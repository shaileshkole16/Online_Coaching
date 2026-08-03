import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure id field is set correctly (might be stored as userId)
      if (!parsedUser.id && parsedUser.userId) {
        parsedUser.id = parsedUser.userId;
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, role, userId, name, message, user } = response.data;
      
      // Check if login was successful (token should not be null)
      if (!token) {
        return { 
          success: false, 
          error: message || 'Login failed' 
        };
      }
      
      // Use user object from response if available, otherwise construct it
      // Ensure the id field is set correctly from userId
      const userData = user 
        ? { ...user, id: user.userId || userId } 
        : { id: userId, role, name, email: credentials.email };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData, userType) => {
    try {
      let endpoint;
      if (userType === 'student') {
        endpoint = authAPI.registerStudent;
      } else if (userType === 'teacher') {
        endpoint = authAPI.registerTeacher;
      } else if (userType === 'admin') {
        endpoint = authAPI.registerAdmin;
      } else {
        return { 
          success: false, 
          error: 'Invalid user type' 
        };
      }
      
      const response = await endpoint(userData);
      const { token, role, userId, name, message, user } = response.data;
      
      // Check if registration was successful (token should not be null)
      if (!token) {
        return { 
          success: false, 
          error: message || 'Registration failed' 
        };
      }
      
      // Use user object from response if available, otherwise construct it
      // Ensure the id field is set correctly from userId
      const userDataObj = user 
        ? { ...user, id: user.userId || userId } 
        : { id: userId, role, name, email: userData.email };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userDataObj));
      setUser(userDataObj);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isStudent: user?.role === 'STUDENT',
    isTeacher: user?.role === 'TEACHER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
