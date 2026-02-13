'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { logoutAction, getCurrentUserAction } from '@/app/actions/auth';
import { getClientApiClient } from '@/lib/api/client';
import type { paths } from '@/generated/api';

type LoginResponse = paths['/api/auth/login/']['post']['responses']['200']['content']['application/json'];

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, setUser, setIsLoading } = useAuthContext();

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUserAction();
      if (
        currentUser &&
        currentUser.id !== undefined &&
        currentUser.username !== undefined
      ) {
        setUser({
          id: currentUser.id,
          username: currentUser.username,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.warn('Error occurred while checking authentication status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setIsLoading]);

  const handleLogin = useCallback(async (username: string, password: string) => {
    try {
      const api = getClientApiClient();
      const { data, error } = await api.POST('/api/auth/login/', {
        body: {
          username,
          password,
        },
      });

      if (error || !data) {
        throw new Error('Login failed');
      }

      const response = data as LoginResponse;

      if (!response.success || response.user_id === undefined || !response.username) {
        throw new Error('Login failed');
      }

      const userData = {
        id: response.user_id,
        username: response.username,
      };
      setUser(userData);

      router.push('/project');
    } catch (error) {
      throw error;
    }
  }, [setUser, router]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.warn('Logout API error (ignored):', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  }, [setUser, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    checkAuth,
  };
}
