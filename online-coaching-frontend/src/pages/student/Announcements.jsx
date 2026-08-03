import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Bell, Megaphone, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { announcementAPI } from '../../services/api';

const Announcements = () => {
  const { colors } = useTheme();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await announcementAPI.getStudentAnnouncements(user.id);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (announcementId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await announcementAPI.markAsRead(announcementId, user.id);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return colors.error;
      case 'MEDIUM': return colors.warning;
      case 'LOW': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'URGENT': return <AlertTriangle size={20} />;
      case 'IMPORTANT': return <Megaphone size={20} />;
      case 'ASSIGNMENT': return <CheckCircle size={20} />;
      case 'EXAM': return <Clock size={20} />;
      default: return <Bell size={20} />;
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
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.text }}>Announcements</h1>

        {announcements.length === 0 ? (
          <div className="card p-12 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Bell size={64} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No Announcements</h3>
            <p style={{ color: colors.textSecondary }}>
              Check back later for updates and news
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
                style={{ 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border,
                  borderLeft: `4px solid ${getPriorityColor(announcement.priority)}`
                }}
                onClick={() => {
                  setSelectedAnnouncement(announcement);
                  if (!announcement.isRead) {
                    markAsRead(announcement.id);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: getPriorityColor(announcement.priority) + '20' }}>
                        {getTypeIcon(announcement.announcementType)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                          {announcement.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                          <span className="px-2 py-1 rounded" style={{ backgroundColor: getPriorityColor(announcement.priority) + '20', color: getPriorityColor(announcement.priority) }}>
                            {announcement.priority}
                          </span>
                          <span className="px-2 py-1 rounded" style={{ backgroundColor: colors.surfaceVariant, color: colors.textSecondary }}>
                            {announcement.announcementType}
                          </span>
                          {!announcement.isRead && (
                            <span className="px-2 py-1 rounded" style={{ backgroundColor: colors.primary + '20', color: colors.primary }}>
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                      {announcement.courseName ? `${announcement.courseName} • ` : ''}
                      {announcement.teacherName ? announcement.teacherName : announcement.adminName}
                    </p>
                    
                    <p className="mb-3 line-clamp-2" style={{ color: colors.text }}>
                      {announcement.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm" style={{ color: colors.textSecondary }}>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(announcement.publishDate).toLocaleDateString()}
                      </span>
                      {announcement.readCount > 0 && (
                        <span className="flex items-center gap-1">
                          <CheckCircle size={14} />
                          {announcement.readCount} read
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {announcement.attachmentUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(announcement.attachmentUrl, '_blank');
                      }}
                      className="p-2 rounded-lg ml-4"
                      style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                    >
                      <ExternalLink size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Announcement Detail Modal */}
        {selectedAnnouncement && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
                <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                  {selectedAnnouncement.title}
                </h2>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: getPriorityColor(selectedAnnouncement.priority) + '20', color: getPriorityColor(selectedAnnouncement.priority) }}>
                    {selectedAnnouncement.priority}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: colors.surfaceVariant, color: colors.textSecondary }}>
                    {selectedAnnouncement.announcementType}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>From:</p>
                  <p style={{ color: colors.text }}>
                    {selectedAnnouncement.teacherName || selectedAnnouncement.adminName}
                  </p>
                </div>
                
                {selectedAnnouncement.courseName && (
                  <div className="mb-4">
                    <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Course:</p>
                    <p style={{ color: colors.text }}>{selectedAnnouncement.courseName}</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Published:</p>
                  <p style={{ color: colors.text }}>
                    {new Date(selectedAnnouncement.publishDate).toLocaleString()}
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>Content:</p>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background, color: colors.text }}>
                    {selectedAnnouncement.content}
                  </div>
                </div>
                
                {selectedAnnouncement.attachmentUrl && (
                  <div className="mb-4">
                    <button
                      onClick={() => window.open(selectedAnnouncement.attachmentUrl, '_blank')}
                      className="px-4 py-2 rounded-lg flex items-center gap-2"
                      style={{ backgroundColor: colors.primary, color: colors.onError }}
                    >
                      <ExternalLink size={18} />
                      Open Attachment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
