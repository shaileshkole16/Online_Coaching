import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { resultAPI, studentAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const ResultsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showError } = useToast();

  useEffect(() => {
    fetchResults();
  }, [user?.id]);

  const fetchResults = async () => {
    try {
      let studentId = user?.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }

      const res = await resultAPI.getStudentResults(studentId);
      setResults(res.data || []);
    } catch (err) {
      showError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return '#10B981';
    if (grade >= 80) return '#4F46E5';
    if (grade >= 70) return '#F59E0B';
    if (grade >= 60) return '#EF4444';
    return '#6B7280';
  };

  const getGradeLabel = (grade) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
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
      <Title style={styles.title}>My Results</Title>

      {results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="assessment" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No results available yet</Text>
        </View>
      ) : (
        results.map((result) => (
          <Card key={result.resultId} style={styles.resultCard}>
            <Card.Content>
              <View style={styles.resultHeader}>
                <MaterialIcons name="school" size={24} color="#4F46E5" />
                <Chip
                  style={[styles.gradeChip, { backgroundColor: getGradeColor(result.totalMarks) }]}
                  textStyle={styles.gradeChipText}
                >
                  {getGradeLabel(result.totalMarks)}
                </Chip>
              </View>
              <Title style={styles.courseTitle}>{result.course?.title || 'Course'}</Title>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Marks</Text>
                  <Text style={styles.statValue}>{result.totalMarks || 0}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Grade</Text>
                  <Text style={[
                    styles.statValue,
                    { color: getGradeColor(result.totalMarks) }
                  ]}>
                    {result.grade || 'N/A'}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>GPA</Text>
                  <Text style={styles.statValue}>{result.gpa || '0.0'}</Text>
                </View>
              </View>

              <Paragraph style={styles.dateText}>
                {new Date(result.createdDate).toLocaleDateString()}
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
  resultCard: {
    margin: 10,
    marginBottom: 5,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gradeChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  gradeChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
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

export default ResultsScreen;
