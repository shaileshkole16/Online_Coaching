import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const [storedToken, storedUser] = await AsyncStorage.multiGet(['token', 'user']);
      if (storedToken[1] && storedUser[1]) {
        setToken(storedToken[1]);
        setUser(JSON.parse(storedUser[1]));
      }
    } catch (error) {
      console.log('Error loading user from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token: newToken, user: newUser, role } = response.data;
      
      await AsyncStorage.multiSet([
        ['token', newToken],
        ['user', JSON.stringify({ ...newUser, role })],
      ]);
      
      setToken(newToken);
      setUser({ ...newUser, role });
      return { success: true, user: { ...newUser, role }, role };
    } catch (error) {
      console.log('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const adminLogin = async (credentials) => {
    try {
      const response = await authAPI.login({ ...credentials, userType: 'admin' });
      const { token: newToken, user: newUser, role } = response.data;
      
      if (role !== 'ADMIN') {
        return { 
          success: false, 
          error: 'Access denied. Admin privileges required.' 
        };
      }
      
      await AsyncStorage.multiSet([
        ['token', newToken],
        ['user', JSON.stringify({ ...newUser, role })],
      ]);
      
      setToken(newToken);
      setUser({ ...newUser, role });
      return { success: true, user: { ...newUser, role }, role };
    } catch (error) {
      console.log('Admin login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Admin login failed' 
      };
    }
  };

  const registerStudent = async (data) => {
    try {
      const response = await authAPI.registerStudent(data);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const registerTeacher = async (data) => {
    try {
      const response = await authAPI.registerTeacher(data);
      return { success: true, data: response.data };
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
      console.log('Logout error:', error);
    } finally {
      await AsyncStorage.multiRemove(['token', 'user']);
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        adminLogin,
        logout,
        registerStudent,
        registerTeacher,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isTeacher: user?.role === 'TEACHER',
        isStudent: user?.role === 'STUDENT',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
