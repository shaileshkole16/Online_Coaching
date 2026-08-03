import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Searchbar, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { courseAPI, teacherAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const CourseListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const { showError } = useToast();

  useEffect(() => {
    fetchCourses();
  }, [user?.id]);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, courses]);

  const fetchCourses = async () => {
    try {
      let teacherId = null;
      try {
        const teacherRes = await teacherAPI.getTeacherByUserId(user.id);
        teacherId = teacherRes.data.teacherId;
      } catch (err) {
        console.log('Teacher record not found');
      }

      if (teacherId) {
        const res = await courseAPI.getCoursesByTeacher(teacherId);
        setCourses(res.data || []);
        setFilteredCourses(res.data || []);
      }
    } catch (err) {
      showError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    if (searchQuery) {
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
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
        placeholder="Search your courses..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

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
                  style={styles.manageButton}
                  onPress={() => navigation.navigate('CourseStudents', { courseId: course.id })}
                >
                  <Text style={styles.manageButtonText}>Manage Course</Text>
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
  manageButton: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  manageButtonText: {
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
