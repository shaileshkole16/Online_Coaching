import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { teacherAPI, ratingAPI, studentAPI, uploadAPI } from '../../services/api';
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
  Edit2,
  GraduationCap,
  Award,
  Briefcase,
  Star
} from 'lucide-react';

const TeacherProfile = () => {
  const { user, updateUser } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAchievements, setIsEditingAchievements] = useState(false);
  const [newAchievement, setNewAchievement] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    qualification: '',
    experience: '',
    specialization: '',
    bio: '',
    profilePicture: null,
  });

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      const [profileRes, dashboardRes] = await Promise.all([
        teacherAPI.getTeacherByUserId(user.id),
        teacherAPI.getTeacherByUserId(user.id).then(res => 
          teacherAPI.getTeacherDashboard(res.data.teacherId)
        ).catch(() => null)
      ]);
      
      const teacherData = profileRes.data;
      const dashboardData = dashboardRes?.data || {};
      
      console.log('Fetched teacher data:', teacherData);
      console.log('Fetched achievements:', teacherData.achievements);
      
      setProfile({
        ...teacherData,
        teacherId: teacherData.teacherId,
        joinDate: teacherData.joinDate || teacherData.createdAt,
        achievements: teacherData.achievements || [],
        totalCourses: dashboardData.totalCourses || 0,
        totalStudents: dashboardData.totalStudents || 0,
        totalLectures: dashboardData.totalLectures || 0,
        averageRating: dashboardData.averageRating || 0,
        totalRatings: dashboardData.totalRatings || 0,
      });
      setFormData({
        name: teacherData.user?.name || user.name || '',
        email: teacherData.user?.email || user.email || '',
        phone: teacherData.phone || '',
        address: teacherData.address || '',
        qualification: teacherData.qualification || '',
        experience: teacherData.expertise || '',
        specialization: teacherData.expertise || '',
        bio: teacherData.bio || '',
        profilePicture: teacherData.profilePicture || null,
      });
    } catch (err) {
      // If teacher not found (404), use user data from auth context as fallback
      if (err.response?.status === 404) {
        setProfile({
          id: user.id,
          teacherId: null,
          name: user.name,
          email: user.email,
          phone: '',
          address: '',
          qualification: '',
          experience: '',
          specialization: '',
          bio: '',
          joinDate: new Date().toISOString(),
          achievements: [],
          totalCourses: 0,
          totalStudents: 0,
          totalLectures: 0,
          averageRating: 0,
        });
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: '',
          address: '',
          qualification: '',
          experience: '',
          specialization: '',
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
      console.log('Updating teacher profile:', user.id, formData);
      
      // Get teacher ID first
      const teacherRes = await teacherAPI.getTeacherByUserId(user.id);
      const teacherId = teacherRes.data.teacherId;
      
      // Handle profile picture upload
      let profilePictureUrl = formData.profilePicture;
      if (formData.profilePicture instanceof File) {
        // Upload profile picture to server
        try {
          const uploadRes = await uploadAPI.uploadProfile(formData.profilePicture);
          profilePictureUrl = uploadRes.data.url;
        } catch (uploadErr) {
          console.error('Profile picture upload failed:', uploadErr);
          // Fall back to local object URL if upload fails
          profilePictureUrl = URL.createObjectURL(formData.profilePicture);
        }
      }
      
      const res = await teacherAPI.updateTeacher(teacherId, {
        ...formData,
        profilePicture: profilePictureUrl,
        achievements: profile.achievements || [],
      });
      console.log('Update response:', res);
      setProfile({ ...profile, ...formData, profilePicture: profilePictureUrl });
      updateUser({ ...user, ...formData });
      showSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      showError('Failed to update profile');
      console.error('Profile update error:', err);
      console.error('Error response:', err.response);
    }
  };

  const handleAddAchievement = () => {
    if (!newAchievement.trim()) return;
    
    const updatedAchievements = [...(profile.achievements || []), newAchievement.trim()];
    setProfile({ ...profile, achievements: updatedAchievements });
    setNewAchievement('');
    
    // Auto-save achievements
    saveAchievements(updatedAchievements);
  };

  const handleDeleteAchievement = (index) => {
    const updatedAchievements = profile.achievements.filter((_, i) => i !== index);
    setProfile({ ...profile, achievements: updatedAchievements });
    
    // Auto-save achievements
    saveAchievements(updatedAchievements);
  };

  const saveAchievements = async (achievements) => {
    try {
      const teacherRes = await teacherAPI.getTeacherByUserId(user.id);
      const teacherId = teacherRes.data.teacherId;
      
      console.log('Saving achievements:', achievements);
      const res = await teacherAPI.updateTeacher(teacherId, {
        achievements,
      });
      console.log('Achievements save response:', res);
      showSuccess('Achievements updated successfully!');
    } catch (err) {
      showError('Failed to update achievements');
      console.error('Achievements update error:', err);
      console.error('Error response:', err.response);
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
              <div className="w-32 h-32 bg-green-100 rounded-2xl flex items-center justify-center">
                <span className="text-green-600 font-bold text-4xl">
                  {profile?.name?.charAt(0) || 'T'}
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
                  id="profile-picture-upload"
                />
                <label
                  htmlFor="profile-picture-upload"
                  className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors cursor-pointer"
                >
                  <Camera size={16} />
                </label>
              </>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
            <p className="text-gray-600 mt-1">{profile?.specialization || 'No specialization specified'}</p>
            <p className="text-gray-500 mt-2 text-sm">{profile?.bio || 'No bio added yet'}</p>
            
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>Teacher ID: {profile?.teacherId || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>Joined: {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'N/A'}</span>
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
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Enter your address"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualification
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="input-field pl-10"
                  placeholder="e.g., PhD, MSc, BSc"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="input-field pl-10"
                  placeholder="e.g., 5 years"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="input-field"
              placeholder="e.g., Mathematics, Physics, Computer Science"
            />
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
              placeholder="Tell us about yourself and your teaching philosophy"
              rows={4}
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
                    qualification: profile.qualification || '',
                    experience: profile.experience || '',
                    specialization: profile.specialization || '',
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

      {/* Teaching Statistics */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Teaching Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Total Courses</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{profile?.totalCourses || 0}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-600">Total Students</p>
            <p className="text-3xl font-bold text-green-900 mt-2">{profile?.totalStudents || 0}</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-600">Total Lectures</p>
            <p className="text-3xl font-bold text-purple-900 mt-2">{profile?.totalLectures || 0}</p>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm font-medium text-orange-600">Average Rating</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="text-orange-500" size={24} fill="currentColor" />
              <p className="text-3xl font-bold text-orange-900">{profile?.averageRating?.toFixed(1) || 0}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">{profile?.totalRatings || 0} ratings</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Achievements & Certifications</h3>
          <button
            onClick={() => setIsEditingAchievements(!isEditingAchievements)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {isEditingAchievements ? 'Done' : 'Add Achievement'}
          </button>
        </div>
        
        {isEditingAchievements && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              className="input-field flex-1"
              placeholder="Enter achievement or certification"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newAchievement.trim()) {
                  handleAddAchievement();
                }
              }}
            />
            <button
              onClick={handleAddAchievement}
              disabled={!newAchievement.trim()}
              className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        )}
        
        {profile?.achievements && profile.achievements.length > 0 ? (
          <div className="space-y-3">
            {profile.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="text-yellow-500" size={20} />
                  <span className="text-gray-900">{achievement}</span>
                </div>
                {isEditingAchievements && (
                  <button
                    onClick={() => handleDeleteAchievement(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No achievements added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;
