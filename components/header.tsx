"use client"

import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"

interface HeaderProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function Header({ currentPage, onPageChange }: HeaderProps) {
  // Define page configurations
  const pageConfigs = {
    campaigns: {
      showMainHeader: true,
      showTabs: true,
      title: "Outbound Campaign Manager",
      subtitle: "Client Panel",
    },
    "create-campaign": {
      showMainHeader: false,
      showTabs: false,
      title: "Create New Campaign",
      subtitle: "Set up your outbound calling campaign",
    },
    clients: {
      showMainHeader: false,
      showTabs: false,
      title: "Client Management",
      subtitle: "Manage your clients and their accounts",
    },
    "add-client": {
      showMainHeader: false,
      showTabs: false,
      title: "Add New Client",
      subtitle: "Create a new client account",
    },
    assistants: {
      showMainHeader: true,
      showTabs: true,
      title: "Outbound Campaign Manager",
      subtitle: "Client Panel",
    },
    analytics: {
      showMainHeader: true,
      showTabs: true,
      title: "Outbound Campaign Manager",
      subtitle: "Client Panel",
    },
    transcripts: {
      showMainHeader: true,
      showTabs: true,
      title: "Outbound Campaign Manager",
      subtitle: "Client Panel",
    },
    "llm-config": {
      showMainHeader: false,
      showTabs: false,
      title: "LLM Provider Configuration",
      subtitle: "Manage AI language models and settings",
    },
    monetization: {
      showMainHeader: false,
      showTabs: false,
      title: "SKU & Monetization Manager",
      subtitle: "Manage pricing plans and revenue",
    },
  }

  const config = pageConfigs[currentPage] || pageConfigs.campaigns

  const tabs = [
    { name: "Campaign List", id: "campaigns" },
    { name: "Create New Campaign", id: "create-campaign" },
    { name: "Assistant & Numbers", id: "assistants" },
    { name: "Analytics", id: "analytics" },
    { name: "Transcripts", id: "transcripts" },
  ]

  const getActiveTab = () => {
    if (currentPage === "create-campaign") return "create-campaign"
    return currentPage
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Back button for certain pages */}
            {(currentPage === "add-client" || currentPage === "create-campaign") && (
              <Button
                variant="ghost"
                onClick={() => onPageChange(currentPage === "add-client" ? "clients" : "campaigns")}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}

            <div className="flex items-center space-x-3">
              {config.showMainHeader && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{config.title}</h1>
                <p className="text-sm text-blue-600">{config.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Show create button only on relevant pages */}
          {(currentPage === "campaigns" || currentPage === "clients") && (
            <Button
              onClick={() => onPageChange(currentPage === "campaigns" ? "create-campaign" : "add-client")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {currentPage === "campaigns" ? "Create Campaign" : "Add Client"}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs - only show for main campaign pages */}
      {config.showTabs && (
        <div className="px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => onPageChange(tab.id)}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                  getActiveTab() === tab.id
                    ? "text-purple-600 border-purple-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
