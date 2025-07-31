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
  ChevronLeft,
  ChevronRight,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import Image from "next/image";

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchCampaigns = async (page = 1) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsPageLoading(true);
      }
      
      const response = await apiRequest(
        `${endpoints.outboundCampaign.getAll}?page=${page}&limit=${pagination.limit}`,
        "GET"
      );
      if (response.data?.success === true) {
        setCampaigns(response.data?.data);
        setPagination(response.data?.pagination || pagination);
        setIsLoading(false);
        setIsPageLoading(false);
      } else {
        toast.error(response.data?.message || "Error fetching campaigns");
        setCampaigns([]);
        setIsLoading(false);
        setIsPageLoading(false);
      }
    } catch (error) {
      toast.error("Error fetching campaigns");
      setCampaigns([]);
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(1);
  }, []);

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  // Pagination functions
  const handlePageChange = (page: number) => {
    fetchCampaigns(page);
  };

  // Keyboard navigation for pagination
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && pagination.hasPrevPage) {
        handlePageChange(pagination.currentPage - 1);
      } else if (event.key === 'ArrowRight' && pagination.hasNextPage) {
        handlePageChange(pagination.currentPage + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pagination.currentPage, pagination.hasPrevPage, pagination.hasNextPage]);

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

  const router = useRouter();

  return (
    <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
      {/* Filters */}
      {/* 
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

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show:</span>
              <Select 
                value={pagination.limit.toString()} 
                onValueChange={(value) => {
                  const newLimit = parseInt(value);
                  setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
                  fetchCampaigns(1);
                }}
              >
                <SelectTrigger className="w-20 bg-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              onClick={() => fetchCampaigns(pagination.currentPage)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
      */}

      {/* Campaign Table */}
      <div className="bg-white rounded-lg shadow-lg shadow-gray-200">
        <div className="">
          <h2 className="text-lg font-semibold text-gray-900 m-4">
            Campaigns ({pagination.totalCount})
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
                      Calls Placed
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Calls Answered
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Calls Unanswered
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Connect Rate (%)
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Total Interested
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                      Created On
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <TableRow
                        key={campaign._id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/outbound-campaign-manager/${campaign._id}`)}
                      >
                        <TableCell className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <div className="flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {campaign.campaignName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {campaign.campaignName}
                              </div>
                            </div>
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
                          <span className="font-medium text-gray-900">
                            {utils.string.formatNumber(
                              campaign.callsAnswered ?? 0
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <span className="font-medium text-gray-900">
                            {utils.string.formatNumber(
                              campaign.callsUnanswered ?? 0
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {campaign.connectRate ?? 0}%
                            </span>
                            <div className="w-16">
                              <Progress
                                value={campaign.connectRate ?? 0}
                                className={`h-2 ${getProgressColor(
                                  campaign.connectRate ?? 0
                                )}`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <span className="font-medium text-gray-900">
                            {utils.string.formatNumber(
                              campaign.totalInterested ?? 0
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <span className="text-sm text-gray-500">
                            {utils.string.formatDate(campaign.createdAt)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 px-4">
                        No campaigns found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
          
          {/* Pagination */}
          {!isLoading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{" "}
                {pagination.totalCount} campaigns
                {isPageLoading && (
                  <span className="ml-2 text-blue-600">
                    <Loader2 className="inline w-3 h-3 animate-spin mr-1" />
                    Loading...
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Go to page input */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Go to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={pagination.totalPages}
                    value={pagination.currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= pagination.totalPages) {
                        handlePageChange(page);
                      }
                    }}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">of {pagination.totalPages}</span>
                </div>
                
                <Pagination>
                  <PaginationContent>
                    {/* First page button */}
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        disabled={pagination.currentPage === 1}
                        className="flex items-center gap-1"
                      >
                        First
                      </Button>
                    </PaginationItem>
                    
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                    </PaginationItem>
                    
                    {/* Page numbers */}
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current page
                      const shouldShow = 
                        page === 1 || 
                        page === pagination.totalPages || 
                        Math.abs(page - pagination.currentPage) <= 1;
                      
                      if (shouldShow) {
                        return (
                          <PaginationItem key={page}>
                            <Button
                              variant={page === pagination.currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="min-w-[40px]"
                            >
                              {page}
                            </Button>
                          </PaginationItem>
                        );
                      } else if (
                        page === pagination.currentPage - 2 || 
                        page === pagination.currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <span className="flex h-9 w-9 items-center justify-center text-sm">
                              ...
                            </span>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                    
                    {/* Last page button */}
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="flex items-center gap-1"
                      >
                        Last
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CampaignsPage;