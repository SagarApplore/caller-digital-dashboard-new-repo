"use client";

import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/protected-route";
import { AuthStatus } from "@/components/auth-status";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/organisms/card";

// Example of a protected page component
function ProtectedExampleContent() {
  const { user, isLoading } = useAuth();

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Protected Page Example
          </h1>
          <p className="text-gray-600">Loading authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Protected Page Example
        </h1>
        <p className="text-gray-600">
          This page is protected and only accessible to authenticated users.
        </p>
      </div>

      <div className="grid gap-6">
        <AuthStatus />

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  User ID:
                </label>
                <p className="text-gray-900">{user?.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email:
                </label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name:
                </label>
                <p className="text-gray-900">{user?.name || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Role:
                </label>
                <p className="text-gray-900">{user?.role || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Use Protected Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  1. Wrap with ProtectedRoute component:
                </h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {`import { ProtectedRoute } from '@/components/protected-route';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>Your protected content here</div>
    </ProtectedRoute>
  );
}`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  2. Use the withAuth HOC:
                </h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {`import { withAuth } from '@/components/protected-route';

function MyPage() {
  return <div>Your protected content here</div>;
}

export default withAuth(MyPage);`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  3. Use the useAuth hook:
                </h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  {`import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user?.name}!</div>;
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Export the protected page
export default function ProtectedExamplePage() {
  return (
    <ProtectedRoute>
      <ProtectedExampleContent />
    </ProtectedRoute>
  );
}
