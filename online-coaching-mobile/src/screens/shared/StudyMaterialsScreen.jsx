import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, FAB, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { materialAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const StudyMaterialsScreen = ({ navigation }) => {
  const route = useRoute();
  const { courseId } = route.params;
  const { user } = useAuth();
  
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  const fetchMaterials = async () => {
    try {
      const res = await materialAPI.getCourseMaterials(courseId);
      setMaterials(res.data || []);
    } catch (err) {
      showError('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (materialId) => {
    Alert.alert(
      'Delete Material',
      'Are you sure you want to delete this material?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await materialAPI.deleteMaterial(materialId);
              showSuccess('Material deleted successfully');
              fetchMaterials();
            } catch (err) {
              showError('Failed to delete material');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return 'picture-as-pdf';
    if (fileType?.includes('image')) return 'image';
    if (fileType?.includes('video')) return 'videocam';
    return 'insert-drive-file';
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
      <Title style={styles.title}>Study Materials</Title>

      <ScrollView style={styles.materialsContainer}>
        {materials.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="folder-open" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No materials available</Text>
          </View>
        ) : (
          materials.map((material) => (
            <Card key={material.materialId} style={styles.materialCard}>
              <Card.Content>
                <View style={styles.materialHeader}>
                  <MaterialIcons name={getFileIcon(material.fileType)} size={32} color="#4F46E5" />
                  <View style={styles.materialInfo}>
                    <Title style={styles.materialTitle}>{material.title}</Title>
                    <Paragraph style={styles.materialDescription} numberOfLines={2}>
                      {material.description || 'No description'}
                    </Paragraph>
                    <Chip style={styles.fileTypeChip} textStyle={styles.fileTypeText}>
                      {material.fileType || 'Unknown'}
                    </Chip>
                  </View>
                  {user?.role === 'TEACHER' && (
                    <TouchableOpacity onPress={() => handleDelete(material.materialId)}>
                      <MaterialIcons name="delete" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
                <Paragraph style={styles.uploadDate}>
                  Uploaded: {new Date(material.uploadDate).toLocaleDateString()}
                </Paragraph>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {user?.role === 'TEACHER' && (
        <FAB
          icon="add"
          style={styles.fab}
          onPress={() => {
            // TODO: Implement file upload
            showError('File upload feature coming soon');
          }}
        />
      )}
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
  materialsContainer: {
    flex: 1,
    padding: 10,
  },
  materialCard: {
    marginBottom: 15,
    elevation: 2,
  },
  materialHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  materialInfo: {
    flex: 1,
    marginLeft: 15,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  materialDescription: {
    fontSize: 14,
    color: '#666',
  },
  fileTypeChip: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: '#E5E7EB',
  },
  fileTypeText: {
    fontSize: 12,
  },
  uploadDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
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
});

export default StudyMaterialsScreen;
