import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { adminAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const AdminAnalyticsScreen = ({ navigation }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showError } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await adminAPI.getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      showError('Failed to load analytics');
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
      <Title style={styles.title}>Platform Analytics</Title>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialIcons name="trending-up" size={24} color="#10B981" />
            <Title style={styles.cardTitle}>Growth Metrics</Title>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>New Students (This Month)</Text>
            <Text style={styles.metricValue}>{analytics?.newStudents || 0}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>New Teachers (This Month)</Text>
            <Text style={styles.metricValue}>{analytics?.newTeachers || 0}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>New Courses (This Month)</Text>
            <Text style={styles.metricValue}>{analytics?.newCourses || 0}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialIcons name="book" size={24} color="#4F46E5" />
            <Title style={styles.cardTitle}>Course Statistics</Title>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Total Enrollments</Text>
            <Text style={styles.metricValue}>{analytics?.totalEnrollments || 0}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Average Course Rating</Text>
            <Text style={styles.metricValue}>{analytics?.avgCourseRating || 0}/5</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Completion Rate</Text>
            <Text style={styles.metricValue}>{analytics?.completionRate || 0}%</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialIcons name="assessment" size={24} color="#8B5CF6" />
            <Title style={styles.cardTitle}>Performance Metrics</Title>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Active Users Today</Text>
            <Text style={styles.metricValue}>{analytics?.activeUsersToday || 0}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Total Quiz Attempts</Text>
            <Text style={styles.metricValue}>{analytics?.totalQuizAttempts || 0}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Average Quiz Score</Text>
            <Text style={styles.metricValue}>{analytics?.avgQuizScore || 0}%</Text>
          </View>
        </Card.Content>
      </Card>
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
  card: {
    margin: 10,
    marginBottom: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AdminAnalyticsScreen;
