import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { quizSubmissionAPI, quizAPI } from '../../services/api';
import { 
  CheckCircle, 
  AlertCircle,
  Users,
  TrendingUp,
  Calendar,
  Search
} from 'lucide-react';

const QuizSubmissions = () => {
  const { courseId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      const [quizzesRes, submissionsRes] = await Promise.all([
        quizAPI.getCourseQuizzes(courseId),
        quizSubmissionAPI.getCourseQuizSubmissions(courseId),
      ]);

      setQuizzes(quizzesRes.data || []);
      
      const normalizedSubmissions = (submissionsRes.data || []).map((submission) => ({
        ...submission,
        submissionId: submission.submissionId ?? submission.id,
        quizId: submission.quiz?.quizId ?? submission.quizId,
        quizTitle: submission.quiz?.title ?? submission.quizName ?? 'Quiz',
        studentName: submission.student?.user?.name ?? submission.studentName,
        studentEmail: submission.student?.user?.email ?? submission.studentEmail,
        score: submission.score ?? 0,
        submittedDate: submission.submittedDate ?? submission.createdDate,
      }));
      setSubmissions(normalizedSubmissions);
    } catch (err) {
      setError('Failed to load quiz submissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(submission =>
    submission.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.quizTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: submissions.length,
    averageScore: submissions.length > 0 
      ? Math.round(submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length)
      : 0,
    passed: submissions.filter(s => (s.score || 0) >= 60).length,
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
      <div>
        <h1 className="page-header">Quiz Submissions</h1>
        <p className="text-gray-600">View student quiz submissions and scores</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Passed (60%+)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.passed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
            placeholder="Search by student name, email, or quiz title..."
          />
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No quiz submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Quiz</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Submitted Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.submissionId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{submission.studentName}</p>
                        <p className="text-sm text-gray-500">{submission.studentEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      {submission.quizTitle}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">{submission.score}%</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              submission.score >= 60 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${submission.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {submission.submittedDate 
                          ? new Date(submission.submittedDate).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {submission.score >= 60 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          <CheckCircle size={14} />
                          Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          <AlertCircle size={14} />
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSubmissions;
