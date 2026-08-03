import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { PlayCircle, Bookmark, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { studentProgressAPI } from '../../services/api';

const Progress = () => {
  const { colors } = useTheme();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await studentProgressAPI.getStudentProgress(user.id);
      setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseProgress = async (courseId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await studentProgressAPI.getProgress(user.id, courseId);
      setCourseProgress(response.data);
    } catch (error) {
      console.error('Error fetching course progress:', error);
    }
  };

  const markLectureComplete = async (lectureId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await studentProgressAPI.markComplete({
        studentId: user.id,
        courseId: selectedCourse,
        lectureId
      });
      fetchCourseProgress(selectedCourse);
    } catch (error) {
      console.error('Error marking lecture complete:', error);
    }
  };

  const bookmarkLecture = async (lectureId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await studentProgressAPI.bookmarkLecture({
        studentId: user.id,
        courseId: selectedCourse,
        lectureId
      });
      fetchCourseProgress(selectedCourse);
    } catch (error) {
      console.error('Error bookmarking lecture:', error);
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
        <h1 className="text-3xl font-bold mb-8" style={{ color: colors.text }}>My Learning Progress</h1>

        {/* Course Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {progressData.map((progress) => (
            <div
              key={progress.id}
              className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
              style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              onClick={() => {
                setSelectedCourse(progress.courseId);
                fetchCourseProgress(progress.courseId);
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                {progress.courseName}
              </h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: colors.textSecondary }}>Progress</span>
                  <span style={{ color: colors.text }}>{progress.completionPercentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2" style={{ backgroundColor: colors.surfaceVariant }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${progress.completionPercentage || 0}%`,
                      backgroundColor: colors.primary
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1" style={{ color: colors.textSecondary }}>
                  <Clock size={16} />
                  {Math.floor((progress.totalTimeSpent || 0) / 60)}h {progress.totalTimeSpent % 60}m
                </div>
                {progress.lastWatchedLectureTitle && (
                  <div className="flex items-center gap-1" style={{ color: colors.textSecondary }}>
                    <PlayCircle size={16} />
                    Last: {progress.lastWatchedLectureTitle.substring(0, 20)}...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Course Progress */}
        {courseProgress && selectedCourse && (
          <div className="card" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
              <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                {courseProgress.courseName} - Detailed Progress
              </h2>
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: colors.surfaceVariant, color: colors.text }}
              >
                Close
              </button>
            </div>
            <div className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                  <div className="flex items-center gap-2 mb-2" style={{ color: colors.primary }}>
                    <TrendingUp size={20} />
                    <span className="font-semibold">Completion</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: colors.text }}>
                    {courseProgress.completionPercentage || 0}%
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                  <div className="flex items-center gap-2 mb-2" style={{ color: colors.secondary }}>
                    <Clock size={20} />
                    <span className="font-semibold">Time Spent</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: colors.text }}>
                    {Math.floor((courseProgress.totalTimeSpent || 0) / 60)}h {courseProgress.totalTimeSpent % 60}m
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                  <div className="flex items-center gap-2 mb-2" style={{ color: colors.success }}>
                    <CheckCircle size={20} />
                    <span className="font-semibold">Completed</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: colors.text }}>
                    {courseProgress.completedLectures ? JSON.parse(courseProgress.completedLectures).length : 0}
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                  <div className="flex items-center gap-2 mb-2" style={{ color: colors.warning }}>
                    <Bookmark size={20} />
                    <span className="font-semibold">Bookmarked</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: colors.text }}>
                    {courseProgress.bookmarkedLectures ? JSON.parse(courseProgress.bookmarkedLectures).length : 0}
                  </p>
                </div>
              </div>

              {/* Continue Learning */}
              {courseProgress.lastWatchedLectureTitle && (
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Continue Learning</p>
                      <p className="font-semibold" style={{ color: colors.text }}>
                        {courseProgress.lastWatchedLectureTitle}
                      </p>
                    </div>
                    <button
                      className="px-4 py-2 rounded-lg flex items-center gap-2"
                      style={{ backgroundColor: colors.primary, color: colors.onError }}
                    >
                      <PlayCircle size={18} />
                      Resume
                    </button>
                  </div>
                </div>
              )}

              {/* Notes */}
              {courseProgress.notes && (
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                  <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>My Notes</p>
                  <p style={{ color: colors.text }}>{courseProgress.notes}</p>
                </div>
              )}

              {/* Bookmarked Lectures */}
              {courseProgress.bookmarkedLectures && JSON.parse(courseProgress.bookmarkedLectures).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Bookmarked Lectures</h3>
                  <div className="space-y-2">
                    {JSON.parse(courseProgress.bookmarkedLectures).map((lectureId, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: colors.background }}>
                        <span style={{ color: colors.text }}>Lecture {lectureId}</span>
                        <button
                          onClick={() => bookmarkLecture(lectureId)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Remove Bookmark
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {progressData.length === 0 && (
          <div className="card p-12 text-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <TrendingUp size={64} className="mx-auto mb-4" style={{ color: colors.textSecondary }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No Progress Yet</h3>
            <p style={{ color: colors.textSecondary }}>
              Enroll in courses to start tracking your progress
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
