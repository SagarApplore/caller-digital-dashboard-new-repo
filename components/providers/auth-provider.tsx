"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  AuthToken,
  isAuthenticated,
  getUserData,
  getAuthToken,
  setAuthToken,
  setUserData,
  removeAuthToken,
  removeUserData,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
  updateToken: (token: AuthToken) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<AuthToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (isAuthenticated()) {
          const userData = getUserData();
          const tokenData = getAuthToken();

          if (userData && tokenData) {
            setUser(userData);
            setToken(tokenData);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid data
        removeAuthToken();
        removeUserData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      // TODO: Replace with your actual backend API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, rememberMe })
      // });

      // For demo purposes, simulate a successful login
      // Remove this when you implement actual backend integration
      const mockUser: User = {
        id: "1",
        email: email,
        name: "Demo User",
        role: "admin",
      };

      const mockToken: AuthToken = {
        accessToken: "mock-access-token-" + Date.now(),
        refreshToken: "mock-refresh-token-" + Date.now(),
        expiresAt: rememberMe
          ? Date.now() + 30 * 24 * 60 * 60 * 1000
          : Date.now() + 24 * 60 * 60 * 1000, // 30 days or 1 day
      };

      // Store auth data
      setAuthToken(mockToken);
      setUserData(mockUser);

      // Update state
      setUser(mockUser);
      setToken(mockToken);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    removeUserData();
    setUser(null);
    setToken(null);

    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const updateUser = (newUser: User) => {
    setUserData(newUser);
    setUser(newUser);
  };

  const updateToken = (newToken: AuthToken) => {
    setAuthToken(newToken);
    setToken(newToken);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    updateUser,
    updateToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
