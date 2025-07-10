import { Home, Users, Megaphone, Brain, Phone } from "lucide-react";

export interface SidebarRouteItem {
  id: string;
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

export const sidebarRoutes: SidebarRouteItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/",
    icon: Home,
    isActive: false,
  },
  {
    id: "campaigns",
    name: "Campaigns",
    path: "/outbound-campaign-manager",
    icon: Megaphone,
    isActive: false,
  },
  // {
  //   id: "clients",
  //   name: "Clients",
  //   path: "/clients",
  //   icon: Users,
  //   isActive: false,
  // },
  // {
  //   id: "team-members",
  //   name: "Team Members",
  //   path: "/team-members",
  //   icon: Users,
  //   isActive: false,
  // },
  {
    id: "agents",
    name: "Agents",
    path: "/agents",
    icon: Brain,
    isActive: false,
  },
  {
    id: "call-logs",
    name: "Call Logs",
    path: "/call-logs",
    icon: Phone,
  },
];

// Helper function to update active state
export const updateActiveRoute = (currentPath: string) => {
  return sidebarRoutes.map((route) => ({
    ...route,
    isActive: route.path === currentPath,
  }));
};

// Get active route
export const getActiveRoute = (currentPath: string) => {
  return sidebarRoutes.find((route) => route.path === currentPath);
};
