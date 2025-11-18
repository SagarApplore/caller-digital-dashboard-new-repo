// Authentication utilities
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  DIY?: boolean;
  teamMemberOf?: string;
  companyName:string,
  companyLogo?:string

}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

// Token management
export const AUTH_TOKEN_KEY = "auth_token";
export const USER_DATA_KEY = "user_data";

export const setAuthToken = (token: AuthToken): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token));
  }
};

export const getAuthToken = (): AuthToken | null => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token ? JSON.parse(token) : null;
  }
  return null;
};

export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const isTokenValid = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;

  // Check if token has expired
  if (token.expiresAt && Date.now() > token.expiresAt) {
    removeAuthToken();
    return false;
  }

  return true;
};

// User data management
export const setUserData = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }
};

export const getUserData = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(USER_DATA_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const removeUserData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_DATA_KEY);
  }
};

// Authentication state check
export const isAuthenticated = (): boolean => {
  return isTokenValid() && getUserData() !== null;
};

// Logout function
export const logout = (): void => {
  removeAuthToken();
  removeUserData();
  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};
