import {
  BarChart3,
  Home,
  MessageSquare,
  Users,
  TrendingUp,
  FileText,
  Settings,
  DollarSign,
} from "lucide-react";

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
    icon: BarChart3,
    isActive: false,
  },
  {
    id: "clients",
    name: "Clients",
    path: "/clients",
    icon: Users,
    isActive: false,
  },
  {
    id: "team-members",
    name: "Team Members",
    path: "/team-members",
    icon: Users,
    isActive: false,
  },
  {
    id: "analytics",
    name: "Analytics",
    path: "/outbound-campaign-manager/analytics",
    icon: TrendingUp,
    isActive: false,
  },
  {
    id: "transcripts",
    name: "Transcripts",
    path: "/outbound-campaign-manager/transcripts",
    icon: FileText,
    isActive: false,
  },
  {
    id: "llm-config",
    name: "LLM Config",
    path: "/outbound-campaign-manager/llm-config",
    icon: Settings,
    isActive: false,
  },
  {
    id: "monetization",
    name: "Monetization",
    path: "/outbound-campaign-manager/monetization",
    icon: DollarSign,
    isActive: false,
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
