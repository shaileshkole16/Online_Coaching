import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Android emulator
// const API_BASE_URL = 'http://10.0.2.2:8080/api';
// For iOS simulator
// const API_BASE_URL = 'http://localhost:8080/api';
// For real device - use your computer's IP
const API_BASE_URL = 'http://192.168.1.5:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.multiRemove(['token', 'user']);
      } catch (err) {
        console.log('Error clearing storage:', err);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  registerStudent: (data) => api.post('/auth/register/student', data),
  registerTeacher: (data) => api.post('/auth/register/teacher', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
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
    return AsyncStorage.getItem('token').then(token => {
      if (token) {
        materialApi.defaults.headers.Authorization = `Bearer ${token}`;
      }
      return materialApi.post('/materials/upload', formData);
    });
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
    return AsyncStorage.getItem('token').then(token => {
      if (token) {
        uploadApi.defaults.headers.Authorization = `Bearer ${token}`;
      }
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name || 'profile.jpg',
      });
      return uploadApi.post('/upload/profile', formData);
    });
  },
  uploadVideo: (file) => {
    const uploadApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return AsyncStorage.getItem('token').then(token => {
      if (token) {
        uploadApi.defaults.headers.Authorization = `Bearer ${token}`;
      }
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name || 'video.mp4',
      });
      return uploadApi.post('/upload/video', formData);
    });
  },
  uploadAssignment: (file) => {
    const uploadApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return AsyncStorage.getItem('token').then(token => {
      if (token) {
        uploadApi.defaults.headers.Authorization = `Bearer ${token}`;
      }
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name || 'assignment.pdf',
      });
      return uploadApi.post('/upload/assignment', formData);
    });
  },
};

export default api;
