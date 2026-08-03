import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, FAB, TextInput, Menu } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { quizAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const QuizListScreen = ({ navigation }) => {
  const route = useRoute();
  const { courseId } = route.params;
  const { user } = useAuth();
  
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [passingScore, setPassingScore] = useState('');

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const fetchQuizzes = async () => {
    try {
      const res = await quizAPI.getCourseQuizzes(courseId);
      setQuizzes(res.data || []);
    } catch (err) {
      showError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title || !duration) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      await quizAPI.createQuiz({
        title,
        description,
        duration: parseInt(duration),
        passingScore: parseInt(passingScore) || 50,
        questions: '[]',
        courseId,
      });
      showSuccess('Quiz created successfully');
      setModalVisible(false);
      setTitle('');
      setDescription('');
      setDuration('');
      setPassingScore('');
      fetchQuizzes();
    } catch (err) {
      showError('Failed to create quiz');
    }
  };

  const handleDelete = async (quizId) => {
    Alert.alert(
      'Delete Quiz',
      'Are you sure you want to delete this quiz?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await quizAPI.deleteQuiz(quizId);
              showSuccess('Quiz deleted successfully');
              fetchQuizzes();
            } catch (err) {
              showError('Failed to delete quiz');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleTakeQuiz = (quizId) => {
    navigation.navigate('StudentQuiz', { courseId, quizId });
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
      <Title style={styles.title}>Course Quizzes</Title>

      <ScrollView style={styles.quizzesContainer}>
        {quizzes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="quiz" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No quizzes available</Text>
          </View>
        ) : (
          quizzes.map((quiz) => (
            <Card key={quiz.quizId} style={styles.quizCard}>
              <Card.Content>
                <View style={styles.quizHeader}>
                  <MaterialIcons name="quiz" size={32} color="#4F46E5" />
                  <View style={styles.quizInfo}>
                    <Title style={styles.quizTitle}>{quiz.title}</Title>
                    <Paragraph style={styles.quizDescription} numberOfLines={2}>
                      {quiz.description || 'No description'}
                    </Paragraph>
                    <View style={styles.quizMeta}>
                      <Text style={styles.metaText}>Duration: {quiz.duration} min</Text>
                      <Text style={styles.metaText}>Passing: {quiz.passingScore}%</Text>
                    </View>
                  </View>
                  {user?.role === 'TEACHER' ? (
                    <TouchableOpacity onPress={() => handleDelete(quiz.quizId)}>
                      <MaterialIcons name="delete" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => handleTakeQuiz(quiz.quizId)}>
                      <MaterialIcons name="play-arrow" size={24} color="#10B981" />
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
        <Menu.Item onPress={() => {}} title="Add New Quiz" />
        <TextInput
          label="Quiz Title"
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
          label="Duration (minutes)"
          value={duration}
          onChangeText={setDuration}
          mode="outlined"
          keyboardType="numeric"
          style={styles.modalInput}
        />
        <TextInput
          label="Passing Score (%)"
          value={passingScore}
          onChangeText={setPassingScore}
          mode="outlined"
          keyboardType="numeric"
          style={styles.modalInput}
        />
        <Menu.Item
          onPress={handleCreate}
          title="Create Quiz"
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
  quizzesContainer: {
    flex: 1,
    padding: 10,
  },
  quizCard: {
    marginBottom: 15,
    elevation: 2,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  quizInfo: {
    flex: 1,
    marginLeft: 15,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizDescription: {
    fontSize: 14,
    color: '#666',
  },
  quizMeta: {
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

export default QuizListScreen;
