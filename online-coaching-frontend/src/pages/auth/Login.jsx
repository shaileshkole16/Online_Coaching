import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';
import { GraduationCap, Mail, Lock, User } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'student',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      showSuccess('Login successful!');
      const user = result.user || JSON.parse(localStorage.getItem('user'));
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (user.role === 'TEACHER') {
        navigate('/teacher/dashboard');
      }
    } else {
      showError(result.error || 'Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: colors.primary }}>
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>Welcome Back</h1>
          <p className="mt-2" style={{ color: colors.textSecondary }}>Sign in to your account</p>
        </div>

        <div className="card" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                I am a
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['student', 'teacher', 'admin'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: type })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.userType === type
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: formData.userType === type ? colors.primary : colors.surfaceVariant,
                      color: formData.userType === type ? colors.onError : colors.text,
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textSecondary }} size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textSecondary }} size={20} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded focus:ring-primary-500"
                  style={{ accentColor: colors.primary }}
                />
                <label htmlFor="remember" className="ml-2 text-sm" style={{ color: colors.textSecondary }}>
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm hover:underline" style={{ color: colors.primary }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.primary, color: colors.onError }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in as {formData.userType.charAt(0).toUpperCase() + formData.userType.slice(1)}...
                </>
              ) : (
                `Sign In as ${formData.userType.charAt(0).toUpperCase() + formData.userType.slice(1)}`
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: colors.textSecondary }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-medium hover:underline" style={{ color: colors.primary }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm" style={{ color: colors.textSecondary }}>
          <p>Online Coaching System - CDAC Final Project</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
