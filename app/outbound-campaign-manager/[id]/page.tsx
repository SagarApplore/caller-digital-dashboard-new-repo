"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Phone, User, CheckCircle, XCircle } from "lucide-react";
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
import apiRequest from "@/utils/api";
import { toast } from "react-toastify";

interface CampaignLead {
  _id: string;
  leadName: string;
  leadNumber: number;
  interest: boolean | null;
  status: "answered" | "unanswered";
  callLogId: string | null;
  createdAt: string;
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

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails | null>(null);
  const [leads, setLeads] = useState<CampaignLead[]>([]);
  const [loading, setLoading] = useState(true);

  const campaignId = params.id as string;

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
      const response = await apiRequest(`/campaign-results/${campaignId}`, "GET");
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

  const handleViewCallLog = (callLogId: string) => {
    if (callLogId) {
      router.push(`/call-logs/${callLogId}`);
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

  const getInterestBadge = (interest: boolean | null) => {
    if (interest === true) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Yes
        </Badge>
      );
    } else if (interest === false) {
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
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
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
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-purple-600" />
             <h2 className="text-lg font-semibold text-gray-900 m-4">Campaign Leads ({leads.length})</h2>
          </CardTitle>
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
                      <TableCell>
                        {lead.callLogId ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCallLog(lead.callLogId!)}
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
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
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
