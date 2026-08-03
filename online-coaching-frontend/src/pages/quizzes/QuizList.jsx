import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { quizAPI, studentAPI } from '../../services/api';
import { 
  HelpCircle, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Play,
  X,
  CheckCircle
} from 'lucide-react';

const QuizList = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTakeQuizModal, setShowTakeQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [takingQuiz, setTakingQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    passingScore: 60,
    questions: [],
  });

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const fetchQuizzes = async () => {
    try {
      const res = await quizAPI.getCourseQuizzes(courseId);
      const normalizedQuizzes = (res.data || []).map((quiz) => ({
        ...quiz,
        quizId: quiz.quizId ?? quiz.id,
        title: quiz.title ?? quiz.name,
        description: quiz.description ?? '',
        duration: quiz.duration ?? 30,
        passingScore: quiz.passingScore ?? 60,
        questions: quiz.questions ? (typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions) : [],
      }));
      setQuizzes(normalizedQuizzes);
    } catch (err) {
      setError('Failed to load quizzes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await quizAPI.createQuiz({
        ...formData,
        courseId: parseInt(courseId),
        totalMarks: parseInt(formData.passingScore),
        questions: JSON.stringify(formData.questions),
      });
      showSuccess('Quiz created successfully!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        duration: 30,
        passingScore: 60,
        questions: [],
      });
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      });
      fetchQuizzes();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create quiz');
      console.error('Failed to create quiz:', err);
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) {
      showError('Please enter a question');
      return;
    }
    if (currentQuestion.options.some(opt => !opt.trim())) {
      alert('Please fill in all options');
      return;
    }
    
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          ...currentQuestion,
          questionId: formData.questions.length + 1,
        },
      ],
    });
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    });
  };

  const handleRemoveQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      passingScore: quiz.passingScore,
      questions: quiz.questions || [],
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await quizAPI.updateQuiz(editingQuiz.quizId, {
        ...formData,
        totalMarks: parseInt(formData.passingScore),
        questions: JSON.stringify(formData.questions),
      });
      setShowEditModal(false);
      setEditingQuiz(null);
      setFormData({
        title: '',
        description: '',
        duration: 30,
        passingScore: 60,
        questions: [],
      });
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      });
      fetchQuizzes();
    } catch (err) {
      console.error('Failed to update quiz:', err);
    }
  };

  const handleTakeQuiz = (quiz) => {
    setTakingQuiz(quiz);
    setQuizAnswers({});
    setShowTakeQuizModal(true);
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    try {
      // Get studentId from auth context
      let studentId = user?.id;

      // Try to get actual studentId from backend
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Using userId as studentId');
      }

      // Send answers to backend for scoring
      await quizAPI.submitQuiz({
        quizId: takingQuiz.quizId,
        studentId: studentId,
        score: 0, // Backend will calculate the score
        answers: quizAnswers,
      });
      setShowTakeQuizModal(false);
      setTakingQuiz(null);
      setQuizAnswers({});
      alert('Quiz submitted successfully!');
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      alert('Failed to submit quiz');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await quizAPI.deleteQuiz(id);
      setQuizzes(quizzes.filter(q => q.quizId !== id));
    } catch (err) {
      console.error('Failed to delete quiz:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card flex items-center gap-3 text-red-600">
        <AlertCircle size={24} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Course Quizzes</h1>
          <p className="text-gray-600">Create and manage student quizzes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <HelpCircle size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No quizzes created yet</p>
          <p className="text-sm mt-2">Click "Add Quiz" to create your first quiz</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz.quizId} className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="text-orange-600" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                      <p className="text-gray-600 mt-1">{quiz.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{quiz.duration || 30} minutes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle size={16} />
                          <span>Passing: {quiz.passingScore || 60}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HelpCircle size={16} />
                          <span>{quiz.questions?.length || 0} questions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleTakeQuiz(quiz)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Take Quiz"
                      >
                        <Play size={18} />
                      </button>
                      <button 
                        onClick={() => handleEdit(quiz)}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.quizId)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Quiz</h2>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter quiz title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field min-h-24"
                    placeholder="Describe the quiz content"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.passingScore}
                      onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Questions Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
                  
                  {/* Add Question Form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={currentQuestion.question}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                          className="input-field"
                          placeholder="Enter question"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentQuestion.options.map((option, index) => (
                          <div key={index}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Option {index + 1}
                            </label>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...currentQuestion.options];
                                newOptions[index] = e.target.value;
                                setCurrentQuestion({ ...currentQuestion, options: newOptions });
                              }}
                              className="input-field"
                              placeholder={`Option ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Correct Answer
                        </label>
                        <select
                          value={currentQuestion.correctAnswer}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(e.target.value) })}
                          className="input-field"
                        >
                          {currentQuestion.options.map((_, index) => (
                            <option key={index} value={index}>
                              Option {index + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="btn-secondary w-full"
                      >
                        Add Question
                      </button>
                    </div>
                  </div>
                  
                  {/* Questions List */}
                  {formData.questions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Added Questions ({formData.questions.length})</h4>
                      {formData.questions.map((q, index) => (
                        <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{index + 1}. {q.question}</p>
                              <div className="mt-2 space-y-1 text-sm text-gray-600">
                                {q.options.map((opt, optIndex) => (
                                  <div key={optIndex} className={q.correctAnswer === optIndex ? 'text-green-600 font-medium' : ''}>
                                    {optIndex + 1}. {opt} {q.correctAnswer === optIndex && '✓'}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(index)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({
                        title: '',
                        description: '',
                        duration: 30,
                        passingScore: 60,
                        questions: [],
                      });
                      setCurrentQuestion({
                        question: '',
                        options: ['', '', '', ''],
                        correctAnswer: 0,
                      });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Add Quiz
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quiz Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Quiz</h2>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter quiz title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field min-h-24"
                    placeholder="Describe the quiz content"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.passingScore}
                      onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Questions Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
                  
                  {/* Add Question Form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={currentQuestion.question}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                          className="input-field"
                          placeholder="Enter question"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentQuestion.options.map((option, index) => (
                          <div key={index}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Option {index + 1}
                            </label>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...currentQuestion.options];
                                newOptions[index] = e.target.value;
                                setCurrentQuestion({ ...currentQuestion, options: newOptions });
                              }}
                              className="input-field"
                              placeholder={`Option ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Correct Answer
                        </label>
                        <select
                          value={currentQuestion.correctAnswer}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(e.target.value) })}
                          className="input-field"
                        >
                          {currentQuestion.options.map((_, index) => (
                            <option key={index} value={index}>
                              Option {index + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="btn-secondary w-full"
                      >
                        Add Question
                      </button>
                    </div>
                  </div>
                  
                  {/* Questions List */}
                  {formData.questions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Questions ({formData.questions.length})</h4>
                      {formData.questions.map((q, index) => (
                        <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{index + 1}. {q.question}</p>
                              <div className="mt-2 space-y-1 text-sm text-gray-600">
                                {q.options.map((opt, optIndex) => (
                                  <div key={optIndex} className={q.correctAnswer === optIndex ? 'text-green-600 font-medium' : ''}>
                                    {optIndex + 1}. {opt} {q.correctAnswer === optIndex && '✓'}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(index)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingQuiz(null);
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Update Quiz
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Take Quiz Modal */}
      {showTakeQuizModal && takingQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{takingQuiz.title}</h2>
                <button
                  onClick={() => {
                    setShowTakeQuizModal(false);
                    setTakingQuiz(null);
                    setQuizAnswers({});
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">{takingQuiz.description}</p>
              
              {takingQuiz.questions && takingQuiz.questions.length > 0 ? (
                <form onSubmit={handleSubmitQuiz} className="space-y-6">
                  {takingQuiz.questions.map((question, qIndex) => (
                    <div key={qIndex} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 mb-3">
                        {qIndex + 1}. {question.questionText || question.text}
                      </p>
                      <div className="space-y-2">
                        {question.options?.map((option, oIndex) => (
                          <label key={oIndex} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${qIndex}`}
                              value={oIndex}
                              checked={quizAnswers[qIndex] === oIndex}
                              onChange={(e) => setQuizAnswers({
                                ...quizAnswers,
                                [qIndex]: parseInt(e.target.value)
                              })}
                              className="w-4 h-4 text-primary-600"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTakeQuizModal(false);
                        setTakingQuiz(null);
                        setQuizAnswers({});
                      }}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary flex-1">
                      Submit Quiz
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No questions available for this quiz</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;
