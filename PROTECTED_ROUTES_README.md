# Protected Routes System

This document explains how to use the protected routes system implemented in the Caller.Digital dashboard.

## Overview

The protected routes system provides a comprehensive solution for protecting pages and components that require authentication. It includes:

- **Authentication Context**: Manages user state and authentication tokens
- **Protected Route Component**: Wraps pages to ensure authentication
- **Higher-Order Component**: Alternative way to protect components
- **Custom Hook**: Easy access to authentication state
- **Middleware**: Server-side route protection

## Features

- ✅ Client-side route protection
- ✅ Server-side middleware protection
- ✅ Token expiration handling
- ✅ Remember me functionality
- ✅ Automatic redirects
- ✅ Loading states
- ✅ TypeScript support

## Quick Start

### 1. Protecting a Page

Wrap your page component with the `ProtectedRoute` component:

```tsx
import { ProtectedRoute } from "@/components/protected-route";

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>Your protected content here</div>
    </ProtectedRoute>
  );
}
```

### 2. Using the Higher-Order Component

```tsx
import { withAuth } from "@/components/protected-route";

function MyPage() {
  return <div>Your protected content here</div>;
}

export default withAuth(MyPage);
```

### 3. Accessing Authentication State

```tsx
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user?.name}!</div>;
}
```

## Components

### AuthProvider

The main authentication context provider that manages:

- User state
- Authentication tokens
- Login/logout functions
- Token validation

### ProtectedRoute

A component that:

- Checks authentication status
- Shows loading state while checking
- Redirects to login if not authenticated
- Renders children only if authenticated

### withAuth HOC

A higher-order component that wraps components with authentication protection.

## Hooks

### useAuth

Provides access to:

- `user`: Current user object
- `token`: Current authentication token
- `isAuthenticated`: Boolean indicating if user is authenticated
- `isLoading`: Boolean indicating if auth state is being checked
- `login(email, password, rememberMe)`: Login function
- `logout()`: Logout function
- `updateUser(user)`: Update user data
- `updateToken(token)`: Update authentication token

## Authentication Flow

1. **Login**: User submits credentials → Backend validates → Token stored → User redirected to dashboard
2. **Token Validation**: On app load, tokens are validated for expiration
3. **Route Protection**: Protected routes check authentication before rendering
4. **Logout**: Tokens cleared → User redirected to login

## Backend Integration

To integrate with your backend:

1. **Update the login function** in `components/providers/auth-provider.tsx`:

```tsx
const login = async (
  email: string,
  password: string,
  rememberMe = false
): Promise<boolean> => {
  setIsLoading(true);

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    // Store auth data
    setAuthToken(data.token);
    setUserData(data.user);

    // Update state
    setUser(data.user);
    setToken(data.token);

    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  } finally {
    setIsLoading(false);
  }
};
```

2. **Add token refresh logic** if needed:

```tsx
const refreshToken = async (): Promise<boolean> => {
  const currentToken = getAuthToken();
  if (!currentToken?.refreshToken) return false;

  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: currentToken.refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      updateToken(data.token);
      return true;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }

  return false;
};
```

## Configuration

### Protected Routes

Update the `protectedRoutes` array in `middleware.ts` to include all routes that require authentication:

```ts
const protectedRoutes = [
  "/",
  "/dashboard",
  "/analytics",
  "/campaigns",
  "/clients",
  "/assistants",
  "/transcripts",
  "/llm-config",
  "/monetization",
];
```

### Auth Routes

Update the `authRoutes` array to include login/register pages:

```ts
const authRoutes = ["/login", "/register", "/forgot-password"];
```

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage. For enhanced security, consider using httpOnly cookies.
2. **Token Expiration**: Tokens are automatically validated for expiration.
3. **CSRF Protection**: Implement CSRF tokens for sensitive operations.
4. **HTTPS**: Always use HTTPS in production.

## Examples

See `pages/protected-example.tsx` for a complete example of how to use the protected routes system.

## Troubleshooting

### Common Issues

1. **Infinite redirects**: Ensure your login page is not in the `protectedRoutes` array
2. **Token not persisting**: Check if localStorage is available and not blocked
3. **Middleware not working**: Verify the middleware matcher configuration

### Debug Mode

Add debug logging to the auth provider:

```tsx
const DEBUG_AUTH = process.env.NODE_ENV === "development";

// In login function
if (DEBUG_AUTH) {
  console.log("Login attempt:", { email, rememberMe });
}
```
