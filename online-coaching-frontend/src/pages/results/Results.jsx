import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { resultAPI, enrollmentAPI, studentAPI } from '../../services/api';
import { 
  Award, 
  TrendingUp, 
  BookOpen,
  AlertCircle,
  Calendar,
  CheckCircle
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
        totalMarks: result.totalMarks ?? result.marksObtained ?? 0,
        grade: result.grade ?? 'N/A',
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

  const getGradeColor = (grade) => {
    if (grade?.startsWith('A') || grade?.startsWith('a')) return 'bg-green-100 text-green-700';
    if (grade?.startsWith('B') || grade?.startsWith('b')) return 'bg-blue-100 text-blue-700';
    if (grade?.startsWith('C') || grade?.startsWith('c')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const calculateGPA = () => {
    if (results.length === 0) return 0;
    const totalMarks = results.reduce((sum, r) => sum + (r.totalMarks || 0), 0);
    const maxPossible = results.length * 100;
    return ((totalMarks / maxPossible) * 4).toFixed(2);
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

  const gpa = calculateGPA();
  const averageMarks = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + (r.totalMarks || 0), 0) / results.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">My Results & Grades</h1>
        <p className="text-gray-600">Track your academic performance and course grades</p>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Award className="text-blue-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600">GPA</p>
              <p className="text-3xl font-bold text-gray-900">{gpa}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-green-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{averageMarks}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <BookOpen className="text-purple-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Courses Completed</p>
              <p className="text-3xl font-bold text-gray-900">{results.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Results</h2>

        {results.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Award size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No results available yet</p>
            <p className="text-sm mt-2">Complete courses to see your grades here</p>
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
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      {result.assignmentMarks !== null && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Assignment:</span>
                          <span>{result.assignmentMarks}%</span>
                        </div>
                      )}
                      {result.quizScore !== null && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Quiz:</span>
                          <span>{result.quizScore}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {result.totalMarks || 0}%
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getGradeColor(result.grade)}`}>
                      {result.grade || 'N/A'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Performance Tips */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Performance Tips</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Aim for consistent performance across all courses</li>
              <li>• Review feedback on assignments to improve</li>
              <li>• Participate actively in quizzes and lectures</li>
              <li>• Reach out to teachers for additional support if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
