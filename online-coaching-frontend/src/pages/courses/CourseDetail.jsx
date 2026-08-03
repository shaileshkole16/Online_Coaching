import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { courseAPI, lectureAPI, enrollmentAPI, studentAPI, assignmentAPI, quizAPI, courseRatingAPI } from '../../services/api';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Play,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Edit,
  Trash2,
  Lock,
  HelpCircle,
  Award,
  Star
} from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isTeacher, isStudent } = useAuth();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseData();
  }, [id, user?.id]);

  const fetchCourseData = async () => {
    if (!id) {
      setError('Course ID is missing');
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
      setLectures(lecturesRes.data);
      
      const normalizedAssignments = (assignmentsRes.data || []).map((assignment) => ({
        ...assignment,
        assignmentId: assignment.assignmentId ?? assignment.id,
        title: assignment.title ?? assignment.name,
        dueDate: assignment.dueDate ?? assignment.createdDate,
        maxMarks: assignment.maxMarks ?? assignment.totalMarks ?? 100,
      }));
      setAssignments(normalizedAssignments);
      
      const normalizedQuizzes = (quizzesRes.data || []).map((quiz) => ({
        ...quiz,
        quizId: quiz.quizId ?? quiz.id,
        title: quiz.title ?? quiz.name,
        description: quiz.description ?? '',
        duration: quiz.duration ?? 30,
        passingScore: quiz.passingScore ?? 60,
        questions: quiz.questions ? (typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions) : [],
      }));
      setQuizzes(normalizedQuizzes);

      if (user?.role === 'STUDENT') {
        // Get studentId first using userId
        let studentId = user.id;
        try {
          const studentRes = await studentAPI.getStudentByUserId(user.id);
          studentId = studentRes.data.studentId;
        } catch (err) {
          console.log('Student record not found, using userId');
        }
        
        const enrollmentsRes = await enrollmentAPI.getStudentEnrollments(studentId);
        console.log('Checking enrollment for course ID:', id);
        console.log('Enrollments:', enrollmentsRes.data);
        const enrolled = enrollmentsRes.data.some(e => e.course?.courseId === parseInt(id) || e.course?.id === parseInt(id));
        console.log('Is enrolled:', enrolled);
        setIsEnrolled(enrolled);
      }
    } catch (err) {
      setError('Failed to load course details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      // Get studentId first using userId
      let studentId = user.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }
      
      await enrollmentAPI.enrollStudent(studentId, id);
      setIsEnrolled(true);
    } catch (err) {
      console.error('Failed to enroll:', err);
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await courseAPI.deleteCourse(id);
      navigate('/teacher/courses');
    } catch (err) {
      console.error('Failed to delete course:', err);
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

  if (!course) {
    return (
      <div className="card text-center py-12 text-gray-500">
        <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/${isTeacher ? 'teacher' : 'student'}/courses`} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="page-header mb-0">Course Details</h1>
        {isTeacher && (
          <div className="ml-auto flex gap-2">
            <Link
              to={`/teacher/courses/${id}/edit`}
              className="btn-secondary flex items-center gap-2"
            >
              <Edit size={18} />
              Edit
            </Link>
            <button
              onClick={handleDeleteCourse}
              className="btn-danger flex items-center gap-2"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Course Header */}
      <div className="card">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="text-primary-600" size={48} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{course.duration || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>{course.enrolledCount || 0} students enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-primary-600">
                  {course.price ? `₹${course.price}` : 'Free'}
                </span>
              </div>
              {course.teacherName && (
                <div className="flex items-center gap-2">
                  <Award size={18} />
                  <span>Instructor: {course.teacherName}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isEnrolled && user?.role === 'STUDENT' && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button onClick={handleEnroll} className="btn-primary w-full">
              Enroll in this Course
            </button>
          </div>
        )}
      </div>

      {/* Lectures */}
      {isEnrolled || isTeacher ? (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Course Lectures</h3>
            <Link
              to={`/${isTeacher ? 'teacher' : 'student'}/courses/${id}/lectures`}
              className="btn-secondary flex items-center gap-2"
            >
              <Play size={16} />
              View All Lectures
            </Link>
          </div>
          
          {lectures.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No lectures added yet</p>
              {isTeacher && (
                <Link
                  to={`/teacher/courses/${id}/lectures`}
                  className="btn-primary inline-flex items-center gap-2 mt-4"
                >
                  <Play size={16} />
                  Add Lecture
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {lectures.slice(0, 3).map((lecture, index) => (
                <div key={lecture.lectureId || lecture.id || index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{lecture.title}</h4>
                    <p className="text-sm text-gray-500">{lecture.duration || 'N/A'}</p>
                  </div>
                  <Play className="text-primary-600" size={20} />
                </div>
              ))}
              {lectures.length > 3 && (
                <Link
                  to={`/${isTeacher ? 'teacher' : 'student'}/courses/${id}/lectures`}
                  className="text-center block text-sm text-primary-600 hover:text-primary-700 mt-2"
                >
                  View all {lectures.length} lectures
                </Link>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-8 text-gray-500">
          <Lock className="mx-auto mb-4 text-gray-300" size={48} />
          <p>Enroll in this course to view the content</p>
        </div>
      )}

      {/* Assignments */}
      {isEnrolled || isTeacher ? (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Assignments</h3>
            {isTeacher && (
              <Link
                to={`/teacher/courses/${id}/assignments`}
                className="btn-secondary flex items-center gap-2"
              >
                <FileText size={16} />
                Manage Assignments
              </Link>
            )}
          </div>
          
          {assignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No assignments created yet</p>
              {isTeacher && (
                <Link
                  to={`/teacher/courses/${id}/assignments`}
                  className="btn-primary inline-flex items-center gap-2 mt-4"
                >
                  <FileText size={16} />
                  Create Assignment
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div key={assignment.assignmentId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="text-purple-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-500">Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</p>
                  </div>
                  {isStudent && (
                    <Link
                      to={`/student/courses/${id}/assignments`}
                      className="btn-secondary px-3 py-1 text-sm"
                    >
                      View Assignments
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-8 text-gray-500">
          <Lock className="mx-auto mb-4 text-gray-300" size={48} />
          <p>Enroll in this course to view assignments</p>
        </div>
      )}

      {/* Quizzes */}
      {isEnrolled || isTeacher ? (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Quizzes</h3>
            {isTeacher && (
              <Link
                to={`/teacher/courses/${id}/quizzes`}
                className="btn-secondary flex items-center gap-2"
              >
                <HelpCircle size={16} />
                Manage Quizzes
              </Link>
            )}
          </div>
          
          {quizzes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <HelpCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No quizzes created yet</p>
              {isTeacher && (
                <Link
                  to={`/teacher/courses/${id}/quizzes`}
                  className="btn-primary inline-flex items-center gap-2 mt-4"
                >
                  <HelpCircle size={16} />
                  Create Quiz
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {quizzes.map((quiz) => {
                const hasQuestions = quiz.questions && quiz.questions.length > 0;
                return (
                  <div key={quiz.quizId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                      <p className="text-sm text-gray-500">
                        {hasQuestions ? `${quiz.questions.length} questions` : 'No questions'} • {quiz.duration} mins • Pass: {quiz.passingScore}%
                      </p>
                      {!hasQuestions && (
                        <p className="text-xs text-orange-600 mt-1">Quiz has no questions yet</p>
                      )}
                    </div>
                    {isStudent && hasQuestions && (
                      <Link
                        to={`/student/courses/${id}/quiz/${quiz.quizId}`}
                        className="btn-primary px-3 py-1 text-sm"
                      >
                        Take Quiz
                      </Link>
                    )}
                    {isStudent && !hasQuestions && (
                      <span className="text-sm text-gray-400 px-3 py-1">Not Available</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-8 text-gray-500">
          <Lock className="mx-auto mb-4 text-gray-300" size={48} />
          <p>Enroll in this course to view quizzes</p>
        </div>
      )}

      {/* Course Rating - Only for enrolled students */}
      {isEnrolled && isStudent && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Rate this Course</h3>
          <p className="text-gray-600 mb-4">Share your feedback to help improve this course for future students.</p>
          <Link
            to={`/student/courses/${id}/rating`}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Star size={18} />
            Rate Course
          </Link>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
