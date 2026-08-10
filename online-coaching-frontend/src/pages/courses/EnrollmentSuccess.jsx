import { useNavigate, useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

const EnrollmentSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleGoToCourse = () => {
    navigate(`/student/courses/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 shadow-lg">
          <CheckCircle className="text-green-600" size={48} />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          🎉 Successfully enrolled!
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          You now have access to this course.
        </p>

        {/* Course Card Preview */}
        <div className="card shadow-2xl border-0 mb-8">
          <div className="flex items-center gap-4 p-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="text-white" size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">Course Access Granted</h3>
              <p className="text-sm text-gray-600">Start your learning journey</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoToCourse}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Go to Course
            <ArrowRight size={20} />
          </button>

          <Link
            to="/student/courses"
            className="block text-center text-gray-600 hover:text-gray-900 font-semibold"
          >
            Browse more courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentSuccess;