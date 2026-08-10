import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { courseAPI, enrollmentAPI, studentAPI, teacherAPI } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Filter,
  Clock,
  Users,
  AlertCircle,
  Award
} from 'lucide-react';

const CourseList = () => {
  const { user, isStudent, isTeacher } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      let coursesRes;
      if (isTeacher) {
        // Teachers should see their own courses - need to get teacherId first
        try {
          const teacherRes = await teacherAPI.getTeacherByUserId(user.id);
          const teacherId = teacherRes.data.teacherId;
          coursesRes = await courseAPI.getCoursesByTeacher(teacherId);
        } catch (err) {
          coursesRes = await courseAPI.getAllCourses();
        }
      } else {
        // Students see all courses
        coursesRes = await courseAPI.getAllCourses();
      }
      
      const coursesData = coursesRes.data || coursesRes;
      setCourses(coursesData);

      if (isStudent) {
        // Need to get studentId first using userId
        try {
          const studentRes = await studentAPI.getStudentByUserId(user.id);
          const studentId = studentRes.data.studentId;
          const enrollmentsRes = await enrollmentAPI.getStudentEnrollments(studentId);
          setEnrolledCourses(enrollmentsRes.data || []);
        } catch (err) {
          setEnrolledCourses([]);
        }
      }
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      // Need to get studentId first using userId
      const studentRes = await studentAPI.getStudentByUserId(user.id);
      const studentId = studentRes.data.studentId;
      
      const enrollRes = await enrollmentAPI.enrollStudent(studentId, courseId);
      const enrollmentsRes = await enrollmentAPI.getStudentEnrollments(studentId);
      setEnrolledCourses(enrollmentsRes.data || []);
      
      // Redirect to success screen
      navigate(`/student/courses/${courseId}/success`);
    } catch (err) {
      console.error('Failed to enroll:', err);
      alert('Failed to enroll in course. Please try again.');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enrolledCourseIds = enrolledCourses.map(e => {
    // Backend returns Course object with courseId field
    if (e.course?.courseId) return e.course.courseId;
    return null;
  }).filter(id => id !== null);

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
        <h1 className="page-header">Courses</h1>
        {isTeacher && (
          <Link to="/teacher/courses/create" className="btn-primary">
            Create Course
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={20} />
            Filter
          </button>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => {
            const courseId = course.courseId || course.id;
            const isEnrolled = enrolledCourseIds.includes(courseId);
            return (
              <div key={courseId || index} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="text-primary-600" size={28} />
                  </div>
                  {isEnrolled && (
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      Enrolled
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{course.duration || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{course.enrolledCount || 0} students</span>
                  </div>
                  {course.teacherName && (
                    <div className="flex items-center gap-1">
                      <Award size={16} />
                      <span>{course.teacherName}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-lg font-semibold text-primary-600">
                    <span>{course.price ? `₹${course.price}` : 'Free'}</span>
                  </div>
                  <Link
                    to={`/${isTeacher ? 'teacher' : 'student'}/courses/${courseId}${isStudent && !isEnrolled ? '/preview' : ''}`}
                    className="btn-primary"
                  >
                    {isEnrolled ? 'Continue' : 'View Details'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseList;
