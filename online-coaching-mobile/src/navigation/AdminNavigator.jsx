import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminAnalyticsScreen from '../screens/admin/AdminAnalyticsScreen';
import ManageStudentsScreen from '../screens/admin/ManageStudentsScreen';
import ManageTeachersScreen from '../screens/admin/ManageTeachersScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <Stack.Screen name="AdminAnalytics" component={AdminAnalyticsScreen} />
    <Stack.Screen name="ManageStudents" component={ManageStudentsScreen} />
    <Stack.Screen name="ManageTeachers" component={ManageTeachersScreen} />
  </Stack.Navigator>
);

const AdminNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'dashboard';
          else if (route.name === 'Analytics') iconName = 'analytics';
          else if (route.name === 'Students') iconName = 'people';
          else if (route.name === 'Teachers') iconName = 'school';
          else if (route.name === 'Settings') iconName = 'settings';
          
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surface,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminStack} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Analytics" component={AdminAnalyticsScreen} options={{ title: 'Analytics' }} />
      <Tab.Screen name="Students" component={ManageStudentsScreen} options={{ title: 'Students' }} />
      <Tab.Screen name="Teachers" component={ManageTeachersScreen} options={{ title: 'Teachers' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
