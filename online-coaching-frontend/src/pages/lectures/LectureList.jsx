import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { lectureAPI, uploadAPI } from '../../services/api';
import { 
  Play, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  FileVideo,
  FileText,
  X,
  Upload
} from 'lucide-react';

const LectureList = () => {
  const { courseId } = useParams();
  const { isStudent, isTeacher } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [editingLecture, setEditingLecture] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    videoFile: null,
    videoSource: 'url', // 'url' or 'file'
    duration: '',
    lectureOrder: 1,
    uploadDate: new Date().toISOString().split('T')[0],
  });
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  const fetchLectures = async () => {
    try {
      const res = await lectureAPI.getCourseLectures(courseId);
      setLectures(res.data);
    } catch (err) {
      setError('Failed to load lectures');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      let videoUrl = formData.videoUrl;
      
      // Handle video file upload to server
      if (formData.videoFile) {
        setUploadingVideo(true);
        try {
          const uploadRes = await uploadAPI.uploadVideo(formData.videoFile);
          videoUrl = uploadRes.data.url;
        } catch (uploadErr) {
          console.error('Video upload failed:', uploadErr);
          setError('Failed to upload video. Please try again.');
          setUploadingVideo(false);
          return;
        }
        setUploadingVideo(false);
      }
      
      await lectureAPI.createLecture({
        title: formData.title,
        description: formData.description,
        videoUrl: videoUrl,
        lectureOrder: formData.lectureOrder || 1,
        uploadDate: formData.uploadDate ? new Date(formData.uploadDate).toISOString().split('T')[0] : null,
        courseId: parseInt(courseId),
      });
      showSuccess('Lecture uploaded successfully!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        videoUrl: '',
        videoFile: null,
        duration: '',
        lectureOrder: lectures.length + 1,
        uploadDate: new Date().toISOString().split('T')[0],
      });
      fetchLectures();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to upload lecture');
      console.error('Failed to create lecture:', err);
      setError('Failed to create lecture. Please try again.');
      setUploadingVideo(false);
    }
  };

  const handleEdit = (lecture) => {
    setEditingLecture(lecture);
    setFormData({
      title: lecture.title,
      description: lecture.description,
      videoUrl: lecture.videoUrl || '',
      videoFile: null,
      videoSource: lecture.videoUrl ? 'url' : 'file',
      duration: lecture.duration,
      lectureOrder: lecture.lectureOrder,
      uploadDate: lecture.uploadDate || new Date().toISOString().split('T')[0],
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let videoUrl = formData.videoUrl;
      
      // Handle video file upload to server
      if (formData.videoFile) {
        setUploadingVideo(true);
        try {
          const uploadRes = await uploadAPI.uploadVideo(formData.videoFile);
          videoUrl = uploadRes.data.url;
        } catch (uploadErr) {
          console.error('Video upload failed:', uploadErr);
          setError('Failed to upload video. Please try again.');
          setUploadingVideo(false);
          return;
        }
        setUploadingVideo(false);
      }
      
      await lectureAPI.updateLecture(editingLecture.lectureId, {
        title: formData.title,
        description: formData.description,
        videoUrl: videoUrl,
        lectureOrder: formData.lectureOrder,
        uploadDate: formData.uploadDate ? new Date(formData.uploadDate).toISOString().split('T')[0] : null,
      });
      showSuccess('Lecture updated successfully!');
      setShowEditModal(false);
      setEditingLecture(null);
      setFormData({
        title: '',
        description: '',
        videoUrl: '',
        videoFile: null,
        duration: '',
        lectureOrder: lectures.length + 1,
        uploadDate: new Date().toISOString().split('T')[0],
      });
      fetchLectures();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update lecture');
      console.error('Failed to update lecture:', err);
      setError('Failed to update lecture. Please try again.');
      setUploadingVideo(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lecture?')) return;
    
    try {
      await lectureAPI.deleteLecture(id);
      showSuccess('Lecture deleted successfully!');
      setLectures(lectures.filter(l => l.lectureId !== id));
    } catch (err) {
      showError('Failed to delete lecture');
      console.error('Failed to delete lecture:', err);
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
            {isStudent ? 'Course Lectures' : 'Manage Course Lectures'}
          </h1>
          <p className="text-gray-600">
            {isStudent ? 'Watch video lectures and course content' : 'Manage video lectures and course content'}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Lecture
          </button>
        )}
      </div>

      {lectures.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <FileVideo size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No lectures added yet</p>
          <p className="text-sm mt-2">Click "Add Lecture" to create your first lecture</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lectures.map((lecture, index) => (
            <div key={lecture.lectureId} className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-semibold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{lecture.title}</h3>
                      <p className="text-gray-600 mt-1">{lecture.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{lecture.duration || 'N/A'}</span>
                        </div>
                        {lecture.videoUrl && (
                          <button
                            onClick={() => {
                              setSelectedVideoUrl(lecture.videoUrl);
                              setShowVideoModal(true);
                            }}
                            className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                          >
                            <FileVideo size={16} />
                            <span>Watch Video</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isTeacher && (
                        <>
                          <button 
                            onClick={() => handleEdit(lecture)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(lecture.lectureId)}
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

      {/* Create Lecture Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Lecture</h2>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lecture Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter lecture title"
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
                    placeholder="Describe the lecture content"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Source
                  </label>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="videoSource"
                        value="url"
                        checked={formData.videoSource === 'url'}
                        onChange={() => setFormData({ ...formData, videoSource: 'url', videoFile: null })}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span>YouTube/URL</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="videoSource"
                        value="file"
                        checked={formData.videoSource === 'file'}
                        onChange={() => setFormData({ ...formData, videoSource: 'file', videoUrl: '' })}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span>Upload File</span>
                    </label>
                  </div>
                </div>

                {formData.videoSource === 'url' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="input-field"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Video File
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/mov,video/avi,video/mkv,video/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 500 * 1024 * 1024) {
                            alert('File size exceeds 500MB limit');
                            e.target.value = '';
                            return;
                          }
                          setFormData({ ...formData, videoFile: file });
                        }
                      }}
                      className="input-field"
                    />
                    {formData.videoFile && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Selected: {formData.videoFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: MP4, MOV, AVI, MKV (Max 500MB)
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 45 minutes"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({
                        title: '',
                        description: '',
                        videoUrl: '',
                        videoFile: null,
                        videoSource: 'url',
                        duration: '',
                        lectureOrder: lectures.length + 1,
                        uploadDate: new Date().toISOString().split('T')[0],
                      });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={uploadingVideo} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                    {uploadingVideo ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      'Add Lecture'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lecture Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Lecture</h2>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lecture Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter lecture title"
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
                    placeholder="Describe the lecture content"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Source
                  </label>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="editVideoSource"
                        value="url"
                        checked={formData.videoSource === 'url'}
                        onChange={() => setFormData({ ...formData, videoSource: 'url', videoFile: null })}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span>YouTube/URL</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="editVideoSource"
                        value="file"
                        checked={formData.videoSource === 'file'}
                        onChange={() => setFormData({ ...formData, videoSource: 'file', videoUrl: '' })}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span>Upload File</span>
                    </label>
                  </div>
                </div>

                {formData.videoSource === 'url' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="input-field"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Video File
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/mov,video/avi,video/mkv,video/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Validate file size (500MB max)
                          if (file.size > 500 * 1024 * 1024) {
                            alert('File size exceeds 500MB limit');
                            e.target.value = '';
                            return;
                          }
                          setFormData({ ...formData, videoFile: file });
                        }
                      }}
                      className="input-field"
                    />
                    {formData.videoFile && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Selected: {formData.videoFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: MP4, MOV, AVI, MKV (Max 500MB)
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 45 minutes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lecture Order
                  </label>
                  <input
                    type="number"
                    value={formData.lectureOrder}
                    onChange={(e) => setFormData({ ...formData, lectureOrder: parseInt(e.target.value) })}
                    className="input-field"
                    placeholder="Order number"
                    min="1"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingLecture(null);
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={uploadingVideo} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                    {uploadingVideo ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      'Update Lecture'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideoUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Video Lecture</h3>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setSelectedVideoUrl(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              {selectedVideoUrl.includes('youtube.com') || selectedVideoUrl.includes('youtu.be') ? (
                <iframe
                  src={selectedVideoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video Lecture"
                />
              ) : (
                <video
                  src={selectedVideoUrl}
                  controls
                  className="w-full h-full"
                  title="Video Lecture"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LectureList;
