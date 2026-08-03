import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentAPI } from '../../services/api';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  AlertCircle,
  CheckCircle,
  Camera,
  Edit2
} from 'lucide-react';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    bio: '',
    profilePicture: null,
  });

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      const res = await studentAPI.getStudentByUserId(user.id);
      setProfile(res.data);
      setFormData({
        name: res.data.user?.name || user.name || '',
        email: res.data.user?.email || user.email || '',
        phone: res.data.phone || '',
        address: res.data.address || '',
        dateOfBirth: res.data.dob || '',
        bio: res.data.bio || '',
        profilePicture: res.data.profilePicture || null,
      });
      // Update auth context with profile picture
      if (res.data.profilePicture) {
        updateUser({ ...user, profilePicture: res.data.profilePicture });
      }
    } catch (err) {
      // If student not found (404), use user data from auth context as fallback
      if (err.response?.status === 404) {
        setProfile({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: '',
          address: '',
          dateOfBirth: '',
          bio: '',
          createdAt: new Date().toISOString(),
        });
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: '',
          address: '',
          dateOfBirth: '',
          bio: '',
        });
      } else {
        setError('Failed to load profile');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Get studentId first using userId
      let studentId = user.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }
      
      // Handle profile picture upload
      let profilePictureUrl = formData.profilePicture;
      if (formData.profilePicture instanceof File) {
        // Create FormData for file upload
        const formDataUpload = new FormData();
        formDataUpload.append('file', formData.profilePicture);
        
        try {
          // Upload file to backend
          const uploadRes = await axios.post('http://localhost:8080/api/upload/profile', formDataUpload, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          profilePictureUrl = uploadRes.data.url;
        } catch (uploadErr) {
          console.error('File upload failed, using base64:', uploadErr);
          // Fallback to base64 if upload fails
          const reader = new FileReader();
          profilePictureUrl = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(formData.profilePicture);
          });
        }
      }
      
      // Structure data to match backend expectations (Student with nested User)
      const updateData = {
        phone: formData.phone,
        address: formData.address,
        dob: formData.dateOfBirth || null,
        bio: formData.bio,
        profilePicture: profilePictureUrl,
        user: {
          name: formData.name,
          email: formData.email,
        }
      };
      
      console.log('Updating student profile:', studentId, updateData);
      const res = await studentAPI.updateStudent(studentId, updateData);
      console.log('Update response:', res);
      setProfile({ ...profile, ...formData, profilePicture: profilePictureUrl });
      updateUser({ ...user, ...formData, profilePicture: profilePictureUrl });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
      console.error('Error response:', err.response);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !profile) {
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
        <h1 className="page-header">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        )}
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

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-start gap-6">
          <div className="relative">
            {profile?.profilePicture || formData.profilePicture ? (
              <img 
                src={formData.profilePicture instanceof File ? URL.createObjectURL(formData.profilePicture) : (profile?.profilePicture || formData.profilePicture)} 
                alt="Profile" 
                className="w-32 h-32 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-primary-100 rounded-2xl flex items-center justify-center">
                <span className="text-primary-600 font-bold text-4xl">
                  {profile?.name?.charAt(0) || 'S'}
                </span>
              </div>
            )}
            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, profilePicture: e.target.files[0] })}
                  className="hidden"
                  id="student-profile-picture-upload"
                />
                <label
                  htmlFor="student-profile-picture-upload"
                  className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors cursor-pointer"
                >
                  <Camera size={16} />
                </label>
              </>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
            <p className="text-gray-600 mt-1">{profile?.bio || 'No bio added yet'}</p>
            
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>Student ID: {profile?.studentId || profile?.id || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>Joined: {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : (profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  disabled={!isEditing}
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea
                disabled={!isEditing}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field pl-10 min-h-24"
                placeholder="Enter your address"
                rows={3}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              disabled={!isEditing}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="input-field min-h-24"
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: profile.name || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    address: profile.address || '',
                    dateOfBirth: profile.dateOfBirth || '',
                    bio: profile.bio || '',
                  });
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account Statistics */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Enrolled Courses</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{profile?.enrolledCourses || 0}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-600">Completed Lectures</p>
            <p className="text-3xl font-bold text-green-900 mt-2">{profile?.completedLectures || 0}</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-600">Certificates Earned</p>
            <p className="text-3xl font-bold text-purple-900 mt-2">{profile?.certificates || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
