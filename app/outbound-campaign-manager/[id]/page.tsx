"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Phone, User, CheckCircle, XCircle, Download, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/organisms/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import apiRequest from "@/utils/api";
import { toast } from "react-toastify";

interface CampaignLead {
  _id: string;
  leadName: string;
  leadNumber: number;
  interest: any | null;
  status: "answered" | "unanswered";
  callLogId: {
    _id: string;
    call_start_time: string;
    call_duration: number;
  } | null;
  createdAt: string;
  entity_result?: any;
  callDuration?: number; // Duration in seconds from call log
}

interface CampaignDetails {
  _id: string;
  campaignName: string;
  status: string;
  createdAt: string;
  metrics: {
    callsPlaced: number;
    callsAnswered: number;
    callsUnanswered: number;
    connectRate: number;
    totalInterested: number;
  };
}
const formatDuration = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "-";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};


export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails | null>(null);
  const [leads, setLeads] = useState<CampaignLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    interested: "all",
    callStatus: "all",
    startDateFrom: "",
    startDateTo: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const campaignId = params?.id as string;

  useEffect(() => {
    fetchCampaignDetails();
    fetchCampaignLeads();
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await apiRequest(`/outbound-campaigns/${campaignId}`, "GET");
      if (response.data?.success) {
        setCampaignDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      toast.error("Failed to load campaign details");
    }
  };

  const fetchCampaignLeads = async () => {
    try {
      setLoading(true);
      
      // Build query parameters for filters
      const queryParams = new URLSearchParams();
      if (filters.interested && filters.interested !== "all") {
        queryParams.append('interested', filters.interested);
      }
      if (filters.callStatus && filters.callStatus !== "all") {
        queryParams.append('callStatus', filters.callStatus);
      }
      if (filters.startDateFrom) {
        queryParams.append('startDateFrom', filters.startDateFrom);
      }
      if (filters.startDateTo) {
        queryParams.append('startDateTo', filters.startDateTo);
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await apiRequest(`/campaign-results/${campaignId}${queryString}`, "GET");
      
      if (response.data?.success) {
        setLeads(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching campaign leads:", error);
      toast.error("Failed to load campaign leads");
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const applyFilters = () => {
    console.log("After reste hit")
    fetchCampaignLeads();
  };
//   useEffect(() => {
//   fetchCampaignLeads();
// }, [filters]);
  const resetFilters = () => {
    setFilters({
      interested: "all",
      callStatus: "all",
      startDateFrom: "",
      startDateTo: ""
    });
    // Fetch without filters
    // applyFilters()
    // setTimeout(() => {
    //   fetchCampaignLeads();
    // }, 1);
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleViewCallLog = (callLogId: string, flag = "truncate") => {
    if (callLogId) {
      router.push(`/call-logs/${callLogId}?flag=${flag}&source=campaign&campaignId=${campaignId}`);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "answered" ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Answered
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <XCircle className="w-3 h-3 mr-1" />
        Unanswered
      </Badge>
    );
  };

  const getInterestBadge = (interest: any | null) => {
    if ((interest === "true") ||(interest === true )) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Yes
        </Badge>
      );
    } else if ((interest === "false") ||(interest === false )) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          No
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          -
        </Badge>
      );
    }
  };

 const downloadEntityCSV = () => {
  try {
    const leadsWithEntityData = leads.filter(lead => lead.entity_result);

    const headers = ["Lead Name", "Phone Number", "Interested", "Call Status", "Entity Result", "Call Duration"];

    const csvRows = [
      headers.join(","), 
      ...leads.map(lead => {
       const leadName = `"${(lead?.leadName ?? "N/A").replace(/"/g, '""')}"`;
        const phoneNumber = `"${lead.leadNumber}"`;
        const interested = `"${lead.interest == "true" ? 'Yes' : lead.interest == "false" ? 'No' : '-'}"`;
        const callStatus = `"${lead.status === 'answered' ? 'Answered' : 'Unanswered'}"`;

        // ✅ Use the same frontend formatting
        const callDuration = lead?.callLogId 
          ? `"${formatDuration(lead.callLogId.call_duration)}"` 
          : `"-"`;

        const entityResultJson = JSON.stringify(lead.entity_result);
        const escapedEntityResult = entityResultJson.replace(/"/g, '""');
        const entityResult = `"${escapedEntityResult}"`;

        return `${leadName},${phoneNumber},${interested},${callStatus},${entityResult},${callDuration}`;
      })
    ];

    const bom = "\uFEFF";
    const csvContent = bom + csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `campaign_entities_${campaignId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Downloaded entity data for ${leadsWithEntityData.length} leads`);
  } catch (error) {
    console.error("Error downloading CSV:", error);
    toast.error("Failed to download entity data");
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading campaign details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/outbound-campaign-manager")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campaigns</span>
          </Button>
          {/* <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {campaignDetails?.campaignName || "Campaign Details"}
            </h1>
            <p className="text-gray-600">Campaign ID: {campaignId}</p>
          </div> */}
        </div>
      </div>

      {/* Campaign Summary */}
      {/* {campaignDetails && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-purple-600" />
              <span>Campaign Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {campaignDetails.metrics?.callsPlaced || 0}
                </div>
                <div className="text-sm text-gray-600">Calls Placed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {campaignDetails.metrics?.callsAnswered || 0}
                </div>
                <div className="text-sm text-gray-600">Calls Answered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {campaignDetails.metrics?.callsUnanswered || 0}
                </div>
                <div className="text-sm text-gray-600">Calls Unanswered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {campaignDetails.metrics?.connectRate || 0}%
                </div>
                <div className="text-sm text-gray-600">Connect Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {campaignDetails.metrics?.totalInterested || 0}
                </div>
                <div className="text-sm text-gray-600">Total Interested</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Campaign Leads ({leads.length})</h2>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1"
              >
                <Filter className="w-4 h-4" />
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </Button>
              <Button
                onClick={downloadEntityCSV}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                // disabled={leads.filter(lead => lead.entity_result).length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Extract Data
                {/* {leads.filter(lead => lead.entity_result).length > 0 && (
                  <Badge className="ml-2 bg-white text-purple-600 text-xs">
                    {leads.filter(lead => lead.entity_result).length}
                  </Badge>
                )} */}
              </Button>
            </div>
          </div>
          
          {/* Filters Section */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Filter Leads</h3>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-gray-500 hover:text-gray-700">
                  <X className="w-3 h-3 mr-1" />
                  Reset Filters
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Interested Filter */}
                <div>
                  <Label htmlFor="interested-filter" className="text-xs font-medium text-gray-700 mb-1 block">
                    Interested
                  </Label>
                  <Select 
                    value={filters.interested} 
                    onValueChange={(value) => handleFilterChange('interested', value)}
                  >
                    <SelectTrigger id="interested-filter" className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Call Status Filter */}
                <div>
                  <Label htmlFor="call-status-filter" className="text-xs font-medium text-gray-700 mb-1 block">
                    Call Status
                  </Label>
                  <Select 
                    value={filters.callStatus} 
                    onValueChange={(value) => handleFilterChange('callStatus', value)}
                  >
                    <SelectTrigger id="call-status-filter" className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="answered">Answered</SelectItem>
                      <SelectItem value="unanswered">Unanswered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Call Start Date From */}
                <div>
                  <Label htmlFor="start-date-from" className="text-xs font-medium text-gray-700 mb-1 block">
                    Call Start Date From
                  </Label>
                  <Input
                    id="start-date-from"
                    type="date"
                    value={filters.startDateFrom}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('startDateFrom', e.target.value)}
                    className="w-full"
                  />
                </div>
                
                {/* Call Start Date To */}
                <div>
                  <Label htmlFor="start-date-to" className="text-xs font-medium text-gray-700 mb-1 block">
                    Call Start Date To
                  </Label>
                  <Input
                    id="start-date-to"
                    type="date"
                    value={filters.startDateTo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('startDateTo', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button onClick={applyFilters} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-2">
            <p className="text-xs text-gray-500 text-right">
              Download CSV with lead names, phone numbers, and entity results
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium text-gray-700">Lead Name</TableHead>
                  <TableHead className="font-medium text-gray-700">Phone Number</TableHead>
                  <TableHead className="font-medium text-gray-700">Interested</TableHead>
                  <TableHead className="font-medium text-gray-700">Call Status</TableHead>
                  <TableHead className="font-medium text-gray-700">Call Start Date </TableHead>
                  <TableHead className="font-medium text-gray-700">Call Duration (mins)</TableHead>
                  <TableHead className="font-medium text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <TableRow key={lead._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">
                        {lead.leadName}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        +{lead.leadNumber}
                      </TableCell>
                      <TableCell>
                        {getInterestBadge(lead.interest)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(lead.status)}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {lead?.callLogId ? formatDate(lead.callLogId.call_start_time) : "-"}
                      </TableCell>
                      {/* <TableCell className="text-gray-700">
                        {lead?.callLogId ? ((lead.callLogId.call_duration)/60).toFixed(2) : "-"}
                      </TableCell> */}
                      <TableCell className="text-gray-700">
  {lead?.callLogId ? formatDuration(lead.callLogId.call_duration) : "-"}
</TableCell>

                      <TableCell>
                        {lead.callLogId ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => lead.callLogId && handleViewCallLog(lead.callLogId._id)}
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          >
                            <ArrowRight className="w-4 h-4" />
                            <span className="ml-1">View Details</span>
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">No call log</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No leads found for this campaign
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
