import {
  BarChart3,
  Home,
  MessageSquare,
  Settings,
  Users,
  TrendingUp,
  FileText,
  DollarSign,
  Plus,
} from "lucide-react";

export interface SidebarRoute {
  id: string;
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  isActive?: boolean;
  children?: SidebarRoute[];
}

export const sidebarRoutes: SidebarRoute[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/",
    icon: Home,
    description: "Main dashboard overview",
  },
  {
    id: "outbound-campaign-manager",
    name: "Campaign Manager",
    path: "/outbound-campaign-manager",
    icon: BarChart3,
    description: "Manage outbound campaigns",
    children: [
      {
        id: "campaigns",
        name: "Campaign List",
        path: "/outbound-campaign-manager",
        icon: BarChart3,
        description: "View all campaigns",
      },
      {
        id: "create-campaign",
        name: "Create Campaign",
        path: "/outbound-campaign-manager/create-campaign",
        icon: Plus,
        description: "Create new campaign",
      },
    ],
  },
  {
    id: "clients",
    name: "Clients",
    path: "/outbound-campaign-manager/clients",
    icon: Users,
    description: "Manage client accounts",
    children: [
      {
        id: "client-list",
        name: "Client List",
        path: "/outbound-campaign-manager/clients",
        icon: Users,
        description: "View all clients",
      },
      {
        id: "add-client",
        name: "Add Client",
        path: "/outbound-campaign-manager/add-client",
        icon: Plus,
        description: "Add new client",
      },
    ],
  },
  {
    id: "assistants",
    name: "Assistants",
    path: "/outbound-campaign-manager/assistants",
    icon: MessageSquare,
    description: "Manage AI assistants and phone numbers",
  },
  {
    id: "analytics",
    name: "Analytics",
    path: "/outbound-campaign-manager/analytics",
    icon: TrendingUp,
    description: "View campaign analytics and insights",
  },
  {
    id: "transcripts",
    name: "Transcripts",
    path: "/outbound-campaign-manager/transcripts",
    icon: FileText,
    description: "View call transcripts and recordings",
  },
  {
    id: "llm-config",
    name: "LLM Config",
    path: "/outbound-campaign-manager/llm-config",
    icon: Settings,
    description: "Configure AI language models",
  },
  {
    id: "monetization",
    name: "Monetization",
    path: "/outbound-campaign-manager/monetization",
    icon: DollarSign,
    description: "Manage pricing and revenue",
  },
];

// Flattened routes for easier navigation
export const flattenedRoutes: SidebarRoute[] = sidebarRoutes.reduce(
  (acc, route) => {
    acc.push(route);
    if (route.children) {
      acc.push(...route.children);
    }
    return acc;
  },
  [] as SidebarRoute[]
);

// Main navigation items (top level)
export const mainNavigationRoutes: SidebarRoute[] = sidebarRoutes.filter(
  (route) => !route.children
);

// Get route by path
export const getRouteByPath = (path: string): SidebarRoute | undefined => {
  return flattenedRoutes.find((route) => route.path === path);
};

// Get active route based on current path
export const getActiveRoute = (
  currentPath: string
): SidebarRoute | undefined => {
  return flattenedRoutes.find((route) => {
    if (route.path === currentPath) return true;
    if (route.children) {
      return route.children.some((child) => child.path === currentPath);
    }
    return false;
  });
};

// Get parent route for nested routes
export const getParentRoute = (
  currentPath: string
): SidebarRoute | undefined => {
  return sidebarRoutes.find((route) =>
    route.children?.some((child) => child.path === currentPath)
  );
};
