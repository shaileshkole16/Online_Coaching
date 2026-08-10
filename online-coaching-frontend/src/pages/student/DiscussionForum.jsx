import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, ThumbsUp, Reply, Pin, CheckCircle, Clock, Eye, Plus, Search, ArrowLeft } from 'lucide-react';
import { discussionForumAPI, enrollmentAPI, studentAPI } from '../../services/api';

const DiscussionForum = () => {
  const { user } = useAuth();
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', category: 'General' });
  const [newReply, setNewReply] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchForums();
  }, [user?.id]);

  const fetchForums = async () => {
    try {
      // First get the student by user ID
      const studentResponse = await studentAPI.getStudentByUserId(user.id);
      if (!studentResponse.data) {
        console.log('Student not found for user:', user.id);
        setLoading(false);
        return;
      }
      
      const studentId = studentResponse.data.studentId;
      const enrollmentResponse = await enrollmentAPI.getStudentEnrollments(studentId);
      const enrolledCourseIds = enrollmentResponse.data.map(e => e.course?.courseId || e.courseId);
      
      const allForums = [];
      for (const courseId of enrolledCourseIds) {
        try {
          const response = await discussionForumAPI.getCourseForums(courseId);
          allForums.push(...(response.data || []));
        } catch (err) {
          console.log(`No forums for course ${courseId}`);
        }
      }
      
      setForums(allForums);
    } catch (error) {
      console.error('Error fetching forums:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (forumId) => {
    try {
      const response = await discussionForumAPI.getForumReplies(forumId);
      setReplies(response.data || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const createQuestion = async () => {
    try {
      // First get the student by user ID
      const studentResponse = await studentAPI.getStudentByUserId(user.id);
      if (!studentResponse.data) {
        alert('Student account not found. Please contact support.');
        return;
      }
      
      const studentId = studentResponse.data.studentId;
      const enrollmentResponse = await enrollmentAPI.getStudentEnrollments(studentId);
      
      if (!enrollmentResponse.data || enrollmentResponse.data.length === 0) {
        alert('You need to enroll in a course first before you can create discussion forums.');
        return;
      }
      
      const courseId = enrollmentResponse.data[0]?.course?.courseId || enrollmentResponse.data[0]?.courseId;
      
      await discussionForumAPI.createForum({
        studentId: studentId,
        courseId: courseId,
        title: newQuestion.title,
        content: newQuestion.content,
        category: newQuestion.category,
        status: 'OPEN'
      });
      
      setShowNewQuestion(false);
      setNewQuestion({ title: '', content: '', category: 'General' });
      fetchForums();
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Failed to create question. Please try again.');
    }
  };

  const createReply = async () => {
    try {
      const studentResponse = await studentAPI.getStudentByUserId(user.id);
      if (!studentResponse.data) {
        alert('Student account not found. Please contact support.');
        return;
      }
      
      const studentId = studentResponse.data.studentId;
      
      await discussionForumAPI.createReply({
        forumId: selectedForum.id,
        studentId: studentId,
        content: newReply
      });
      
      setNewReply('');
      fetchReplies(selectedForum.id);
    } catch (error) {
      console.error('Error creating reply:', error);
      alert('Failed to post reply. Please try again.');
    }
  };

  const acceptAnswer = async (replyId) => {
    try {
      await discussionForumAPI.acceptAnswer(replyId);
      fetchReplies(selectedForum.id);
    } catch (error) {
      console.error('Error accepting answer:', error);
    }
  };

  const filteredForums = forums.filter(forum =>
    forum.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forum.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-header">Discussion Forum</h1>
        <button
          onClick={() => setShowNewQuestion(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Ask Question
        </button>
      </div>

      {selectedForum ? (
        <div>
          <button
            onClick={() => setSelectedForum(null)}
            className="mb-4 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Forums
          </button>

          <div className="card mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                {selectedForum.isPinned && <Pin size={20} className="text-primary-600" />}
                {selectedForum.isAnswered && <CheckCircle size={20} className="text-green-600" />}
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedForum.title}
                </h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>By {selectedForum.studentName || selectedForum.teacherName}</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(selectedForum.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {selectedForum.views} views
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  {replies.length} replies
                </span>
              </div>
              {selectedForum.category && (
                <span className="px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
                  {selectedForum.category}
                </span>
              )}
            </div>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedForum.content}</p>
            </div>
          </div>

          <div className="card mb-6">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Reply</h3>
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Write your reply..."
                className="input-field mb-4"
                rows={4}
              />
              <button
                onClick={createReply}
                className="btn-primary"
              >
                Post Reply
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Replies</h3>
            {replies.length === 0 ? (
              <div className="card text-center py-8 text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No replies yet. Be the first to respond!</p>
              </div>
            ) : (
              replies.map((reply) => (
                <div key={reply.id} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {reply.studentName || reply.teacherName}
                        </span>
                        {reply.isAcceptedAnswer && (
                          <span className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-green-100 text-green-700">
                            <CheckCircle size={14} />
                            Accepted Answer
                          </span>
                        )}
                      </div>
                      <p className="mb-2 text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                      <span className="text-sm text-gray-500">
                        {new Date(reply.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => acceptAnswer(reply.id)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field flex-1"
              />
            </div>
          </div>

          {filteredForums.length === 0 ? (
            <div className="card text-center py-12 text-gray-500">
              <MessageSquare size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No discussions yet</p>
              <p className="text-sm">Start a conversation by asking a question!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredForums.map((forum) => (
                <div
                  key={forum.id}
                  onClick={() => {
                    setSelectedForum(forum);
                    fetchReplies(forum.id);
                  }}
                  className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {forum.isPinned && <Pin size={18} className="text-primary-600" />}
                        {forum.isAnswered && <CheckCircle size={18} className="text-green-600" />}
                        <h3 className="text-lg font-bold text-gray-900">{forum.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{forum.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(forum.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {forum.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={14} />
                          {forum.replyCount || 0} replies
                        </span>
                      </div>
                      {forum.category && (
                        <span className="px-2 py-1 rounded text-xs bg-primary-100 text-primary-700">
                          {forum.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showNewQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ask a Question</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">Title</label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  className="input-field"
                  placeholder="What's your question?"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">Category</label>
                <select
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                  className="input-field"
                >
                  <option value="General">General</option>
                  <option value="Technical">Technical</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Course Content">Course Content</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">Details</label>
                <textarea
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  className="input-field"
                  placeholder="Provide more details about your question..."
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={createQuestion}
                  className="btn-primary flex-1"
                >
                  Post Question
                </button>
                <button
                  onClick={() => {
                    setShowNewQuestion(false);
                    setNewQuestion({ title: '', content: '', category: 'General' });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionForum;