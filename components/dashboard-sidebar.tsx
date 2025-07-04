import { BarChart3, Home, MessageSquare, Mail, Settings } from "lucide-react"

export function DashboardSidebar() {
  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-4">
      <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
        <BarChart3 className="w-5 h-5" />
      </button>
      <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50">
        <Home className="w-5 h-5" />
      </button>
      <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50">
        <MessageSquare className="w-5 h-5" />
      </button>
      <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50">
        <Mail className="w-5 h-5" />
      </button>
      <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  )
}
