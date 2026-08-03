import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Heart, Trash2, ShoppingCart, ExternalLink, Star } from 'lucide-react';
import { wishlistAPI, enrollmentAPI } from '../../services/api';

const Wishlist = () => {
  const { colors } = useTheme();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await wishlistAPI.getStudentWishlist(user.id);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (courseId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await wishlistAPI.removeFromWishlist({
        studentId: user.id,
        courseId
      });
      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await enrollmentAPI.enrollStudent(user.id, courseId);
      alert('Successfully enrolled in course!');
      removeFromWishlist(courseId);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
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
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.text }}>My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="card p-12 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Heart size={64} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>Your Wishlist is Empty</h3>
            <p style={{ color: colors.textSecondary }}>
              Save courses you're interested in by clicking the heart icon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="card overflow-hidden" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
                        {item.courseName}
                      </h3>
                      <p className="text-sm mb-3 line-clamp-2" style={{ color: colors.textSecondary }}>
                        {item.courseDescription}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(item.courseId)}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: colors.error + '20', color: colors.error }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
                      <Star size={16} style={{ color: colors.warning }} fill={colors.warning} />
                      <span>{item.courseLevel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
                      <span>Duration:</span>
                      <span>{item.courseDuration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
                      <span>Teacher:</span>
                      <span>{item.teacherName}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                      ₹{item.coursePrice}
                    </span>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t flex gap-2" style={{ borderColor: colors.border }}>
                  <button
                    onClick={() => enrollInCourse(item.courseId)}
                    className="flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: colors.primary, color: colors.onError }}
                  >
                    <ShoppingCart size={18} />
                    Enroll Now
                  </button>
                  <button
                    onClick={() => window.open(`/course/${item.courseId}`, '_blank')}
                    className="px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
                  >
                    <ExternalLink size={18} />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
