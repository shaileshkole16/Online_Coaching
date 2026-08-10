import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentAPI, enrollmentAPI, courseAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  AlertCircle,
  Play
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      // Get studentId first using userId
      let studentId = user.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
        console.log('Student ID:', studentId);
      } catch (err) {
        console.log('Student record not found, using userId');
      }

      const [dashboardRes, enrollmentsRes, coursesRes] = await Promise.all([
        studentAPI.getStudentDashboard(studentId),
        enrollmentAPI.getStudentEnrollments(studentId),
        courseAPI.getAllCourses(),
      ]);

      console.log('Dashboard data:', dashboardRes.data);
      console.log('Enrollments data:', enrollmentsRes.data);
      console.log('Courses data:', coursesRes.data);

      setDashboard(dashboardRes.data);
      setEnrollments(enrollmentsRes.data || []);
      setAvailableCourses(coursesRes.data || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      console.log('Enrolling in course:', courseId);
      
      // Get studentId first using userId
      let studentId = user.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }
      
      await enrollmentAPI.enrollStudent(studentId, courseId);
      console.log('Enrollment successful, refreshing dashboard');
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to enroll:', err);
      alert('Failed to enroll in course. Please try again.');
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

  const enrolledCourseIds = enrollments.map(e => {
    // Backend returns Course object with courseId field
    if (e.course?.courseId) return e.course.courseId;
    return null;
  }).filter(id => id !== null);
  // const coursesToEnroll = availableCourses.filter(c => !enrolledCourseIds.includes(c.courseId));
  const coursesToEnroll = availableCourses.filter(
  c => !enrolledCourseIds.includes(c.id)
);

  const stats = [
    {
      label: 'Enrolled Courses',
      value: enrollments.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Completed Lectures',
      value: `${dashboard?.completedLectures || 0}/${dashboard?.totalLectures || 0}`,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Pending Assignments',
      value: dashboard?.pendingAssignments || 0,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      label: 'Overall Progress',
      value: `${Math.round(dashboard?.overallProgress || 0)}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Track your learning progress and continue where you left off</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-full ${stat.bgColor}`}>
                  <Icon className={stat.textColor} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* My Courses */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
          <Link to="/student/courses" className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <p>You haven't enrolled in any courses yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {enrollments.slice(0, 3).map((enrollment) => (
  <div key={enrollment.enrollId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-primary-600" size={24} />
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Enrolled
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{enrollment.course?.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Progress: {Math.round(dashboard?.overallProgress || 0)}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.round(dashboard?.overallProgress || 0)}%` }}
                  ></div>
                </div>
                <Link 
                  to={`/student/courses/${enrollment.course?.courseId}`}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Play size={16} />
                  Continue Learning
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Courses */}
      {coursesToEnroll.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Available Courses</h2>
            <Link to="/student/courses" className="text-primary-600 hover:text-primary-700 font-medium">
              Browse All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesToEnroll.slice(0, 3).map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-purple-600" size={24} />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="btn-primary w-full"
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
