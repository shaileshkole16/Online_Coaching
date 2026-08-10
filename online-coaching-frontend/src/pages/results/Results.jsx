import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { resultAPI, enrollmentAPI, studentAPI } from '../../services/api';
import { 
  BookOpen,
  AlertCircle,
  Calendar
} from 'lucide-react';

const Results = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    try {
      // Get studentId first using userId
      let studentId = user.id;
      try {
        const studentRes = await studentAPI.getStudentByUserId(user.id);
        studentId = studentRes.data.studentId;
        console.log('Student ID for results:', studentId);
      } catch (err) {
        console.log('Student record not found, using userId');
      }

      console.log('Fetching results for student ID:', studentId);
      const [resultsRes, enrollmentsRes] = await Promise.all([
        resultAPI.getStudentResults(studentId),
        enrollmentAPI.getStudentEnrollments(studentId),
      ]);

      console.log('Results response:', resultsRes);
      console.log('Results data:', resultsRes.data);
      const normalizedResults = (resultsRes.data || []).map((result) => ({
        ...result,
        resultId: result.resultId ?? result.id,
        courseName: result.course?.title ?? result.courseName ?? 'Unknown Course',
        courseId: result.course?.courseId ?? result.courseId,
        resultDate: result.resultDate ?? result.createdDate,
        assignmentMarks: result.assignmentMarks ?? null,
        quizScore: result.quizScore ?? null,
      }));
      setResults(normalizedResults);
      
      const normalizedEnrollments = (enrollmentsRes.data || []).map((enrollment) => ({
        ...enrollment,
        enrollId: enrollment.enrollId ?? enrollment.id,
        courseId: enrollment.course?.courseId ?? enrollment.courseId,
        courseName: enrollment.course?.title ?? enrollment.courseName ?? 'Unknown Course',
      }));
      setEnrollments(normalizedEnrollments);
    } catch (err) {
      setError('Failed to load results');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        <h1 className="page-header">My Results</h1>
        <p className="text-gray-600">View your assignment and quiz marks</p>
      </div>

      {/* Results List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Results</h2>

        {results.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No results available yet</p>
            <p className="text-sm mt-2">Complete assignments and quizzes to see your marks here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => {
              const enrollment = enrollments.find(e => e.courseId === result.courseId);
              return (
                <div key={result.resultId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="text-primary-600" size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {result.courseName || enrollment?.courseName || 'Course'}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{new Date(result.resultDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-3 text-sm">
                      {result.assignmentMarks !== null && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Assignment Marks:</span>
                          <span className="font-semibold text-gray-900">{result.assignmentMarks}</span>
                        </div>
                      )}
                      {result.quizScore !== null && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Quiz Marks:</span>
                          <span className="font-semibold text-gray-900">{result.quizScore}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
