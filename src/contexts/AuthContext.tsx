import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import authApi from "../api/authApi";
import type { User, AuthResponse } from "../services/api";
import setToken from "../services/api";
import { AppError, handleApiError, getErrorMessage } from "../utils/errorUtils";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setToken(token);
      } catch (err) {
        console.error("Failed to parse stored user data:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      if (!email || !password) {
        throw new AppError(
          "Email and password are required",
          "VALIDATION_ERROR",
          !email ? "email" : "password"
        );
      }

      const response = await authApi.login({ email, password });

      if (!response.token || !response.user) {
        throw new AppError(
          "Invalid response from server",
          "INVALID_RESPONSE",
          undefined,
          500
        );
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    } catch (err) {
      const appError = handleApiError(err);
      setError(getErrorMessage(appError));
      throw appError;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      isAuthenticated: Boolean(user),
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};
