import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { firebaseAuthService } from '../services/firebaseAuthService';
import type { User, AuthContextType } from '../types/auth';

export function useAuth() {
  const context = useContext(AuthContext) as AuthContextType;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const handleAuthStateChange = useCallback((user: User | null) => {
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setCurrentUser(firebaseAuthService.getCurrentUser());
    const unsubscribe = firebaseAuthService.onAuthStateChanged(handleAuthStateChange);

    return () => unsubscribe();
  }, [handleAuthStateChange]);

  return {
    user: currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    ...context
  };
}