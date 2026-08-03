import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Video, Calendar, Clock, Users, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { liveClassAPI, enrollmentAPI } from '../../services/api';

const LiveClasses = () => {
  const { colors } = useTheme();
  const [liveClasses, setLiveClasses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await liveClassAPI.getUpcomingClasses();
      const allClasses = response.data;
      
      // Filter classes for student's enrolled courses
      const enrolledResponse = await enrollmentAPI.getStudentEnrollments(user.id);
      const enrolledCourseIds = enrolledResponse.data.map(e => e.courseId);
      
      const studentClasses = allClasses.filter(lc => enrolledCourseIds.includes(lc.courseId));
      
      const upcoming = studentClasses.filter(lc => lc.status === 'SCHEDULED');
      const past = studentClasses.filter(lc => lc.status === 'COMPLETED');
      
      setLiveClasses(studentClasses);
      setUpcomingClasses(upcoming);
      setPastClasses(past);
    } catch (error) {
      console.error('Error fetching live classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinLiveClass = async (classId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await liveClassAPI.joinLiveClass(classId);
      alert('Joined live class successfully!');
    } catch (error) {
      console.error('Error joining live class:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return colors.primary;
      case 'LIVE': return colors.success;
      case 'COMPLETED': return colors.secondary;
      case 'CANCELLED': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SCHEDULED': return <Calendar size={20} />;
      case 'LIVE': return <CheckCircle size={20} />;
      case 'COMPLETED': return <CheckCircle size={20} />;
      case 'CANCELLED': return <XCircle size={20} />;
      default: return <Calendar size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.text }}>Live Classes</h1>

        {/* Upcoming Classes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>Upcoming Classes</h2>
          {upcomingClasses.length === 0 ? (
            <div className="card p-12 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <Calendar size={64} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No Upcoming Classes</h3>
              <p style={{ color: colors.textSecondary }}>Check back later for scheduled live sessions</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingClasses.map((liveClass) => (
                <div key={liveClass.id} className="card overflow-hidden" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                  {liveClass.thumbnailUrl && (
                    <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${liveClass.thumbnailUrl})` }}></div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm" style={{ 
                        backgroundColor: getStatusColor(liveClass.status) + '20',
                        color: getStatusColor(liveClass.status)
                      }}>
                        {getStatusIcon(liveClass.status)}
                        {liveClass.status}
                      </span>
                      {liveClass.maxParticipants && (
                        <span className="flex items-center gap-1 text-sm" style={{ color: colors.textSecondary }}>
                          <Users size={16} />
                          {liveClass.participantCount || 0}/{liveClass.maxParticipants}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                      {liveClass.title}
                    </h3>
                    
                    <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                      {liveClass.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
                        <Calendar size={16} />
                        {new Date(liveClass.scheduledDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
                        <Clock size={16} />
                        {new Date(liveClass.scheduledDate).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
                        <Clock size={16} />
                        Duration: {liveClass.duration} minutes
                      </div>
                    </div>
                    
                    <button
                      onClick={() => joinLiveClass(liveClass.id)}
                      className="w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                      style={{ backgroundColor: colors.primary, color: colors.onError }}
                    >
                      <Video size={18} />
                      Join Class
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Classes */}
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>Past Classes</h2>
          {pastClasses.length === 0 ? (
            <div className="card p-12 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <Video size={64} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No Past Classes</h3>
              <p style={{ color: colors.textSecondary }}>Completed live classes will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastClasses.map((liveClass) => (
                <div key={liveClass.id} className="card overflow-hidden" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                  {liveClass.thumbnailUrl && (
                    <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${liveClass.thumbnailUrl})` }}></div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm" style={{ 
                        backgroundColor: getStatusColor(liveClass.status) + '20',
                        color: getStatusColor(liveClass.status)
                      }}>
                        {getStatusIcon(liveClass.status)}
                        {liveClass.status}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                      {liveClass.title}
                    </h3>
                    
                    <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                      {liveClass.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
                        <Calendar size={16} />
                        {new Date(liveClass.scheduledDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
                        <Clock size={16} />
                        {new Date(liveClass.scheduledDate).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    {liveClass.recordingUrl ? (
                      <button
                        onClick={() => window.open(liveClass.recordingUrl, '_blank')}
                        className="w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                        style={{ backgroundColor: colors.secondary, color: colors.onError }}
                      >
                        <ExternalLink size={18} />
                        Watch Recording
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                        style={{ backgroundColor: colors.surfaceVariant, color: colors.textSecondary }}
                      >
                        Recording Not Available
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;
