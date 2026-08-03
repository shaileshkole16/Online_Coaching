import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  FileText,
  TrendingUp,
  User,
  Award,
  BarChart3,
  Star,
  Calendar,
  Tag,
  HelpCircle,
  Settings,
  Bell,
  Trophy,
  CheckCircle,
  MessageCircle,
  Video,
  Heart,
  Clock
} from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout, isAdmin, isStudent, isTeacher } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isStudent) return '/student/dashboard';
    if (isTeacher) return '/teacher/dashboard';
    return '/login';
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: getDashboardPath() },
  ];

  if (isAdmin) {
    navItems.push(
      { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
      { icon: Users, label: 'Students', path: '/admin/students' },
      { icon: Users, label: 'Teachers', path: '/admin/teachers' },
      { icon: Settings, label: 'Settings', path: '/admin/settings' },
    );
  }

  if (isStudent) {
    navItems.push(
      { icon: BookOpen, label: 'My Courses', path: '/student/courses' },
      { icon: Trophy, label: 'Progress', path: '/student/progress' },
      { icon: FileText, label: 'Submissions', path: '/student/submissions' },
      { icon: Award, label: 'Results', path: '/student/results' },
      { icon: Bell, label: 'Announcements', path: '/student/announcements' },
      { icon: CheckCircle, label: 'Certificates', path: '/student/certificates' },
      { icon: Clock, label: 'Attendance', path: '/student/attendance' },
      { icon: MessageCircle, label: 'Forum', path: '/student/forum' },
      { icon: Video, label: 'Live Classes', path: '/student/live-classes' },
      { icon: Heart, label: 'Wishlist', path: '/student/wishlist' },
      { icon: MessageSquare, label: 'Messages', path: '/student/messages' },
      { icon: User, label: 'Profile', path: '/student/profile' },
      { icon: Settings, label: 'Settings', path: '/student/settings' },
    );
  }

  if (isTeacher) {
    navItems.push(
      { icon: BookOpen, label: 'My Courses', path: '/teacher/courses' },
      { icon: Star, label: 'Ratings', path: '/teacher/ratings' },
      { icon: MessageSquare, label: 'Messages', path: '/teacher/messages' },
      { icon: User, label: 'Profile', path: '/teacher/profile' },
      { icon: Settings, label: 'Settings', path: '/teacher/settings' },
    );
  }

  // Shared routes for all authenticated users
  navItems.push(
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Tag, label: 'Categories', path: '/categories' },
    { icon: HelpCircle, label: 'Support Tickets', path: '/support-tickets' },
    { icon: Star, label: 'Course Reviews', path: '/course-reviews' },
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-600">Online Coaching</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary-600 mb-8">Online Coaching</h1>
            
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4 px-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;