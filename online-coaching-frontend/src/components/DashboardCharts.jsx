import { useTheme } from '../contexts/ThemeContext';
import { TrendingUp, Users, DollarSign, BookOpen, Award } from 'lucide-react';

const DashboardCharts = ({ data = {} }) => {
  const { colors } = useTheme();

  const {
    totalStudents = 0,
    totalTeachers = 0,
    totalCourses = 0,
    totalRevenue = 0,
    monthlyRevenue = [],
    studentGrowth = [],
    courseEnrollments = [],
    topCourses = []
  } = data;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Total Students</p>
              <p className="text-3xl font-bold" style={{ color: colors.text }}>{totalStudents}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
              <Users size={24} style={{ color: colors.primary }} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: colors.success }}>
            <TrendingUp size={16} />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Total Teachers</p>
              <p className="text-3xl font-bold" style={{ color: colors.text }}>{totalTeachers}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: colors.secondary + '20' }}>
              <BookOpen size={24} style={{ color: colors.secondary }} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: colors.success }}>
            <TrendingUp size={16} />
            <span>+8.2% from last month</span>
          </div>
        </div>

        <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Total Courses</p>
              <p className="text-3xl font-bold" style={{ color: colors.text }}>{totalCourses}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: colors.warning + '20' }}>
              <Award size={24} style={{ color: colors.warning }} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: colors.success }}>
            <TrendingUp size={16} />
            <span>+15.3% from last month</span>
          </div>
        </div>

        <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Total Revenue</p>
              <p className="text-3xl font-bold" style={{ color: colors.text }}>{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: colors.success + '20' }}>
              <DollarSign size={24} style={{ color: colors.success }} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: colors.success }}>
            <TrendingUp size={16} />
            <span>+22.1% from last month</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Monthly Revenue</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {monthlyRevenue.length > 0 ? monthlyRevenue.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t transition-all hover:opacity-80"
                  style={{
                    height: `${(item.amount / Math.max(...monthlyRevenue.map(r => r.amount))) * 100}%`,
                    backgroundColor: colors.primary
                  }}
                ></div>
                <span className="text-xs mt-2" style={{ color: colors.textSecondary }}>{item.month}</span>
              </div>
            )) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: colors.textSecondary }}>
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Student Growth Chart */}
        <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Student Growth</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {studentGrowth.length > 0 ? studentGrowth.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t transition-all hover:opacity-80"
                  style={{
                    height: `${(item.count / Math.max(...studentGrowth.map(s => s.count))) * 100}%`,
                    backgroundColor: colors.secondary
                  }}
                ></div>
                <span className="text-xs mt-2" style={{ color: colors.textSecondary }}>{item.month}</span>
              </div>
            )) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: colors.textSecondary }}>
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Enrollments & Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Enrollments */}
        <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Course Enrollments by Category</h3>
          <div className="space-y-4">
            {courseEnrollments.length > 0 ? courseEnrollments.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span style={{ color: colors.text }}>{item.category}</span>
                  <span style={{ color: colors.textSecondary }}>{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2" style={{ backgroundColor: colors.surfaceVariant }}>
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(item.count / Math.max(...courseEnrollments.map(c => c.count))) * 100}%`,
                      backgroundColor: colors.warning
                    }}
                  ></div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8" style={{ color: colors.textSecondary }}>
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Top Courses */}
        <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Top Courses</h3>
          <div className="space-y-4">
            {topCourses.length > 0 ? topCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: colors.background }}>
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: colors.text }}>{course.title}</p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>{course.enrollments} enrollments</p>
                </div>
                <div className="flex items-center gap-1" style={{ color: colors.warning }}>
                  <span>★</span>
                  <span>{course.rating}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8" style={{ color: colors.textSecondary }}>
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
