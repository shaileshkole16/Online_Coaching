import { useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';

const FileUpload = ({ onUpload, accept = '*', maxSize = 10485760, multiple = false }) => {
  const { colors } = useTheme;
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [maxSize, accept]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (newFiles) => {
    const validFiles = [];
    const errors = {};

    newFiles.forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        errors[file.name] = `File size exceeds ${maxSize / 1024 / 1024}MB limit`;
        return;
      }

      // Check file type if accept is specified
      if (accept !== '*' && !file.type.match(accept.replace('*', ''))) {
        errors[file.name] = 'File type not accepted';
        return;
      }

      validFiles.push(file);
    });

    setUploadErrors(errors);

    if (multiple) {
      setFiles((prev) => [...prev, ...validFiles]);
    } else {
      setFiles(validFiles.slice(0, 1));
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[files[index]?.name];
      return newProgress;
    });
    setUploadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[files[index]?.name];
      return newErrors;
    });
  };

  const uploadFiles = async () => {
    const uploadPromises = files.map(async (file) => {
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progress
          }));
        }

        // Call the onUpload callback
        await onUpload(file);
        
        return { file, success: true };
      } catch (error) {
        setUploadErrors((prev) => ({
          ...prev,
          [file.name]: error.message || 'Upload failed'
        }));
        return { file, success: false };
      }
    });

    await Promise.all(uploadPromises);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging ? 'ring-2' : ''
        }`}
        style={{
          borderColor: isDragging ? colors.primary : colors.border,
          backgroundColor: colors.surface,
          ringColor: colors.primary
        }}
      >
        <Upload size={48} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
        <p className="mb-2" style={{ color: colors.text }}>
          Drag & drop files here, or click to select
        </p>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          Maximum file size: {formatFileSize(maxSize)}
        </p>
        <input
          type="file"
          onChange={handleFileSelect}
          accept={accept}
          multiple={multiple}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-block mt-4 px-6 py-2 rounded-lg cursor-pointer"
          style={{ backgroundColor: colors.primary, color: colors.onError }}
        >
          Browse Files
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold" style={{ color: colors.text }}>
              Selected Files ({files.length})
            </h4>
            <button
              onClick={uploadFiles}
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: colors.success, color: colors.onError }}
            >
              <Upload size={18} />
              Upload All
            </button>
          </div>
          
          {files.map((file, index) => (
            <div
              key={index}
              className="card p-4 flex items-center gap-4"
              style={{ backgroundColor: colors.surface, borderColor: colors.border }}
            >
              <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
                <File size={24} style={{ color: colors.primary }} />
              </div>
              
              <div className="flex-1">
                <p className="font-medium" style={{ color: colors.text }}>{file.name}</p>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {formatFileSize(file.size)}
                </p>
                
                {/* Progress Bar */}
                {uploadProgress[file.name] !== undefined && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2" style={{ backgroundColor: colors.surfaceVariant }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${uploadProgress[file.name]}%`,
                          backgroundColor: colors.primary
                        }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                      {uploadProgress[file.name]}%
                    </p>
                  </div>
                )}
                
                {/* Error Message */}
                {uploadErrors[file.name] && (
                  <div className="mt-2 flex items-center gap-2 text-sm" style={{ color: colors.error }}>
                    <AlertCircle size={14} />
                    {uploadErrors[file.name]}
                  </div>
                )}
              </div>
              
              {uploadProgress[file.name] === 100 && !uploadErrors[file.name] && (
                <CheckCircle size={24} style={{ color: colors.success }} />
              )}
              
              <button
                onClick={() => removeFile(index)}
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.error + '20', color: colors.error }}
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
