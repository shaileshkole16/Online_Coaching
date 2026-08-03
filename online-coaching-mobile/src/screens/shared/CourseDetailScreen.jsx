import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Avatar, Chip, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { courseAPI, enrollmentAPI, courseRatingAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const CourseDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { courseId } = route.params;
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchCourseData();
  }, [courseId, user?.id]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, ratingRes] = await Promise.all([
        courseAPI.getCourseById(courseId),
        user?.role === 'STUDENT' 
          ? courseRatingAPI.getStudentRatingForCourse(user.id, courseId)
          : Promise.resolve({ data: null })
      ]);

      setCourse(courseRes.data);
      if (ratingRes.data) {
        setRating(ratingRes.data.rating);
      }

      // Check if enrolled
      if (user?.role === 'STUDENT') {
        try {
          const { studentAPI: studentApi } = require('../../services/api');
          const studentRes = await studentApi.getStudentByUserId(user.id);
          const studentId = studentRes.data.studentId;
          const enrollRes = await enrollmentAPI.getStudentEnrollments(studentId);
          const isEnrolled = enrollRes.data?.some(e => e.course?.courseId === courseId);
          setEnrolled(isEnrolled);
        } catch (err) {
          console.log('Error checking enrollment');
        }
      }
    } catch (err) {
      showError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      const { studentAPI: studentApi } = require('../../services/api');
      const studentRes = await studentApi.getStudentByUserId(user.id);
      const studentId = studentRes.data.studentId;
      
      await enrollmentAPI.enrollStudent(studentId, courseId);
      setEnrolled(true);
      showSuccess('Successfully enrolled in course');
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

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <Avatar.Text size={60} label={course?.title?.charAt(0) || 'C'} />
            <View style={styles.headerText}>
              <Title style={styles.title}>{course?.title}</Title>
              <Paragraph style={styles.teacher}>
                By {course?.teacher?.user?.name || 'Unknown'}
              </Paragraph>
            </View>
          </View>
          
          <View style={styles.metaContainer}>
            <Chip icon="schedule" style={styles.chip}>{course?.duration || 'N/A'}</Chip>
            <Chip icon="bar-chart" style={styles.chip}>{course?.level || 'N/A'}</Chip>
            <Chip 
              icon="currency-rupee" 
              style={[styles.chip, course?.price ? styles.paidChip : styles.freeChip]}
            >
              {course?.price ? `₹${course.price}` : 'Free'}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Description</Title>
          <Paragraph style={styles.description}>{course?.description || 'No description available'}</Paragraph>
        </Card.Content>
      </Card>

      {user?.role === 'STUDENT' && (
        <>
          {enrolled ? (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('LectureList', { courseId })}
              >
                <Icon name="play-circle-filled" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>View Lectures</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('AssignmentList', { courseId })}
              >
                <Icon name="assignment" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Assignments</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('QuizList', { courseId })}
              >
                <Icon name="quiz" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Quizzes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('StudyMaterials', { courseId })}
              >
                <Icon name="folder" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Study Materials</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.ratingButton]}
                onPress={() => navigation.navigate('CourseRating', { courseId })}
              >
                <Icon name="star" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Rate Course</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.enrollButton}
              onPress={handleEnroll}
            >
              <Text style={styles.enrollButtonText}>Enroll Now</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {user?.role === 'TEACHER' && (
        <>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('LectureList', { courseId })}
          >
            <Icon name="video-library" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Manage Lectures</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AssignmentList', { courseId })}
          >
            <Icon name="assignment" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Manage Assignments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('QuizList', { courseId })}
          >
            <Icon name="quiz" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Manage Quizzes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('StudyMaterials', { courseId })}
          >
            <Icon name="folder" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Manage Materials</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Submissions', { courseId })}
          >
            <Icon name="grading" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>View Submissions</Text>
          </TouchableOpacity>
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
  headerCard: {
    margin: 15,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  teacher: {
    fontSize: 14,
    color: '#666',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: '#E5E7EB',
  },
  paidChip: {
    backgroundColor: '#10B981',
  },
  freeChip: {
    backgroundColor: '#4F46E5',
  },
  card: {
    margin: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    padding: 15,
    margin: 15,
    marginTop: 5,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  ratingButton: {
    backgroundColor: '#F59E0B',
  },
  enrollButton: {
    backgroundColor: '#10B981',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CourseDetailScreen;
