import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { attendanceAPI } from '../../services/api';

const Attendance = () => {
  const { colors } = useTheme();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, percentage: 0 });

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth]);

  const fetchAttendance = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await attendanceAPI.getStudentAttendance(user.id);
      setAttendanceData(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthStart = (month) => {
    const date = new Date();
    date.setMonth(month, 1);
    return date.toISOString().split('T')[0];
  };

  const getMonthEnd = (month) => {
    const date = new Date();
    date.setMonth(month + 1, 0);
    return date.toISOString().split('T')[0];
  };

  const calculateStats = (data) => {
    const present = data.filter(a => a.status === 'PRESENT').length;
    const absent = data.filter(a => a.status === 'ABSENT').length;
    const late = data.filter(a => a.status === 'LATE').length;
    const total = data.length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    setStats({ present, absent, late, percentage });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT': return colors.success;
      case 'ABSENT': return colors.error;
      case 'LATE': return colors.warning;
      case 'EXCUSED': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle size={20} />;
      case 'ABSENT': return <XCircle size={20} />;
      case 'LATE': return <Clock size={20} />;
      default: return <Clock size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>Attendance</h1>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.success + '20' }}>
                <CheckCircle size={24} style={{ color: colors.success }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Present</p>
                <p className="text-2xl font-bold" style={{ color: colors.text }}>{stats.present}</p>
              </div>
            </div>
          </div>
          <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.error + '20' }}>
                <XCircle size={24} style={{ color: colors.error }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Absent</p>
                <p className="text-2xl font-bold" style={{ color: colors.text }}>{stats.absent}</p>
              </div>
            </div>
          </div>
          <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.warning + '20' }}>
                <Clock size={24} style={{ color: colors.warning }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Late</p>
                <p className="text-2xl font-bold" style={{ color: colors.text }}>{stats.late}</p>
              </div>
            </div>
          </div>
          <div className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
                <TrendingUp size={24} style={{ color: colors.primary }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Attendance %</p>
                <p className="text-2xl font-bold" style={{ color: colors.text }}>{stats.percentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="card" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="p-6 border-b" style={{ borderColor: colors.border }}>
            <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Attendance Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: colors.surfaceVariant }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((attendance, index) => (
                  <tr key={index} className="border-b" style={{ borderColor: colors.border }}>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                      {new Date(attendance.attendanceDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                      {attendance.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-2" style={{ color: getStatusColor(attendance.status) }}>
                        {getStatusIcon(attendance.status)}
                        {attendance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                      {attendance.checkInTime || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                      {attendance.checkOutTime || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.text }}>
                      {attendance.notes || '-'}
                    </td>
                  </tr>
                ))}
                {attendanceData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center" style={{ color: colors.textSecondary }}>
                      No attendance records found for this month
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
