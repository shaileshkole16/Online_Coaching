import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Card, Title, Paragraph, Avatar, Searchbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { adminAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const ManageTeachersScreen = ({ navigation }) => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [searchQuery, teachers]);

  const fetchTeachers = async () => {
    try {
      const res = await adminAPI.getAllTeachers();
      setTeachers(res.data || []);
      setFilteredTeachers(res.data || []);
    } catch (err) {
      showError('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const filterTeachers = () => {
    if (searchQuery) {
      const filtered = teachers.filter(teacher =>
        teacher.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers(teachers);
    }
  };

  const handleBlockTeacher = async (teacherId) => {
    Alert.alert(
      'Block Teacher',
      'Are you sure you want to block this teacher?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          onPress: async () => {
            try {
              await adminAPI.blockTeacher(teacherId);
              showSuccess('Teacher blocked successfully');
              fetchTeachers();
            } catch (err) {
              showError('Failed to block teacher');
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
        placeholder="Search teachers..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView style={styles.teachersContainer}>
        {filteredTeachers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No teachers found</Text>
          </View>
        ) : (
          filteredTeachers.map((teacher) => (
            <Card key={teacher.teacherId} style={styles.teacherCard}>
              <Card.Content>
                <View style={styles.teacherHeader}>
                  <Avatar.Text
                    size={50}
                    label={teacher.user?.name?.charAt(0) || 'T'}
                  />
                  <View style={styles.teacherInfo}>
                    <Title style={styles.teacherName}>
                      {teacher.user?.name || 'Unknown'}
                    </Title>
                    <Paragraph style={styles.teacherEmail}>
                      {teacher.user?.email || 'N/A'}
                    </Paragraph>
                    <Paragraph style={styles.teacherQualification}>
                      {teacher.qualification || 'N/A'}
                    </Paragraph>
                  </View>
                </View>

                <View style={styles.expertiseContainer}>
                  <Text style={styles.expertiseLabel}>Expertise:</Text>
                  <Text style={styles.expertiseText}>{teacher.expertise || 'N/A'}</Text>
                </View>

                <View style={styles.actions}>
                  <Text style={styles.joinDate}>
                    Joined: {new Date(teacher.joinDate).toLocaleDateString()}
                  </Text>
                  <MaterialIcons
                    name="block"
                    size={24}
                    color="#EF4444"
                    onPress={() => handleBlockTeacher(teacher.teacherId)}
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
  teachersContainer: {
    flex: 1,
    padding: 10,
  },
  teacherCard: {
    marginBottom: 15,
    elevation: 2,
  },
  teacherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  teacherInfo: {
    flex: 1,
    marginLeft: 15,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  teacherEmail: {
    fontSize: 14,
    color: '#666',
  },
  teacherQualification: {
    fontSize: 12,
    color: '#999',
  },
  expertiseContainer: {
    marginBottom: 10,
  },
  expertiseLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  expertiseText: {
    fontSize: 14,
    color: '#333',
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

export default ManageTeachersScreen;
