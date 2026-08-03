import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { courseRatingAPI, teacherAPI } from '../../services/api';
import { 
  Star, 
  MessageSquare, 
  Calendar, 
  User, 
  AlertCircle,
  BookOpen
} from 'lucide-react';

const TeacherCourseRatings = () => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1

  useEffect(() => {
    fetchRatings();
  }, [user?.id]);

  const fetchRatings = async () => {
    try {
      // Get teacher ID from user ID
      const teacherRes = await teacherAPI.getTeacherByUserId(user.id);
      const teacherId = teacherRes.data.teacherId;
      
      // Get ratings for teacher's courses
      const ratingsRes = await courseRatingAPI.getTeacherCourseRatings(teacherId);
      
      // Normalize ratings data
      const normalizedRatings = (ratingsRes.data || []).map(rating => ({
        ...rating,
        studentName: rating.student?.user?.name || 'Unknown Student',
        courseTitle: rating.course?.title || 'Unknown Course',
        ratingDate: rating.ratingDate || new Date().toISOString().split('T')[0],
      }));
      
      setRatings(normalizedRatings);
    } catch (err) {
      setError('Failed to load ratings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRatings = filter === 'all' 
    ? ratings 
    : ratings.filter(r => r.rating === parseInt(filter));

  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0;

  const ratingDistribution = {
    5: ratings.filter(r => r.rating === 5).length,
    4: ratings.filter(r => r.rating === 4).length,
    3: ratings.filter(r => r.rating === 3).length,
    2: ratings.filter(r => r.rating === 2).length,
    1: ratings.filter(r => r.rating === 1).length,
  };

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
      <div>
        <h1 className="page-header">Course Ratings & Feedback</h1>
        <p className="text-gray-600">View student ratings and feedback for your courses</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Star className="text-primary-600" size={32} fill="currentColor" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
              <p className="text-sm text-gray-500">{ratings.length} total ratings</p>
            </div>
          </div>
        </div>

        <div className="card md:col-span-2">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <Star size={16} className="text-yellow-400" fill="currentColor" />
                  <span className="text-sm text-gray-600">{star}</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-yellow-400 h-3 rounded-full transition-all"
                    style={{ width: `${ratings.length > 0 ? (ratingDistribution[star] / ratings.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{ratingDistribution[star]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map(star => (
              <button
                key={star}
                onClick={() => setFilter(star.toString())}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  filter === star.toString() ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Star size={14} fill="currentColor" />
                {star}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ratings List */}
      {filteredRatings.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No ratings found</p>
          <p className="text-sm mt-2">Ratings from students will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRatings.map((rating) => (
            <div key={rating.ratingId} className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="text-yellow-600" size={24} fill="currentColor" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{rating.studentName}</h3>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= rating.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                              fill={star <= rating.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <BookOpen size={14} />
                          <span>{rating.courseTitle}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(rating.ratingDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {rating.comment && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">{rating.comment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCourseRatings;
