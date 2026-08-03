import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { materialAPI } from '../../services/api';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2,
  AlertCircle,
  File,
  FileImage,
  FileVideo,
  FileArchive
} from 'lucide-react';

const StudyMaterials = () => {
  const { courseId } = useParams();
  const { isStudent, isTeacher } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  const fetchMaterials = async () => {
    try {
      const res = await materialAPI.getCourseMaterials(courseId);
      const normalizedMaterials = (res.data || []).map((material) => ({
        ...material,
        id: material.id ?? material.materialId,
        title: material.title ?? material.name,
        fileName: material.fileName ?? material.file_name,
        uploadDate: material.uploadDate ?? material.createdDate,
      }));
      setMaterials(normalizedMaterials);
    } catch (err) {
      setError('Failed to load materials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !title) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('courseId', courseId);

    try {
      await materialAPI.uploadMaterial(formData);
      setTitle('');
      setSelectedFile(null);
      fetchMaterials();
    } catch (err) {
      console.error('Failed to upload material:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (materialId, fileName) => {
    try {
      const response = await materialAPI.downloadMaterial(materialId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download material:', err);
    }
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    
    try {
      await materialAPI.deleteMaterial(materialId);
      setMaterials(materials.filter(m => m.id !== materialId));
    } catch (err) {
      console.error('Failed to delete material:', err);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <FileImage size={24} />;
    if (['mp4', 'avi', 'mov'].includes(ext)) return <FileVideo size={24} />;
    if (['zip', 'rar', '7z'].includes(ext)) return <FileArchive size={24} />;
    return <File size={24} />;
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
      <div>
        <h1 className="page-header">
          {isStudent ? 'Study Materials' : 'Manage Study Materials'}
        </h1>
        <p className="text-gray-600">
          {isStudent ? 'View and download course materials' : 'Upload and manage course materials for students'}
        </p>
      </div>

      {/* Upload Form - Only for teachers */}
      {isTeacher && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Material</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Enter material title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload size={48} className="text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    {selectedFile ? selectedFile.name : 'Click to select a file'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, DOC, Images, Videos up to 100MB
                  </p>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedFile || !title || uploading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Material'}
            </button>
          </form>
        </div>
      )}

      {/* Materials List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Materials</h2>

        {materials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No materials uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <div key={material.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600">
                  {getFileIcon(material.fileName)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{material.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{material.fileName}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(material.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(material.id, material.fileName)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Download size={18} />
                  </button>
                  {isTeacher && (
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;
