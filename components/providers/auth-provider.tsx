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
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";
import { toast } from "react-toastify";

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
    const initializeAuth = async () => {
      try {
        if (isAuthenticated()) {
          const tokenData = getAuthToken();
          
          if (tokenData) {
            // Call /auth/me to get the latest user data
            try {
              const response = await apiRequest(endpoints.auth.me, "GET");
              console.log('getMe response:', response?.data);
              if (response?.data?.success) {
                const userData: User = {
                  id: response.data.data._id,
                  email: response.data.data.email,
                  name: response.data.data.name,
                  role: response.data.data.role,
                  DIY: response.data.data.DIY,
                  teamMemberOf: response.data.data.teamMemberOf,
                };
                
                console.log('User data from getMe:', userData);
                setUser(userData);
                setToken(tokenData);
                setUserData(userData); // Update localStorage with latest data
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              // Fallback to localStorage data
              const userData = getUserData();
              if (userData) {
                setUser(userData);
                setToken(tokenData);
              }
            }
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
      const response = await apiRequest(endpoints.auth.login, "POST", {
        email,
        password,
      });

      const user: User = {
        id: response?.data?._id,
        email: response?.data?.email,
        name: response?.data?.name,
        role: response?.data?.role,
        DIY: response?.data?.DIY,
        teamMemberOf: response?.data?.teamMemberOf,
      };

      console.log('Login response:', response?.data);
      console.log('User object created:', user);

      const token: AuthToken = {
        accessToken: response?.data?.token,
        refreshToken: response?.data?.token,
        expiresAt: rememberMe
          ? Date.now() + 30 * 24 * 60 * 60 * 1000
          : Date.now() + 24 * 60 * 60 * 1000, // 30 days or 1 day
      };

      // Store auth data
      setAuthToken(token);
      setUserData(user);

      // // Update state
      setUser(user);
      setToken(token);

      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      console.error("Login error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      
      // The API utility throws error.response?.data, so error is already the response data
      const errorMessage = error?.message || "Invalid credentials";
      console.log("Extracted error message:", errorMessage);
      
      // Show toast error
      toast.error(errorMessage);
      
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
