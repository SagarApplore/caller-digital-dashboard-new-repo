import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/organisms/card";
import { Loader2, ChevronLeft, ChevronRight, Download, RefreshCw } from "lucide-react";
import utils from "@/utils/index.util";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";
import { useAuth } from "@/components/providers/auth-provider";
import { useSearchParams } from "next/navigation";
import * as XLSX from 'xlsx';
import { CheckCircle2 } from "lucide-react";
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
  PaginationItem,
} from "../ui/pagination";

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [loadingActions, setLoadingActions] = useState<{[key: string]: string}>({});

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [campaignMetrics, setCampaignMetrics] = useState({
    totalCallsPlaced: 0,
    totalCallsAnswered: 0,
    totalCallsUnanswered: 0,
    totalInterestedCount: 0,
    totalConnectRate: 0,
    totalCount: 0,
    totalCallDurationMinutes:0
  });

  const router = useRouter();
  const { user } = useAuth();

  const searchParams = useSearchParams();
const isRetryMode = searchParams.get("retry") === "true"; // detect retry mode

const [selectedCampaigns, setSelectedCampaigns] = useState<Set<string>>(new Set());


  // Check if user is super admin
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const fetchCampaigns = async (page = 1) => {
    try {
      if (page === 1) setIsLoading(true);
      else setIsPageLoading(true);

      const response = await apiRequest(
        `${endpoints.outboundCampaign.getAll}?page=${page}&limit=${pagination.limit}`,
        "GET"
      );

      if (response.data?.success === true) {
        setCampaigns(response.data?.data);
        setPagination(response.data?.pagination || pagination);
        
        // Set campaign metrics from totalData
        if (response.data?.totalData) {
          setCampaignMetrics({
            totalCallsPlaced: response.data.totalData.totalCallsPlaced || 0,
            totalCallsAnswered: response.data.totalData.totalCallsAnswered || 0,
            totalCallsUnanswered: response.data.totalData.totalCallsUnanswered || 0,
            totalInterestedCount: response.data.totalData.totalInterestedCount || 0,
            totalConnectRate: response.data.totalData.totalConnectRate || 0,
            totalCount: response.data.totalData.totalCount || 0,
            totalCallDurationMinutes:response.data.totalData.totalCallDurationMinutes || 0,
            
          });
        }
      } else {
        toast.error(response.data?.message || "Error fetching campaigns");
        setCampaigns([]);
      }
    } catch (error) {
      toast.error("Error fetching campaigns");
      setCampaigns([]);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(1);
  }, []);

  // Handle Campaign Actions (Pause, Resume, End)
  const handleCampaignAction = async (id: string, action: string) => {
    try {
      setLoadingActions(prev => ({ ...prev, [`${id}-${action}`]: action }));
      const response = await apiRequest(
        `/outbound-campaigns/${id}/toggle?action=${action}`,
        "POST"
      );

      if (response.data?.success) {
        toast.success(`Campaign ${action}d successfully`);
        fetchCampaigns(pagination.currentPage);
      } else {
        toast.error(response.data?.message || `Failed to ${action} campaign`);
      }
    } catch (error) {
      toast.error(`Error trying to ${action} campaign`);
    } finally {
      setLoadingActions(prev => {
        const newState = { ...prev };
        delete newState[`${id}-${action}`];
        return newState;
      });
    }
  };

  const handlePageChange = (page: number) => {
    fetchCampaigns(page);
  };


  // Checkbox change handler
const handleCheckboxChange = (id: string, checked: boolean) => {
  setSelectedCampaigns(prev => {
    const updated = new Set(prev);
    if (checked) updated.add(id);
    else updated.delete(id);
    return updated;
  });
};

// Retry done handler
// const handleRetryDone = async () => {
//   if (selectedCampaigns.size === 0) {
//     toast.warning("Please select at least one campaign.");
//     return;
//   }

//   try {
//     toast.info("Generating retry CSV...");

//     // 🔥 Fetch CSV as Blob
//     const response = await apiRequest(
//       endpoints.outboundCampaign.retryUnanswered,
//       "POST",
//       { campaignIds: Array.from(selectedCampaigns) },
//       { responseType: "blob" } // important
//     );

//     // ✅ Create File object from Blob
//     const blob = new Blob([response.data], { type: "text/csv" });
//     const file = new File([blob], "retry_unanswered.csv", { type: "text/csv" });

//     // 🔒 Store temporarily in sessionStorage
//     sessionStorage.setItem("retryCsv", await blob.text());

//     toast.success("Retry CSV ready! Redirecting...");

//     // 🚀 Navigate to upload page with retry=true flag
//     router.push("/outbound-campaign-manager/new?retry=true");

//   } catch (error) {
//     console.error(error);
//     toast.error("An error occurred while retrying unanswered numbers.");
//   }
// };

const handleRetryDone = async () => {
  if (selectedCampaigns.size === 0) {
    toast.warning("Please select at least one campaign.");
    return;
  }

  try {
    toast.info("Generating retry CSV...");

    const response = await apiRequest(
      endpoints.outboundCampaign.retryUnanswered,
      "POST",
      { campaignIds: Array.from(selectedCampaigns) },
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], { type: "text/csv" });

    // ✅ Convert to Base64 (binary-safe)
    const reader = new FileReader();
    reader.onloadend = () => {
      sessionStorage.setItem("retryCsvBase64", reader.result);
      sessionStorage.setItem("isRetryMode", "true"); // 👈 Set flag
      toast.success("Retry CSV ready! Redirecting...");
      router.push("/outbound-campaign-manager/new"); // no query param needed
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while retrying unanswered numbers.");
  }
};




  // Keyboard pagination shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && pagination.hasPrevPage) {
        handlePageChange(pagination.currentPage - 1);
      } else if (event.key === "ArrowRight" && pagination.hasNextPage) {
        handlePageChange(pagination.currentPage + 1);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pagination.currentPage, pagination.hasPrevPage, pagination.hasNextPage]);

  const totalCalls = useMemo(() => {
    return campaigns.reduce((acc, campaign) => acc + campaign.callsPlaced, 0);
  }, [campaigns]);

  const getProgressColor = useCallback((connectRate: number) => {
    if (connectRate >= 70) return "bg-green-500";
    if (connectRate >= 40) return "bg-yellow-500";
    return "bg-red-500";
  }, []);

  // Handle export all campaigns data
  const handleExportAllCampaigns = async () => {
    try {
      toast.info("Preparing export... This may take a moment.");
      
      const response = await apiRequest(
        endpoints.outboundCampaign.exportAll,
        "GET"
      );

      if (response.data?.success) {
        const exportData = response.data.data;
        const entityFields = response.data.entityFields || [];
        console.log("extract data ",exportData)

        // console.log("Export data received:", exportData.length, "rows");
        // console.log("Entity fields:", entityFields);
        // console.log("Sample row structure:", exportData[0] ? Object.keys(exportData[0]) : []);

        // Create workbook
        const wb = XLSX.utils.book_new();

        // Create worksheet from data
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, "All Campaigns Data");

        // Download the file
        const fileName = `all_campaigns_data_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName,{ compression: true });

        toast.success(`Exported ${exportData.length} records successfully!`);
      } else {
        toast.error(response.data?.message || "Failed to export data");
      }
    } catch (error) {
      console.error("Error exporting campaigns:", error);
      toast.error("Failed to export campaigns data");
    }
  };

  return (<>
   {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg shadow-sm gap-4">
    Hello how are you 
   </div> */}
    {isRetryMode && (
  <div className="flex justify-end mb-2">
   <Button
  onClick={handleRetryDone}
  className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
>
  <CheckCircle2 className="h-4 w-4" />
  Done (Retry Selected)
</Button>
  </div>
)}

    <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
      {/* Export Button */}
      {/* <div className="flex justify-end mb-2">
        <Button
          onClick={handleExportAllCampaigns}
          className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export All Campaigns Data
        </Button>
      </div> */}

      {/* Campaign Metrics Boxes */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-white border-none shadow-lg shadow-gray-200">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Campaigns</div>
            <div className="text-2xl font-bold text-gray-900 py-2">{campaignMetrics.totalCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-lg shadow-gray-200">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Calls Placed</div>
            <div className="text-2xl font-bold text-gray-900 py-2">{utils.string.formatNumber(campaignMetrics.totalCallsPlaced)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-lg shadow-gray-200">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Calls Answered</div>
            <div className="text-2xl font-bold text-gray-900 py-2">{utils.string.formatNumber(campaignMetrics.totalCallsAnswered)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-lg shadow-gray-200">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Calls Unanswered</div>
            <div className="text-2xl font-bold text-gray-900 py-2">{utils.string.formatNumber(campaignMetrics.totalCallsUnanswered)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-lg shadow-gray-200">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Connect Rate</div>
            <div className="text-2xl font-bold text-gray-900 py-2">{campaignMetrics.totalConnectRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-lg shadow-gray-200">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Interested</div>
            <div className="text-2xl font-bold text-gray-900 py-2">{utils.string.formatNumber(campaignMetrics.totalInterestedCount)}</div>
          </CardContent>
        </Card>
          <Card className="bg-white border-none shadow-lg shadow-gray-200">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Call Duration</div>
            <div className="text-2xl font-bold text-gray-900 py-2">{campaignMetrics.totalCallDurationMinutes} mins</div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Table */}
      <div className="bg-white rounded-lg shadow-lg shadow-gray-200">
        <div>
          {/* <h2 className="text-lg font-semibold text-gray-900 m-4">
            Campaigns ({pagination.totalCount})
          </h2> */}

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
      {/* 🔧 Added checkbox header inside the row (previously misplaced) */}
      {isRetryMode && (
        <TableHead className="py-3 px-4 text-gray-500 text-sm font-medium">
          Select
        </TableHead>
      )}

                    <TableHead className="py-3 px-4 text-gray-500 text-sm font-medium">
                      Campaign Name
                    </TableHead>
                    <TableHead className="py-3 px-4 text-gray-500 text-sm font-medium">
                      Status
                    </TableHead>
                    <TableHead className="py-3 px-4 text-gray-500 text-sm font-medium">
                      Calls Placed
                    </TableHead>
                    <TableHead className="py-3 px-4 text-gray-500 text-sm font-medium">
                      Calls Answered
                    </TableHead>
                    <TableHead className="py-3 px-4 text-gray-500 text-sm font-medium">
                      Calls Unanswered
                    </TableHead>
                    <TableHead className="py-3 px-4 text-gray-500 text-sm font-medium">
                      Connect Rate (%)
                    </TableHead>
                    <TableHead className="py-3 px-4 text-gray-500 text-sm font-medium">
                      Total Interested
                    </TableHead>
                    <TableHead className="py-3 px-4 text-gray-500 text-sm font-medium">
                      Created On
                    </TableHead>
                    {isSuperAdmin && (
                      <TableHead className="py-3 px-4 text-gray-500 text-sm font-medium">
                        Action
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <TableRow
                        key={campaign._id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          router.push(`/outbound-campaign-manager/${campaign._id}`)
                        }
                      >

                         {/*  Added checkbox for each campaign row */}

                         {isRetryMode && (
          <TableCell className="py-4 px-4">
            <input
              type="checkbox"
              checked={selectedCampaigns.has(campaign._id)}
              onChange={(e) =>
                handleCheckboxChange(campaign._id, e.target.checked)
              }
              onClick={(e) => e.stopPropagation()} // prevent navigation
              className="h-4 w-4 cursor-pointer"
            />
          </TableCell>
        )}
                        <TableCell className="py-4 px-4 font-medium text-gray-900">
                          {campaign.campaignName}
                        </TableCell>

                        <TableCell className="py-4 px-4">
                          <Badge 
                            className={`${
                              campaign.status === "running" 
                                ? "bg-green-100 text-green-800 border-green-200" 
                                : campaign.status === "paused" 
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : campaign.status === "ended" || campaign.status === "completed"
                                ? "bg-gray-100 text-gray-800 border-gray-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            } border-0`}
                          >
                            {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1) || "Unknown"}
                          </Badge>
                        </TableCell>

                        <TableCell className="py-4 px-4">
                          {utils.string.formatNumber(campaign.callsPlaced ?? 0)}
                        </TableCell>

                        <TableCell className="py-4 px-4">
                          {utils.string.formatNumber(campaign.callsAnswered ?? 0)}
                        </TableCell>

                        <TableCell className="py-4 px-4">
                          {utils.string.formatNumber(campaign.callsUnanswered ?? 0)}
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
                          {utils.string.formatNumber(
                            campaign.totalInterested ?? 0
                          )}
                        </TableCell>

                        <TableCell className="py-4 px-4 text-sm text-gray-500">
                          {utils.string.formatDateTime(campaign.createdAt)}
                        </TableCell>

                        {isSuperAdmin && (
                          <TableCell className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                            {campaign.status === "completed" ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled
                                className="bg-gray-100 text-gray-500"
                              >
                                Completed
                              </Button>
                            ) : campaign.status === "running" ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCampaignAction(campaign._id, "pause");
                                  }}
                                  disabled={loadingActions[`${campaign._id}-pause`] !== undefined}
                                >
                                  {loadingActions[`${campaign._id}-pause`] ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Pause"
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCampaignAction(campaign._id, "ended");
                                  }}
                                  disabled={loadingActions[`${campaign._id}-ended`] !== undefined}
                                >
                                  {loadingActions[`${campaign._id}-ended`] ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "End"
                                  )}
                                </Button>
                              </>
                            ) : campaign.status === "paused" ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCampaignAction(campaign._id, "running");
                                  }}
                                  disabled={loadingActions[`${campaign._id}-running`] !== undefined}
                                >
                                  {loadingActions[`${campaign._id}-running`] ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Resume"
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCampaignAction(campaign._id, "ended");
                                  }}
                                  disabled={loadingActions[`${campaign._id}-ended`] !== undefined}
                                >
                                  {loadingActions[`${campaign._id}-ended`] ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "End"
                                  )}
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled
                                className="bg-gray-100 text-gray-500"
                              >
                                {campaign.status}
                              </Button>
                            )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isSuperAdmin ? 9 : 8} className="text-center py-4">
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
                Showing{" "}
                {((pagination.currentPage - 1) * pagination.limit) + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalCount
                )}{" "}
                of {pagination.totalCount} campaigns
                {isPageLoading && (
                  <span className="ml-2 text-blue-600">
                    <Loader2 className="inline w-3 h-3 animate-spin mr-1" />
                    Loading...
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Go to page:</span>
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
                <span className="text-sm text-gray-700">of {pagination.totalPages}</span>
                
                <div className="flex items-center space-x-1 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={!pagination.hasPrevPage}
                    className="text-xs"
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="text-xs"
                  >
                    &lt; Previous
                  </Button>
                  
                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {pagination.currentPage > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        className="text-xs"
                      >
                        {pagination.currentPage - 1}
                      </Button>
                    )}
                    <Button
                      variant="default"
                      size="sm"
                      className="text-xs bg-black text-white"
                    >
                      {pagination.currentPage}
                    </Button>
                    {pagination.currentPage < pagination.totalPages && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        className="text-xs"
                      >
                        {pagination.currentPage + 1}
                      </Button>
                    )}
                    {pagination.currentPage < pagination.totalPages - 1 && (
                      <span className="text-xs text-gray-500">...</span>
                    )}
                    {pagination.currentPage < pagination.totalPages - 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.totalPages)}
                        className="text-xs"
                      >
                        {pagination.totalPages}
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="text-xs"
                  >
                    Next &gt;
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={!pagination.hasNextPage}
                    className="text-xs"
                  >
                    Last
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default CampaignsPage;
