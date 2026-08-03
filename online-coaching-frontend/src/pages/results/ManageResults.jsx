import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resultAPI, enrollmentAPI } from '../../services/api';
import { 
  Award, 
  TrendingUp, 
  BookOpen,
  AlertCircle,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Save,
  Users
} from 'lucide-react';

const ManageResults = () => {
  const { courseId } = useParams();
  const [results, setResults] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: courseId,
    totalMarks: '',
    grade: '',
  });

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      const [resultsRes, enrollmentsRes] = await Promise.all([
        resultAPI.getCourseResults(courseId),
        enrollmentAPI.getCourseStudents(courseId),
      ]);

      const normalizedResults = (resultsRes.data || []).map((result) => ({
        ...result,
        resultId: result.resultId ?? result.id,
        studentId: result.student?.studentId ?? result.studentId,
        studentName: result.student?.user?.name ?? result.studentName,
        studentEmail: result.student?.user?.email ?? result.studentEmail,
        totalMarks: result.totalMarks ?? result.marksObtained ?? 0,
        grade: result.grade ?? 'N/A',
        resultDate: result.resultDate ?? result.createdDate,
      }));
      setResults(normalizedResults);
      
      const normalizedEnrollments = (enrollmentsRes.data || []).map((enrollment) => ({
        ...enrollment,
        enrollId: enrollment.enrollId ?? enrollment.id,
        studentId: enrollment.student?.studentId ?? enrollment.studentId,
        studentName: enrollment.student?.user?.name ?? enrollment.studentName,
        studentEmail: enrollment.student?.user?.email ?? enrollment.studentEmail,
      }));
      setEnrollments(normalizedEnrollments);
    } catch (err) {
      setError('Failed to load results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade?.startsWith('A') || grade?.startsWith('a')) return 'bg-green-100 text-green-700';
    if (grade?.startsWith('B') || grade?.startsWith('b')) return 'bg-blue-100 text-blue-700';
    if (grade?.startsWith('C') || grade?.startsWith('c')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await resultAPI.generateResult(
        formData.studentId,
        courseId,
        formData.totalMarks,
        formData.grade
      );
      setShowCreateModal(false);
      setFormData({
        studentId: '',
        courseId: courseId,
        totalMarks: '',
        grade: '',
      });
      setSuccess('Result generated successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError('Failed to generate result');
      console.error(err);
    }
  };

  const handleEdit = (result) => {
    setEditingResult(result);
    setFormData({
      studentId: result.studentId,
      courseId: courseId,
      totalMarks: result.totalMarks,
      grade: result.grade,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await resultAPI.updateResult(editingResult.resultId, formData.totalMarks, formData.grade);
      setShowEditModal(false);
      setEditingResult(null);
      setFormData({
        studentId: '',
        courseId: courseId,
        totalMarks: '',
        grade: '',
      });
      setSuccess('Result updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError('Failed to update result');
      console.error(err);
    }
  };

  const handleDelete = async (resultId) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return;
    
    try {
      await resultAPI.deleteResult(resultId);
      setResults(results.filter(r => r.resultId !== resultId));
      setSuccess('Result deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete result');
      console.error(err);
    }
  };

  const studentsWithoutResults = enrollments.filter(
    enrollment => !results.some(r => r.studentId === enrollment.studentId)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !results.length) {
    return (
      <div className="card flex items-center gap-3 text-red-600">
        <AlertCircle size={24} />
        <span>{error}</span>
      </div>
    );
  }

  const averageMarks = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + (r.totalMarks || 0), 0) / results.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Manage Course Results</h1>
          <p className="text-gray-600">Generate and manage student grades and results</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/teacher/courses/${courseId}`}
            className="btn-secondary"
          >
            Back to Course
          </Link>
          {studentsWithoutResults.length > 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Generate Result
            </button>
          )}
        </div>
      </div>

      {success && (
        <div className="card flex items-center gap-3 text-green-600 bg-green-50">
          <Award size={24} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="card flex items-center gap-3 text-red-600 bg-red-50">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="text-blue-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Results</p>
              <p className="text-3xl font-bold text-gray-900">{results.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{averageMarks}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <BookOpen className="text-purple-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Results</p>
              <p className="text-3xl font-bold text-gray-900">{studentsWithoutResults.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Results</h2>

        {results.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Award size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No results generated yet</p>
            <p className="text-sm mt-2">Generate results for enrolled students</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Marks</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Grade</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.resultId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">
                            {result.studentName?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{result.studentName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{result.studentEmail}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {result.resultDate 
                        ? new Date(result.resultDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">{result.totalMarks || 0}%</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(result.grade)}`}>
                        {result.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(result)}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(result.resultId)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Result Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Result</h2>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student
                  </label>
                  <select
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select a student</option>
                    {studentsWithoutResults.map((enrollment) => (
                      <option key={enrollment.studentId} value={enrollment.studentId}>
                        {enrollment.studentName} ({enrollment.studentEmail})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Marks (%)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    className="input-field"
                    placeholder="Enter marks (0-100)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </label>
                  <select
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select grade</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="C-">C-</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Save size={18} />
                    Generate Result
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Result Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Result</h2>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingResult?.studentName || ''}
                    className="input-field bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Marks (%)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    className="input-field"
                    placeholder="Enter marks (0-100)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </label>
                  <select
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select grade</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="C-">C-</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingResult(null);
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Save size={18} />
                    Update Result
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageResults;
