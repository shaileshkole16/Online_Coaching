import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Title, Menu } from 'react-native-paper';
import { courseAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useRoute } from '@react-navigation/native';

const EditCourseScreen = ({ navigation }) => {
  const route = useRoute();
  const { courseId } = route.params;
  
  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [levelMenuVisible, setLevelMenuVisible] = useState(false);

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await courseAPI.getCourseById(courseId);
      const courseData = res.data;
      setCourse(courseData);
      setTitle(courseData.title || '');
      setDescription(courseData.description || '');
      setDuration(courseData.duration || '');
      setLevel(courseData.level || 'Beginner');
      setPrice(courseData.price?.toString() || '');
    } catch (err) {
      showError('Failed to load course');
    }
  };

  const handleUpdate = async () => {
    if (!title || !description || !duration) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const courseData = {
        title,
        description,
        duration,
        level,
        price: price || 0,
      };

      await courseAPI.updateCourse(courseId, courseData);
      showSuccess('Course updated successfully');
      navigation.goBack();
    } catch (err) {
      showError('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this course? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await courseAPI.deleteCourse(courseId);
              showSuccess('Course deleted successfully');
              navigation.goBack();
            } catch (err) {
              showError('Failed to delete course');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!course) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title style={styles.title}>Edit Course</Title>

        <TextInput
          label="Course Title *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="title" />}
        />

        <TextInput
          label="Description *"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          left={<TextInput.Icon icon="description" />}
        />

        <TextInput
          label="Duration *"
          value={duration}
          onChangeText={setDuration}
          mode="outlined"
          placeholder="e.g., 8 weeks, 40 hours"
          style={styles.input}
          left={<TextInput.Icon icon="schedule" />}
        />

        <Menu
          visible={levelMenuVisible}
          onDismiss={() => setLevelMenuVisible(false)}
          anchor={
            <TextInput
              label="Level"
              value={level}
              mode="outlined"
              style={styles.input}
              right={<TextInput.Icon icon="menu-down" onPress={() => setLevelMenuVisible(true)} />}
              left={<TextInput.Icon icon="bar-chart" />}
            />
          }
        >
          {levels.map((lvl) => (
            <Menu.Item
              key={lvl}
              onPress={() => {
                setLevel(lvl);
                setLevelMenuVisible(false);
              }}
              title={lvl}
            />
          ))}
        </Menu>

        <TextInput
          label="Price (₹)"
          value={price}
          onChangeText={setPrice}
          mode="outlined"
          keyboardType="numeric"
          placeholder="0 for free"
          style={styles.input}
          left={<TextInput.Icon icon="currency-rupee" />}
        />

        <Button
          mode="contained"
          onPress={handleUpdate}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Update Course
        </Button>

        <Button
          mode="outlined"
          onPress={handleDelete}
          style={styles.button}
          buttonColor="#EF4444"
          textColor="#fff"
        >
          Delete Course
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Cancel
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default EditCourseScreen;
