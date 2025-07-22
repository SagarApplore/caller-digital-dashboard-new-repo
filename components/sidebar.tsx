"use client";
import { useRouter, usePathname } from "next/navigation";
import { HelpCircle, User, LogOut } from "lucide-react";
import { useAuth } from "./providers/auth-provider";
import { updateActiveRoute } from "@/lib/sidebar-routes";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();

  // Update routes with active state based on current path
  const activeRoutes = updateActiveRoute(pathname ?? "/");

  // Filter routes by user role
  const filteredRoutes = activeRoutes.filter(route =>
    !route.roles || (user && route.roles.includes(user.role))
  );

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
      {/* Logo */}
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-sm"></div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-2">
        {filteredRoutes.map((route) => (
          <button
            key={route.id}
            onClick={() => handleNavigation(route.path)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              route.isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
            title={route.name}
          >
            <route.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Bottom Items */}
      <div className="flex-1"></div>
      <div className="flex flex-col space-y-2">
        {/* <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50">
          <HelpCircle className="w-5 h-5" />
        </button> */}
        <button
          onClick={logout}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <User className="w-4 h-4 text-purple-600" />
        </button>
      </div>
    </div>
  );
}
