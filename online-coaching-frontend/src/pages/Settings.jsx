import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  User, 
  Bell, 
  Shield, 
  LogOut,
  ChevronRight,
  HelpCircle,
  Save
} from 'lucide-react';
import { userSettingsAPI } from '../services/api';

const Settings = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    emailDigest: 'daily',
    language: 'en',
    timezone: 'UTC'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const response = await userSettingsAPI.getUserSettings(user.id);
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      if (settings.id) {
        await userSettingsAPI.updateSettings(settings.id, settings);
      } else {
        await userSettingsAPI.createSettings({
          ...settings,
          userId: user.id
        });
      }
      showSuccess('Settings saved successfully');
    } catch (error) {
      showError('Error saving settings');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      showSuccess('Logged out successfully');
      navigate('/login');
    } catch (error) {
      showError('Error logging out');
    }
    setLoading(false);
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: SettingsIcon,
      items: [
        {
          label: 'Dark Mode',
          icon: isDarkMode ? Moon : Sun,
          action: toggleTheme,
          value: isDarkMode ? 'On' : 'Off',
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Email Notifications',
          icon: Bell,
          action: () => setSettings({ ...settings, emailNotifications: !settings.emailNotifications }),
          value: settings.emailNotifications ? 'Enabled' : 'Disabled',
        },
        {
          label: 'Push Notifications',
          icon: Bell,
          action: () => setSettings({ ...settings, pushNotifications: !settings.pushNotifications }),
          value: settings.pushNotifications ? 'Enabled' : 'Disabled',
        },
        {
          label: 'Email Digest',
          icon: Bell,
          field: 'emailDigest',
          value: settings.emailDigest,
          isSelect: true,
          options: ['daily', 'weekly', 'monthly']
        },
      ],
    },
    {
      title: 'Preferences',
      icon: User,
      items: [
        {
          label: 'Language',
          icon: User,
          field: 'language',
          value: settings.language,
          isSelect: true,
          options: ['en', 'es', 'fr', 'de']
        },
        {
          label: 'Timezone',
          icon: User,
          field: 'timezone',
          value: settings.timezone,
          isSelect: true,
          options: ['UTC', 'EST', 'PST', 'IST']
        },
      ],
    },
    {
      title: 'Account',
      icon: User,
      items: [
        {
          label: 'Profile',
          icon: User,
          action: () => navigate(user?.role === 'STUDENT' ? '/student/profile' : user?.role === 'TEACHER' ? '/teacher/profile' : '/admin/dashboard'),
          value: 'View',
        },
        {
          label: 'Security',
          icon: Shield,
          action: () => showError('Password change feature coming soon'),
          value: 'Manage',
        },
      ],
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        {
          label: 'Support Tickets',
          icon: HelpCircle,
          action: () => navigate('/support-tickets'),
          value: 'View',
        },
        {
          label: 'Help Center',
          icon: HelpCircle,
          action: () => showError('Help center coming soon'),
          value: 'Visit',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
            Settings
          </h1>
          <p style={{ color: colors.textSecondary }}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* User Info Card */}
        <div className="card mb-6 p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <User className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                {user?.name || 'User'}
              </h2>
              <p style={{ color: colors.textSecondary }}>
                {user?.email || 'user@example.com'}
              </p>
              <span className="inline-block px-2 py-1 text-xs font-medium rounded mt-1" style={{ 
                backgroundColor: colors.primary, 
                color: colors.onError 
              }}>
                {user?.role || 'STUDENT'}
              </span>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
              <section.icon size={20} />
              {section.title}
            </h3>
            <div className="card" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              {section.items.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-4 ${
                    index !== section.items.length - 1 ? 'border-b' : ''
                  }`}
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: colors.surfaceVariant }}>
                      <item.icon size={20} style={{ color: colors.primary }} />
                    </div>
                    <span style={{ color: colors.text }}>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.isSelect ? (
                      <select
                        value={item.value}
                        onChange={(e) => {
                          if (item.field) {
                            setSettings({ ...settings, [item.field]: e.target.value });
                          }
                        }}
                        className="px-3 py-1 rounded text-sm"
                        style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                      >
                        {item.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <>
                        <span className="text-sm" style={{ color: colors.textSecondary }}>
                          {item.value}
                        </span>
                        {!item.isSelect && (
                          <button
                            onClick={item.action}
                            className="p-1"
                            style={{ backgroundColor: 'transparent', color: colors.textSecondary }}
                          >
                            <ChevronRight size={20} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Save Button */}
        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full card p-4 flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          style={{ 
            backgroundColor: colors.primary, 
            borderColor: colors.border,
            color: colors.onError,
          }}
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full card p-4 flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: colors.error, 
            borderColor: colors.border,
            color: colors.onError,
          }}
        >
          <LogOut size={20} />
          {loading ? 'Logging out...' : 'Logout'}
        </button>

        {/* App Info */}
        <div className="mt-8 text-center text-sm" style={{ color: colors.textSecondary }}>
          <p>Online Coaching System v1.0.0</p>
          <p className="mt-1">© 2024 CDAC Final Project</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
