"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export const AuthStatus = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={logout}
        className="flex items-center space-x-1"
      >
        <LogOut className="w-3 h-3" />
        <span>Logout</span>
      </Button>
    </div>
  );
};
