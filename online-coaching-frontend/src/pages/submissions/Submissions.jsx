import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { submissionAPI, assignmentAPI, studentAPI } from '../../services/api';
import { 
  FileText, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Download,
  Edit,
  Star
} from 'lucide-react';

const Submissions = () => {
  const { courseId } = useParams();
  const { user, isTeacher, isStudent } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grading, setGrading] = useState(null);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchData();
  }, [courseId, user?.id]);

  const fetchData = async () => {
    try {
      if (isTeacher && courseId) {
        // Teacher viewing submissions for a specific course
        const assignmentsRes = await assignmentAPI.getCourseAssignments(courseId);
        const normalizedAssignments = (assignmentsRes.data || []).map((assignment) => ({
          ...assignment,
          assignmentId: assignment.assignmentId ?? assignment.id,
          title: assignment.title ?? assignment.name,
          totalMarks: assignment.totalMarks ?? assignment.maxMarks ?? 100,
        }));
        setAssignments(normalizedAssignments);
        
        const allSubmissions = await Promise.all(
          normalizedAssignments.map((assignment) =>
            submissionAPI.getAssignmentSubmissions(assignment.assignmentId)
          )
        );
        const normalizedSubmissions = allSubmissions.flatMap(res => (res.data || []).map((submission) => ({
          ...submission,
          submissionId: submission.submissionId ?? submission.id,
          assignmentId: submission.assignment?.assignmentId ?? submission.assignmentId,
          assignmentTitle: submission.assignment?.title ?? submission.assignmentName ?? 'Assignment',
          assignmentMaxMarks: submission.assignment?.totalMarks ?? submission.assignment?.maxMarks ?? 100,
          studentName: submission.student?.user?.name ?? submission.studentName,
          marksObtained: submission.marksObtained ?? submission.marks ?? null,
          feedback: submission.feedback ?? '',
          submissionDate: submission.submissionDate ?? submission.createdDate,
        })));
        setSubmissions(normalizedSubmissions);
      } else if (isStudent) {
        // Student viewing all their submissions - need to get studentId
        let studentId = user.id;
        try {
          const studentRes = await studentAPI.getStudentByUserId(user.id);
          studentId = studentRes.data.studentId;
          console.log('Student ID for submissions:', studentId);
        } catch (err) {
          console.log('Student record not found, using userId');
        }

        console.log('Fetching submissions for student ID:', studentId);
        const submissionsRes = await submissionAPI.getStudentSubmissions(studentId);
        console.log('Submissions response:', submissionsRes);
        console.log('Submissions data:', submissionsRes.data);
        const normalizedSubmissions = (submissionsRes.data || []).map((submission) => ({
          ...submission,
          submissionId: submission.submissionId ?? submission.id,
          assignmentId: submission.assignment?.assignmentId ?? submission.assignmentId,
          assignmentTitle: submission.assignment?.title ?? submission.assignmentName ?? 'Assignment',
          assignmentMaxMarks: submission.assignment?.totalMarks ?? submission.assignment?.maxMarks ?? 100,
          marksObtained: submission.marksObtained ?? submission.marks ?? null,
          feedback: submission.feedback ?? '',
          submissionDate: submission.submissionDate ?? submission.createdDate,
        }));
        setSubmissions(normalizedSubmissions);
      }
    } catch (err) {
      setError('Failed to load submissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (submissionId) => {
    if (!marks || !feedback) {
      setError('Please enter both marks and feedback');
      return;
    }

    setGrading(submissionId);
    setError('');
    try {
      await submissionAPI.gradeSubmission(submissionId, parseInt(marks), feedback);
      setMarks('');
      setFeedback('');
      showSuccess('Assignment evaluated successfully!');
      fetchData();
    } catch (err) {
      setError('Failed to grade submission');
      console.error('Failed to grade submission:', err);
    } finally {
      setGrading(null);
    }
  };

  const getSubmissionStatus = (submission) => {
    if (submission.marksObtained !== null && submission.feedback) {
      return { status: 'Evaluated', color: 'green' };
    }
    return { status: 'Submitted', color: 'yellow' };
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
        <h1 className="page-header">
          {isTeacher ? 'Student Submissions' : 'My Submissions'}
        </h1>
        <p className="text-gray-600">
          {isTeacher 
            ? 'Review and grade student assignment submissions' 
            : 'View your assignment submissions and grades'}
        </p>
      </div>


      {submissions.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No submissions yet</p>
          {isStudent && (
            <p className="text-sm mt-2">Submit your assignments to see them here</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const assignment = assignments.find(a => a.assignmentId === submission.assignmentId);
            const isGraded = submission.marksObtained !== null && submission.feedback !== null;
            
            return (
              <div key={submission.submissionId} className="card">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isGraded ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {isGraded ? (
                      <CheckCircle className="text-green-600" size={24} />
                    ) : (
                      <XCircle className="text-yellow-600" size={24} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        {isTeacher && (
                          <p className="text-sm text-gray-500 mb-1">
                            Student: {submission.studentName || 'Unknown'}
                          </p>
                        )}
                        <h3 className="font-semibold text-gray-900">
                          {submission.assignmentTitle || assignment?.title || 'Assignment'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                        </p>
                        
                        {submission.fileUrl && (
                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-2"
                          >
                            <Download size={16} />
                            View Submission
                          </a>
                        )}
                      </div>

                      {isGraded && (
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                            <Star size={20} />
                            {submission.marksObtained}/{submission.assignmentMaxMarks || assignment?.totalMarks || 100}
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Graded
                          </span>
                        </div>
                      )}
                    </div>

                    {isGraded && submission.feedback && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                        <p className="text-sm text-gray-600">{submission.feedback}</p>
                      </div>
                    )}

                    {isTeacher && !isGraded && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Grade Submission</h4>
                        <div className="flex gap-4">
                          <input
                            type="number"
                            min="0"
                            max={submission.assignmentMaxMarks || assignment?.totalMarks || 100}
                            value={marks}
                            onChange={(e) => setMarks(e.target.value)}
                            placeholder={`Max: ${submission.assignmentMaxMarks || assignment?.totalMarks || 100}`}
                            className="input-field w-32"
                          />
                          <input
                            type="text"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter feedback"
                            className="input-field flex-1"
                          />
                          <button
                            onClick={() => handleGrade(submission.submissionId)}
                            disabled={grading === submission.submissionId || !marks || !feedback}
                            className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {grading === submission.submissionId ? 'Grading...' : 'Submit Grade'}
                          </button>
                        </div>
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
  );
};

export default Submissions;
