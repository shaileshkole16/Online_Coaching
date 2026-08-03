import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { quizAPI, studentAPI } from '../../services/api';
import { 
  HelpCircle, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save,
  XCircle,
  Trophy
} from 'lucide-react';

const StudentQuiz = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    fetchQuiz();
    checkQuizAttempt();
  }, [quizId]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const fetchQuiz = async () => {
    try {
      const res = await quizAPI.getQuizById(quizId);
      const normalizedQuiz = {
        ...res.data,
        quizId: res.data.quizId ?? res.data.id,
        title: res.data.title ?? res.data.name,
        description: res.data.description ?? '',
        duration: res.data.duration ?? 30,
        passingScore: res.data.passingScore ?? 60,
        questions: res.data.questions ? (typeof res.data.questions === 'string' ? JSON.parse(res.data.questions) : res.data.questions) : [],
      };
      setQuiz(normalizedQuiz);
      setTimeLeft(normalizedQuiz.duration * 60);
    } catch (err) {
      setError('Failed to load quiz');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkQuizAttempt = async () => {
    try {
      let studentId = user.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }

      const res = await quizAPI.checkQuizAttempt(quizId, studentId);
      setHasAttempted(res.data);

      if (res.data) {
        // Fetch the submission details
        const submissionRes = await quizAPI.getStudentQuizSubmission(quizId, studentId);
        if (submissionRes.data) {
          setQuizResult(submissionRes.data);
        }
      }
    } catch (err) {
      console.error('Error checking quiz attempt:', err);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      // Get studentId first using userId
      let studentId = user.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }

      // Convert answers to the format expected by backend: Map<Integer, Integer>
      // where key is question index and value is selected option index
      const formattedAnswers = {};
      quiz.questions.forEach((question, index) => {
        const answer = answers[question.questionId || index];
        if (answer !== undefined) {
          // Find the option index that matches the selected answer
          const optionIndex = question.options?.indexOf(answer);
          if (optionIndex !== -1) {
            formattedAnswers[index] = optionIndex;
          }
        }
      });

      // Send answers to backend for scoring
      const res = await quizAPI.submitQuiz({
        quizId: parseInt(quizId),
        studentId: studentId,
        score: 0, // Backend will calculate the score
        answers: formattedAnswers,
      });

      // Display quiz results immediately
      setQuizResult(res.data);
      setHasAttempted(true);
      setQuizStarted(false);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      const errorMessage = err.response?.data || 'Failed to submit quiz';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (!quiz) {
    return (
      <div className="card text-center py-12 text-gray-500">
        <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
        <p>Quiz not found</p>
      </div>
    );
  }

  // Show quiz results if already attempted or just submitted
  if (hasAttempted && quizResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to={`/student/courses/${courseId}`} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="page-header mb-0">Quiz Results</h1>
        </div>

        <div className="card">
          <div className="text-center py-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${quizResult.passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {quizResult.passed ? (
                <Trophy size={48} className="text-green-600" />
              ) : (
                <XCircle size={48} className="text-red-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{quizResult.quizTitle}</h2>
            <p className="text-gray-600 mb-6">
              {quizResult.passed ? 'Congratulations! You passed the quiz.' : 'You did not pass the quiz.'}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Your Score</p>
                <p className="text-2xl font-bold text-gray-900">{quizResult.score}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Grade</p>
                <p className="text-2xl font-bold text-gray-900">{quizResult.grade}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Correct</p>
                <p className="text-2xl font-bold text-gray-900">{quizResult.correctCount}/{quizResult.totalQuestions}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Passing Score</p>
                <p className="text-2xl font-bold text-gray-900">{quizResult.passingScore}%</p>
              </div>
            </div>

            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question-by-Question Results</h3>
              <div className="space-y-4">
                {quizResult.questionResults?.map((qr, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${qr.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${qr.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {qr.isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          {index + 1}. {qr.question}
                        </p>
                        <div className="space-y-1 text-sm">
                          {qr.options?.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded ${
                                optIndex === qr.correctAnswer
                                  ? 'bg-green-200 text-green-800 font-medium'
                                  : optIndex === qr.studentAnswer && !qr.isCorrect
                                  ? 'bg-red-200 text-red-800'
                                  : 'text-gray-600'
                              }`}
                            >
                              {option}
                              {optIndex === qr.correctAnswer && ' ✓ (Correct)'}
                              {optIndex === qr.studentAnswer && !qr.isCorrect && ' ✗ (Your answer)'}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                to={`/student/courses/${courseId}`}
                className="btn-primary px-8 py-3"
              >
                Back to Course
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to={`/student/courses/${courseId}`} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="page-header mb-0">Quiz</h1>
        </div>

        <div className="card">
          <div className="text-center py-8">
            <HelpCircle size={64} className="mx-auto mb-4 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h2>
            <p className="text-gray-600 mb-6">{quiz.description}</p>
            
            <div className="flex justify-center gap-8 mb-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{quiz.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} />
                <span>{quiz.questions?.length || 0} questions</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle size={18} />
                <span>Passing: {quiz.passingScore}%</span>
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              className="btn-primary px-8 py-3 text-lg"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/student/courses/${courseId}`} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="page-header mb-0">{quiz.title}</h1>
        </div>
        <div className={`px-4 py-2 rounded-lg font-semibold ${timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          <Clock size={18} className="inline mr-2" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="card">
        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.questionId || index} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-semibold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-3">{question.question}</h3>
                  
                  <div className="space-y-2">
                    {question.options?.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name={`question-${question.questionId || index}`}
                          value={option}
                          checked={answers[question.questionId || index] === option}
                          onChange={(e) => handleAnswerChange(question.questionId || index, e.target.value)}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
          <Link
            to={`/student/courses/${courseId}`}
            className="btn-secondary"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting || Object.keys(answers).length < quiz.questions.length}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentQuiz;
