import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Users,
  BarChart,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import utils from "@/utils/index.util";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

const data = [
  {
    id: 1,
    name: "Q4 Lead Follow-up",
    leads: "2,450 leads",
    status: "Running",
    assistant: { name: "Sophia AI", initials: "SA" },
    callsPlaced: 1847,
    connectRate: 68.5,
    createdOn: "Dec 15, 2024",
    icon: Phone,
  },
  {
    id: 2,
    name: "Product Demo Outreach",
    leads: "1,200 leads",
    status: "Completed",
    assistant: { name: "Max AI", initials: "MA" },
    callsPlaced: 1200,
    connectRate: 72.3,
    createdOn: "Dec 10, 2024",
    icon: Users,
  },
  {
    id: 3,
    name: "Customer Satisfaction Survey",
    leads: "850 leads",
    status: "Paused",
    assistant: { name: "Emma AI", initials: "EA" },
    callsPlaced: 423,
    connectRate: 39,
    createdOn: "Dec 8, 2024",
    icon: BarChart,
  },
];

export function CampaignsPage() {
  const [filters, setFilters] = useState({
    status: "all-status",
    assistant: "all-assistants",
    dateRange: "all-dates",
  });

  // Memoized filtered campaigns for better performance
  const filteredCampaigns = useMemo(() => {
    return data.filter((campaign) => {
      const statusMatch =
        filters.status === "all-status" ||
        campaign.status.toLowerCase() === filters.status.toLowerCase();

      const assistantMatch =
        filters.assistant === "all-assistants" ||
        campaign.assistant.name
          .toLowerCase()
          .includes(filters.assistant.toLowerCase());

      // Date range filtering can be implemented here when needed
      const dateMatch = filters.dateRange === "all-dates" || true;

      return statusMatch && assistantMatch && dateMatch;
    });
  }, [filters]);

  // Memoized total calls for better performance
  const totalCalls = useMemo(() => {
    return filteredCampaigns.reduce(
      (acc, campaign) => acc + campaign.callsPlaced,
      0
    );
  }, [filteredCampaigns]);

  const getProgressColor = useCallback((connectRate: number) => {
    if (connectRate >= 70) return "bg-green-500";
    if (connectRate >= 40) return "bg-yellow-500";
    return "bg-red-500";
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case "running":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
  }, []);

  const handleAssistantChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, assistant: value }));
  }, []);

  const handleDateRangeClick = useCallback(() => {
    // Date range picker functionality can be implemented here
    console.log("Date range picker clicked");
  }, []);

  const handleExport = useCallback(() => {
    // Export functionality can be implemented here
    console.log("Export clicked");
  }, []);

  const handleRefresh = useCallback(() => {
    // Refresh functionality can be implemented here
    console.log("Refresh clicked");
  }, []);

  const router = useRouter();

  return (
    <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-lg shadow-gray-200 w-full overflow-x-scroll">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-32 bg-gray-100">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.assistant}
              onValueChange={handleAssistantChange}
            >
              <SelectTrigger className="w-40 bg-gray-100">
                <SelectValue placeholder="All Assistants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-assistants">All Assistants</SelectItem>
                <SelectItem value="sophia">Sophia AI</SelectItem>
                <SelectItem value="max">Max AI</SelectItem>
                <SelectItem value="emma">Emma AI</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="bg-gray-100"
              onClick={handleDateRangeClick}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-none"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-100 border-none"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-white rounded-lg shadow-lg shadow-gray-200">
        <div className="">
          <h2 className="text-lg font-semibold text-gray-900 m-4">
            Active Campaigns ({filteredCampaigns.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                    Campaign Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                    Assistant
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                    Calls Placed
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                    Connect Rate
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                    Created On
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <campaign.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {campaign.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {campaign.leads}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        className={`${getStatusColor(
                          campaign.status
                        )} border-0`}
                      >
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-purple-100 text-purple-600">
                            {campaign.assistant.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-900">
                          {campaign.assistant.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">
                        {utils.string.formatNumber(campaign.callsPlaced)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {campaign.connectRate}%
                        </span>
                        <div className="w-16">
                          <Progress
                            value={campaign.connectRate}
                            className={`h-2 ${getProgressColor(
                              campaign.connectRate
                            )}`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-500">
                        {campaign.createdOn}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() =>
                            router.push(
                              `/outbound-campaign-manager/${campaign.id}`
                            )
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-700"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
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

      {/* Total Leads Dialed */}
      <div className="bg-white rounded-lg shadow-lg shadow-gray-200 w-fit">
        <div className="m-4">
          <h2 className="text-sm text-gray-400">Total Leads Dialed</h2>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {utils.string.formatNumber(totalCalls)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignsPage;
