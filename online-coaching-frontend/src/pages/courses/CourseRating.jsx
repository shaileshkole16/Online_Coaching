import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { studentAPI, courseRatingAPI } from '../../services/api';
import { 
  Star, 
  MessageSquare, 
  Send
} from 'lucide-react';

const CourseRating = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [existingRating, setExistingRating] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExistingRating();
  }, [courseId, user?.id]);

  const fetchExistingRating = async () => {
    try {
      let studentId = user.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }

      const response = await courseRatingAPI.getStudentRatingForCourse(studentId, courseId);
      if (response.data) {
        setExistingRating(response.data);
        setRating(response.data.rating);
        setComment(response.data.comment || '');
      }
    } catch (err) {
      console.log('No existing rating found');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showError('Please select a rating');
      return;
    }

    setLoading(true);

    try {
      let studentId = user.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
      } catch (err) {
        console.log('Student record not found, using userId');
      }

      const requestData = {
        studentId,
        courseId: parseInt(courseId),
        rating,
        comment
      };

      if (existingRating) {
        await courseRatingAPI.updateRating(existingRating.ratingId, requestData);
        showSuccess('Rating updated successfully!');
      } else {
        await courseRatingAPI.submitRating(requestData);
        showSuccess('Rating submitted successfully!');
        await fetchExistingRating();
      }
      
      // Clear form after successful submission
      setRating(0);
      setComment('');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit rating. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Rate this Course</h3>
      

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {rating > 0 && `${rating} out of 5 stars`}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Feedback
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this course. What did you like? What could be improved?"
              className="input-field pl-10 min-h-32"
              rows={4}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || rating === 0}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          {loading ? 'Submitting...' : (existingRating ? 'Update Rating' : 'Submit Rating')}
        </button>
      </form>
    </div>
  );
};

export default CourseRating;
