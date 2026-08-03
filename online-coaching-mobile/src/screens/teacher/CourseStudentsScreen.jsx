import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Avatar, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { enrollmentAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useRoute } from '@react-navigation/native';

const CourseStudentsScreen = ({ navigation }) => {
  const route = useRoute();
  const { courseId } = route.params;
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showError } = useToast();

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  const fetchStudents = async () => {
    try {
      const res = await enrollmentAPI.getCourseStudents(courseId);
      setStudents(res.data || []);
    } catch (err) {
      showError('Failed to load students');
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
      <Title style={styles.title}>Enrolled Students</Title>

      {students.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="people" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No students enrolled yet</Text>
        </View>
      ) : (
        students.map((enrollment) => (
          <Card key={enrollment.enrollId} style={styles.studentCard}>
            <Card.Content>
              <View style={styles.studentHeader}>
                <Avatar.Text
                  size={50}
                  label={enrollment.student?.user?.name?.charAt(0) || 'S'}
                />
                <View style={styles.studentInfo}>
                  <Title style={styles.studentName}>
                    {enrollment.student?.user?.name || 'Unknown'}
                  </Title>
                  <Paragraph style={styles.studentEmail}>
                    {enrollment.student?.user?.email || 'N/A'}
                  </Paragraph>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>Progress: {enrollment.progress || 0}%</Text>
                <Chip
                  style={[
                    styles.progressChip,
                    { backgroundColor: enrollment.progress >= 50 ? '#10B981' : '#F59E0B' }
                  ]}
                >
                  {enrollment.progress >= 50 ? 'Active' : 'Just Started'}
                </Chip>
              </View>

              <Paragraph style={styles.enrollmentDate}>
                Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
              </Paragraph>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    color: '#333',
  },
  studentCard: {
    margin: 10,
    marginBottom: 5,
    elevation: 2,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  studentInfo: {
    flex: 1,
    marginLeft: 15,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentEmail: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressChip: {
    paddingHorizontal: 12,
  },
  enrollmentDate: {
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

export default CourseStudentsScreen;
