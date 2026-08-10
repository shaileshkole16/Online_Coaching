import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminTickets from './pages/admin/AdminTickets'
import ManageStudents from './pages/admin/ManageStudents'
import ManageTeachers from './pages/admin/ManageTeachers'
import AdminAuditLogs from './pages/admin/AdminAuditLogs'
import ManageCourses from './pages/admin/ManageCourses'
import EnrollmentManagement from './pages/admin/EnrollmentManagement'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import SupportTickets from './pages/student/SupportTickets'
import CourseRating from './pages/courses/CourseRating'
import AIChat from './pages/ai/AIChat'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherProfile from './pages/teacher/TeacherProfile'
import TeacherCourseRatings from './pages/teacher/TeacherCourseRatings'
import CourseList from './pages/courses/CourseList'
import CourseDetail from './pages/courses/CourseDetail'
import CreateCourse from './pages/courses/CreateCourse'
import EditCourse from './pages/courses/EditCourse'
import CourseStudents from './pages/courses/CourseStudents'
import LectureList from './pages/lectures/LectureList'
import AssignmentList from './pages/assignments/AssignmentList'
import QuizList from './pages/quizzes/QuizList'
import StudentQuiz from './pages/quizzes/StudentQuiz'
import QuizSubmissions from './pages/quizzes/QuizSubmissions'
import Messages from './pages/messages/Messages'
import StudyMaterials from './pages/materials/StudyMaterials'
import Submissions from './pages/submissions/Submissions'
import Results from './pages/results/Results'
import ManageResults from './pages/results/ManageResults'
import Settings from './pages/Settings'
import DiscussionForum from './pages/student/DiscussionForum'
import TeacherDiscussionForum from './pages/teacher/TeacherDiscussionForum'
import CoursePreview from './pages/courses/CoursePreview'
import CourseHome from './pages/courses/CourseHome'
import EnrollmentSuccess from './pages/courses/EnrollmentSuccess'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/login" replace />} />
              
              {/* Admin Routes */}
              <Route path="admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="admin/tickets" element={<ProtectedRoute roles={['ADMIN']}><AdminTickets /></ProtectedRoute>} />
              <Route path="admin/students" element={<ProtectedRoute roles={['ADMIN']}><ManageStudents /></ProtectedRoute>} />
              <Route path="admin/teachers" element={<ProtectedRoute roles={['ADMIN']}><ManageTeachers /></ProtectedRoute>} />
              <Route path="admin/courses" element={<ProtectedRoute roles={['ADMIN']}><ManageCourses /></ProtectedRoute>} />
              <Route path="admin/enrollments" element={<ProtectedRoute roles={['ADMIN']}><EnrollmentManagement /></ProtectedRoute>} />
              <Route path="admin/audit-logs" element={<ProtectedRoute roles={['ADMIN']}><AdminAuditLogs /></ProtectedRoute>} />
              <Route path="admin/ai-chat" element={<ProtectedRoute roles={['ADMIN']}><AIChat /></ProtectedRoute>} />
              
              {/* Student Routes */}
              <Route path="student/dashboard" element={<ProtectedRoute roles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="student/profile" element={<ProtectedRoute roles={['STUDENT']}><StudentProfile /></ProtectedRoute>} />
              <Route path="student/courses" element={<ProtectedRoute roles={['STUDENT']}><CourseList /></ProtectedRoute>} />
              <Route path="student/courses/:id/preview" element={<ProtectedRoute roles={['STUDENT']}><CoursePreview /></ProtectedRoute>} />
              <Route path="student/courses/:id/success" element={<ProtectedRoute roles={['STUDENT']}><EnrollmentSuccess /></ProtectedRoute>} />
              <Route path="student/courses/:id/home" element={<ProtectedRoute roles={['STUDENT']}><CourseHome /></ProtectedRoute>} />
              <Route path="student/courses/:id" element={<ProtectedRoute roles={['STUDENT']}><CourseDetail /></ProtectedRoute>} />
              <Route path="student/courses/:courseId/quiz/:quizId" element={<ProtectedRoute roles={['STUDENT']}><StudentQuiz /></ProtectedRoute>} />
              <Route path="student/courses/:courseId/assignments" element={<ProtectedRoute roles={['STUDENT']}><AssignmentList /></ProtectedRoute>} />
              <Route path="student/courses/:courseId/materials" element={<ProtectedRoute roles={['STUDENT']}><StudyMaterials /></ProtectedRoute>} />
              <Route path="student/courses/:courseId/lectures" element={<ProtectedRoute roles={['STUDENT']}><LectureList /></ProtectedRoute>} />
              <Route path="student/courses/:courseId/rating" element={<ProtectedRoute roles={['STUDENT']}><CourseRating /></ProtectedRoute>} />
              <Route path="student/forum" element={<ProtectedRoute roles={['STUDENT']}><DiscussionForum /></ProtectedRoute>} />
              <Route path="student/ai-chat" element={<ProtectedRoute roles={['STUDENT']}><AIChat /></ProtectedRoute>} />
              <Route path="student/support" element={<ProtectedRoute roles={['STUDENT']}><SupportTickets /></ProtectedRoute>} />
              <Route path="student/submissions" element={<ProtectedRoute roles={['STUDENT']}><Submissions /></ProtectedRoute>} />
              <Route path="student/courses/:courseId/submissions" element={<ProtectedRoute roles={['STUDENT']}><Submissions /></ProtectedRoute>} />
              <Route path="student/results" element={<ProtectedRoute roles={['STUDENT']}><Results /></ProtectedRoute>} />
              
              {/* Teacher Routes */}
              <Route path="teacher/dashboard" element={<ProtectedRoute roles={['TEACHER']}><TeacherDashboard /></ProtectedRoute>} />
              <Route path="teacher/profile" element={<ProtectedRoute roles={['TEACHER']}><TeacherProfile /></ProtectedRoute>} />
              <Route path="teacher/ratings" element={<ProtectedRoute roles={['TEACHER']}><TeacherCourseRatings /></ProtectedRoute>} />
              <Route path="teacher/courses" element={<ProtectedRoute roles={['TEACHER']}><CourseList /></ProtectedRoute>} />
              <Route path="teacher/courses/create" element={<ProtectedRoute roles={['TEACHER']}><CreateCourse /></ProtectedRoute>} />
              <Route path="teacher/courses/:id" element={<ProtectedRoute roles={['TEACHER']}><CourseDetail /></ProtectedRoute>} />
              <Route path="teacher/courses/:id/edit" element={<ProtectedRoute roles={['TEACHER']}><EditCourse /></ProtectedRoute>} />
              <Route path="teacher/courses/:courseId/students" element={<ProtectedRoute roles={['TEACHER']}><CourseStudents /></ProtectedRoute>} />
              <Route path="teacher/courses/:courseId/lectures" element={<ProtectedRoute roles={['TEACHER']}><LectureList /></ProtectedRoute>} />
              <Route path="teacher/courses/:courseId/assignments" element={<ProtectedRoute roles={['TEACHER']}><AssignmentList /></ProtectedRoute>} />
              <Route path="teacher/courses/:courseId/quizzes" element={<ProtectedRoute roles={['TEACHER']}><QuizList /></ProtectedRoute>} />
              <Route path="teacher/courses/:courseId/quiz-submissions" element={<ProtectedRoute roles={['TEACHER']}><QuizSubmissions /></ProtectedRoute>} />
              <Route path="teacher/courses/:courseId/materials" element={<ProtectedRoute roles={['TEACHER']}><StudyMaterials /></ProtectedRoute>} />
              <Route path="teacher/courses/:courseId/submissions" element={<ProtectedRoute roles={['TEACHER']}><Submissions /></ProtectedRoute>} />
              <Route path="teacher/courses/:courseId/results" element={<ProtectedRoute roles={['TEACHER']}><ManageResults /></ProtectedRoute>} />
              <Route path="teacher/forum" element={<ProtectedRoute roles={['TEACHER']}><TeacherDiscussionForum /></ProtectedRoute>} />
              <Route path="teacher/ai-chat" element={<ProtectedRoute roles={['TEACHER']}><AIChat /></ProtectedRoute>} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
