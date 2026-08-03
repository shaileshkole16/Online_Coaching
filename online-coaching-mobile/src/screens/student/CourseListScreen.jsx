import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Searchbar, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { courseAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const CourseListScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [loading, setLoading] = useState(true);

  const { showError } = useToast();

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, selectedLevel, courses]);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getAllCourses();
      setCourses(res.data || []);
      setFilteredCourses(res.data || []);
    } catch (err) {
      showError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (selectedLevel !== 'All') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
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
        placeholder="Search courses..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {levels.map((level) => (
          <Chip
            key={level}
            selected={selectedLevel === level}
            onPress={() => setSelectedLevel(level)}
            style={styles.chip}
            selectedColor="#4F46E5"
          >
            {level}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.coursesContainer}>
        {filteredCourses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No courses found</Text>
          </View>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id} style={styles.courseCard}>
              <Card.Content>
                <View style={styles.courseHeader}>
                  <MaterialIcons name="school" size={32} color="#4F46E5" />
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                      {course.price ? `₹${course.price}` : 'Free'}
                    </Text>
                  </View>
                </View>
                <Title style={styles.courseTitle}>{course.title}</Title>
                <Paragraph style={styles.courseDescription} numberOfLines={2}>
                  {course.description}
                </Paragraph>
                <View style={styles.courseMeta}>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="schedule" size={16} color="#666" />
                    <Text style={styles.metaText}>{course.duration || 'N/A'}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="bar-chart" size={16} color="#666" />
                    <Text style={styles.metaText}>{course.level || 'N/A'}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
                >
                  <Text style={styles.viewButtonText}>View Course</Text>
                </TouchableOpacity>
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
  chipContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  chip: {
    marginRight: 10,
  },
  coursesContainer: {
    flex: 1,
    padding: 10,
  },
  courseCard: {
    marginBottom: 15,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceContainer: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  price: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  courseMeta: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  viewButton: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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

export default CourseListScreen;
