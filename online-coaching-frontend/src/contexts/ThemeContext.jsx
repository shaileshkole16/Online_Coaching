import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const lightTheme = {
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
  border: '#E5E7EB',
  text: '#1F2937',
  textSecondary: '#6B7280',
};

const darkTheme = {
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
  border: '#374151',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    setTheme(isDarkMode ? darkTheme : lightTheme);
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

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
        colors: theme,
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
