import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Avatar, ProgressBar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { studentAPI, enrollmentAPI, courseAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const StudentDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showError } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      let studentId = user?.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }

      const [dashboardRes, enrollmentsRes, coursesRes] = await Promise.all([
        studentAPI.getStudentDashboard(studentId),
        enrollmentAPI.getStudentEnrollments(studentId),
        courseAPI.getAllCourses(),
      ]);

      setDashboard(dashboardRes.data);
      setEnrollments(enrollmentsRes.data || []);
      setAvailableCourses(coursesRes.data || []);
    } catch (err) {
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      let studentId = user?.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }
      
      await enrollmentAPI.enrollStudent(studentId, courseId);
      fetchDashboardData();
    } catch (err) {
      showError('Failed to enroll in course');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const enrolledCourseIds = enrollments.map(e => e.course?.courseId).filter(Boolean);
  const coursesToEnroll = availableCourses.filter(c => !enrolledCourseIds.includes(c.id));

  const stats = [
    { label: 'Enrolled', value: enrollments.length, icon: 'book', color: '#4F46E5' },
    { label: 'Completed', value: dashboard?.completedLectures || 0, icon: 'check-circle', color: '#10B981' },
    { label: 'Pending', value: dashboard?.pendingAssignments || 0, icon: 'assignment', color: '#F59E0B' },
    { label: 'Score', value: `${dashboard?.averageQuizScore || 0}%`, icon: 'trending-up', color: '#8B5CF6' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={60} label={user?.name?.charAt(0) || 'U'} />
        <View style={styles.headerText}>
          <Title style={styles.title}>Welcome, {user?.name}!</Title>
          <Paragraph style={styles.subtitle}>Track your learning progress</Paragraph>
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

      <Title style={styles.sectionTitle}>My Courses</Title>
      {enrollments.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <MaterialIcons name="book" size={48} color="#9CA3AF" />
            <Paragraph style={styles.emptyText}>No courses enrolled yet</Paragraph>
          </Card.Content>
        </Card>
      ) : (
        enrollments.slice(0, 3).map((enrollment) => (
          <Card key={enrollment.enrollId} style={styles.courseCard}>
            <Card.Content>
              <View style={styles.courseHeader}>
                <MaterialIcons name="book" size={24} color="#4F46E5" />
                <Text style={styles.enrolledBadge}>Enrolled</Text>
              </View>
              <Title style={styles.courseTitle}>{enrollment.course?.title}</Title>
              <ProgressBar progress={enrollment.progress / 100} style={styles.progressBar} />
              <Text style={styles.progressText}>Progress: {enrollment.progress || 0}%</Text>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => navigation.navigate('CourseDetail', { courseId: enrollment.course?.courseId })}
              >
                <Text style={styles.continueButtonText}>Continue Learning</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ))
      )}

      {coursesToEnroll.length > 0 && (
        <>
          <Title style={styles.sectionTitle}>Available Courses</Title>
          {coursesToEnroll.slice(0, 3).map((course) => (
            <Card key={course.id} style={styles.courseCard}>
              <Card.Content>
                <View style={styles.courseHeader}>
                  <MaterialIcons name="school" size={24} color="#8B5CF6" />
                </View>
                <Title style={styles.courseTitle}>{course.title}</Title>
                <Paragraph style={styles.courseDescription} numberOfLines={2}>
                  {course.description}
                </Paragraph>
                <TouchableOpacity
                  style={styles.enrollButton}
                  onPress={() => handleEnroll(course.id)}
                >
                  <Text style={styles.enrollButtonText}>Enroll Now</Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          ))}
        </>
      )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 15,
    marginTop: 20,
    color: '#333',
  },
  courseCard: {
    margin: 10,
    marginBottom: 5,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  enrolledBadge: {
    backgroundColor: '#10B981',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  enrollButton: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrollButtonText: {
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
});

export default StudentDashboardScreen;
