import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { MessageSquare, ThumbsUp, Reply, Pin, CheckCircle, Clock, Eye, Plus } from 'lucide-react';
import { discussionForumAPI, enrollmentAPI } from '../../services/api';

const DiscussionForum = () => {
  const { colors } = useTheme();
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', category: '' });
  const [newReply, setNewReply] = useState('');

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const enrollmentResponse = await enrollmentAPI.getStudentEnrollments(user.id);
      const enrolledCourseIds = enrollmentResponse.data.map(e => e.courseId);
      
      const allForums = [];
      for (const courseId of enrolledCourseIds) {
        const response = await discussionForumAPI.getCourseForums(courseId);
        allForums.push(...response.data);
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
      setReplies(response.data);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const createQuestion = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const enrollmentResponse = await enrollmentAPI.getStudentEnrollments(user.id);
      const courseId = enrollmentResponse.data[0]?.courseId;
      
      await discussionForumAPI.createForum({
        studentId: user.id,
        courseId: courseId,
        title: newQuestion.title,
        content: newQuestion.content,
        category: newQuestion.category,
        status: 'OPEN'
      });
      
      setShowNewQuestion(false);
      setNewQuestion({ title: '', content: '', category: '' });
      fetchForums();
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const createReply = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await discussionForumAPI.createReply({
        forumId: selectedForum.id,
        studentId: user.id,
        content: newReply
      });
      
      setNewReply('');
      fetchReplies(selectedForum.id);
    } catch (error) {
      console.error('Error creating reply:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>Discussion Forum</h1>
          <button
            onClick={() => setShowNewQuestion(true)}
            className="px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ backgroundColor: colors.primary, color: colors.onError }}
          >
            <Plus size={20} />
            Ask Question
          </button>
        </div>

        {selectedForum ? (
          <div>
            <button
              onClick={() => setSelectedForum(null)}
              className="mb-4 px-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
            >
              ← Back to Forums
            </button>

            <div className="card mb-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <div className="p-6 border-b" style={{ borderColor: colors.border }}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedForum.isPinned && <Pin size={20} style={{ color: colors.primary }} />}
                  {selectedForum.isAnswered && <CheckCircle size={20} style={{ color: colors.success }} />}
                  <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                    {selectedForum.title}
                  </h2>
                </div>
                <div className="flex items-center gap-4 text-sm mb-4" style={{ color: colors.textSecondary }}>
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
                    {selectedForum.replyCount} replies
                  </span>
                </div>
                {selectedForum.category && (
                  <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: colors.primary + '20', color: colors.primary }}>
                    {selectedForum.category}
                  </span>
                )}
              </div>
              <div className="p-6">
                <p style={{ color: colors.text }}>{selectedForum.content}</p>
              </div>
            </div>

            <div className="card mb-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Add Reply</h3>
                <textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full p-4 rounded-lg mb-4"
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                  rows={4}
                />
                <button
                  onClick={createReply}
                  className="px-6 py-2 rounded-lg"
                  style={{ backgroundColor: colors.primary, color: colors.onError }}
                >
                  Post Reply
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: colors.text }}>Replies</h3>
              {replies.map((reply) => (
                <div key={reply.id} className="card p-6" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold" style={{ color: colors.text }}>
                          {reply.studentName || reply.teacherName}
                        </span>
                        {reply.isAcceptedAnswer && (
                          <span className="flex items-center gap-1 text-sm px-2 py-1 rounded" style={{ backgroundColor: colors.success + '20', color: colors.success }}>
                            <CheckCircle size={14} />
                            Accepted Answer
                          </span>
                        )}
                      </div>
                      <p className="mb-2" style={{ color: colors.text }}>{reply.content}</p>
                      <span className="text-sm" style={{ color: colors.textSecondary }}>
                        {new Date(reply.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {replies.length === 0 && (
                <div className="card p-12 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                  <MessageSquare size={64} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
                  <p style={{ color: colors.textSecondary }}>No replies yet. Be the first to reply!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {forums.length === 0 ? (
              <div className="card p-12 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <MessageSquare size={64} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No Discussions Yet</h3>
                <p style={{ color: colors.textSecondary }}>
                  Start a discussion by asking a question
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {forums.map((forum) => (
                  <div
                    key={forum.id}
                    className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                    onClick={() => {
                      setSelectedForum(forum);
                      fetchReplies(forum.id);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {forum.isPinned && <Pin size={20} style={{ color: colors.primary }} />}
                          {forum.isAnswered && <CheckCircle size={20} style={{ color: colors.success }} />}
                          <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                            {forum.title}
                          </h3>
                        </div>
                        <p className="mb-3 line-clamp-2" style={{ color: colors.text }}>
                          {forum.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm" style={{ color: colors.textSecondary }}>
                          <span>By {forum.studentName || forum.teacherName}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(forum.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {forum.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Reply size={14} />
                            {forum.replyCount} replies
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* New Question Modal */}
        {showNewQuestion && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="card max-w-2xl w-full" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
                <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Ask a Question</h2>
                <button
                  onClick={() => setShowNewQuestion(false)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block mb-2 text-sm" style={{ color: colors.text }}>Title</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    placeholder="Question title..."
                    className="w-full px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm" style={{ color: colors.text }}>Category</label>
                  <input
                    type="text"
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                    placeholder="Category (optional)..."
                    className="w-full px-4 py-2 rounded-lg"
                    style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm" style={{ color: colors.text }}>Content</label>
                  <textarea
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                    placeholder="Describe your question in detail..."
                    className="w-full p-4 rounded-lg"
                    style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                    rows={6}
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={createQuestion}
                    className="flex-1 px-6 py-2 rounded-lg"
                    style={{ backgroundColor: colors.primary, color: colors.onError }}
                  >
                    Submit Question
                  </button>
                  <button
                    onClick={() => setShowNewQuestion(false)}
                    className="flex-1 px-6 py-2 rounded-lg"
                    style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionForum;
