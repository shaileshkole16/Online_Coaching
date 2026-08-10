import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
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
  Lock
} from 'lucide-react';

const CoursePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
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

      if (user?.role === 'STUDENT') {
        let studentId = user.id;
        try {
          const studentRes = await studentAPI.getStudentByUserId(user.id);
          studentId = studentRes.data.studentId;
        } catch (err) {
          console.log('Student record not found, using userId');
        }
        
        const enrollmentsRes = await enrollmentAPI.getStudentEnrollments(studentId);
        const enrolled = enrollmentsRes.data.some(e => e.course?.courseId === parseInt(id) || e.course?.id === parseInt(id));
        setIsEnrolled(enrolled);
      }
    } catch (err) {
      console.error('Failed to load course data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      showError('Please login to enroll in this course');
      navigate('/login');
      return;
    }

    try {
      let studentId = user.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }
      
      await enrollmentAPI.enrollStudent(studentId, id);
      setIsEnrolled(true);
      showSuccess('Successfully enrolled in the course!');
      navigate(`/student/courses/${id}`);
    } catch (err) {
      showError('Failed to enroll. Please try again.');
    }
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

  // If already enrolled, redirect to course detail
  if (isEnrolled) {
    return (
      <div className="card text-center py-12">
        <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">You're already enrolled!</h2>
        <p className="text-gray-600 mb-6">You have access to this course content.</p>
        <Link to={`/student/courses/${id}`} className="btn-primary inline-flex items-center gap-2">
          <Play size={18} />
          Continue Learning
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/student/courses" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="page-header mb-0">Course Preview</h1>
      </div>

      {/* Course Header */}
      <div className="card shadow-2xl border-0">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <BookOpen className="text-white" size={64} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">2026 Course</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Recorded</span>
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
                <span className="font-semibold text-gray-700">Validity:</span>
                <span className="text-gray-600">3 Months</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Pre-requisite:</span>
                <span className="text-gray-600">None</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-3xl font-extrabold text-primary-600">
                {course.price ? `₹${course.price}` : 'Free'}
              </span>
              <span className="text-sm text-gray-500">+18% GST</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button 
            onClick={handleEnroll}
            className="btn-primary w-full py-4 text-lg font-bold bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
          >
            Enroll Now
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

      {/* Testimonials Section */}
      <div className="card">
        <h3 className="text-2xl font-extrabold text-gray-900 mb-6">What Students Say</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <span className="font-bold text-gray-900">Excellent Course!</span>
            </div>
            <p className="text-gray-600">This course helped me understand the concepts deeply. The teaching style is excellent and practical examples are very helpful.</p>
            <p className="text-sm text-gray-500 mt-2 font-semibold">- Student</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <span className="font-bold text-gray-900">Highly Recommended</span>
            </div>
            <p className="text-gray-600">The assignments and quizzes really helped me practice and improve my skills. Great learning experience!</p>
            <p className="text-sm text-gray-500 mt-2 font-semibold">- Student</p>
          </div>
        </div>
      </div>

      {/* Certification */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Award className="text-white" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Get a certificate after completing the course</h3>
            <p className="text-gray-600">Showcase your skills – get a certificate upon completion.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;