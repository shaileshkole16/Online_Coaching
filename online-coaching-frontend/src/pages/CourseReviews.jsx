import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Star, ThumbsUp, MessageSquare, Plus, Search } from 'lucide-react';
import { courseReviewAPI, courseAPI } from '../services/api';

const CourseReviews = () => {
  const { colors } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    courseId: null,
    rating: 5,
    title: '',
    content: '',
    pros: '',
    cons: ''
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAllCourses();
      setCourses(response.data);
      // After courses are loaded, fetch reviews
      fetchReviews(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const fetchReviews = async (coursesList) => {
    try {
      const allReviews = [];
      for (const course of coursesList) {
        try {
          const response = await courseReviewAPI.getCourseReviews(course.id);
          allReviews.push(...response.data);
        } catch (error) {
          // Skip if no reviews for this course
        }
      }
      setReviews(allReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await courseReviewAPI.createReview({
        ...formData,
        studentId: user.id,
        studentName: user.name,
        isVerified: false,
        helpfulCount: 0
      });
      setShowModal(false);
      setFormData({
        courseId: null,
        rating: 5,
        title: '',
        content: '',
        pros: '',
        cons: ''
      });
      // Re-fetch reviews after submission
      const response = await courseAPI.getAllCourses();
      fetchReviews(response.data);
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  const markHelpful = async (reviewId) => {
    try {
      await courseReviewAPI.markHelpful(reviewId);
      // Re-fetch reviews to update the count
      const response = await courseAPI.getAllCourses();
      fetchReviews(response.data);
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            style={{ color: star <= rating ? colors.warning : colors.textSecondary }}
            fill={star <= rating ? colors.warning : 'none'}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === 'all' || review.isVerified === (filter === 'verified');
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>Course Reviews</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ backgroundColor: colors.primary, color: colors.onError }}
          >
            <Plus size={20} />
            Write Review
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSecondary }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reviews..."
              className="w-full pl-10 pr-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'verified', 'unverified'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg ${filter === status ? 'ring-2' : ''}`}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  ringColor: filter === status ? colors.primary : 'transparent'
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="card p-12 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <MessageSquare size={64} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No Reviews Yet</h3>
            <p style={{ color: colors.textSecondary }}>
              {searchTerm ? 'Try a different search term' : 'Be the first to review a course!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="card p-6 hover:shadow-lg transition-shadow"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(review.rating)}
                      {review.isVerified && (
                        <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: colors.success + '20', color: colors.success }}>
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                      {review.title}
                    </h3>
                    
                    <p className="mb-3" style={{ color: colors.text }}>
                      {review.content}
                    </p>
                    
                    {review.pros && (
                      <div className="mb-2 p-3 rounded" style={{ backgroundColor: colors.success + '10' }}>
                        <strong style={{ color: colors.success }}>Pros:</strong>
                        <p className="text-sm" style={{ color: colors.text }}>{review.pros}</p>
                      </div>
                    )}
                    
                    {review.cons && (
                      <div className="mb-2 p-3 rounded" style={{ backgroundColor: colors.error + '10' }}>
                        <strong style={{ color: colors.error }}>Cons:</strong>
                        <p className="text-sm" style={{ color: colors.text }}>{review.cons}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm" style={{ color: colors.textSecondary }}>
                      <span>By {review.studentName}</span>
                      <span>Course: {review.courseName}</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markHelpful(review.id)}
                      className="p-2 rounded-lg flex items-center gap-1"
                      style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                    >
                      <ThumbsUp size={16} />
                      {review.helpfulCount}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Review Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
                <h2 className="text-xl font-semibold" style={{ color: colors.text }}>Write a Review</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Select Course</label>
                    <select
                      value={formData.courseId || ''}
                      onChange={(e) => setFormData({ ...formData, courseId: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                    >
                      <option value="">Choose a course...</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-2"
                        >
                          <Star
                            size={24}
                            style={{ color: star <= formData.rating ? colors.warning : colors.textSecondary }}
                            fill={star <= formData.rating ? colors.warning : 'none'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Review Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                      placeholder="Summarize your experience"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Review</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                      rows={4}
                      placeholder="Share your detailed experience with this course"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Pros (Optional)</label>
                    <textarea
                      value={formData.pros}
                      onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                      rows={2}
                      placeholder="What did you like about the course?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Cons (Optional)</label>
                    <textarea
                      value={formData.cons}
                      onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}
                      rows={2}
                      placeholder="What could be improved?"
                    />
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.courseId}
                    className="w-full px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: colors.primary, color: colors.onError }}
                  >
                    Submit Review
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

export default CourseReviews;