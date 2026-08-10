import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  Settings, 
  Save, 
  Shield, 
  Bell, 
  Upload, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    platformName: 'Online Coaching',
    platformDescription: '',
    contactEmail: '',
    contactPhone: '',
    maintenanceMode: false,
    registrationEnabled: true,
    teacherRegistrationRequiresApproval: true,
    defaultCourseApprovalRequired: false,
    maxFileSizeMb: 100,
    allowedVideoFormats: 'mp4,avi,mov,mkv'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await adminAPI.getSettings();
      setSettings(res.data);
    } catch (err) {
      setError('Failed to load settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await adminAPI.updateSettings(settings);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Platform Settings</h1>
          <p className="text-gray-600">Configure platform-wide settings and preferences</p>
        </div>
      </div>

      {success && (
        <div className="card flex items-center gap-3 text-green-600 bg-green-50">
          <CheckCircle size={24} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="card flex items-center gap-3 text-red-600 bg-red-50">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-primary-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Name
              </label>
              <input
                type="text"
                name="platformName"
                value={settings.platformName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter platform name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Description
              </label>
              <textarea
                name="platformDescription"
                value={settings.platformDescription}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Enter platform description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-green-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Access Control</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-600">Disable platform for maintenance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">User Registration</h3>
                <p className="text-sm text-gray-600">Allow new user registrations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="registrationEnabled"
                  checked={settings.registrationEnabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Teacher Approval Required</h3>
                <p className="text-sm text-gray-600">Require admin approval for teacher registration</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="teacherRegistrationRequiresApproval"
                  checked={settings.teacherRegistrationRequiresApproval}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Course Approval Required</h3>
                <p className="text-sm text-gray-600">Require admin approval for published courses</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="defaultCourseApprovalRequired"
                  checked={settings.defaultCourseApprovalRequired}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* File Upload Settings */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="text-purple-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">File Upload Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum File Size (MB)
              </label>
              <input
                type="number"
                name="maxFileSizeMb"
                value={settings.maxFileSizeMb}
                onChange={handleChange}
                className="input-field"
                min="1"
                max="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed Video Formats
              </label>
              <input
                type="text"
                name="allowedVideoFormats"
                value={settings.allowedVideoFormats}
                onChange={handleChange}
                className="input-field"
                placeholder="mp4,avi,mov,mkv"
              />
              <p className="text-sm text-gray-500 mt-1">
                Comma-separated list of allowed video formats
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;