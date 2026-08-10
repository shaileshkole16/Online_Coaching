import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import StudentDashboardScreen from '../screens/student/StudentDashboardScreen';
import StudentProfileScreen from '../screens/student/StudentProfileScreen';
import CourseListScreen from '../screens/student/CourseListScreen';
import DiscussionForumScreen from '../screens/student/DiscussionForumScreen';
import ResultsScreen from '../screens/student/ResultsScreen';
import CourseDetailScreen from '../screens/shared/CourseDetailScreen';
import LectureListScreen from '../screens/shared/LectureListScreen';
import AssignmentListScreen from '../screens/shared/AssignmentListScreen';
import QuizListScreen from '../screens/shared/QuizListScreen';
import StudyMaterialsScreen from '../screens/shared/StudyMaterialsScreen';
import SubmissionsScreen from '../screens/shared/SubmissionsScreen';
import PaymentScreen from '../screens/shared/PaymentScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StudentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} />
    <Stack.Screen name="CourseList" component={CourseListScreen} />
    <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    <Stack.Screen name="LectureList" component={LectureListScreen} />
    <Stack.Screen name="AssignmentList" component={AssignmentListScreen} />
    <Stack.Screen name="QuizList" component={QuizListScreen} />
    <Stack.Screen name="StudyMaterials" component={StudyMaterialsScreen} />
    <Stack.Screen name="Submissions" component={SubmissionsScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
  </Stack.Navigator>
);

const StudentNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Courses') iconName = 'book';
          else if (route.name === 'Forum') iconName = 'forum';
          else if (route.name === 'Results') iconName = 'assessment';
          
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
      <Tab.Screen name="Home" component={StudentStack} options={{ title: 'Home' }} />
      <Tab.Screen name="Courses" component={CourseListScreen} options={{ title: 'Courses' }} />
      <Tab.Screen name="Forum" component={DiscussionForumScreen} options={{ title: 'Forum' }} />
      <Tab.Screen name="Results" component={ResultsScreen} options={{ title: 'Results' }} />
    </Tab.Navigator>
  );
};

export default StudentNavigator;
