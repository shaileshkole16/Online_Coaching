import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { courseAPI, lectureAPI, enrollmentAPI, studentAPI, assignmentAPI, quizAPI } from '../../services/api';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Play,
  FileText,
  CheckCircle,
  ArrowLeft,
  HelpCircle,
  Award,
  Star,
  Lock,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

const CourseHome = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [id, user?.id]);

  const fetchCourseData = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const [courseRes, lecturesRes, assignmentsRes, quizzesRes] = await Promise.all([
        courseAPI.getCourseById(id),
        lectureAPI.getCourseLectures(id),
        assignmentAPI.getCourseAssignments(id),
        quizAPI.getCourseQuizzes(id),
      ]);

      setCourse(courseRes.data);
      setLectures(lecturesRes.data || []);
      setAssignments(assignmentsRes.data || []);
      setQuizzes(quizzesRes.data || []);

      // Calculate basic progress (this will be enhanced with backend tracking)
      const totalItems = lectures.length + assignments.length + quizzes.length;
      const completedItems = 0; // Will be enhanced with lesson progress
      setProgress(totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0);
    } catch (err) {
      console.error('Failed to load course data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueLearning = () => {
    // Navigate to CourseDetail to show all course content
    navigate(`/student/courses/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="card text-center py-12 text-gray-500">
        <Lock size={48} className="mx-auto mb-4 text-gray-300" />
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/student/courses" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="page-header mb-0">Course Home</h1>
      </div>

      {/* Course Overview Card */}
      <div className="card shadow-2xl border-0">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <BookOpen className="text-white" size={48} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Active</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">In Progress</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="text-gray-500" size={18} />
                <span className="font-semibold text-gray-700">Duration:</span>
                <span className="text-gray-600">{course.duration || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-gray-500" size={18} />
                <span className="font-semibold text-gray-700">Students:</span>
                <span className="text-gray-600">{course.enrolledCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-primary-600" size={24} />
              <span className="font-bold text-gray-900 text-lg">Your Progress</span>
            </div>
            <span className="text-3xl font-extrabold text-primary-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-primary-600 to-blue-700 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <button
            onClick={handleContinueLearning}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800"
          >
            <Play size={20} />
            Continue Learning
          </button>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-4xl font-extrabold text-primary-600">{lectures.length}</div>
          <div className="text-sm font-semibold text-gray-600">Lectures</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-extrabold text-primary-600">{assignments.length}</div>
          <div className="text-sm font-semibold text-gray-600">Assignments</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-extrabold text-primary-600">{quizzes.length}</div>
          <div className="text-sm font-semibold text-gray-600">Quizzes</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-extrabold text-primary-600">{course.enrolledCount || 0}</div>
          <div className="text-sm font-semibold text-gray-600">Students</div>
        </div>
      </div>

      {/* What We Provide */}
      <div className="card">
        <h3 className="text-2xl font-extrabold text-gray-900 mb-6">What We Provide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Play className="text-primary-600" size={28} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Video Lectures</h4>
              <p className="text-sm text-gray-600">{course.duration || 'Comprehensive video content'}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="text-purple-600" size={28} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Assignments</h4>
              <p className="text-sm text-gray-600">{assignments.length} assignments with solutions</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <HelpCircle className="text-blue-600" size={28} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Quizzes</h4>
              <p className="text-sm text-gray-600">{quizzes.length} quizzes for practice</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award className="text-green-600" size={28} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Certificate</h4>
              <p className="text-sm text-gray-600">Certificate upon completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules & Regulations */}
      <div className="card">
        <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Rules & Regulations</h3>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
            <span>The course offers comprehensive learning content and is valid for 3 Months</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
            <span>This course is completely online and available in recorded mode</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
            <span>All course materials are available after enrollment</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
            <span>Complete all assignments and quizzes for certification</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
            <span>Contact support for any course-related queries</span>
          </li>
        </ul>
      </div>

      {/* Course Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Modules Card */}
        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/student/courses/${id}/lectures`)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <BookOpen className="text-primary-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Modules</h3>
              <p className="text-sm text-gray-600">{lectures.length} lessons</p>
            </div>
          </div>
          <div className="space-y-2">
            {lectures.slice(0, 3).map((lecture, index) => (
              <div key={lecture.id || index} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-600" />
                <span className="truncate">{lecture.title}</span>
              </div>
            ))}
            {lectures.length > 3 && (
              <p className="text-sm text-gray-500">+{lectures.length - 3} more lessons</p>
            )}
          </div>
        </div>

        {/* Assignments Card */}
        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/student/courses/${id}/assignments`)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Assignments</h3>
              <p className="text-sm text-gray-600">{assignments.length} assignments</p>
            </div>
          </div>
          <div className="space-y-2">
            {assignments.slice(0, 3).map((assignment, index) => (
              <div key={assignment.id || index} className="flex items-center gap-2 text-sm text-gray-600">
                <Lock size={16} className="text-gray-400" />
                <span className="truncate">{assignment.title}</span>
              </div>
            ))}
            {assignments.length > 3 && (
              <p className="text-sm text-gray-500">+{assignments.length - 3} more assignments</p>
            )}
          </div>
        </div>

        {/* Quizzes Card */}
        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/student/courses/${id}/quizzes`)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Quizzes</h3>
              <p className="text-sm text-gray-600">{quizzes.length} quizzes</p>
            </div>
          </div>
          <div className="space-y-2">
            {quizzes.slice(0, 3).map((quiz, index) => (
              <div key={quiz.id || index} className="flex items-center gap-2 text-sm text-gray-600">
                <Lock size={16} className="text-gray-400" />
                <span className="truncate">{quiz.title}</span>
              </div>
            ))}
            {quizzes.length > 3 && (
              <p className="text-sm text-gray-500">+{quizzes.length - 3} more quizzes</p>
            )}
          </div>
        </div>

        {/* Discussion Card */}
        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/student/forum')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Discussion</h3>
              <p className="text-sm text-gray-600">Join the community</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Ask questions, share knowledge, and connect with other students.</p>
        </div>

        {/* Certificate Card */}
        <div className="card hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <Award className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Certificate</h3>
              <p className="text-sm text-gray-600">Earn recognition</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Complete all modules to earn your certificate.</p>
        </div>
      </div>
    </div>
  );
};

export default CourseHome;