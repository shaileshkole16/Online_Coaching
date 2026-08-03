import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { messageAPI, studentAPI, teacherAPI } from '../../services/api';
import { 
  MessageSquare, 
  Send, 
  Search,
  User,
  Clock,
  Trash2,
  AlertCircle,
  ArrowLeft,
  Plus,
  X
} from 'lucide-react';

const Messages = () => {
  const { user, isStudent, isTeacher } = useAuth();
  const [inbox, setInbox] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchInbox();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchInbox = async () => {
    if (!user?.id) return;
    try {
      const res = await messageAPI.getInbox(user.id);
      setInbox(res.data);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      let usersRes;
      if (isStudent) {
        // Students can message teachers
        usersRes = await teacherAPI.getAllTeachers();
      } else {
        // Teachers can message students
        usersRes = await studentAPI.getAllStudents();
      }
      setAvailableUsers(usersRes.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleStartConversation = async () => {
    if (!selectedRecipient) return;
    
    try {
      // Send initial message to start conversation
      await messageAPI.sendMessage({
        senderId: user.id,
        receiverId: selectedRecipient.userId || selectedRecipient.id,
        message: 'Hello, I would like to start a conversation with you.',
      });
      setShowNewMessageModal(false);
      setSelectedRecipient(null);
      fetchInbox();
    } catch (err) {
      console.error('Failed to start conversation:', err);
      alert('Failed to start conversation');
    }
  };

  const fetchConversation = async (senderId) => {
    try {
      const res = await messageAPI.getConversation(senderId, user.id);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await messageAPI.sendMessage({
        senderId: user.id,
        receiverId: selectedConversation.senderId,
        message: newMessage,
      });
      setNewMessage('');
      fetchConversation(selectedConversation.senderId);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await messageAPI.deleteMessage(messageId);
      setMessages(messages.filter(m => m.id !== messageId));
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const filteredInbox = inbox.filter(msg =>
    msg.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const normalizeMessage = (msg) => ({
    ...msg,
    id: msg.id ?? msg.messageId,
    messageId: msg.messageId ?? msg.id,
    content: msg.content ?? msg.message,
    senderId: msg.senderId ?? msg.sender?.userId,
    senderName: msg.senderName ?? msg.sender?.name,
    sentAt: msg.sentAt ?? msg.timestamp,
  });

  const normalizedInbox = filteredInbox.map(normalizeMessage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card flex items-center gap-3 text-red-600">
        <AlertCircle size={24} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">Messages</h1>
        <button
          onClick={() => {
            setShowNewMessageModal(true);
            fetchAvailableUsers();
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          New Conversation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inbox List */}
        <div className="card lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field flex-1"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {normalizedInbox.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No messages yet</p>
              </div>
            ) : (
              normalizedInbox.map((msg) => (
                <div
                  key={msg.messageId}
                  onClick={() => {
                    setSelectedConversation(msg);
                    fetchConversation(msg.senderId);
                  }}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation?.messageId === msg.messageId
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="text-primary-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 truncate">{msg.senderName}</h4>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(msg.sentAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Conversation View */}
        <div className="card lg:col-span-2">
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="text-primary-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedConversation.senderName}</h3>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No messages in this conversation</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const normalizedMsg = normalizeMessage(msg);
                    const isOwn = normalizedMsg.senderId === user.id;
                    return (
                      <div
                        key={normalizedMsg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            isOwn
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{normalizedMsg.content}</p>
                          <div className="flex items-center justify-between mt-2 gap-4">
                            <span className="text-xs opacity-70">
                              {new Date(normalizedMsg.sentAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isOwn && (
                              <button
                                onClick={() => handleDeleteMessage(normalizedMsg.id)}
                                className="opacity-70 hover:opacity-100"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary px-4">
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-[500px] text-gray-500">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Start New Conversation</h2>
                <button
                  onClick={() => {
                    setShowNewMessageModal(false);
                    setSelectedRecipient(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Recipient
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableUsers.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No users available</p>
                    ) : (
                      availableUsers.map((userItem, index) => (
                        <div
                          key={userItem.userId || userItem.id || index}
                          onClick={() => setSelectedRecipient(userItem)}
                          className={`p-3 rounded-lg cursor-pointer border ${
                            selectedRecipient?.userId === userItem.userId || selectedRecipient?.id === userItem.id
                              ? 'bg-primary-50 border-primary-200'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="text-primary-600" size={18} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{userItem.user?.name || userItem.name}</p>
                              <p className="text-sm text-gray-500">{userItem.user?.email || userItem.email}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={handleStartConversation}
                  disabled={!selectedRecipient}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
