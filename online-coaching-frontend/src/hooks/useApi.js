import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI, adminAPI, studentAPI, teacherAPI, courseAPI, enrollmentAPI, lectureAPI, assignmentAPI, quizAPI, messageAPI, materialAPI, submissionAPI, resultAPI } from '../services/api';
import toast from 'react-hot-toast';

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      const { token, role, id, name, email } = data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, role, name, email }));
      queryClient.invalidateQueries(['user']);
      toast.success('Login successful!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, type }) => type === 'student' ? authAPI.registerStudent(data) : authAPI.registerTeacher(data),
    onSuccess: (data) => {
      const { token, role, id, name, email } = data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, role, name, email }));
      queryClient.invalidateQueries(['user']);
      toast.success('Registration successful!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};

// Dashboard hooks
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminAPI.getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStudentDashboard = (studentId) => {
  return useQuery({
    queryKey: ['student', 'dashboard', studentId],
    queryFn: () => studentAPI.getStudentDashboard(studentId),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTeacherDashboard = (teacherId) => {
  return useQuery({
    queryKey: ['teacher', 'dashboard', teacherId],
    queryFn: () => teacherAPI.getTeacherDashboard(teacherId),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
};

// Course hooks
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: courseAPI.getAllCourses,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCourse = (courseId) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseAPI.getCourseById(courseId),
    enabled: !!courseId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseAPI.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      toast.success('Course created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create course');
    },
  });
};

// Enrollment hooks
export const useEnrollments = (studentId) => {
  return useQuery({
    queryKey: ['enrollments', studentId],
    queryFn: () => enrollmentAPI.getStudentEnrollments(studentId),
    enabled: !!studentId,
  });
};

export const useEnroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, courseId }) => enrollmentAPI.enrollStudent(studentId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries(['enrollments']);
      toast.success('Enrolled successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    },
  });
};

// Lecture hooks
export const useLectures = (courseId) => {
  return useQuery({
    queryKey: ['lectures', courseId],
    queryFn: () => lectureAPI.getCourseLectures(courseId),
    enabled: !!courseId,
  });
};

// Assignment hooks
export const useAssignments = (courseId) => {
  return useQuery({
    queryKey: ['assignments', courseId],
    queryFn: () => assignmentAPI.getCourseAssignments(courseId),
    enabled: !!courseId,
  });
};

// Quiz hooks
export const useQuizzes = (courseId) => {
  return useQuery({
    queryKey: ['quizzes', courseId],
    queryFn: () => quizAPI.getCourseQuizzes(courseId),
    enabled: !!courseId,
  });
};

// Message hooks
export const useInbox = (receiverId) => {
  return useQuery({
    queryKey: ['messages', 'inbox', receiverId],
    queryFn: () => messageAPI.getInbox(receiverId),
    enabled: !!receiverId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageAPI.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
    },
    onError: (error) => {
      toast.error('Failed to send message');
    },
  });
};

// Result hooks
export const useResults = (studentId) => {
  return useQuery({
    queryKey: ['results', studentId],
    queryFn: () => resultAPI.getStudentResults(studentId),
    enabled: !!studentId,
  });
};
