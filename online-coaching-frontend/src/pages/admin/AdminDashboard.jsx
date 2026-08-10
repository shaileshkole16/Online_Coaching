import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  UserCheck,
  UserX,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, studentsRes, teachersRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAllStudents(),
        adminAPI.getAllTeachers(),
      ]);

      console.log('Dashboard response:', dashboardRes);
      console.log('Students response:', studentsRes);
      console.log('Teachers response:', teachersRes);

      setDashboard(dashboardRes.data);
      setStudents(studentsRes.data);
      setTeachers(teachersRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockStudent = async (id) => {
    try {
      await adminAPI.blockStudent(id);
      setStudents(students.filter(s => s.studentId !== id));
      setSuccess('Student blocked successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to block student: ' + (err.response?.data || err.message));
      console.error('Failed to block student:', err);
    }
  };

  const handleBlockTeacher = async (id) => {
    try {
      await adminAPI.blockTeacher(id);
      setTeachers(teachers.filter(t => t.teacherId !== id));
      setSuccess('Teacher blocked successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to block teacher: ' + (err.response?.data || err.message));
      console.error('Failed to block teacher:', err);
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
      label: 'Total Students',
      value: dashboard?.totalStudents || students.length,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Total Teachers',
      value: dashboard?.totalTeachers || teachers.length,
      icon: UserCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Total Courses',
      value: dashboard?.totalCourses || 0,
      icon: BookOpen,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      label: 'Total Revenue',
      value: `₹${dashboard?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Active Users',
      value: dashboard?.activeUsers || 0,
      icon: UserCheck,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      label: 'Total Enrollments',
      value: dashboard?.totalEnrollments || 0,
      icon: BookOpen,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Admin Dashboard</h1>
      </div>

      {success && (
        <div className="card flex items-center gap-3 text-green-600 bg-green-50">
          <UserCheck size={24} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="card flex items-center gap-3 text-red-600 bg-red-50">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      )}

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

      {/* Recent Activities */}
      {dashboard?.recentActivities && dashboard.recentActivities.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <span className="text-sm text-gray-500">Latest platform activities</span>
          </div>

          <div className="space-y-3">
            {dashboard.recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {activity.userName?.charAt(0) || 'S'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">by {activity.userName}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Students</h2>
          <span className="text-sm text-gray-500">{students.length} students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr key="no-students">
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.studentId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">
                            {student.name?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{student.email}</td>
                    <td className="py-4 px-4 text-gray-600">{student.phone}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleBlockStudent(student.studentId)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        <UserX size={18} />
                        <span>Block</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Teachers</h2>
          <span className="text-sm text-gray-500">{teachers.length} teachers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr key="no-teachers">
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No teachers found
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.teacherId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold">
                            {teacher.name?.charAt(0) || 'T'}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{teacher.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{teacher.email}</td>
                    <td className="py-4 px-4 text-gray-600">{teacher.phone}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleBlockTeacher(teacher.teacherId)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        <UserX size={18} />
                        <span>Block</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
