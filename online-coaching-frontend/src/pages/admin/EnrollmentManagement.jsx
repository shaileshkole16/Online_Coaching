import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  Users, 
  Search, 
  BookOpen, 
  GraduationCap,
  Calendar,
  AlertCircle,
  Filter,
  TrendingUp
} from 'lucide-react';

const EnrollmentManagement = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await adminAPI.getAllEnrollments();
      setEnrollments(res.data);
    } catch (err) {
      setError('Failed to load enrollments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.teacherName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || enrollment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const uniqueCourses = [...new Set(enrollments.map(e => e.courseTitle))];
  const uniqueTeachers = [...new Set(enrollments.map(e => e.teacherName))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !enrollments.length) {
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
        <div>
          <h1 className="page-header">Enrollment Management</h1>
          <p className="text-gray-600">View all students, teachers, courses, and enrollment relationships</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <GraduationCap className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">
                {enrollments.filter(e => e.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <BookOpen className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueTeachers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="card flex items-center gap-3 text-red-600 bg-red-50">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              placeholder="Search by student, teacher, or course..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Enrollments</h2>
          <span className="text-sm text-gray-500">{filteredEnrollments.length} enrollments</span>
        </div>

        {filteredEnrollments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No enrollments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Course</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Teacher</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Enrolled Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.enrollmentId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-medium text-gray-900">{enrollment.studentName}</span>
                        <p className="text-sm text-gray-500">{enrollment.studentEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-purple-600" />
                        <div>
                          <span className="font-medium text-gray-900">{enrollment.courseTitle}</span>
                          <p className="text-xs text-gray-500 line-clamp-1">{enrollment.courseDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-green-600" />
                        <div>
                          <span className="font-medium text-gray-900">{enrollment.teacherName}</span>
                          <p className="text-sm text-gray-500">{enrollment.teacherEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(enrollment.status)}`}>
                        {enrollment.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {enrollment.planType || 'Standard'}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        {enrollment.amountPaid != null && enrollment.amountPaid > 0 ? `₹${enrollment.amountPaid}` : 'Free'}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {enrollment.enrollDate 
                          ? new Date(enrollment.enrollDate).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stats by Teacher */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Enrollments by Teacher</h2>
        <div className="space-y-4">
          {uniqueTeachers.map(teacherName => {
            const teacherEnrollments = enrollments.filter(e => e.teacherName === teacherName);
            return (
              <div key={teacherName} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{teacherName}</p>
                    <p className="text-sm text-gray-500">{teacherEnrollments.length} enrollments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">₹{teacherEnrollments.reduce((sum, e) => sum + (e.amountPaid || 0), 0).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentManagement;