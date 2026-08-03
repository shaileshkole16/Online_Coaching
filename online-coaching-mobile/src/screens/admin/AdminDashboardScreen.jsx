import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { adminAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const AdminDashboardScreen = ({ navigation }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showError } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await adminAPI.getDashboard();
      setDashboard(res.data);
    } catch (err) {
      showError('Failed to load dashboard data');
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

  const stats = [
    { label: 'Total Students', value: dashboard?.totalStudents || 0, icon: 'people', color: '#4F46E5' },
    { label: 'Total Teachers', value: dashboard?.totalTeachers || 0, icon: 'school', color: '#10B981' },
    { label: 'Total Courses', value: dashboard?.totalCourses || 0, icon: 'book', color: '#8B5CF6' },
    { label: 'Active Users', value: dashboard?.activeUsers || 0, icon: 'person', color: '#F59E0B' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={60} label="A" />
        <View style={styles.headerText}>
          <Title style={styles.title}>Admin Dashboard</Title>
          <Paragraph style={styles.subtitle}>Platform overview and statistics</Paragraph>
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

      <Title style={styles.sectionTitle}>Quick Actions</Title>
      
      <Card style={styles.actionCard} onPress={() => navigation.navigate('ManageStudents')}>
        <Card.Content>
          <View style={styles.actionContent}>
            <MaterialIcons name="people" size={32} color="#4F46E5" />
            <View style={styles.actionText}>
              <Title style={styles.actionTitle}>Manage Students</Title>
              <Paragraph style={styles.actionSubtitle}>View and manage all students</Paragraph>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.actionCard} onPress={() => navigation.navigate('ManageTeachers')}>
        <Card.Content>
          <View style={styles.actionContent}>
            <MaterialIcons name="school" size={32} color="#10B981" />
            <View style={styles.actionText}>
              <Title style={styles/actionTitle}>Manage Teachers</Title>
              <Paragraph style={styles.actionSubtitle}>View and manage all teachers</Paragraph>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.actionCard} onPress={() => navigation.navigate('AdminAnalytics')}>
        <Card.Content>
          <View style={styles.actionContent}>
            <MaterialIcons name="analytics" size={32} color="#8B5CF6" />
            <View style={styles.actionText}>
              <Title style={styles.actionTitle}>Analytics</Title>
              <Paragraph style={styles.actionSubtitle}>View platform analytics</Paragraph>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
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
  actionCard: {
    margin: 10,
    marginBottom: 5,
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
    marginLeft: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default AdminDashboardScreen;
