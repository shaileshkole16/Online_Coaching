import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import TeacherNavigator from './TeacherNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return null; // You could add a loading screen here
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          {user?.role === 'STUDENT' && (
            <Stack.Screen name="Student" component={StudentNavigator} />
          )}
          {user?.role === 'TEACHER' && (
            <Stack.Screen name="Teacher" component={TeacherNavigator} />
          )}
          {user?.role === 'ADMIN' && (
            <Stack.Screen name="Admin" component={AdminNavigator} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
