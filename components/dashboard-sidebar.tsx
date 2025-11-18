"use client";

import { useRouter, usePathname } from "next/navigation";
import { sidebarRoutes, updateActiveRoute } from "@/lib/sidebar-routes";

export function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Update routes with active state based on current path
  const activeRoutes = updateActiveRoute(pathname);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-4">
      {activeRoutes.map((route) => (
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
  );
}
