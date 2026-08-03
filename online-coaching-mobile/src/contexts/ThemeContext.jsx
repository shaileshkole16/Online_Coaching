import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const ThemeContext = createContext(null);

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4F46E5',
    secondary: '#7C3AED',
    tertiary: '#EC4899',
    background: '#FFFFFF',
    surface: '#F3F4F6',
    surfaceVariant: '#E5E7EB',
    onSurface: '#1F2937',
    onSurfaceVariant: '#4B5563',
    error: '#EF4444',
    onError: '#FFFFFF',
    success: '#10B981',
    onSuccess: '#FFFFFF',
    warning: '#F59E0B',
    onWarning: '#FFFFFF',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#6366F1',
    secondary: '#8B5CF6',
    tertiary: '#F472B6',
    background: '#111827',
    surface: '#1F2937',
    surfaceVariant: '#374151',
    onSurface: '#F9FAFB',
    onSurfaceVariant: '#D1D5DB',
    error: '#EF4444',
    onError: '#FFFFFF',
    success: '#10B981',
    onSuccess: '#FFFFFF',
    warning: '#F59E0B',
    onWarning: '#FFFFFF',
  },
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    saveThemePreference();
  }, [isDarkMode]);

  const loadThemePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme !== null) {
        setIsDarkMode(storedTheme === 'dark');
      } else {
        setIsDarkMode(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async () => {
    try {
      await AsyncStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      setTheme(isDarkMode ? darkTheme : lightTheme);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setThemeMode = (mode) => {
    setIsDarkMode(mode === 'dark');
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        theme,
        toggleTheme,
        setThemeMode,
        colors: theme.colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export { lightTheme, darkTheme };
