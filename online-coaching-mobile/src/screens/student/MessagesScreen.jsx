import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Card, Title, Paragraph, TextInput, Avatar, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { messageAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const MessagesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [inbox, setInbox] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchInbox();
  }, [user?.id]);

  const fetchInbox = async () => {
    try {
      const res = await messageAPI.getInbox(user.id);
      setInbox(res.data || []);
    } catch (err) {
      showError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (senderId) => {
    try {
      const res = await messageAPI.getConversation(senderId, user.id);
      setMessages(res.data || []);
    } catch (err) {
      showError('Failed to load conversation');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await messageAPI.sendMessage({
        senderId: user.id,
        receiverId: selectedConversation.senderId,
        content: newMessage,
      });
      setNewMessage('');
      fetchConversation(selectedConversation.senderId);
      showSuccess('Message sent');
    } catch (err) {
      showError('Failed to send message');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (selectedConversation) {
    return (
      <View style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedConversation(null)}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Title style={styles.chatTitle}>{selectedConversation.senderName}</Title>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.messageId.toString()}
          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble,
              item.senderId === user.id ? styles.sentMessage : styles.receivedMessage
            ]}>
              <Text style={[
                styles.messageText,
                item.senderId === user.id ? styles.sentText : styles.receivedText
              ]}>
                {item.content}
              </Text>
              <Text style={styles.messageTime}>
                {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}
          style={styles.messagesList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            mode="outlined"
            style={styles.input}
            right={
              <TextInput.Icon
                icon="send"
                onPress={sendMessage}
              />
            }
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Messages</Title>
      
      {inbox.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="message" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No messages yet</Text>
        </View>
      ) : (
        inbox.map((conversation) => (
          <Card
            key={conversation.messageId}
            style={styles.messageCard}
            onPress={() => {
              setSelectedConversation(conversation);
              fetchConversation(conversation.senderId);
            }}
          >
            <Card.Content>
              <View style={styles.messageHeader}>
                <Avatar.Text
                  size={40}
                  label={conversation.senderName?.charAt(0) || 'U'}
                />
                <View style={styles.messageInfo}>
                  <Title style={styles.senderName}>{conversation.senderName}</Title>
                  <Paragraph style={styles.lastMessage} numberOfLines={1}>
                    {conversation.content}
                  </Paragraph>
                </View>
                <Text style={styles.messageTime}>
                  {new Date(conversation.sentAt).toLocaleDateString()}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    color: '#333',
  },
  messageCard: {
    margin: 10,
    marginBottom: 5,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageInfo: {
    flex: 1,
    marginLeft: 15,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  messageTime: {
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
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#4F46E5',
  },
  chatTitle: {
    color: '#fff',
    marginLeft: 15,
    fontSize: 18,
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  sentMessage: {
    backgroundColor: '#4F46E5',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 5,
    opacity: 0.7,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    backgroundColor: '#F3F4F6',
  },
});

export default MessagesScreen;
