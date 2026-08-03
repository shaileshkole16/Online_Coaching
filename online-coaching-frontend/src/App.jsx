import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import ManageStudents from './pages/admin/ManageStudents'
import ManageTeachers from './pages/admin/ManageTeachers'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import Progress from './pages/student/Progress'
import Announcements from './pages/student/Announcements'
import Certificates from './pages/student/Certificates'
import Attendance from './pages/student/Attendance'
import DiscussionForum from './pages/student/DiscussionForum'
import LiveClasses from './pages/student/LiveClasses'
import Wishlist from './pages/student/Wishlist'
import CourseRating from './pages/courses/CourseRating'
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
import Calendar from './pages/Calendar'
import Categories from './pages/Categories'
import Settings from './pages/Settings'
import SupportTickets from './pages/SupportTickets'
import CourseReviews from './pages/CourseReviews'
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
              <Route path="admin/analytics" element={<ProtectedRoute roles={['ADMIN']}><AdminAnalytics /></ProtectedRoute>} />
              <Route path="admin/students" element={<ProtectedRoute roles={['ADMIN']}><ManageStudents /></ProtectedRoute>} />
              <Route path="admin/teachers" element={<ProtectedRoute roles={['ADMIN']}><ManageTeachers /></ProtectedRoute>} />
              <Route path="admin/settings" element={<ProtectedRoute roles={['ADMIN']}><Settings /></ProtectedRoute>} />
              
              {/* Student Routes */}
              <Route path="student/dashboard" element={<ProtectedRoute roles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="student/profile" element={<ProtectedRoute roles={['STUDENT']}><StudentProfile /></ProtectedRoute>} />
              <Route path="student/progress" element={<ProtectedRoute roles={['STUDENT']}><Progress /></ProtectedRoute>} />
              <Route path="student/announcements" element={<ProtectedRoute roles={['STUDENT']}><Announcements /></ProtectedRoute>} />
              <Route path="student/certificates" element={<ProtectedRoute roles={['STUDENT']}><Certificates /></ProtectedRoute>} />
              <Route path="student/attendance" element={<ProtectedRoute roles={['STUDENT']}><Attendance /></ProtectedRoute>} />
              <Route path="student/forum" element={<ProtectedRoute roles={['STUDENT']}><DiscussionForum /></ProtectedRoute>} />
              <Route path="student/live-classes" element={<ProtectedRoute roles={['STUDENT']}><LiveClasses /></ProtectedRoute>} />
              <Route path="student/wishlist" element={<ProtectedRoute roles={['STUDENT']}><Wishlist /></ProtectedRoute>} />
              <Route path="student/courses" element={<ProtectedRoute roles={['STUDENT']}><CourseList /></ProtectedRoute>} />
              <Route path="student/courses/:id" element={<ProtectedRoute roles={['STUDENT']}><CourseDetail /></ProtectedRoute>} />
              <Route path="student/courses/:courseId/quiz/:quizId" element={<ProtectedRoute roles={['STUDENT']}><StudentQuiz /></ProtectedRoute>} />
              <Route path="student/courses/:courseId/assignments" element={<ProtectedRoute roles={['STUDENT']}><AssignmentList /></ProtectedRoute>} />
              <Route path="student/courses/:courseId/materials" element={<ProtectedRoute roles={['STUDENT']}><StudyMaterials /></ProtectedRoute>} />
              <Route path="student/courses/:courseId/lectures" element={<ProtectedRoute roles={['STUDENT']}><LectureList /></ProtectedRoute>} />
              <Route path="student/courses/:courseId/rating" element={<ProtectedRoute roles={['STUDENT']}><CourseRating /></ProtectedRoute>} />
              <Route path="student/messages" element={<ProtectedRoute roles={['STUDENT']}><Messages /></ProtectedRoute>} />
              <Route path="student/submissions" element={<ProtectedRoute roles={['STUDENT']}><Submissions /></ProtectedRoute>} />
              <Route path="student/courses/:courseId/submissions" element={<ProtectedRoute roles={['STUDENT']}><Submissions /></ProtectedRoute>} />
              <Route path="student/results" element={<ProtectedRoute roles={['STUDENT']}><Results /></ProtectedRoute>} />
              <Route path="student/settings" element={<ProtectedRoute roles={['STUDENT']}><Settings /></ProtectedRoute>} />
              
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
              <Route path="teacher/messages" element={<ProtectedRoute roles={['TEACHER']}><Messages /></ProtectedRoute>} />
              <Route path="teacher/settings" element={<ProtectedRoute roles={['TEACHER']}><Settings /></ProtectedRoute>} />
              
              {/* Shared Routes */}
              <Route path="calendar" element={<ProtectedRoute roles={['STUDENT', 'TEACHER', 'ADMIN']}><Calendar /></ProtectedRoute>} />
              <Route path="categories" element={<ProtectedRoute roles={['STUDENT', 'TEACHER', 'ADMIN']}><Categories /></ProtectedRoute>} />
              <Route path="support-tickets" element={<ProtectedRoute roles={['STUDENT', 'TEACHER', 'ADMIN']}><SupportTickets /></ProtectedRoute>} />
              <Route path="course-reviews" element={<ProtectedRoute roles={['STUDENT', 'TEACHER', 'ADMIN']}><CourseReviews /></ProtectedRoute>} />
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
