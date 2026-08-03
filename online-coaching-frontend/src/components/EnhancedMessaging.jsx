import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Send, Paperclip, Image, MoreVertical, Check, CheckCheck, Clock, User } from 'lucide-react';

const EnhancedMessaging = ({ conversationId, currentUser, onSendMessage }) => {
  const { colors } = useTheme;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      senderId: currentUser.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'text'
    };

    setMessages([...messages, message]);
    onSendMessage(message);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : '*/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const message = {
          id: Date.now(),
          senderId: currentUser.id,
          content: file.name,
          timestamp: new Date().toISOString(),
          read: false,
          type: type === 'image' ? 'image' : 'file',
          file: file
        };
        setMessages([...messages, message]);
        onSendMessage(message);
      }
    };
    input.click();
    setShowAttachMenu(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isCurrentUserMessage = (message) => {
    return message.senderId === currentUser.id;
  };

  const getMessageStatus = (message) => {
    if (isCurrentUserMessage(message)) {
      if (message.read) {
        return <CheckCheck size={16} style={{ color: colors.success }} />;
      }
      return <Check size={16} style={{ color: colors.textSecondary }} />;
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
              <User size={20} style={{ color: colors.primary }} />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ backgroundColor: colors.success, borderColor: colors.surface }}></div>
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: colors.text }}>Conversation</h3>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        <button className="p-2 rounded-lg" style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}>
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${isCurrentUserMessage(message) ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${isCurrentUserMessage(message) ? 'order-2' : 'order-1'}`}>
              <div
                className={`p-3 rounded-lg ${
                  isCurrentUserMessage(message)
                    ? 'rounded-br-none'
                    : 'rounded-bl-none'
                }`}
                style={{
                  backgroundColor: isCurrentUserMessage(message) ? colors.primary : colors.surface,
                  color: isCurrentUserMessage(message) ? colors.onError : colors.text
                }}
              >
                {message.type === 'image' && (
                  <div className="mb-2">
                    <img
                      src={message.file ? URL.createObjectURL(message.file) : message.content}
                      alt="Shared image"
                      className="max-w-full rounded-lg"
                    />
                  </div>
                )}
                
                {message.type === 'file' && (
                  <div className="flex items-center gap-2 mb-2 p-2 rounded" style={{ backgroundColor: colors.background }}>
                    <Paperclip size={16} />
                    <span className="text-sm">{message.content}</span>
                  </div>
                )}
                
                <p className="break-words">{message.content}</p>
                
                <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                  isCurrentUserMessage(message) ? 'text-white/70' : 'text-gray-500'
                }`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {getMessageStatus(message)}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg rounded-bl-none" style={{ backgroundColor: colors.surface }}>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.textSecondary }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.textSecondary, animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.textSecondary, animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
            >
              <Paperclip size={20} />
            </button>
            
            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-2 card p-2 space-y-1" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <button
                  onClick={() => handleFileUpload('image')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg w-full hover:opacity-80"
                  style={{ backgroundColor: colors.background, color: colors.text }}
                >
                  <Image size={16} />
                  <span className="text-sm">Image</span>
                </button>
                <button
                  onClick={() => handleFileUpload('file')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg w-full hover:opacity-80"
                  style={{ backgroundColor: colors.background, color: colors.text }}
                >
                  <Paperclip size={16} />
                  <span className="text-sm">File</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 rounded-lg pr-12"
              style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-3 rounded-lg disabled:opacity-50"
            style={{ backgroundColor: colors.primary, color: colors.onError }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessaging;
