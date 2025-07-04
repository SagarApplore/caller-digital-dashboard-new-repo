"use client"
import {
  BarChart3,
  MessageSquare,
  Users,
  Settings,
  HelpCircle,
  User,
  TrendingUp,
  FileText,
  DollarSign,
} from "lucide-react"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const sidebarItems = [
    { id: "campaigns", icon: BarChart3, label: "Campaigns" },
    { id: "clients", icon: Users, label: "Clients" },
    { id: "assistants", icon: MessageSquare, label: "Assistants" },
    { id: "analytics", icon: TrendingUp, label: "Analytics" },
    { id: "transcripts", icon: FileText, label: "Transcripts" },
    { id: "llm-config", icon: Settings, label: "LLM Config" },
    { id: "monetization", icon: DollarSign, label: "Monetization" },
  ]

  const getActiveState = (itemId: string) => {
    if (itemId === "campaigns" && (currentPage === "campaigns" || currentPage === "create-campaign")) {
      return true
    }
    if (itemId === "clients" && (currentPage === "clients" || currentPage === "add-client")) {
      return true
    }
    return currentPage === itemId
  }

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
      {/* Logo */}
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-sm"></div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              getActiveState(item.id)
                ? "bg-blue-50 text-blue-600"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Bottom Items */}
      <div className="flex-1"></div>
      <div className="flex flex-col space-y-2">
        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <User className="w-4 h-4 text-purple-600" />
        </button>
      </div>
    </div>
  )
}
