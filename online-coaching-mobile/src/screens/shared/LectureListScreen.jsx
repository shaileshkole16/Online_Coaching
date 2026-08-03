import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, FAB, TextInput, Menu } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { lectureAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const LectureListScreen = ({ navigation }) => {
  const route = useRoute();
  const { courseId } = route.params;
  const { user } = useAuth();
  
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  const fetchLectures = async () => {
    try {
      const res = await lectureAPI.getCourseLectures(courseId);
      setLectures(res.data || []);
    } catch (err) {
      showError('Failed to load lectures');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title || !videoUrl) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      await lectureAPI.createLecture({
        title,
        videoUrl,
        description,
        courseId,
      });
      showSuccess('Lecture created successfully');
      setModalVisible(false);
      setTitle('');
      setVideoUrl('');
      setDescription('');
      fetchLectures();
    } catch (err) {
      showError('Failed to create lecture');
    }
  };

  const handleDelete = async (lectureId) => {
    Alert.alert(
      'Delete Lecture',
      'Are you sure you want to delete this lecture?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await lectureAPI.deleteLecture(lectureId);
              showSuccess('Lecture deleted successfully');
              fetchLectures();
            } catch (err) {
              showError('Failed to delete lecture');
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
      <Title style={styles.title}>Course Lectures</Title>

      <ScrollView style={styles.lecturesContainer}>
        {lectures.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="video-library" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No lectures available</Text>
          </View>
        ) : (
          lectures.map((lecture) => (
            <Card key={lecture.lectureId} style={styles.lectureCard}>
              <Card.Content>
                <View style={styles.lectureHeader}>
                  <MaterialIcons name="play-circle-filled" size={32} color="#4F46E5" />
                  <View style={styles.lectureInfo}>
                    <Title style={styles.lectureTitle}>{lecture.title}</Title>
                    <Paragraph style={styles.lectureDescription} numberOfLines={2}>
                      {lecture.description || 'No description'}
                    </Paragraph>
                  </View>
                  {user?.role === 'TEACHER' && (
                    <TouchableOpacity onPress={() => handleDelete(lecture.lectureId)}>
                      <MaterialIcons name="delete" size={24} color="#EF4444" />
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
        <Menu.Item onPress={() => {}} title="Add New Lecture" />
        <TextInput
          label="Lecture Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.modalInput}
        />
        <TextInput
          label="Video URL"
          value={videoUrl}
          onChangeText={setVideoUrl}
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
        <Menu.Item
          onPress={handleCreate}
          title="Create Lecture"
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
  lecturesContainer: {
    flex: 1,
    padding: 10,
  },
  lectureCard: {
    marginBottom: 15,
    elevation: 2,
  },
  lectureHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  lectureInfo: {
    flex: 1,
    marginLeft: 15,
  },
  lectureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lectureDescription: {
    fontSize: 14,
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

export default LectureListScreen;
