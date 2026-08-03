import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI, studentAPI, teacherAPI, courseAPI, enrollmentAPI } from '../services/api';

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: authAPI.login,
  });
};

// Student hooks
export const useStudentDashboard = (studentId) => {
  return useQuery({
    queryKey: ['studentDashboard', studentId],
    queryFn: () => studentAPI.getStudentDashboard(studentId),
    enabled: !!studentId,
  });
};

export const useStudentEnrollments = (studentId) => {
  return useQuery({
    queryKey: ['studentEnrollments', studentId],
    queryFn: () => enrollmentAPI.getStudentEnrollments(studentId),
    enabled: !!studentId,
  });
};

// Teacher hooks
export const useTeacherDashboard = (teacherId) => {
  return useQuery({
    queryKey: ['teacherDashboard', teacherId],
    queryFn: () => teacherAPI.getTeacherDashboard(teacherId),
    enabled: !!teacherId,
  });
};

export const useTeacherCourses = (teacherId) => {
  return useQuery({
    queryKey: ['teacherCourses', teacherId],
    queryFn: () => courseAPI.getCoursesByTeacher(teacherId),
    enabled: !!teacherId,
  });
};

// Course hooks
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: courseAPI.getAllCourses,
  });
};

export const useCourse = (courseId) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseAPI.getCourseById(courseId),
    enabled: !!courseId,
  });
};

// Enrollment hooks
export const useEnrollStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ studentId, courseId }) => 
      enrollmentAPI.enrollStudent(studentId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries(['studentEnrollments']);
      queryClient.invalidateQueries(['courses']);
    },
  });
};
