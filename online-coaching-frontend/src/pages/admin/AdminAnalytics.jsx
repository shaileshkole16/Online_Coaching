import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  ArrowUp,
  ArrowDown,
  Calendar,
  BarChart3,
  PieChart,
  AlertCircle
} from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await adminAPI.getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    } finally {
      setLoading(false);
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

  const metrics = [
    {
      label: 'Total Revenue',
      value: `₹${analytics?.totalRevenue || 0}`,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      trend: analytics?.revenueTrend || 0,
    },
    {
      label: 'Active Students',
      value: analytics?.activeStudents || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: analytics?.studentTrend || 0,
    },
    {
      label: 'Active Courses',
      value: analytics?.activeCourses || 0,
      icon: BookOpen,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      trend: analytics?.courseTrend || 0,
    },
    {
      label: 'Enrollment Rate',
      value: `${analytics?.enrollmentRate || 0}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      trend: analytics?.enrollmentTrend || 0,
    },
  ];

  const coursePerformance = analytics?.coursePerformance || [];
  const teacherPerformance = analytics?.teacherPerformance || [];
  const monthlyStats = analytics?.monthlyStats || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Admin Analytics</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={18} />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend >= 0;
          return (
            <div key={metric.label} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={metric.textColor} size={20} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  <span>{Math.abs(metric.trend)}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Stats */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Monthly Statistics</h2>
            <BarChart3 className="text-gray-400" size={20} />
          </div>
          
          {monthlyStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No monthly data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {monthlyStats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{stat.month}</span>
                    <span className="font-medium text-gray-900">{stat.enrollments} enrollments</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${(stat.enrollments / Math.max(...monthlyStats.map(s => s.enrollments))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Course Performance */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Performing Courses</h2>
            <PieChart className="text-gray-400" size={20} />
          </div>
          
          {coursePerformance.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No course data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {coursePerformance.slice(0, 5).map((course, index) => (
                <div key={course.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{course.title}</h4>
                    <p className="text-sm text-gray-500">{course.enrollments} students</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">${course.revenue}</p>
                    <p className="text-xs text-gray-500">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Teacher Performance */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Teacher Performance</h2>
          <Users className="text-gray-400" size={20} />
        </div>
        
        {teacherPerformance.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No teacher data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Teacher</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Courses</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Students</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {teacherPerformance.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
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
                    <td className="py-4 px-4 text-gray-600">{teacher.courseCount}</td>
                    <td className="py-4 px-4 text-gray-600">{teacher.studentCount}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900">{teacher.rating}</span>
                        <span className="text-gray-400">/5</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-green-600">${teacher.revenue}</td>
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

export default AdminAnalytics;
