import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Card, Title, Paragraph, Avatar, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { teacherAPI, courseAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const TeacherDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showError } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      let teacherId = null;
      try {
        const teacherRes = await teacherAPI.getTeacherByUserId(user.id);
        teacherId = teacherRes.data.teacherId;
      } catch (err) {
        console.log('Teacher record not found');
        setLoading(false);
        return;
      }

      if (!teacherId) {
        setLoading(false);
        return;
      }

      const [dashboardRes, coursesRes] = await Promise.all([
        teacherAPI.getTeacherDashboard(teacherId),
        courseAPI.getCoursesByTeacher(teacherId),
      ]);

      setDashboard(dashboardRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this course?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await courseAPI.deleteCourse(courseId);
              setCourses(courses.filter(c => c.id !== courseId));
            } catch (err) {
              showError('Failed to delete course');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const stats = [
    { label: 'My Courses', value: dashboard?.totalCourses || courses.length, icon: 'book', color: '#4F46E5' },
    { label: 'Students', value: dashboard?.totalStudents || 0, icon: 'people', color: '#10B981' },
    { label: 'Lectures', value: dashboard?.totalLectures || 0, icon: 'video-library', color: '#8B5CF6' },
    { label: 'Rating', value: `${dashboard?.averageRating || 0}/5`, icon: 'star', color: '#F59E0B' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={60} label={user?.name?.charAt(0) || 'T'} />
        <View style={styles.headerText}>
          <Title style={styles.title}>Welcome, {user?.name}!</Title>
          <Paragraph style={styles.subtitle}>Manage your courses and track progress</Paragraph>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <View style={styles.statContent}>
              <MaterialIcons name={stat.icon} size={32} color={stat.color} />
              <View style={styles.statText}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Title style={styles.sectionTitle}>My Courses</Title>
      </View>

      {courses.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <Icon name="book" size={48} color="#9CA3AF" />
            <Paragraph style={styles.emptyText}>You haven't created any courses yet</Paragraph>
          </Card.Content>
        </Card>
      ) : (
        courses.map((course) => (
          <Card key={course.id} style={styles.courseCard}>
            <Card.Content>
              <View style={styles.courseHeader}>
                <Icon name="book" size={24} color="#4F46E5" />
                <View style={styles.courseActions}>
                  <TouchableOpacity onPress={() => navigation.navigate('EditCourse', { courseId: course.id })}>
                    <Icon name="edit" size={20} color="#4F46E5" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteCourse(course.id)} style={styles.deleteButton}>
                    <Icon name="delete" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
              <Title style={styles.courseTitle}>{course.title}</Title>
              <Paragraph style={styles.courseDescription} numberOfLines={2}>
                {course.description}
              </Paragraph>
              <View style={styles.courseMeta}>
                <Text style={styles.metaText}>{course.duration || 'N/A'}</Text>
                <Text style={styles.metaText}>{course.price ? `₹${course.price}` : 'Free'}</Text>
              </View>
              <TouchableOpacity
                style={styles.manageButton}
                onPress={() => navigation.navigate('CourseStudents', { courseId: course.id })}
              >
                <Text style={styles.manageButtonText}>Manage Course</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ))
      )}

      <FAB
        icon="add"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateCourse')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerText: {
    marginLeft: 15,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 10,
    elevation: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  statText: {
    marginLeft: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  courseCard: {
    margin: 10,
    marginBottom: 5,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseActions: {
    flexDirection: 'row',
    gap: 15,
  },
  deleteButton: {
    marginLeft: 15,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  manageButton: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  manageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyCard: {
    margin: 10,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4F46E5',
  },
});

export default TeacherDashboardScreen;
