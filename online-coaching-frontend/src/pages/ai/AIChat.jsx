import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Copy, Check, Trash2, Plus, FileText, BookOpen, GraduationCap, Database } from 'lucide-react';
import { ollamaAPI } from '../../services/ollamaAPI';
import { ragService } from '../../services/ragService';
import { conversationService } from '../../services/conversationService';
import { useAuth } from '../../contexts/AuthContext';

const SYSTEM_PROMPT = `You are an expert AI Learning Assistant for an Online Coaching System. Your role is to help students and teachers with educational content, course material, and learning guidance.

## Your Capabilities:
1. **Subject Matter Expert**: Provide accurate, well-structured explanations of concepts across various subjects
2. **Study Guidance**: Offer effective study strategies, tips, and learning techniques
3. **Course Material Assistant**: Help understand lectures, assignments, and study materials
4. **Quiz & Assignment Generator**: Create quizzes, assignments, and interview questions from course content
5. **Code Explanation**: Explain programming concepts, debug code, and provide examples
6. **Interactive Learning**: Engage in Socratic dialogue to deepen understanding

## Response Guidelines:
- Be concise yet comprehensive
- Use markdown formatting for better readability (headings, code blocks, tables, lists)
- Provide practical examples when explaining concepts
- Ask follow-up questions to ensure understanding
- Adapt complexity based on the user's level
- Use structured formats (tables, bullet points) for complex information
- Include code examples in proper code blocks with syntax highlighting
- Provide step-by-step explanations for problems

## Special Instructions:
- If asked about course material, provide detailed explanations
- When generating quizzes, include varied question types (MCQ, short answer, essay)
- For assignments, provide clear instructions and rubrics
- For interview questions, categorize by difficulty and topic
- Always cite your reasoning when explaining complex concepts
- Be encouraging and supportive in your responses

Remember: You are here to facilitate learning, not just provide answers. Guide users toward understanding.`;

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Learning Assistant. I can help you with:\n\n• 📚 **Course Material** - Explain concepts from your courses\n• 🎯 **Study Guidance** - Provide effective learning strategies\n• 📝 **Quiz Generation** - Create practice quizzes from content\n• 💻 **Code Help** - Debug and explain programming concepts\n• 📋 **Assignment Ideas** - Generate assignments and interview questions\n\nHow can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [healthCheck, setHealthCheck] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [ragEnabled, setRagEnabled] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loadingRAG, setLoadingRAG] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const loadAvailableCourses = async () => {
    try {
      console.log('Loading courses for user:', user);
      console.log('User ID:', user?.id, 'User role:', user?.role);
      
      let courses = [];
      
      // Fetch all courses first
      const allCoursesResponse = await fetch('/api/courses');
      if (!allCoursesResponse.ok) {
        console.error('Failed to fetch all courses');
        setAvailableCourses([]);
        return;
      }
      
      const allCourses = await allCoursesResponse.json();
      console.log('All available courses:', allCourses);
      
      if (!allCourses || allCourses.length === 0) {
        console.log('No courses in database');
        setAvailableCourses([]);
        return;
      }
      
      // Filter courses based on user role
      if (user?.role === 'TEACHER') {
        // For teachers, we need to get the teacher_id from the teacher table
        let teacherId = user.teacherId || user.teacher_id;
        
        // If teacherId is not in user object, fetch it from the teacher endpoint
        if (!teacherId) {
          try {
            console.log('Teacher ID not found in user object, fetching from teacher endpoint');
            const teacherResponse = await fetch(`/api/teachers/user/${user.id}`);
            if (teacherResponse.ok) {
              const teacherData = await teacherResponse.json();
              teacherId = teacherData.teacherId || teacherData.teacher_id;
              console.log('Fetched teacher ID:', teacherId);
            }
          } catch (error) {
            console.error('Error fetching teacher ID:', error);
          }
        }
        
        console.log('Filtering courses for teacher ID:', teacherId);
        console.log('User object:', user);
        console.log('All courses structure:', allCourses.map(c => ({
          id: c.course_id || c.id,
          title: c.title,
          teacherId: c.teacherId || c.teacher_id
        })));
        
        if (teacherId) {
          courses = allCourses.filter(course => {
            // Handle both teacherId and teacher_id field names
            const courseTeacherId = course.teacherId || course.teacher_id;
            const courseId = course.course_id || course.id;
            console.log(`Course ${courseId}: teacherId=${courseTeacherId}, matches=${courseTeacherId === teacherId}`);
            
            return courseTeacherId === teacherId;
          });
          console.log('Filtered teacher courses:', courses);
        } else {
          console.log('Could not determine teacher ID, showing all courses');
          courses = allCourses;
        }
      } else if (user?.role === 'STUDENT') {
        // For students, try to get enrolled courses
        try {
          const studentId = user.studentId || user.id;
          console.log('Fetching enrollments for student ID:', studentId);
          const enrollmentResponse = await fetch(`/api/enrollments/student/${studentId}`);
          
          if (enrollmentResponse.ok) {
            const enrollments = await enrollmentResponse.json();
            console.log('Student enrollments:', enrollments);
            
            if (enrollments && enrollments.length > 0) {
              // The course ID is nested inside the course object as courseId
              const enrolledCourseIds = enrollments.map(e => {
                const courseId = e.course?.courseId;
                console.log('Extracted course ID:', courseId, 'from course:', e.course?.title);
                return courseId;
              }).filter(id => id !== undefined && id !== null);
              
              console.log('Enrolled course IDs:', enrolledCourseIds);
              
              if (enrolledCourseIds.length > 0) {
                courses = allCourses.filter(course => 
                  enrolledCourseIds.includes(course.id)
                );
                console.log('Filtered student courses:', courses);
              } else {
                console.log('No valid course IDs found in enrollments, showing all courses');
                courses = allCourses;
              }
            } else {
              console.log('No enrollments found for student, showing all courses');
              courses = allCourses;
            }
          } else {
            console.log('Failed to fetch enrollments, showing all courses');
            courses = allCourses;
          }
        } catch (enrollmentError) {
          console.error('Error fetching enrollments:', enrollmentError);
          console.log('Showing all courses as fallback');
          courses = allCourses;
        }
      } else {
        // Admin or other roles - show all courses
        courses = allCourses;
      }
      
      console.log('Final courses to display:', courses);
      setAvailableCourses(courses);
    } catch (error) {
      console.error('Error in loadAvailableCourses:', error);
      setAvailableCourses([]);
    }
  };

  useEffect(() => {
    checkOllamaHealth();
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadAvailableCourses();
    }
  }, [user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const checkOllamaHealth = async () => {
    const isHealthy = await ollamaAPI.checkHealth();
    setHealthCheck(isHealthy);
    if (!isHealthy) {
      setMessages([
        {
          role: 'assistant',
          content: 'Error: Unable to connect to Ollama. Please make sure Ollama is running on localhost:11434 and the llama3.2 model is installed.'
        }
      ]);
    }
  };

  const loadChatHistory = async () => {
    try {
      console.log('Loading chat history for user:', user?.id, 'Role:', user?.role);
      
      // Try to load from backend first (user-specific)
      if (user?.id) {
        const backendConversations = await conversationService.getConversations(user.id);
        if (backendConversations && backendConversations.length > 0) {
          console.log('Loaded backend conversations:', backendConversations.length);
          const formattedHistory = backendConversations.map(conv => ({
            id: conv.id,
            title: conv.title || 'Chat',
            timestamp: conv.createdAt,
            messages: conv.messages || []
          }));
          setChatHistory(formattedHistory);
          return;
        }
      }
      
      // Fallback to localStorage (also user-specific)
      const savedHistory = localStorage.getItem(`ai_chat_history_${user?.id || 'guest'}`);
      if (savedHistory) {
        console.log('Loaded localStorage history');
        setChatHistory(JSON.parse(savedHistory));
      } else {
        console.log('No chat history found');
        setChatHistory([]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Fallback to localStorage
      const savedHistory = localStorage.getItem(`ai_chat_history_${user?.id || 'guest'}`);
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      } else {
        setChatHistory([]);
      }
    }
  };

  const saveChatHistory = async (history) => {
    // Save to localStorage as backup (user-specific)
    const userKey = `ai_chat_history_${user?.id || 'guest'}`;
    localStorage.setItem(userKey, JSON.stringify(history));
    
    // Try to save to backend
    try {
      if (user?.id && currentChatId) {
        const currentChat = history.find(c => c.id === currentChatId);
        if (currentChat) {
          await conversationService.updateConversation(currentChatId, {
            title: currentChat.title,
            messages: currentChat.messages,
            userId: user.id
          });
        }
      }
    } catch (error) {
      console.error('Error saving to backend:', error);
      // Continue with localStorage only
    }
  };

  const handleNewChat = async () => {
    if (messages.length > 1) {
      // Save current chat
      const newChat = {
        id: currentChatId || Date.now(),
        title: messages[1]?.content?.substring(0, 30) + '...' || 'New Chat',
        timestamp: new Date().toISOString(),
        messages: messages
      };
      
      try {
        // Try to save to backend with user ID
        if (user?.id) {
          if (currentChatId) {
            await conversationService.updateConversation(currentChatId, {
              title: newChat.title,
              messages: JSON.stringify(newChat.messages),
              userId: user.id
            });
          } else {
            const saved = await conversationService.saveConversation({
              title: newChat.title,
              messages: JSON.stringify(newChat.messages),
              userId: user.id
            });
            if (saved && saved.id) {
              newChat.id = saved.id;
            }
          }
        }
      } catch (error) {
        console.error('Error saving to backend:', error);
        // Continue with localStorage
      }
      
      const updatedHistory = [newChat, ...chatHistory.filter(c => c.id !== newChat.id || newChat.id === null)];
      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
    }
    
    // Reset chat
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI Learning Assistant. I can help you with:\n\n• 📚 **Course Material** - Explain concepts from your courses\n• 🎯 **Study Guidance** - Provide effective learning strategies\n• 📝 **Quiz Generation** - Create practice quizzes from content\n• 💻 **Code Help** - Debug and explain programming concepts\n• 📋 **Assignment Ideas** - Generate assignments and interview questions\n\nHow can I assist you today?'
      }
    ]);
    setCurrentChatId(null);
    setShowNewChat(false);
  };

  const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
    }
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    
    try {
      // Try to delete from backend
      await conversationService.deleteConversation(chatId);
    } catch (error) {
      console.error('Error deleting from backend:', error);
      // Continue with localStorage
    }
    
    const updatedHistory = chatHistory.filter(c => c.id !== chatId);
    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);
    
    if (currentChatId === chatId) {
      handleNewChat();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setIsTyping(true);

    try {
      let enhancedMessages = [...newMessages];
      let useSystemPrompt = SYSTEM_PROMPT;
      
      // If RAG is enabled and a course is selected, add context
      if (ragEnabled && selectedCourse) {
        setLoadingRAG(true);
        try {
          console.log('Building RAG context for course:', selectedCourse);
          const ragContext = await ragService.searchRelevantContent(selectedCourse, input);
          console.log('RAG context generated:', ragContext);
          
          if (ragContext) {
            const contextMessage = {
              role: 'system',
              content: `RELEVANT COURSE MATERIAL:\n${ragContext}\n\nUse this context to provide more accurate and specific answers. Reference the course material when relevant. If the context doesn't contain information about the specific question, provide a helpful general response based on the course topic.`
            };
            enhancedMessages = [contextMessage, ...newMessages];
            console.log('RAG context added to messages');
            useSystemPrompt = null; // Don't use base system prompt when RAG is active
          } else {
            console.log('No RAG context generated, using base system prompt only');
          }
        } catch (error) {
          console.error('RAG error:', error);
        } finally {
          setLoadingRAG(false);
        }
      }

      // Add empty assistant message for streaming
      const assistantMessage = { role: 'assistant', content: '' };
      setMessages([...enhancedMessages, assistantMessage]);

      // Stream the response
      try {
        await ollamaAPI.chatStream(
          enhancedMessages, 
          'llama3.2', 
          useSystemPrompt,
          (chunk, fullContent) => {
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: fullContent };
              return updated;
            });
          }
        );
      } catch (streamError) {
        console.error('Streaming failed, trying non-streaming chat:', streamError);
        // Fallback to non-streaming chat
        try {
          const response = await ollamaAPI.chat(enhancedMessages, 'llama3.2', useSystemPrompt);
          const assistantMessage = { role: 'assistant', content: response.message?.content || response.response || 'No response' };
          setMessages([...newMessages, assistantMessage]);
        } catch (chatError) {
          console.error('Chat also failed, trying generate endpoint:', chatError);
          // Final fallback to generate endpoint
          const prompt = enhancedMessages.map(m => `${m.role}: ${m.content}`).join('\n');
          const response = await ollamaAPI.generate(prompt, 'llama3.2');
          const assistantMessage = { role: 'assistant', content: response.response || 'No response' };
          setMessages([...newMessages, assistantMessage]);
        }
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      
      // Try fallback to non-streaming
      try {
        console.log('Attempting fallback to non-streaming mode...');
        const response = await ollamaAPI.chat(enhancedMessages, 'llama3.2', useSystemPrompt);
        const assistantMessage = { role: 'assistant', content: response.message?.content || response.response || 'No response' };
        setMessages([...newMessages, assistantMessage]);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        const errorMessage = { 
          role: 'assistant', 
          content: `Sorry, I encountered an error: ${error.message}. Ollama is running but there might be an issue with the model or API.` 
        };
        setMessages([...newMessages, errorMessage]);
      }
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatMessage = (content) => {
    // Simple markdown formatter (temporary until react-markdown is installed)
    const lines = content.split('\n');
    const formattedLines = lines.map((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        return <div key={`code-${index}`} className="bg-gray-100 p-4 rounded-lg my-2 overflow-x-auto font-mono text-sm">{line.replace(/```/g, '')}</div>;
      }
      
      let formattedLine = line;
      
      // Bold text - handle **text** but don't show HTML tags
      formattedLine = formattedLine.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      
      // Italic text
      formattedLine = formattedLine.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      
      // Inline code
      formattedLine = formattedLine.replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded text-sm">$1</code>');
      
      // Headers
      if (formattedLine.startsWith('###')) {
        return <h3 key={`h3-${index}`} className="text-lg font-bold mt-4 mb-2">{formattedLine.replace('###', '')}</h3>;
      }
      if (formattedLine.startsWith('##')) {
        return <h2 key={`h2-${index}`} className="text-xl font-bold mt-4 mb-2">{formattedLine.replace('##', '')}</h2>;
      }
      if (formattedLine.startsWith('#')) {
        return <h1 key={`h1-${index}`} className="text-2xl font-bold mt-4 mb-2">{formattedLine.replace('#', '')}</h1>;
      }
      
      // Lists
      if (formattedLine.startsWith('- ')) {
        return <li key={`list-${index}`} className="ml-4 list-disc">{formattedLine.replace('- ', '')}</li>;
      }
      if (formattedLine.match(/^\d+\. /)) {
        return <li key={`numlist-${index}`} className="ml-4 list-decimal">{formattedLine.replace(/^\d+\. /, '')}</li>;
      }
      
      // Regular paragraph - render HTML for bold/italic tags
      return <p key={`p-${index}`} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: formattedLine }}></p>;
    });
    
    return <div className="prose prose-sm max-w-none">{formattedLines}</div>;
  };

  const generateQuiz = () => {
    const quizPrompt = `Generate a comprehensive quiz with the following structure:
    
1. **Topic**: [Specify the topic]
2. **Difficulty Level**: [Beginner/Intermediate/Advanced]
3. **Number of Questions**: [Specify count]

Please include:
- Multiple Choice Questions (MCQs)
- True/False questions
- Short answer questions
- One coding problem (if applicable)

Format each question clearly with:
- Question text
- Options (for MCQs)
- Correct answer
- Brief explanation

What topic would you like me to create a quiz for?`;
    
    setInput(quizPrompt);
    inputRef.current?.focus();
  };

  const generateAssignment = () => {
    const assignmentPrompt = `Generate a detailed assignment with the following structure:

1. **Topic**: [Specify the topic]
2. **Type**: [Practical/Theoretical/Mixed]
3. **Duration**: [Specify time limit]
4. **Difficulty**: [Beginner/Intermediate/Advanced]

Please include:
- Clear learning objectives
- Detailed problem statements
- Submission requirements
- Grading rubric
- Hints/suggestions for students

What topic would you like me to create an assignment for?`;
    
    setInput(assignmentPrompt);
    inputRef.current?.focus();
  };

  const generateInterviewQuestions = () => {
    const interviewPrompt = `Generate interview questions with the following structure:

1. **Domain**: [e.g., Java, React, Database, System Design]
2. **Experience Level**: [Fresher/Mid-level/Senior]
3. **Number of Questions**: [Specify count]

Please include:
- Technical questions
- Problem-solving scenarios
- Behavioral questions
- Expected answers/key points
- Difficulty rating for each question

What domain would you like interview questions for?`;
    
    setInput(interviewPrompt);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-header">AI Learning Assistant</h1>
            <p className="text-gray-600">Get help with your courses, assignments, and study materials</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${healthCheck ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {healthCheck ? 'Connected to Ollama' : 'Ollama Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-4">
              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={generateQuiz}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors text-sm"
                  >
                    <FileText size={16} />
                    <span>Generate Quiz</span>
                  </button>
                  <button
                    onClick={generateAssignment}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors text-sm"
                  >
                    <BookOpen size={16} />
                    <span>Generate Assignment</span>
                  </button>
                  <button
                    onClick={generateInterviewQuestions}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors text-sm"
                  >
                    <GraduationCap size={16} />
                    <span>Interview Questions</span>
                  </button>
                </div>
              </div>

              {/* RAG Mode */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Course Context</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ragEnabled}
                      onChange={(e) => setRagEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-600"
                    />
                    <span>Enable Course Context</span>
                  </label>
                  {ragEnabled && (
                    <select
                      value={selectedCourse || ''}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full input-field text-sm"
                    >
                      <option value="">Select Course</option>
                      {availableCourses.length > 0 ? (
                        availableCourses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title || course.name || `Course ${course.id}`}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No courses available</option>
                      )}
                    </select>
                  )}
                </div>
              </div>

              {/* Chat History */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Recent Chats</h3>
                  <button
                    onClick={handleNewChat}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => loadChat(chat.id)}
                      className="group relative p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="text-sm text-gray-900 truncate">{chat.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(chat.timestamp).toLocaleDateString()}
                      </div>
                      <button
                        onClick={(e) => deleteChat(chat.id, e)}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                      >
                        <Trash2 size={14} className="text-gray-500" />
                      </button>
                    </div>
                  ))}
                  {chatHistory.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">
                      No chat history
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="card h-[calc(100vh-180px)] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-start gap-3 max-w-[80%]">
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <Bot size={16} className="text-primary-600" />
                          </div>
                        )}
                        <div className={`flex-1 ${
                          message.role === 'user' 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        } rounded-2xl px-4 py-3`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 prose prose-sm max-w-none">
                              {formatMessage(message.content)}
                            </div>
                            <button
                              onClick={() => copyToClipboard(message.content, index)}
                              className="flex-shrink-0 opacity-0 hover:opacity-100 transition-opacity"
                            >
                              {copiedIndex === index ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <Copy size={16} className="text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User size={16} className="text-gray-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <Bot size={16} className="text-primary-600" />
                        </div>
                        <div className="bg-gray-100 rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-end gap-3 bg-white rounded-xl p-2 border border-gray-300">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your courses..."
                    className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 resize-none outline-none px-3 py-2 max-h-32"
                    rows={1}
                    disabled={loading || !healthCheck}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading || !healthCheck}
                    className="w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Send size={18} className="text-white" />
                    )}
                  </button>
                </div>
                <div className="text-center text-xs text-gray-500 mt-2">
                  AI can make mistakes. Verify important information.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;