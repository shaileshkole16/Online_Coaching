import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { submissionAPI, assignmentAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const SubmissionsScreen = ({ navigation }) => {
  const route = useRoute();
  const { courseId } = route.params;
  const { user } = useAuth();
  
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchData();
  }, [courseId, user?.id]);

  const fetchData = async () => {
    try {
      if (user?.role === 'TEACHER') {
        const [subRes, assignRes] = await Promise.all([
          submissionAPI.getAssignmentSubmissions(courseId),
          assignmentAPI.getCourseAssignments(courseId),
        ]);
        setSubmissions(subRes.data || []);
        setAssignments(assignRes.data || []);
      } else {
        const { studentAPI: studentApi } = require('../../services/api');
        const studentRes = await studentApi.getStudentByUserId(user.id);
        const studentId = studentRes.data.studentId;
        const subRes = await submissionAPI.getStudentSubmissions(studentId);
        setSubmissions(subRes.data || []);
      }
    } catch (err) {
      showError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (submissionId, marks, feedback) => {
    try {
      await submissionAPI.gradeSubmission(submissionId, marks, feedback);
      showSuccess('Graded successfully');
      fetchData();
    } catch (err) {
      showError('Failed to grade submission');
    }
  };

  const getAssignmentTitle = (assignmentId) => {
    const assignment = assignments.find(a => a.assignmentId === assignmentId);
    return assignment?.title || 'Unknown Assignment';
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
      <Title style={styles.title}>
        {user?.role === 'TEACHER' ? 'Student Submissions' : 'My Submissions'}
      </Title>

      {submissions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="assignment-turned-in" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No submissions yet</Text>
        </View>
      ) : (
        submissions.map((submission) => (
          <Card key={submission.submissionId} style={styles.submissionCard}>
            <Card.Content>
              <View style={styles.submissionHeader}>
                <MaterialIcons name="assignment-turned-in" size={32} color="#4F46E5" />
                <View style={styles.submissionInfo}>
                  <Title style={styles.submissionTitle}>
                    {user?.role === 'TEACHER' 
                      ? getAssignmentTitle(submission.assignmentId)
                      : getAssignmentTitle(submission.assignmentId)
                    }
                  </Title>
                  <Paragraph style={styles.studentName}>
                    {user?.role === 'TEACHER'
                      ? `Student: ${submission.student?.user?.name || 'Unknown'}`
                      : `Submitted: ${new Date(submission.submissionDate).toLocaleDateString()}`
                    }
                  </Paragraph>
                </View>
              </View>

              <View style={styles.submissionMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Status:</Text>
                  <Chip
                    style={[
                      styles.statusChip,
                      submission.marks !== null ? styles.gradedChip : styles.pendingChip
                    ]}
                  >
                    {submission.marks !== null ? 'Graded' : 'Pending'}
                  </Chip>
                </View>
                {submission.marks !== null && (
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Marks:</Text>
                    <Text style={styles.marksValue}>{submission.marks}/100</Text>
                  </View>
                )}
              </View>

              {submission.feedback && (
                <Paragraph style={styles.feedback}>
                  <Text style={styles.feedbackLabel}>Feedback: </Text>
                  {submission.feedback}
                </Paragraph>
              )}

              {user?.role === 'TEACHER' && submission.marks === null && (
                <View style={styles.gradingSection}>
                  <TextInput
                    label="Marks"
                    placeholder="Enter marks"
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.gradeInput}
                  />
                  <TextInput
                    label="Feedback"
                    placeholder="Enter feedback"
                    mode="outlined"
                    multiline
                    numberOfLines={2}
                    style={styles.gradeInput}
                  />
                  <Chip
                    mode="outlined"
                    onPress={() => {
                      // TODO: Implement grading with actual input values
                      handleGrade(submission.submissionId, 85, 'Good work!');
                    }}
                    style={styles.gradeButton}
                  >
                    Grade Submission
                  </Chip>
                </View>
              )}
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
  submissionCard: {
    margin: 10,
    marginBottom: 5,
    elevation: 2,
  },
  submissionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  submissionInfo: {
    flex: 1,
    marginLeft: 15,
  },
  submissionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentName: {
    fontSize: 14,
    color: '#666',
  },
  submissionMeta: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 5,
  },
  statusChip: {
    paddingHorizontal: 12,
  },
  gradedChip: {
    backgroundColor: '#10B981',
  },
  pendingChip: {
    backgroundColor: '#F59E0B',
  },
  marksValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  feedback: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  feedbackLabel: {
    fontWeight: 'bold',
  },
  gradingSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  gradeInput: {
    marginBottom: 10,
  },
  gradeButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#4F46E5',
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

export default SubmissionsScreen;
