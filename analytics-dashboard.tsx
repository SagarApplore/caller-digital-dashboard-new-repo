import { DashboardHeader } from "./components/dashboard-header"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { DashboardFilters } from "./components/dashboard-filters"
import { VoiceAnalytics } from "./components/voice-analytics"
import { ChatEmailInsights } from "./components/chat-email-insights"
import { OmnichannelSnapshot } from "./components/omnichannel-snapshot"

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardSidebar />

        <div className="flex-1">
          <DashboardFilters />

          <div className="p-6">
            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
              <VoiceAnalytics />
              <ChatEmailInsights />
              <OmnichannelSnapshot />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
