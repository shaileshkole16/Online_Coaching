import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Card, Title, Paragraph, Avatar, Searchbar, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { adminAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const ManageStudentsScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    try {
      const res = await adminAPI.getAllStudents();
      setStudents(res.data || []);
      setFilteredStudents(res.data || []);
    } catch (err) {
      showError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (searchQuery) {
      const filtered = students.filter(student =>
        student.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  };

  const handleBlockStudent = async (studentId) => {
    Alert.alert(
      'Block Student',
      'Are you sure you want to block this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          onPress: async () => {
            try {
              await adminAPI.blockStudent(studentId);
              showSuccess('Student blocked successfully');
              fetchStudents();
            } catch (err) {
              showError('Failed to block student');
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
      <Searchbar
        placeholder="Search students..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView style={styles.studentsContainer}>
        {filteredStudents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        ) : (
          filteredStudents.map((student) => (
            <Card key={student.studentId} style={styles.studentCard}>
              <Card.Content>
                <View style={styles.studentHeader}>
                  <Avatar.Text
                    size={50}
                    label={student.user?.name?.charAt(0) || 'S'}
                  />
                  <View style={styles.studentInfo}>
                    <Title style={styles.studentName}>
                      {student.user?.name || 'Unknown'}
                    </Title>
                    <Paragraph style={styles.studentEmail}>
                      {student.user?.email || 'N/A'}
                    </Paragraph>
                    <Paragraph style={styles.studentPhone}>
                      {student.phone || 'N/A'}
                    </Paragraph>
                  </View>
                </View>

                <View style={styles.actions}>
                  <Text style={styles.joinDate}>
                    Joined: {new Date(student.joinDate).toLocaleDateString()}
                  </Text>
                  <MaterialIcons
                    name="block"
                    size={24}
                    color="#EF4444"
                    onPress={() => handleBlockStudent(student.studentId)}
                  />
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
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
  searchbar: {
    margin: 15,
    elevation: 2,
  },
  studentsContainer: {
    flex: 1,
    padding: 10,
  },
  studentCard: {
    marginBottom: 15,
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
  studentPhone: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  joinDate: {
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

export default ManageStudentsScreen;
