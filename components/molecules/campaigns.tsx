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
  Loader2,
} from "lucide-react";
import utils from "@/utils/index.util";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCampaigns = async () => {
    try {
      const response = await apiRequest(
        endpoints.outboundCampaign.getAll,
        "GET"
      );
      if (response.data?.success === true) {
        setCampaigns(response.data?.data);
        setIsLoading(false);
      } else {
        toast.error(response.data?.message || "Error fetching campaigns");
        setCampaigns([]);
      }
    } catch (error) {
      toast.error("Error fetching campaigns");
      setCampaigns([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  const [filters, setFilters] = useState({
    status: "all-status",
    assistant: "all-assistants",
    dateRange: "all-dates",
  });

  // Memoized filtered campaigns for better performance
  // const filteredCampaigns = useMemo(() => {
  //   return campaigns.filter((campaign) => {
  //     const statusMatch =
  //       filters.status === "all-status" ||
  //       campaign.status.toLowerCase() === filters.status.toLowerCase();

  //     const assistantMatch =
  //       filters.assistant === "all-assistants" ||
  //       campaign.assistant.name
  //         .toLowerCase()
  //         .includes(filters.assistant.toLowerCase());

  //     // Date range filtering can be implemented here when needed
  //     const dateMatch = filters.dateRange === "all-dates" || true;

  //     return statusMatch && assistantMatch && dateMatch;
  //   });
  // }, [filters]);

  // Memoized total calls for better performance
  const totalCalls = useMemo(() => {
    return campaigns.reduce((acc, campaign) => acc + campaign.callsPlaced, 0);
  }, [campaigns]);

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
            Active Campaigns ({campaigns.length})
          </h2>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin" />
                <span className="ml-3 text-gray-500 text-sm">
                  Loading campaigns...
                </span>
              </div>
            ) : (
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Campaign Name
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Status
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Assistant
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Calls Placed
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Connect Rate
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Created On
                    </TableHead>
                    {/* <TableHead className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Actions
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <TableRow
                        key={campaign._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <TableCell className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              {campaign.icon ? (
                                <Image
                                  src={campaign.icon}
                                  alt={campaign.campaignName}
                                  width={32}
                                  height={32}
                                />
                              ) : (
                                <div className="flex items-center justify-center">
                                  <span className="text-sm">
                                    {campaign.campaignName.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {campaign.campaignName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {campaign.callPlaced}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <Badge
                            className={`${getStatusColor(
                              campaign.status
                            )} border-0`}
                          >
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs bg-purple-100 text-purple-600">
                                {campaign.assistant?.image ? (
                                  <Image
                                    src={campaign.assistant.image}
                                    alt={campaign.assistant.agentName}
                                    width={32}
                                    height={32}
                                  />
                                ) : (
                                  <div className="flex items-center justify-center">
                                    <span className="text-sm">
                                      {campaign.assistant.agentName.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-900">
                              {campaign.assistant.agentName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <span className="font-medium text-gray-900">
                            {utils.string.formatNumber(
                              campaign.callsPlaced ?? 0
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-4">
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
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <span className="text-sm text-gray-500">
                            {utils.string.formatDate(campaign.createdAt)}
                          </span>
                        </TableCell>
                        {/* <TableCell className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                              onClick={() =>
                                router.push(
                                  `/outbound-campaign-manager/${campaign._id}`
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
                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-4 px-4">
                        No campaigns found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      {/* Total Leads Dialed */}
      {/* <div className="bg-white rounded-lg shadow-lg shadow-gray-200 w-fit">
        <div className="m-4">
          <h2 className="text-sm text-gray-400">Total Leads Dialed</h2>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin" />
                  <span className="text-sm text-gray-500">
                    Loading total calls...
                  </span>
                </div>
              ) : (
                utils.string.formatNumber(totalCalls)
              )}
            </span>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default CampaignsPage;
