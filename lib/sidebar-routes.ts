import {
  Home,
  Megaphone,
  Brain,
  Phone,
  Building2,
  Bot,
  Hash,
  PhoneCall,
  CodeXml,
  Users,
} from "lucide-react";

export interface SidebarRouteItem {
  id: string;
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  roles?: string[]; // Only show for these roles if specified
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
  {
    id: "clients",
    name: "Clients",
    path: "/clients",
    icon:  Megaphone,
    isActive: false,
    roles: ["SUPER_ADMIN"], // Only show for SUPER_ADMIN
  },
  {
    id: "team-members",
    name: "Team Members",
    path: "/team-members",
    icon: Users,
    isActive: false,
    roles: ["CLIENT_ADMIN"], // Only show for CLIENT_ADMIN
  },
  {
    id: "agents",
    name: "Agents",
    path: "/agents",
    icon: Bot,
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
  // {
  //   id: "inbound-trunks",
  //   name: "Inbound Trunks",
  //   path: "/inbound-trunks",
  //   icon: Building2,
  // },
  // {
  //   id: "create-inbound-trunk",
  //   name: "Create Inbound Trunk",
  //   path: "/inbound-trunks/new",
  //   icon: Plus,
  // },
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
  {
    id: "function-tools",
    name: "Function Tools",
    path: "/function-tools",
    icon: CodeXml,
  },
  // {
  //   id: "llm-config",
  //   name: "LLM Config",
  //   path: "/llm-provider-config",
  //   icon: Settings,
  // },
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
