import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, HelperText, Menu } from 'react-native-paper';
import { courseAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const CreateCourseScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [levelMenuVisible, setLevelMenuVisible] = useState(false);

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const { showSuccess, showError } = useToast();

  const handleCreate = async () => {
    if (!title || !description || !duration) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let teacherId = null;
      try {
        const { teacherAPI: teacherApi } = require('../../services/api');
        const teacherRes = await teacherApi.getTeacherByUserId(user.id);
        teacherId = teacherRes.data.teacherId;
      } catch (err) {
        console.log('Teacher record not found');
      }

      const courseData = {
        title,
        description,
        duration,
        level,
        price: price || 0,
        teacherId,
      };

      await courseAPI.createCourse(courseData);
      showSuccess('Course created successfully');
      navigation.goBack();
    } catch (err) {
      showError('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title style={styles.title}>Create New Course</Title>

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
          onPress={handleCreate}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Create Course
        </Button>

        <Button
          mode="outlined"
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

export default CreateCourseScreen;
