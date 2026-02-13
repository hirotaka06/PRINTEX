'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getCurrentUserAction } from '@/app/actions/auth';

type User = {
  id: number;
  username: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        setUser,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}
