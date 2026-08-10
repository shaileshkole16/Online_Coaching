import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { teacherAPI, courseAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  TrendingUp,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      // Get teacherId first using userId
      let teacherId = null;
      try {
        const teacherRes = await teacherAPI.getTeacherByUserId(user.id);
        teacherId = teacherRes.data.teacherId;
      } catch (err) {
        console.log('Teacher record not found');
        setError('Teacher profile not found. Please contact administrator.');
        setLoading(false);
        return;
      }

      if (!teacherId) {
        setError('Teacher profile not found. Please contact administrator.');
        setLoading(false);
        return;
      }

      const [dashboardRes, coursesRes] = await Promise.all([
        teacherAPI.getTeacherDashboard(teacherId),
        courseAPI.getCoursesByTeacher(teacherId),
      ]);

      setDashboard(dashboardRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await courseAPI.deleteCourse(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
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

  const stats = [
    {
      label: 'My Courses',
      value: dashboard?.totalCourses || courses.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Total Students',
      value: dashboard?.totalStudents || 0,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Total Lectures',
      value: dashboard?.totalLectures || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      label: 'Average Rating',
      value: `${(dashboard?.averageRating || 0).toFixed(1)}/5`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Manage your courses and track student progress</p>
        </div>
        <Link
          to="/teacher/courses/create"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Create Course
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2 truncate">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-full ${stat.bgColor} ml-4`}>
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
          <Link to="/teacher/courses" className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <p>You haven't created any courses yet</p>
            <Link
              to="/teacher/courses/create"
              className="btn-primary inline-flex items-center gap-2 mt-4"
            >
              <Plus size={16} />
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div key={course.id || course.courseId || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-primary-600" size={24} />
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/teacher/courses/${course.id}`}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{course.duration || 'N/A'}</span>
                  <span>{course.price ? `₹${course.price}` : 'Free'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
