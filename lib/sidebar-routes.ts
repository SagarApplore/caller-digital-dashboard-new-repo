import { Home, Megaphone, Brain, Phone, Building2, Bot, Plus, Hash } from "lucide-react";

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
    icon:   Bot,
    isActive: false,
  },
  {
    id: "phone-numbers",
    name: "Phone Numbers",
    path: "/phone-numbers",
    icon: Hash,
    isActive: false,
  },
  {
    id: "call-logs",
    name: "Call Logs",
    path: "/call-logs",
    icon: Phone,
  },
  {
    id: "inbound-trunks",
    name: "Inbound Trunks",
    path: "/inbound-trunks",
    icon: Building2,
  },
  {
    id: "create-inbound-trunk",
    name: "Create Inbound Trunk",
    path: "/inbound-trunks/new",
    icon: Plus,
  },
  {
    id: "manage-brands",
    name: "Manage Brands",
    path: "/manage-brands",
    icon: Building2,
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    path: "/knowledge-base",
    icon: Brain,
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
