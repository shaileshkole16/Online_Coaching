import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { assignmentAPI, submissionAPI, studentAPI, uploadAPI } from '../../services/api';
import { 
  FileText, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Calendar,
  CheckCircle,
  Upload
} from 'lucide-react';

const AssignmentList = () => {
  const { courseId } = useParams();
  const { user, isStudent, isTeacher } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submitting, setSubmitting] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxMarks: 100,
  });

  useEffect(() => {
    fetchAssignments();
    if (isStudent) {
      fetchSubmissions();
    }
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      const res = await assignmentAPI.getCourseAssignments(courseId);
      const normalizedAssignments = (res.data || []).map((assignment) => ({
        ...assignment,
        assignmentId: assignment.assignmentId ?? assignment.id,
        title: assignment.title ?? assignment.name,
        description: assignment.description ?? '',
        dueDate: assignment.dueDate ?? assignment.createdDate,
        maxMarks: assignment.maxMarks ?? assignment.totalMarks ?? 100,
      }));
      setAssignments(normalizedAssignments);
    } catch (err) {
      setError('Failed to load assignments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      let studentId = user.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }

      const res = await submissionAPI.getStudentSubmissions(studentId);
      setSubmissions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    }
  };

  const hasSubmitted = (assignmentId) => {
    return submissions.some(sub => 
      sub.assignment?.assignmentId === assignmentId || 
      sub.assignmentId === assignmentId
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await assignmentAPI.createAssignment({
        ...formData,
        courseId: parseInt(courseId),
        totalMarks: parseInt(formData.maxMarks),
        deadline: formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : null,
      });
      showSuccess('Assignment created successfully!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        maxMarks: 100,
      });
      fetchAssignments();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create assignment');
      console.error('Failed to create assignment:', err);
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      maxMarks: assignment.maxMarks,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await assignmentAPI.updateAssignment(editingAssignment.assignmentId, {
        ...formData,
        totalMarks: parseInt(formData.maxMarks),
        deadline: formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : null,
      });
      showSuccess('Assignment updated successfully!');
      setShowEditModal(false);
      setEditingAssignment(null);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        maxMarks: 100,
      });
      fetchAssignments();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update assignment');
      console.error('Failed to update assignment:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      await assignmentAPI.deleteAssignment(id);
      showSuccess('Assignment deleted successfully!');
      setAssignments(assignments.filter(a => a.assignmentId !== id));
    } catch (err) {
      showError('Failed to delete assignment');
      console.error('Failed to delete assignment:', err);
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    if (!submissionFile) {
      showError('Please select a file to submit');
      return;
    }

    setSubmitting(assignmentId);
    setUploading(true);
    try {
      // Get studentId first using userId
      let studentId = user.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }

      // Upload file to server first
      const uploadRes = await uploadAPI.uploadAssignment(submissionFile);
      const fileUrl = uploadRes.data.url;
      
      // Submit assignment with the server file URL
      await submissionAPI.submitAssignment(assignmentId, studentId, fileUrl);
      setSubmissionFile(null);
      showSuccess('Assignment submitted successfully!');
      fetchSubmissions();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit assignment');
      console.error('Failed to submit assignment:', err);
    } finally {
      setSubmitting(null);
      setUploading(false);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">
            {isStudent ? 'Course Assignments' : 'Manage Assignments'}
          </h1>
          <p className="text-gray-600">
            {isStudent ? 'View and submit your assignments' : 'Create and manage student assignments'}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Assignment
          </button>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No assignments created yet</p>
          <p className="text-sm mt-2">Click "Add Assignment" to create your first assignment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.assignmentId} className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="text-purple-600" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                      <p className="text-gray-600 mt-1">{assignment.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>Due: {assignment.dueDate || 'No due date'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle size={16} />
                          <span>Max Marks: {assignment.maxMarks || 100}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isStudent && (
                        <div className="flex items-center gap-2">
                          {hasSubmitted(assignment.assignmentId) ? (
                            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                              <CheckCircle size={16} />
                              Submitted
                            </span>
                          ) : (
                            <>
                              <input
                                type="file"
                                onChange={(e) => setSubmissionFile(e.target.files[0])}
                                className="hidden"
                                id={`file-${assignment.assignmentId}`}
                              />
                              <label
                                htmlFor={`file-${assignment.assignmentId}`}
                                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Upload size={18} />
                              </label>
                              {submissionFile && (
                                <button
                                  onClick={() => handleSubmitAssignment(assignment.assignmentId)}
                                  disabled={submitting === assignment.assignmentId}
                                  className="btn-primary px-3 py-1 text-sm disabled:opacity-50"
                                >
                                  {submitting === assignment.assignmentId ? 'Submitting...' : 'Submit'}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {isTeacher && (
                        <>
                          <Link
                            to={`/teacher/courses/${courseId}/submissions`}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View Submissions"
                          >
                            <FileText size={18} />
                          </Link>
                          <button 
                            onClick={() => handleEdit(assignment)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(assignment.assignmentId)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Assignment</h2>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter assignment title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field min-h-24"
                    placeholder="Describe the assignment requirements"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Marks
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxMarks}
                      onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Add Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Assignment</h2>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter assignment title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field min-h-24"
                    placeholder="Describe the assignment requirements"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Marks
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxMarks}
                      onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingAssignment(null);
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Update Assignment
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

export default AssignmentList;
