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

  const register = useCallback(async (userData, userType) => {
    const result = await auth.register(userData, userType);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result;
  }, [auth]);

  return {
    ...auth,
    login,
    register,
  };
};
