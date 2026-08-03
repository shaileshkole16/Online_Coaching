import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Rating, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { courseRatingAPI, teacherAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const TeacherCourseRatingsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const { showError } = useToast();

  useEffect(() => {
    fetchRatings();
  }, [user?.id]);

  const fetchRatings = async () => {
    try {
      let teacherId = null;
      try {
        const teacherRes = await teacherAPI.getTeacherByUserId(user.id);
        teacherId = teacherRes.data.teacherId;
      } catch (err) {
        console.log('Teacher record not found');
      }

      if (teacherId) {
        const res = await courseRatingAPI.getTeacherCourseRatings(teacherId);
        setRatings(res.data || []);

        // Calculate average
        if (res.data && res.data.length > 0) {
          const avg = res.data.reduce((sum, r) => sum + r.rating, 0) / res.data.length;
          setAverageRating(avg.toFixed(1));
        }
      }
    } catch (err) {
      showError('Failed to load ratings');
    } finally {
      setLoading(false);
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
      <View style={styles.header}>
        <MaterialIcons name="star" size={48} color="#F59E0B" />
        <View style={styles.headerText}>
          <Title style={styles.averageRating}>{averageRating}</Title>
          <Paragraph style={styles.ratingLabel}>Average Rating</Paragraph>
        </View>
      </View>

      <Title style={styles.title}>Course Ratings</Title>

      {ratings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="star-border" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No ratings yet</Text>
        </View>
      ) : (
        ratings.map((rating) => (
          <Card key={rating.courseRatingId} style={styles.ratingCard}>
            <Card.Content>
              <View style={styles.ratingHeader}>
                <Title style={styles.courseName}>{rating.course?.title || 'Course'}</Title>
                <Rating
                  readonly
                  startingValue={rating.rating}
                  imageSize={20}
                />
              </View>
              
              <View style={styles.studentInfo}>
                <Icon name="person" size={16} color="#666" />
                <Text style={styles.studentName}>
                  {rating.student?.user?.name || 'Anonymous'}
                </Text>
              </View>

              {rating.feedback && (
                <Paragraph style={styles.feedback}>
                  "{rating.feedback}"
                </Paragraph>
              )}

              <Text style={styles.dateText}>
                {new Date(rating.ratingDate).toLocaleDateString()}
              </Text>
            </Card.Content>
          </Card>
        ))
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
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerText: {
    marginLeft: 20,
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    color: '#333',
  },
  ratingCard: {
    margin: 10,
    marginBottom: 5,
    elevation: 2,
  },
  ratingHeader: {
    marginBottom: 10,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  feedback: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
});

export default TeacherCourseRatingsScreen;
