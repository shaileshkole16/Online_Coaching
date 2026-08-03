import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  registerStudent: (data) => api.post('/auth/register/student', data),
  registerTeacher: (data) => api.post('/auth/register/teacher', data),
  registerAdmin: (data) => api.post('/auth/register/admin', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Payment API
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (orderId, paymentId, signature) => 
    api.post('/payments/verify', null, { params: { orderId, paymentId, signature } }),
  processRefund: (paymentId) => api.post(`/payments/refund/${paymentId}`),
  getPaymentStatus: (paymentId) => api.get(`/payments/status/${paymentId}`),
};

// Analytics API
export const analyticsAPI = {
  trackEvent: (data) => api.post('/analytics/track', data),
  getEventsBySession: (sessionId) => api.get(`/analytics/session/${sessionId}`),
  getUserAnalytics: (userId) => api.get(`/analytics/user/${userId}`),
  getEventsByName: (eventName) => api.get(`/analytics/event/${eventName}`),
  getAnalyticsSummary: () => api.get('/analytics/summary'),
  getEventsInDateRange: (start, end) => api.get('/analytics/range', { params: { start, end } }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: () => api.get('/admin/analytics'),
  getAllStudents: () => api.get('/admin/students'),
  getAllTeachers: () => api.get('/admin/teachers'),
  blockStudent: (id) => api.delete(`/admin/block/student/${id}`),
  blockTeacher: (id) => api.delete(`/admin/block/teacher/${id}`),
};

// Student API
export const studentAPI = {
  getAllStudents: () => api.get('/students'),
  getStudentById: (id) => api.get(`/students/${id}`),
  getStudentByUserId: (userId) => api.get(`/students/user/${userId}`),
  updateStudent: (id, data) => api.put(`/students/update/${id}`, data),
  deleteStudent: (id) => api.delete(`/students/delete/${id}`),
  getStudentDashboard: (id) => api.get(`/students/dashboard/${id}`),
};

// Teacher API
export const teacherAPI = {
  getAllTeachers: () => api.get('/teachers'),
  getTeacherById: (id) => api.get(`/teachers/${id}`),
  getTeacherByUserId: (userId) => api.get(`/teachers/user/${userId}`),
  updateTeacher: (id, data) => api.put(`/teachers/update/${id}`, data),
  deleteTeacher: (id) => api.delete(`/teachers/delete/${id}`),
  getTeacherDashboard: (id) => api.get(`/teachers/dashboard/${id}`),
};

// Course API
export const courseAPI = {
  createCourse: (data) => api.post('/courses/create', data),
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  getCoursesByTeacher: (teacherId) => api.get(`/courses/teacher/${teacherId}`),
  updateCourse: (id, data) => api.put(`/courses/update/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/delete/${id}`),
};

// Enrollment API
export const enrollmentAPI = {
  enrollStudent: (studentId, courseId) => 
    api.post('/enrollments/enroll', null, { params: { studentId, courseId } }),
  getStudentEnrollments: (studentId) => api.get(`/enrollments/student/${studentId}`),
  getCourseStudents: (courseId) => api.get(`/enrollments/course/${courseId}`),
  cancelEnrollment: (id) => api.delete(`/enrollments/cancel/${id}`),
  getEnrollmentById: (id) => api.get(`/enrollments/${id}`),
};

// Lecture API
export const lectureAPI = {
  createLecture: (data) => api.post('/lectures/create', data),
  getCourseLectures: (courseId) => api.get(`/lectures/course/${courseId}`),
  getLectureById: (id) => api.get(`/lectures/${id}`),
  updateLecture: (id, data) => api.put(`/lectures/update/${id}`, data),
  deleteLecture: (id) => api.delete(`/lectures/delete/${id}`),
};

// Assignment API
export const assignmentAPI = {
  createAssignment: (data) => api.post('/assignments/create', data),
  getCourseAssignments: (courseId) => api.get(`/assignments/course/${courseId}`),
  getAssignmentById: (id) => api.get(`/assignments/${id}`),
  updateAssignment: (id, data) => api.put(`/assignments/update/${id}`, data),
  deleteAssignment: (id) => api.delete(`/assignments/delete/${id}`),
};

// Quiz API
export const quizAPI = {
  createQuiz: (data) => api.post('/quiz/create', data),
  getCourseQuizzes: (courseId) => api.get(`/quiz/course/${courseId}`),
  getQuizById: (id) => api.get(`/quiz/${id}`),
  updateQuiz: (id, data) => api.put(`/quiz/update/${id}`, data),
  deleteQuiz: (id) => api.delete(`/quiz/delete/${id}`),
  submitQuiz: (data) => api.post('/quiz/submit', data),
  checkQuizAttempt: (quizId, studentId) => api.get(`/quiz/check-attempt/${quizId}/${studentId}`),
  getStudentQuizSubmission: (quizId, studentId) => api.get(`/quiz/submission/${quizId}/${studentId}`),
};

// Quiz Submission API
export const quizSubmissionAPI = {
  getQuizSubmissions: (quizId) => api.get(`/quiz-submissions/quiz/${quizId}`),
  getStudentQuizSubmissions: (studentId) => api.get(`/quiz-submissions/student/${studentId}`),
  getCourseQuizSubmissions: (courseId) => api.get(`/quiz/submissions/course/${courseId}`),
  getQuizSubmissionById: (id) => api.get(`/quiz-submissions/${id}`),
};

// Message API
export const messageAPI = {
  sendMessage: (data) => api.post('/messages/send', data),
  getInbox: (receiverId) => api.get(`/messages/inbox/${receiverId}`),
  getConversation: (senderId, receiverId) => 
    api.get('/messages/conversation', { params: { senderId, receiverId } }),
  deleteMessage: (id) => api.delete(`/messages/delete/${id}`),
};

// Study Material API
export const materialAPI = {
  uploadMaterial: (formData) => {
    const materialApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const token = localStorage.getItem('token');
    if (token) {
      materialApi.defaults.headers.Authorization = `Bearer ${token}`;
    }
    return materialApi.post('/materials/upload', formData);
  },
  getCourseMaterials: (courseId) => api.get(`/materials/course/${courseId}`),
  downloadMaterial: (materialId) => api.get(`/materials/download/${materialId}`, {
    responseType: 'blob',
  }),
  deleteMaterial: (materialId) => api.delete(`/materials/delete/${materialId}`),
};

// Submission API
export const submissionAPI = {
  submitAssignment: (assignmentId, studentId, fileUrl) => 
    api.post('/submissions/submit', null, { params: { assignmentId, studentId, fileUrl } }),
  getStudentSubmissions: (studentId) => api.get(`/submissions/student/${studentId}`),
  getAssignmentSubmissions: (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`),
  gradeSubmission: (submissionId, marks, feedback) => 
    api.put(`/submissions/grade/${submissionId}`, null, { params: { marks, feedback } }),
  getSubmissionById: (id) => api.get(`/submissions/${id}`),
};

// Result API
export const resultAPI = {
  generateResult: (studentId, courseId, totalMarks, grade) => 
    api.post('/results/generate', null, { params: { studentId, courseId, totalMarks, grade } }),
  getStudentResults: (studentId) => api.get(`/results/student/${studentId}`),
  getCourseResults: (courseId) => api.get(`/results/course/${courseId}`),
  getResultById: (id) => api.get(`/results/${id}`),
  updateResult: (resultId, totalMarks, grade) => 
    api.put(`/results/update/${resultId}`, null, { params: { totalMarks, grade } }),
  deleteResult: (resultId) => api.delete(`/results/delete/${resultId}`),
};

// Rating API
export const ratingAPI = {
  submitRating: (data) => api.post('/ratings/submit', data),
  getTeacherRatings: (teacherId) => api.get(`/ratings/teacher/${teacherId}`),
  getStudentRatingForTeacher: (studentId, teacherId) => api.get(`/ratings/student/${studentId}/teacher/${teacherId}`),
  getAverageRating: (teacherId) => api.get(`/ratings/teacher/${teacherId}/average`),
  updateRating: (ratingId, data) => api.put(`/ratings/update/${ratingId}`, data),
  deleteRating: (ratingId) => api.delete(`/ratings/delete/${ratingId}`),
};

// Course Rating API
export const courseRatingAPI = {
  submitRating: (data) => api.post('/course-ratings/submit', data),
  getCourseRatings: (courseId) => api.get(`/course-ratings/course/${courseId}`),
  getStudentRatingForCourse: (studentId, courseId) => api.get(`/course-ratings/student/${studentId}/course/${courseId}`),
  getAverageRating: (courseId) => api.get(`/course-ratings/course/${courseId}/average`),
  getTeacherCourseRatings: (teacherId) => api.get(`/course-ratings/teacher/${teacherId}`),
  updateRating: (ratingId, data) => api.put(`/course-ratings/update/${ratingId}`, data),
  deleteRating: (ratingId) => api.delete(`/course-ratings/delete/${ratingId}`),
};

// File Upload API
export const uploadAPI = {
  uploadProfile: (file) => {
    const uploadApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const token = localStorage.getItem('token');
    if (token) {
      uploadApi.defaults.headers.Authorization = `Bearer ${token}`;
    }
    const formData = new FormData();
    formData.append('file', file);
    return uploadApi.post('/upload/profile', formData);
  },
  uploadVideo: (file) => {
    const uploadApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const token = localStorage.getItem('token');
    if (token) {
      uploadApi.defaults.headers.Authorization = `Bearer ${token}`;
    }
    const formData = new FormData();
    formData.append('file', file);
    return uploadApi.post('/upload/video', formData);
  },
  uploadAssignment: (file) => {
    const uploadApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const token = localStorage.getItem('token');
    if (token) {
      uploadApi.defaults.headers.Authorization = `Bearer ${token}`;
    }
    const formData = new FormData();
    formData.append('file', file);
    return uploadApi.post('/upload/assignment', formData);
  },
};

// Phase 1: Critical Features

// Student Progress API
export const studentProgressAPI = {
  updateProgress: (data) => api.post('/student-progress/update', data),
  getProgress: (studentId, courseId) => api.get(`/student-progress/student/${studentId}/course/${courseId}`),
  getStudentProgress: (studentId) => api.get(`/student-progress/student/${studentId}`),
  getCourseProgress: (courseId) => api.get(`/student-progress/course/${courseId}`),
  markComplete: (data) => api.post('/student-progress/mark-complete', data),
  bookmarkLecture: (data) => api.post('/student-progress/bookmark', data),
  removeBookmark: (data) => api.delete('/student-progress/bookmark', { params: data }),
};

// Announcement API
export const announcementAPI = {
  createAnnouncement: (data) => api.post('/announcements/create', data),
  updateAnnouncement: (announcementId, data) => api.put(`/announcements/${announcementId}`, data),
  getAnnouncement: (announcementId) => api.get(`/announcements/${announcementId}`),
  getCourseAnnouncements: (courseId) => api.get(`/announcements/course/${courseId}`),
  getTeacherAnnouncements: (teacherId) => api.get(`/announcements/teacher/${teacherId}`),
  getAdminAnnouncements: () => api.get('/announcements/admin'),
  getStudentAnnouncements: (studentId) => api.get(`/announcements/student/${studentId}`),
  markAsRead: (announcementId, studentId) => api.post(`/announcements/${announcementId}/mark-read`, null, { params: { studentId } }),
  deleteAnnouncement: (announcementId) => api.delete(`/announcements/${announcementId}`),
};

// Certificate API
export const certificateAPI = {
  issueCertificate: (data) => api.post('/certificates/issue', data),
  updateCertificate: (certificateId, data) => api.put(`/certificates/${certificateId}`, data),
  getCertificate: (certificateId) => api.get(`/certificates/${certificateId}`),
  getCertificateByNumber: (certificateNumber) => api.get(`/certificates/number/${certificateNumber}`),
  verifyCertificate: (verificationCode) => api.get(`/certificates/verify/${verificationCode}`),
  getStudentCertificates: (studentId) => api.get(`/certificates/student/${studentId}`),
  getCourseCertificates: (courseId) => api.get(`/certificates/course/${courseId}`),
  revokeCertificate: (certificateId) => api.post(`/certificates/${certificateId}/revoke`),
  deleteCertificate: (certificateId) => api.delete(`/certificates/${certificateId}`),
};

// Phase 2: Important Features

// Calendar Event API
export const calendarEventAPI = {
  createEvent: (data) => api.post('/calendar-events/create', data),
  updateEvent: (eventId, data) => api.put(`/calendar-events/${eventId}`, data),
  getEvent: (eventId) => api.get(`/calendar-events/${eventId}`),
  getUserEvents: (userId) => api.get(`/calendar-events/user/${userId}`),
  getUserEventsByRange: (userId, start, end) => api.get(`/calendar-events/user/${userId}/range`, { params: { start, end } }),
  getUpcomingEvents: (userId) => api.get(`/calendar-events/user/${userId}/upcoming`),
  getCourseEvents: (courseId) => api.get(`/calendar-events/course/${courseId}`),
  deleteEvent: (eventId) => api.delete(`/calendar-events/${eventId}`),
};

// Discussion Forum API
export const discussionForumAPI = {
  createForum: (data) => api.post('/discussion-forum/create', data),
  updateForum: (forumId, data) => api.put(`/discussion-forum/${forumId}`, data),
  getForum: (forumId) => api.get(`/discussion-forum/${forumId}`),
  getCourseForums: (courseId) => api.get(`/discussion-forum/course/${courseId}`),
  getStudentForums: (studentId) => api.get(`/discussion-forum/student/${studentId}`),
  getTeacherForums: (teacherId) => api.get(`/discussion-forum/teacher/${teacherId}`),
  createReply: (data) => api.post('/discussion-forum/reply', data),
  acceptAnswer: (replyId) => api.post(`/discussion-forum/reply/${replyId}/accept`),
  getForumReplies: (forumId) => api.get(`/discussion-forum/${forumId}/replies`),
  deleteForum: (forumId) => api.delete(`/discussion-forum/${forumId}`),
  deleteReply: (replyId) => api.delete(`/discussion-forum/reply/${replyId}`),
};

// Attendance API
export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance/mark', data),
  updateAttendance: (attendanceId, data) => api.put(`/attendance/${attendanceId}`, data),
  getAttendance: (attendanceId) => api.get(`/attendance/${attendanceId}`),
  getStudentAttendance: (studentId) => api.get(`/attendance/student/${studentId}`),
  getCourseAttendance: (courseId) => api.get(`/attendance/course/${courseId}`),
  getStudentCourseAttendance: (studentId, courseId) => api.get(`/attendance/student/${studentId}/course/${courseId}`),
  markBulkAttendance: (data) => api.post('/attendance/bulk', data),
  deleteAttendance: (attendanceId) => api.delete(`/attendance/${attendanceId}`),
};

// Phase 3: Enhancement Features

// Category API
export const categoryAPI = {
  createCategory: (data) => api.post('/categories/create', data),
  updateCategory: (categoryId, data) => api.put(`/categories/${categoryId}`, data),
  getCategory: (categoryId) => api.get(`/categories/${categoryId}`),
  getAllCategories: () => api.get('/categories'),
  getSubcategories: (parentCategoryId) => api.get(`/categories/${parentCategoryId}/subcategories`),
  assignToCategory: (data) => api.post('/categories/assign', data),
  removeFromCategory: (data) => api.delete('/categories/remove', { params: data }),
  deleteCategory: (categoryId) => api.delete(`/categories/${categoryId}`),
};

// Support Ticket API
export const supportTicketAPI = {
  createTicket: (data) => api.post('/support-tickets/create', data),
  updateTicket: (ticketId, data) => api.put(`/support-tickets/${ticketId}`, data),
  getTicket: (ticketId) => api.get(`/support-tickets/${ticketId}`),
  getTicketByNumber: (ticketNumber) => api.get(`/support-tickets/number/${ticketNumber}`),
  getUserTickets: (userId) => api.get(`/support-tickets/user/${userId}`),
  getOpenTickets: () => api.get('/support-tickets/open'),
  getResolvedTickets: () => api.get('/support-tickets/resolved'),
  getAllTickets: () => api.get('/support-tickets'),
  deleteTicket: (ticketId) => api.delete(`/support-tickets/${ticketId}`),
};

// User Settings API
export const userSettingsAPI = {
  createSettings: (data) => api.post('/user-settings/create', data),
  updateSettings: (settingsId, data) => api.put(`/user-settings/${settingsId}`, data),
  getUserSettings: (userId) => api.get(`/user-settings/user/${userId}`),
  deleteSettings: (settingsId) => api.delete(`/user-settings/${settingsId}`),
};

// Phase 4: Optional Features

// Course Review API
export const courseReviewAPI = {
  createReview: (data) => api.post('/course-reviews/create', data),
  updateReview: (reviewId, data) => api.put(`/course-reviews/${reviewId}`, data),
  getReview: (reviewId) => api.get(`/course-reviews/${reviewId}`),
  getCourseReviews: (courseId) => api.get(`/course-reviews/course/${courseId}`),
  verifyReview: (reviewId) => api.post(`/course-reviews/${reviewId}/verify`),
  markHelpful: (reviewId) => api.post(`/course-reviews/${reviewId}/helpful`),
  deleteReview: (reviewId) => api.delete(`/course-reviews/${reviewId}`),
  getAverageRating: (courseId) => api.get(`/course-reviews/course/${courseId}/average-rating`),
  getReviewCount: (courseId) => api.get(`/course-reviews/course/${courseId}/count`),
};

// Live Class API
export const liveClassAPI = {
  createLiveClass: (data) => api.post('/live-classes/create', data),
  updateLiveClass: (liveClassId, data) => api.put(`/live-classes/${liveClassId}`, data),
  getLiveClass: (liveClassId) => api.get(`/live-classes/${liveClassId}`),
  getCourseLiveClasses: (courseId) => api.get(`/live-classes/course/${courseId}`),
  getTeacherLiveClasses: (teacherId) => api.get(`/live-classes/teacher/${teacherId}`),
  getUpcomingClasses: () => api.get('/live-classes/upcoming'),
  getUpcomingCourseClasses: (courseId) => api.get(`/live-classes/course/${courseId}/upcoming`),
  startLiveClass: (liveClassId) => api.post(`/live-classes/${liveClassId}/start`),
  endLiveClass: (liveClassId) => api.post(`/live-classes/${liveClassId}/end`),
  cancelLiveClass: (liveClassId) => api.post(`/live-classes/${liveClassId}/cancel`),
  joinLiveClass: (liveClassId) => api.post(`/live-classes/${liveClassId}/join`),
  leaveLiveClass: (liveClassId) => api.post(`/live-classes/${liveClassId}/leave`),
  deleteLiveClass: (liveClassId) => api.delete(`/live-classes/${liveClassId}`),
};

// Push Subscription API
export const pushSubscriptionAPI = {
  createSubscription: (data) => api.post('/push-subscriptions/create', data),
  updateSubscription: (subscriptionId, data) => api.put(`/push-subscriptions/${subscriptionId}`, data),
  getSubscription: (subscriptionId) => api.get(`/push-subscriptions/${subscriptionId}`),
  getUserSubscriptions: (userId) => api.get(`/push-subscriptions/user/${userId}`),
  getActiveSubscriptions: () => api.get('/push-subscriptions/active'),
  deactivateSubscription: (subscriptionId) => api.post(`/push-subscriptions/${subscriptionId}/deactivate`),
  updateLastUsed: (subscriptionId) => api.post(`/push-subscriptions/${subscriptionId}/update-last-used`),
  deleteSubscription: (subscriptionId) => api.delete(`/push-subscriptions/${subscriptionId}`),
};

// Wishlist API
export const wishlistAPI = {
  addToWishlist: (data) => api.post('/wishlist/add', data),
  getWishlistItem: (wishlistId) => api.get(`/wishlist/${wishlistId}`),
  getStudentWishlist: (studentId) => api.get(`/wishlist/student/${studentId}`),
  getCourseWishlist: (courseId) => api.get(`/wishlist/course/${courseId}`),
  removeFromWishlist: (data) => api.delete('/wishlist/remove', { params: data }),
  deleteWishlistItem: (wishlistId) => api.delete(`/wishlist/${wishlistId}`),
};

// Audit Log API
export const auditLogAPI = {
  createLog: (data) => api.post('/audit-logs/create', data),
  getUserLogs: (userId) => api.get(`/audit-logs/user/${userId}`),
  getActionLogs: (action) => api.get(`/audit-logs/action/${action}`),
  getEntityLogs: (entityType) => api.get(`/audit-logs/entity/${entityType}`),
  getDateRangeLogs: (start, end) => api.get('/audit-logs/range', { params: { start, end } }),
  getAllLogs: () => api.get('/audit-logs'),
};

// Fix partially implemented APIs

// Enhanced Assignment API
export const enhancedAssignmentAPI = {
  ...assignmentAPI,
  getStudentCourseAssignments: (courseId, studentId) => api.get(`/assignments/course/${courseId}/student/${studentId}`),
};

// Enhanced Quiz API
export const enhancedQuizAPI = {
  ...quizAPI,
  deleteQuiz: (quizId) => api.delete(`/quiz/delete/${quizId}`),
  getQuizSubmissions: (quizId) => api.get(`/quiz/submissions/quiz/${quizId}`),
};

export default api;
