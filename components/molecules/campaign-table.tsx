import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Users, BarChart } from "lucide-react"

const campaigns = [
  {
    id: 1,
    name: "Q4 Lead Follow-up",
    leads: "2,450 leads",
    status: "Running",
    statusColor: "bg-green-100 text-green-800",
    assistant: {
      name: "Sophia AI",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SA",
    },
    callsPlaced: "1,847",
    connectRate: 68.5,
    connectColor: "bg-green-500",
    createdOn: "Dec 15, 2024",
    icon: Phone,
  },
  {
    id: 2,
    name: "Product Demo Outreach",
    leads: "1,200 leads",
    status: "Completed",
    statusColor: "bg-blue-100 text-blue-800",
    assistant: {
      name: "Max AI",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MA",
    },
    callsPlaced: "1,200",
    connectRate: 72.3,
    connectColor: "bg-green-500",
    createdOn: "Dec 10, 2024",
    icon: Users,
  },
  {
    id: 3,
    name: "Customer Satisfaction Survey",
    leads: "850 leads",
    status: "Paused",
    statusColor: "bg-yellow-100 text-yellow-800",
    assistant: {
      name: "Emma AI",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "EA",
    },
    callsPlaced: "423",
    connectRate: 65.2,
    connectColor: "bg-yellow-500",
    createdOn: "Dec 8, 2024",
    icon: BarChart,
  },
]

export function CampaignTable() {
  return (
    <div className="bg-white">
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Campaigns</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Campaign Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Assistant</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Calls Placed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Connect Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Created On</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <campaign.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.leads}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={`${campaign.statusColor} border-0`}>{campaign.status}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={campaign.assistant.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs bg-purple-100 text-purple-600">
                          {campaign.assistant.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900">{campaign.assistant.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{campaign.callsPlaced}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{campaign.connectRate}%</span>
                      <div className="w-16">
                        <Progress value={campaign.connectRate} className="h-2" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-500">{campaign.createdOn}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        View
                      </Button>
                      {campaign.status === "Running" && (
                        <>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            Stop
                          </Button>
                        </>
                      )}
                      {campaign.status === "Completed" && (
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                          Duplicate
                        </Button>
                      )}
                      {campaign.status === "Paused" && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                            Resume
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                            Edit
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
