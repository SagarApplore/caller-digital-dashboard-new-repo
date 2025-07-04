import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Users, BarChart, Calendar, Download, RefreshCw } from "lucide-react"

const campaigns = [
  {
    id: 1,
    name: "Q4 Lead Follow-up",
    leads: "2,450 leads",
    status: "Running",
    statusColor: "bg-green-100 text-green-800",
    assistant: { name: "Sophia AI", initials: "SA" },
    callsPlaced: "1,847",
    connectRate: 68.5,
    createdOn: "Dec 15, 2024",
    icon: Phone,
  },
  {
    id: 2,
    name: "Product Demo Outreach",
    leads: "1,200 leads",
    status: "Completed",
    statusColor: "bg-blue-100 text-blue-800",
    assistant: { name: "Max AI", initials: "MA" },
    callsPlaced: "1,200",
    connectRate: 72.3,
    createdOn: "Dec 10, 2024",
    icon: Users,
  },
  {
    id: 3,
    name: "Customer Satisfaction Survey",
    leads: "850 leads",
    status: "Paused",
    statusColor: "bg-yellow-100 text-yellow-800",
    assistant: { name: "Emma AI", initials: "EA" },
    callsPlaced: "423",
    connectRate: 65.2,
    createdOn: "Dec 8, 2024",
    icon: BarChart,
  },
]

export function CampaignsPage() {
  return (
    <div className="flex-1 overflow-auto">
      {/* Filters */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select defaultValue="all-status">
              <SelectTrigger className="w-32 bg-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-assistants">
              <SelectTrigger className="w-40 bg-white">
                <SelectValue placeholder="All Assistants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-assistants">All Assistants</SelectItem>
                <SelectItem value="sophia">Sophia AI</SelectItem>
                <SelectItem value="max">Max AI</SelectItem>
                <SelectItem value="emma">Emma AI</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="bg-white">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="bg-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="bg-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-white">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-green-600">2</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Leads Dialed</p>
              <p className="text-2xl font-bold text-gray-900">3,470</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Overall Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">68.5%</p>
            </div>
          </div>
        </div>
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
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          Stop
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
