import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, FAB, TextInput, Menu } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { assignmentAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const AssignmentListScreen = ({ navigation }) => {
  const route = useRoute();
  const { courseId } = route.params;
  const { user } = useAuth();
  
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalMarks, setTotalMarks] = useState('');

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      const res = await assignmentAPI.getCourseAssignments(courseId);
      setAssignments(res.data || []);
    } catch (err) {
      showError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title || !dueDate) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      await assignmentAPI.createAssignment({
        title,
        description,
        dueDate,
        totalMarks: parseInt(totalMarks) || 100,
        courseId,
      });
      showSuccess('Assignment created successfully');
      setModalVisible(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      setTotalMarks('');
      fetchAssignments();
    } catch (err) {
      showError('Failed to create assignment');
    }
  };

  const handleDelete = async (assignmentId) => {
    Alert.alert(
      'Delete Assignment',
      'Are you sure you want to delete this assignment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await assignmentAPI.deleteAssignment(assignmentId);
              showSuccess('Assignment deleted successfully');
              fetchAssignments();
            } catch (err) {
              showError('Failed to delete assignment');
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

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Course Assignments</Title>

      <ScrollView style={styles.assignmentsContainer}>
        {assignments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="assignment" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No assignments available</Text>
          </View>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment.assignmentId} style={styles.assignmentCard}>
              <Card.Content>
                <View style={styles.assignmentHeader}>
                  <Icon name="assignment" size={32} color="#4F46E5" />
                  <View style={styles.assignmentInfo}>
                    <Title style={styles.assignmentTitle}>{assignment.title}</Title>
                    <Paragraph style={styles.assignmentDescription} numberOfLines={2}>
                      {assignment.description || 'No description'}
                    </Paragraph>
                    <View style={styles.assignmentMeta}>
                      <Text style={styles.metaText}>Due: {assignment.dueDate || 'N/A'}</Text>
                      <Text style={styles.metaText}>Marks: {assignment.totalMarks || 100}</Text>
                    </View>
                  </View>
                  {user?.role === 'TEACHER' && (
                    <TouchableOpacity onPress={() => handleDelete(assignment.assignmentId)}>
                      <Icon name="delete" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {user?.role === 'TEACHER' && (
        <FAB
          icon="add"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        />
      )}

      <Menu
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentStyle={styles.modalContent}
      >
        <Menu.Item onPress={() => {}} title="Add New Assignment" />
        <TextInput
          label="Assignment Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.modalInput}
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.modalInput}
        />
        <TextInput
          label="Due Date"
          value={dueDate}
          onChangeText={setDueDate}
          mode="outlined"
          placeholder="YYYY-MM-DD"
          style={styles.modalInput}
        />
        <TextInput
          label="Total Marks"
          value={totalMarks}
          onChangeText={setTotalMarks}
          mode="outlined"
          keyboardType="numeric"
          style={styles.modalInput}
        />
        <Menu.Item
          onPress={handleCreate}
          title="Create Assignment"
          titleStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
        />
      </Menu>
    </View>
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
  assignmentsContainer: {
    flex: 1,
    padding: 10,
  },
  assignmentCard: {
    marginBottom: 15,
    elevation: 2,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  assignmentInfo: {
    flex: 1,
    marginLeft: 15,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  assignmentDescription: {
    fontSize: 14,
    color: '#666',
  },
  assignmentMeta: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4F46E5',
  },
  modalContent: {
    padding: 20,
    width: '90%',
    alignSelf: 'center',
  },
  modalInput: {
    marginBottom: 15,
  },
});

export default AssignmentListScreen;
