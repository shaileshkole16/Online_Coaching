import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import { Card, Title, Paragraph, Avatar, Divider, Button, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { discussionForumAPI, courseAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const DiscussionForumScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', category: 'General' });
  const [newReply, setNewReply] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchForums();
  }, [user?.id]);

  const fetchForums = async () => {
    try {
      const coursesResponse = await courseAPI.getCoursesByTeacher(user.id);
      const courses = coursesResponse.data || [];
      
      const allForums = [];
      for (const course of courses) {
        try {
          const response = await discussionForumAPI.getCourseForums(course.courseId || course.id);
          allForums.push(...(response.data || []));
        } catch (err) {
          console.log(`No forums for course ${course.courseId}`);
        }
      }
      
      setForums(allForums);
    } catch (error) {
      showError('Failed to load forums');
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (forumId) => {
    try {
      const response = await discussionForumAPI.getForumReplies(forumId);
      setReplies(response.data || []);
    } catch (error) {
      showError('Failed to load replies');
    }
  };

  const createQuestion = async () => {
    try {
      const coursesResponse = await courseAPI.getCoursesByTeacher(user.id);
      const courseId = coursesResponse.data[0]?.courseId || coursesResponse.data[0]?.id;
      
      await discussionForumAPI.createForum({
        teacherId: user.id,
        courseId: courseId,
        title: newQuestion.title,
        content: newQuestion.content,
        category: newQuestion.category,
        status: 'OPEN'
      });
      
      setShowNewQuestion(false);
      setNewQuestion({ title: '', content: '', category: 'General' });
      fetchForums();
      showSuccess('Discussion created successfully');
    } catch (error) {
      showError('Failed to create discussion');
    }
  };

  const createReply = async () => {
    try {
      await discussionForumAPI.createReply({
        forumId: selectedForum.id,
        teacherId: user.id,
        content: newReply
      });
      
      setNewReply('');
      fetchReplies(selectedForum.id);
      showSuccess('Reply posted successfully');
    } catch (error) {
      showError('Failed to post reply');
    }
  };

  const acceptAnswer = async (replyId) => {
    try {
      await discussionForumAPI.acceptAnswer(replyId);
      fetchReplies(selectedForum.id);
      showSuccess('Answer accepted');
    } catch (error) {
      showError('Failed to accept answer');
    }
  };

  const filteredForums = forums.filter(forum =>
    forum.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forum.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (selectedForum) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedForum(null)}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Title style={styles.headerTitle}>Discussion</Title>
        </View>

        <ScrollView style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.forumHeader}>
                {selectedForum.isPinned && <MaterialIcons name="push-pin" size={20} color="#4F46E5" />}
                {selectedForum.isAnswered && <MaterialIcons name="check-circle" size={20} color="#10B981" />}
                <Title style={styles.forumTitle}>{selectedForum.title}</Title>
              </View>
              <View style={styles.forumMeta}>
                <Text style={styles.metaText}>By {selectedForum.studentName || selectedForum.teacherName}</Text>
                <Text style={styles.metaText}>
                  {new Date(selectedForum.createdAt).toLocaleDateString()}
                </Text>
                <View style={styles.metaItem}>
                  <MaterialIcons name="visibility" size={14} color="#666" />
                  <Text style={styles.metaText}>{selectedForum.views} views</Text>
                </View>
                <View style={styles.metaItem}>
                  <MaterialIcons name="question-answer" size={14} color="#666" />
                  <Text style={styles.metaText}>{replies.length} replies</Text>
                </View>
              </View>
              {selectedForum.category && (
                <Chip style={styles.categoryChip}>{selectedForum.category}</Chip>
              )}
              <Paragraph style={styles.forumContent}>{selectedForum.content}</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Add Reply</Title>
              <TextInput
                value={newReply}
                onChangeText={setNewReply}
                placeholder="Write your reply..."
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.textInput}
              />
              <Button mode="contained" onPress={createReply} style={styles.button}>
                Post Reply
              </Button>
            </Card.Content>
          </Card>

          <Title style={styles.sectionTitle}>Replies</Title>
          {replies.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="question-answer" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No replies yet</Text>
            </View>
          ) : (
            replies.map((reply) => (
              <Card key={reply.id} style={styles.card}>
                <Card.Content>
                  <View style={styles.replyHeader}>
                    <Avatar.Text size={32} label={(reply.studentName || reply.teacherName)?.charAt(0) || 'U'} />
                    <View style={styles.replyInfo}>
                      <Text style={styles.replyAuthor}>{reply.studentName || reply.teacherName}</Text>
                      {reply.isAcceptedAnswer && (
                        <Chip icon="check" style={styles.acceptedChip}>Accepted</Chip>
                      )}
                    </View>
                  </View>
                  <Paragraph style={styles.replyContent}>{reply.content}</Paragraph>
                  <Text style={styles.replyTime}>
                    {new Date(reply.createdAt).toLocaleString()}
                  </Text>
                  <Button mode="outlined" onPress={() => acceptAnswer(reply.id)} style={styles.acceptButton}>
                    Accept
                  </Button>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Discussion Forum</Title>
      
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#9CA3AF" />
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search discussions..."
          mode="flat"
          style={styles.searchInput}
        />
      </View>

      {filteredForums.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="question-answer" size={64} color="#9CA3AF" />
          <Text style={styles.emptyText}>No discussions yet</Text>
          <Paragraph style={styles.emptySubtext}>Start a conversation!</Paragraph>
        </View>
      ) : (
        <FlatList
          data={filteredForums}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card
              style={styles.card}
              onPress={() => {
                setSelectedForum(item);
                fetchReplies(item.id);
              }}
            >
              <Card.Content>
                <View style={styles.forumHeader}>
                  {item.isPinned && <MaterialIcons name="push-pin" size={18} color="#4F46E5" />}
                  {item.isAnswered && <MaterialIcons name="check-circle" size={18} color="#10B981" />}
                  <Title style={styles.forumListTitle}>{item.title}</Title>
                </View>
                <Paragraph style={styles.forumPreview} numberOfLines={2}>
                  {item.content}
                </Paragraph>
                <View style={styles.forumMeta}>
                  <Text style={styles.metaText}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="visibility" size={14} color="#666" />
                    <Text style={styles.metaText}>{item.views} views</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="question-answer" size={14} color="#666" />
                    <Text style={styles.metaText}>{item.replyCount || 0} replies</Text>
                  </View>
                </View>
                {item.category && (
                  <Chip style={styles.categoryChip}>{item.category}</Chip>
                )}
              </Card.Content>
            </Card>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setShowNewQuestion(true)}>
        <MaterialIcons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showNewQuestion} animationType="slide">
        <View style={styles.modalContainer}>
          <Title style={styles.modalTitle}>Create Discussion</Title>
          <TextInput
            value={newQuestion.title}
            onChangeText={(text) => setNewQuestion({ ...newQuestion, title: text })}
            placeholder="Title"
            mode="outlined"
            style={styles.textInput}
          />
          <TextInput
            value={newQuestion.category}
            onChangeText={(text) => setNewQuestion({ ...newQuestion, category: text })}
            placeholder="Category"
            mode="outlined"
            style={styles.textInput}
          />
          <TextInput
            value={newQuestion.content}
            onChangeText={(text) => setNewQuestion({ ...newQuestion, content: text })}
            placeholder="Details"
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.textInput}
          />
          <View style={styles.modalButtons}>
            <Button mode="contained" onPress={createQuestion} style={styles.button}>
              Create
            </Button>
            <Button mode="outlined" onPress={() => {
              setShowNewQuestion(false);
              setNewQuestion({ title: '', content: '', category: 'General' });
            }} style={styles.button}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  card: {
    margin: 10,
    marginBottom: 5,
    elevation: 2,
  },
  forumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  forumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  forumListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  forumPreview: {
    color: '#666',
    marginBottom: 8,
  },
  forumMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#DBEAFE',
  },
  forumContent: {
    marginTop: 12,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 15,
    marginLeft: 20,
    color: '#333',
  },
  textInput: {
    marginBottom: 15,
  },
  button: {
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
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#4F46E5',
  },
  headerTitle: {
    color: '#fff',
    marginLeft: 15,
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyInfo: {
    marginLeft: 12,
    flex: 1,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  replyContent: {
    color: '#333',
    marginBottom: 8,
  },
  replyTime: {
    fontSize: 12,
    color: '#999',
  },
  acceptedChip: {
    backgroundColor: '#D1FAE5',
    marginTop: 4,
  },
  acceptButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4F46E5',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default DiscussionForumScreen;