import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  BookOpen, 
  Search, 
  Check, 
  X, 
  AlertCircle,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await adminAPI.getAllCourses();
      setCourses(res.data);
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacher?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      case 'PENDING':
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !courses.length) {
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
          <h1 className="page-header">Manage Courses</h1>
          <p className="text-gray-600">View, approve, and manage all platform courses</p>
        </div>
      </div>

      {success && (
        <div className="card flex items-center gap-3 text-green-600 bg-green-50">
          <Check size={24} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="card flex items-center gap-3 text-red-600 bg-red-50">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
            placeholder="Search by course title or teacher name..."
          />
        </div>
      </div>

      {/* Courses Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Courses</h2>
          <span className="text-sm text-gray-500">{filteredCourses.length} courses</span>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No courses found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Course</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Teacher</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.courseId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <BookOpen className="text-purple-600" size={20} />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{course.title}</span>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{course.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {course.teacher?.user?.name || 'Unknown'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor('ACTIVE')}`}>
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {course.price ? `₹${course.price}` : 'Free'}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {course.level || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {course.createdDate 
                          ? new Date(course.createdDate).toLocaleDateString()
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Check className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(courses.map(c => c.teacher?.user?.name))].length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{courses.reduce((sum, c) => sum + (c.price || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;