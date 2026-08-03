import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Title, Paragraph, TextInput, Button, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { studentAPI, uploadAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const StudentProfileScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchStudentData();
  }, [user?.id]);

  const fetchStudentData = async () => {
    try {
      const res = await studentAPI.getStudentByUserId(user.id);
      setStudent(res.data);
      setFormData({
        phone: res.data.phone || '',
        address: res.data.address || '',
        bio: res.data.bio || '',
      });
    } catch (err) {
      console.log('Error fetching student data:', err);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await studentAPI.updateStudent(student.studentId, formData);
      showSuccess('Profile updated successfully');
      setEditing(false);
      fetchStudentData();
    } catch (err) {
      showError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  if (!student) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.name?.charAt(0) || 'U'} 
          style={styles.avatar}
        />
        <Title style={styles.name}>{user?.name}</Title>
        <Paragraph style={styles.email}>{user?.email}</Paragraph>
        <Paragraph style={styles.role}>Student</Paragraph>
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Personal Information</Title>
        
        <TextInput
          label="Phone"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          mode="outlined"
          disabled={!editing}
          style={styles.input}
          left={<TextInput.Icon icon="phone" />}
        />

        <TextInput
          label="Address"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          mode="outlined"
          disabled={!editing}
          style={styles.input}
          left={<TextInput.Icon icon="home" />}
        />

        <TextInput
          label="Bio"
          value={formData.bio}
          onChangeText={(text) => setFormData({ ...formData, bio: text })}
          mode="outlined"
          disabled={!editing}
          multiline
          numberOfLines={3}
          style={styles.input}
          left={<TextInput.Icon icon="person" />}
        />

        {editing ? (
          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={() => {
                setEditing(false);
                setFormData({
                  phone: student.phone || '',
                  address: student.address || '',
                  bio: student.bio || '',
                });
              }}
              style={styles.button}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleUpdate}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Save
            </Button>
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={() => setEditing(true)}
            style={styles.button}
          >
            Edit Profile
          </Button>
        )}
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Account Actions</Title>
        
        <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#EF4444" />
          <Text style={styles.actionText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  avatar: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  role: {
    fontSize: 12,
    color: '#4F46E5',
    marginTop: 5,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  divider: {
    marginVertical: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#EF4444',
    fontWeight: 'bold',
  },
});

export default StudentProfileScreen;
