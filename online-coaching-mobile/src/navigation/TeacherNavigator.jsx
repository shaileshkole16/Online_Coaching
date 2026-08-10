import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import TeacherDashboardScreen from '../screens/teacher/TeacherDashboardScreen';
import TeacherProfileScreen from '../screens/teacher/TeacherProfileScreen';
import CourseListScreen from '../screens/teacher/CourseListScreen';
import CreateCourseScreen from '../screens/teacher/CreateCourseScreen';
import EditCourseScreen from '../screens/teacher/EditCourseScreen';
import CourseStudentsScreen from '../screens/teacher/CourseStudentsScreen';
import DiscussionForumScreen from '../screens/teacher/DiscussionForumScreen';
import ManageResultsScreen from '../screens/teacher/ManageResultsScreen';
import TeacherCourseRatingsScreen from '../screens/teacher/TeacherCourseRatingsScreen';
import LectureListScreen from '../screens/shared/LectureListScreen';
import AssignmentListScreen from '../screens/shared/AssignmentListScreen';
import QuizListScreen from '../screens/shared/QuizListScreen';
import StudyMaterialsScreen from '../screens/shared/StudyMaterialsScreen';
import SubmissionsScreen from '../screens/shared/SubmissionsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TeacherStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} />
    <Stack.Screen name="CourseList" component={CourseListScreen} />
    <Stack.Screen name="CreateCourse" component={CreateCourseScreen} />
    <Stack.Screen name="EditCourse" component={EditCourseScreen} />
    <Stack.Screen name="CourseStudents" component={CourseStudentsScreen} />
    <Stack.Screen name="LectureList" component={LectureListScreen} />
    <Stack.Screen name="AssignmentList" component={AssignmentListScreen} />
    <Stack.Screen name="QuizList" component={QuizListScreen} />
    <Stack.Screen name="StudyMaterials" component={StudyMaterialsScreen} />
    <Stack.Screen name="Submissions" component={SubmissionsScreen} />
    <Stack.Screen name="ManageResults" component={ManageResultsScreen} />
    <Stack.Screen name="CourseRatings" component={TeacherCourseRatingsScreen} />
  </Stack.Navigator>
);

const TeacherNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'dashboard';
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
      <Tab.Screen name="Home" component={TeacherStack} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Courses" component={CourseListScreen} options={{ title: 'Courses' }} />
      <Tab.Screen name="Forum" component={DiscussionForumScreen} options={{ title: 'Forum' }} />
      <Tab.Screen name="Results" component={ManageResultsScreen} options={{ title: 'Results' }} />
    </Tab.Navigator>
  );
};

export default TeacherNavigator;
