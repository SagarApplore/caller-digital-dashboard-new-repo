"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, Bell, AlertTriangle } from "lucide-react";
import { getActiveRoute } from "@/lib/sidebar-routes";

export function DashboardHeader() {
  const pathname = usePathname();
  const activeRoute = getActiveRoute(pathname || "/");

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 bg-white transform rotate-45 rounded-sm"></div>
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-900">
              {activeRoute?.name || "Dashboard"}
            </h1>
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5"
            >
              Beta
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search calls, chats, emails, assistants..."
              className="pl-10 w-80 bg-gray-50 border-gray-200 h-9"
            />
          </div>

          {/* SLA Breaches Alert */}
          <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-md">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">3 SLA Breaches</span>
          </div>

          {/* Refresh Button */}
          <Button variant="outline" size="sm" className="h-9 bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          {/* Notification */}
          <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>
        </div>
      </div>
    </div>
  );
}
