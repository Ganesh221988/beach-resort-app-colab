import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'owner' | 'broker';
  }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  switchRole: (role: 'admin' | 'owner' | 'broker' | 'customer') => void;
  sendPasswordReset: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const switchRole = (role: 'admin' | 'owner' | 'broker' | 'customer') => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const result = await authService.signin({ email, password });
      
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      } else {
        console.error('Login failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'owner' | 'broker';
  }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const result = await authService.signup(userData);
      
      if (result.success) {
        return true;
      } else {
        console.error('Signup failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    try {
      const result = await authService.sendPasswordReset(email);
      return result.success;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isLoading,
      switchRole,
      sendPasswordReset
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}