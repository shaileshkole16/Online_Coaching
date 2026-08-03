import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { useCallback } from 'react';

export const useAuth = () => {
  const auth = useAuthContext();

  const login = useCallback(async (credentials) => {
    const result = await auth.login(credentials);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result;
  }, [auth]);

  const registerStudent = useCallback(async (data) => {
    const result = await auth.registerStudent(data);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result;
  }, [auth]);

  const registerTeacher = useCallback(async (data) => {
    const result = await auth.registerTeacher(data);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result;
  }, [auth]);

  return {
    ...auth,
    login,
    registerStudent,
    registerTeacher,
  };
};
