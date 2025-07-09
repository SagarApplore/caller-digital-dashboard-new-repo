"use client";

import {
  Badge,
  Phone,
  MessageCircle,
  Star,
  ChevronDown,
  Calendar,
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Play,
} from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "./card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import { Input } from "../atoms/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import utils from "@/utils/index.util";
import apiRequest from "@/utils/api";
import { useRouter } from "next/navigation";

export interface Conversation {
  id: string;
  contact: {
    name: string;
    identifier: string;
    avatar: string;
  };
  channel: "voice" | "chat" | "email" | "whatsapp";
  assistant: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  timestampDate: Date;
  duration: string;
  durationSeconds: number;
  status: "resolved" | "escalated" | "pending";
  csat: number;
  confidence: number;
  language: string;
  // Additional API-specific fields
  transcriptUri?: string;
  summaryUri?: string;
  recordingUri?: string;
  callStartTime?: string;
  callEndTime?: string;
  handOff?: boolean;
}

export interface FilterState {
  channel: string;
  assistant: string;
  dateRange: string;
  status: string;
  language: string;
  searchQuery: string;
  quickFilters: {
    escalation: boolean;
    lowCSAT: boolean;
    longDuration: boolean;
  };
  startDate?: string;
  endDate?: string;
}

const CallLogs = () => {
  const [selectedConversations, setSelectedConversations] = useState<string[]>(
    []
  );
  const [apiData, setApiData] = useState<any[]>([]);
  const [agentsData, setAgentsData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateInputs, setDateInputs] = useState({
    startDate: "",
    endDate: "",
  });
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [tempDateFilter, setTempDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [filters, setFilters] = useState<FilterState>({
    channel: "all-channels",
    assistant: "all-assistants",
    dateRange: "last-7-days",
    status: "all-status",
    language: "all-languages",
    searchQuery: "",
    quickFilters: {
      escalation: false,
      lowCSAT: false,
      longDuration: false,
    },
  });

  // Fetch call logs data from API
  const fetchCallLogs = async (
    assistantId?: string,
    startDate?: string,
    endDate?: string
  ) => {
    try {
      const params: any = {};
      if (assistantId && assistantId !== "all-assistants") {
        params.assistantId = assistantId;
      }
      if (startDate) {
        params.createdAtGe = startDate;
      }
      if (endDate) {
        params.createdAtLe = endDate;
      }

      const response = await apiRequest(
        "/vapi/call-logs/getData",
        "GET",
        {},
        params
      );
      setApiData(response.data.data || []);
      setTotalCount(response.data.totalCount || 0);
    } catch (err: any) {
      console.error("Error fetching call logs:", err);
      setError(err.message || "Failed to fetch call logs");
    }
  };

  // Fetch agents data from API
  const fetchAgents = async () => {
    try {
      const response = await apiRequest("/agents", "GET");
      setAgentsData(response.data.data || []);
    } catch (err: any) {
      console.error("Error fetching agents:", err);
      // Don't set error for agents as it's not critical for main functionality
    }
  };

  // Fetch all data on component mount
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchCallLogs(filters.assistant, filters.startDate, filters.endDate),
        fetchAgents(),
      ]);
    } catch (err: any) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch call logs when assistant filter changes
  const fetchCallLogsWithFilter = async (assistantId: string) => {
    try {
      setLoading(true);
      setError(null);
      await fetchCallLogs(assistantId, filters.startDate, filters.endDate);
    } catch (err: any) {
      console.error("Error fetching call logs with filter:", err);
    } finally {
      setLoading(false);
    }
  };

  // Apply date filter
  const applyDateFilter = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchCallLogs(
        filters.assistant,
        dateInputs.startDate,
        dateInputs.endDate
      );
    } catch (err: any) {
      console.error("Error applying date filter:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format date for chip display
  const formatDateForChip = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Handle clear date filter
  const handleClearDateFilter = () => {
    setDateInputs({ startDate: "", endDate: "" });
    setTempDateFilter({ startDate: "", endDate: "" });
    setShowDateFilter(false);
    // Refetch data without date filter
    fetchCallLogs(filters.assistant);
  };

  // Handle apply date filter from temp state
  const handleApplyDateFilter = async () => {
    setDateInputs(tempDateFilter);
    setShowDateFilter(false);
    try {
      setLoading(true);
      setError(null);
      await fetchCallLogs(
        filters.assistant,
        tempDateFilter.startDate,
        tempDateFilter.endDate
      );
    } catch (err: any) {
      console.error("Error applying date filter:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Refetch call logs when assistant filter changes
  useEffect(() => {
    if (filters.assistant) {
      fetchCallLogsWithFilter(filters.assistant);
    }
  }, [filters.assistant]);

  // Close date filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showDateFilter && !target.closest(".date-filter-container")) {
        setShowDateFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateFilter]);

  // Helper function to get time ago
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  // Transform API data to match the Conversation interface
  const transformApiData = (apiData: any[]): Conversation[] => {
    return apiData.map((item, index) => {
      const callStartTime = new Date(item.call_start_time);
      const callEndTime = new Date(item.call_end_time);
      const durationInSeconds = item.call_duration || 0;
      const durationMinutes = Math.floor(durationInSeconds / 60);
      const durationSeconds = durationInSeconds % 60;

      return {
        id: item._id || `temp-${index}`,
        contact: {
          name: item.clientId?.name || `Customer ${index + 1}`,
          identifier:
            item.customer_phone_number ||
            `+1 555-${String(index + 1).padStart(4, "0")}`,
          avatar: "/placeholder.svg?height=32&width=32",
        },
        channel: "voice", // API data is for voice calls
        assistant: {
          name: item.agentId?.agentName || `Agent ${index + 1}`,
          avatar: "/placeholder.svg?height=32&width=32",
        },
        timestamp: getTimeAgo(callStartTime),
        timestampDate: callStartTime,
        duration: `${durationMinutes}m ${durationSeconds}s`,
        durationSeconds: durationInSeconds,
        status: item.hand_off ? "escalated" : "resolved", // Use hand_off to determine status
        csat: Number((4.2 + Math.random() * 0.8).toFixed(2)), // Hardcoded CSAT score
        confidence: Number((75 + Math.random() * 20).toFixed(2)), // Hardcoded confidence score
        language: "english", // Hardcoded language
        // Additional API-specific fields
        transcriptUri: item.transcript_uri,
        summaryUri: item.summary_uri,
        recordingUri: item.recording_uri,
        callStartTime: item.call_start_time,
        callEndTime: item.call_end_time,
        handOff: item.hand_off,
      };
    });
  };

  // Transform API data to conversations
  const allConversations: Conversation[] = useMemo(() => {
    return transformApiData(apiData);
  }, [apiData]);

  // Filter conversations based on current filters
  const filteredConversations = useMemo(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return allConversations.filter((conversation) => {
      // Channel filter
      if (
        filters.channel !== "all-channels" &&
        conversation.channel !== filters.channel
      ) {
        return false;
      }

      // Assistant filter is now handled server-side via API
      // No need for client-side filtering

      // Status filter
      if (
        filters.status !== "all-status" &&
        conversation.status !== filters.status
      ) {
        return false;
      }

      // Language filter
      if (
        filters.language !== "all-languages" &&
        conversation.language !== filters.language
      ) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = [
          conversation.contact.name,
          conversation.contact.identifier,
          conversation.assistant.name,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Quick filters
      if (
        filters.quickFilters.escalation &&
        conversation.status !== "escalated"
      ) {
        return false;
      }

      if (filters.quickFilters.lowCSAT && conversation.csat >= 4.0) {
        return false;
      }

      if (
        filters.quickFilters.longDuration &&
        conversation.durationSeconds < 300
      ) {
        // 5 minutes = 300 seconds
        return false;
      }

      // Date range filter (simplified - in real app would be more sophisticated)
      if (
        filters.dateRange === "last-24-hours" &&
        conversation.timestampDate < oneDayAgo
      ) {
        return false;
      }

      return true;
    });
  }, [filters, allConversations]);

  // Calculate metrics based on filtered data
  const metrics = useMemo(() => {
    const totalConversations = totalCount; // Use totalCount from API
    const resolvedConversations = filteredConversations.filter(
      (c) => c.status === "resolved"
    ).length;
    const escalatedConversations = filteredConversations.filter(
      (c) => c.status === "escalated"
    ).length;
    const avgDuration =
      filteredConversations.reduce((sum, c) => sum + c.durationSeconds, 0) /
        filteredConversations.length || 0;
    const avgCSAT =
      filteredConversations.reduce((sum, c) => sum + c.csat, 0) /
        filteredConversations.length || 0;

    return [
      {
        label: "Total Conversations",
        value: totalConversations.toLocaleString(),
        change: "+8.2%",
        trend: "up" as const,
      },
      {
        label: "Avg. Duration",
        value: `${Math.floor(avgDuration / 60)}m ${Math.floor(
          avgDuration % 60
        )}s`,
        change: "+2.1%",
        trend: "up" as const,
      },
      {
        label: "AI Resolution %",
        // value: `${(
        //   (resolvedConversations / totalConversations) * 100 || 0
        // ).toFixed(1)}%`,
        value: "92.4%",
        change: "+3.5%",
        trend: "up" as const,
      },
      {
        label: "Escalation Rate",
        value: `${(
          (escalatedConversations / totalConversations) * 100 || 0
        ).toFixed(1)}%`,
        change: "-1.2%",
        trend: "down" as const,
      },
      {
        label: "CSAT Score",
        value: `${avgCSAT.toFixed(1)}/5`,
        change: "+0.2",
        trend: "up" as const,
      },
      {
        label: "Token Usage",
        value: "2.4M",
        change: "-0.8%",
        trend: "down" as const,
      },
    ];
  }, [filteredConversations, totalCount]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSelectedConversations([]); // Clear selections when filters change
  };

  const toggleQuickFilter = (filterName: keyof FilterState["quickFilters"]) => {
    setFilters((prev) => ({
      ...prev,
      quickFilters: {
        ...prev.quickFilters,
        [filterName]: !prev.quickFilters[filterName],
      },
    }));
    setSelectedConversations([]);
  };

  const clearAllFilters = () => {
    setFilters({
      channel: "all-channels",
      assistant: "all-assistants",
      dateRange: "last-7-days",
      status: "all-status",
      language: "all-languages",
      searchQuery: "",
      quickFilters: {
        escalation: false,
        lowCSAT: false,
        longDuration: false,
      },
    });
    setDateInputs({
      startDate: "",
      endDate: "",
    });
    setTempDateFilter({
      startDate: "",
      endDate: "",
    });
    setSelectedConversations([]);
  };

  const toggleConversationSelection = (id: string) => {
    setSelectedConversations((prev) =>
      prev.includes(id) ? prev.filter((convId) => convId !== id) : [...prev, id]
    );
  };

  const toggleAllConversations = () => {
    setSelectedConversations((prev) =>
      prev.length === filteredConversations.length
        ? []
        : filteredConversations.map((conv) => conv.id)
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <div className="bg-green-100 text-green-800 border-green-300 px-2 py-1 rounded-full w-fit font-semibold text-xs">
            Resolved
          </div>
        );
      case "escalated":
        return (
          <div className="bg-yellow-100 text-yellow-800 border-yellow-300 px-2 py-1 rounded-full w-fit font-semibold text-xs">
            Escalated
          </div>
        );
      case "pending":
        return (
          <div className="bg-blue-100 text-blue-800 border-blue-300 px-2 py-1 rounded-full w-fit font-semibold text-xs">
            Pending
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 text-gray-800 border-gray-300 px-2 py-1 rounded-full w-fit font-semibold text-xs">
            {status}
          </div>
        );
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "voice":
        return (
          <div className="flex items-center space-x-1 text-blue-600 bg-blue-100 rounded-full px-2 py-1 w-fit">
            <Phone className="w-3 h-3" />
            <span className="text-xs font-semibold">Voice</span>
          </div>
        );
      case "chat":
        return (
          <div className="flex items-center space-x-1 text-purple-600 bg-purple-100 rounded-full px-2 py-1 w-fit">
            <MessageCircle className="w-3 h-3" />
            <span className="text-xs font-semibold">Chat</span>
          </div>
        );
      case "whatsapp":
        return (
          <div className="flex items-center space-x-1 text-green-600 bg-green-100 rounded-full px-2 py-1 w-fit">
            <MessageCircle className="w-3 h-3" />
            <span className="text-xs font-semibold">WhatsApp</span>
          </div>
        );
      case "email":
        return (
          <div className="flex items-center space-x-1 text-gray-600 bg-gray-100 rounded-full px-2 py-1 w-fit">
            <MessageCircle className="w-3 h-3" />
            <span className="text-xs font-semibold">Email</span>
          </div>
        );
      default:
        return <span className="text-xs">{channel}</span>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium">{rating}</span>
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
      </div>
    );
  };

  const hasActiveFilters = () => {
    return (
      filters.channel !== "all-channels" ||
      filters.assistant !== "all-assistants" ||
      filters.status !== "all-status" ||
      filters.language !== "all-languages" ||
      filters.searchQuery !== "" ||
      dateInputs.startDate !== "" ||
      dateInputs.endDate !== "" ||
      Object.values(filters.quickFilters).some(Boolean)
    );
  };

  const router = useRouter();
  return (
    <>
      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <Select
            value={filters.channel}
            onValueChange={(value) => updateFilter("channel", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Channels" />
              <ChevronDown className="w-4 h-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-channels">All Channels</SelectItem>
              <SelectItem value="voice">Voice</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.assistant}
            onValueChange={(value) => updateFilter("assistant", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Assistants" />
              <ChevronDown className="w-4 h-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-assistants">All Assistants</SelectItem>
              {agentsData.map((agent) => (
                <SelectItem
                  key={agent._id || agent.id}
                  value={agent._id || agent.id}
                >
                  {agent.agentName || agent.name || `Agent ${agent._id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative date-filter-container flex items-center">
            <Button
              variant="outline"
              className={`flex items-center h-10 px-4 py-2 rounded-md border text-base font-normal shadow-sm min-w-[160px] ${
                showDateFilter || (dateInputs.startDate && dateInputs.endDate)
                  ? "text-blue-600 border-blue-300 bg-blue-50"
                  : "text-gray-600 border-gray-300 bg-white hover:bg-blue-50"
              }`}
              type="button"
              onClick={() => setShowDateFilter(!showDateFilter)}
            >
              <div className="flex items-center space-x-2 w-full">
                <Calendar className="w-4 h-4" />
                <span className="text-base">
                  {dateInputs.startDate && dateInputs.endDate ? (
                    <span className="flex items-center">
                      <span className="text-gray-600 mr-2">Date Range</span>
                      <div className="w-px h-4 bg-gray-300 mx-2"></div>
                      <span className="text-blue-600 font-medium">
                        {formatDateForChip(dateInputs.startDate)} -{" "}
                        {formatDateForChip(dateInputs.endDate)}
                      </span>
                    </span>
                  ) : (
                    "Date Range"
                  )}
                </span>
                {dateInputs.startDate && dateInputs.endDate && (
                  <button
                    type="button"
                    className="ml-2 p-1 rounded-full hover:bg-red-100 focus:outline-none"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearDateFilter();
                    }}
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                )}
              </div>
            </Button>

            {showDateFilter && (
              <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80">
                <div className="text-gray-900 text-sm font-medium mb-3">
                  Filter by Date Range
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 text-xs mb-1 font-medium">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={tempDateFilter.startDate}
                      onChange={(e) =>
                        setTempDateFilter((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="w-full bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs mb-1 font-medium">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={tempDateFilter.endDate}
                      onChange={(e) =>
                        setTempDateFilter((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="w-full bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  onClick={handleApplyDateFilter}
                  disabled={
                    !tempDateFilter.startDate || !tempDateFilter.endDate
                  }
                >
                  Apply
                </Button>
              </div>
            )}
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Status" />
              <ChevronDown className="w-4 h-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.language}
            onValueChange={(value) => updateFilter("language", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Languages" />
              <ChevronDown className="w-4 h-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-languages">All Languages</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by phone, email, user ID..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              className={`cursor-pointer transition-colors ${
                filters.quickFilters.escalation
                  ? "text-red-600 border-red-300 bg-red-50"
                  : "text-gray-600 border-gray-300 bg-white hover:bg-red-50"
              }`}
              onClick={() => toggleQuickFilter("escalation")}
            >
              Escalation
              {filters.quickFilters.escalation && (
                <X className="w-3 h-3 ml-1" />
              )}
            </Badge>
            <Badge
              className={`cursor-pointer transition-colors ${
                filters.quickFilters.lowCSAT
                  ? "text-yellow-600 border-yellow-300 bg-yellow-50"
                  : "text-gray-600 border-gray-300 bg-white hover:bg-yellow-50"
              }`}
              onClick={() => toggleQuickFilter("lowCSAT")}
            >
              Low CSAT
              {filters.quickFilters.lowCSAT && <X className="w-3 h-3 ml-1" />}
            </Badge>
            <Badge
              className={`cursor-pointer transition-colors ${
                filters.quickFilters.longDuration
                  ? "text-blue-600 border-blue-300 bg-blue-50"
                  : "text-gray-600 border-gray-300 bg-white hover:bg-blue-50"
              }`}
              onClick={() => toggleQuickFilter("longDuration")}
            >
              Long Duration
              {filters.quickFilters.longDuration && (
                <X className="w-3 h-3 ml-1" />
              )}
            </Badge>
          </div>

          {hasActiveFilters() && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-blue-800">Loading call logs...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-800">Error: {error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllData}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {hasActiveFilters() && !loading && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Showing {filteredConversations.length} of {totalCount} conversations
            {filters.searchQuery && ` matching "${filters.searchQuery}"`}
          </p>
        </div>
      )}

      <div className="m-6 space-y-6 h-full">
        {/* Metrics Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-6 gap-4">
            {metrics.map((metric, index) => (
              <Card
                key={index}
                className="bg-white border-none shadow-lg shadow-gray-200"
              >
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.value}
                    </p>
                    <div className="flex items-center space-x-1">
                      {metric.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm ${
                          metric.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Loading Skeleton for Metrics */}
        {loading && (
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="bg-white border-none shadow-lg shadow-gray-200"
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && (
          <div className="overflow-scroll rounded-lg shadow-lg shadow-gray-200 max-h-[calc(100vh-310px)]">
            <Table className="w-full">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-left py-2 px-4 w-12">
                    <Checkbox
                      className="border-gray-300 border h-4 w-4 bg-white"
                      checked={
                        filteredConversations.length > 0 &&
                        selectedConversations.length ===
                          filteredConversations.length
                      }
                      onCheckedChange={toggleAllConversations}
                    />
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Contact
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Channel
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Assistant
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Duration
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    CSAT
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Confidence
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="bg-white">
                {filteredConversations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="p-8 text-center text-gray-500"
                    >
                      {apiData.length === 0
                        ? "No call logs found. Start making calls to see data here."
                        : "No conversations found matching your filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredConversations.map((conversation) => (
                    <TableRow
                      key={conversation.id}
                      className="hover:bg-gray-50 border-gray-50"
                    >
                      <TableCell className="p-4">
                        <Checkbox
                          className="border-gray-300 border h-4 w-4 bg-white"
                          checked={selectedConversations.includes(
                            conversation.id
                          )}
                          onCheckedChange={() =>
                            toggleConversationSelection(conversation.id)
                          }
                        />
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={
                                conversation.contact.avatar ||
                                "/placeholder.svg"
                              }
                            />
                            <AvatarFallback>
                              {conversation.contact.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {conversation.contact.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {conversation.contact.identifier}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        {getChannelIcon(conversation.channel)}
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={
                                conversation.assistant.avatar ||
                                "/placeholder.svg"
                              }
                            />
                            <AvatarFallback>
                              {conversation.assistant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {conversation.assistant.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-sm text-gray-600">
                        {conversation.timestamp}
                      </TableCell>
                      <TableCell className="p-4 text-sm font-medium">
                        {conversation.duration}
                      </TableCell>
                      <TableCell className="p-4">
                        {getStatusBadge(conversation.status)}
                      </TableCell>
                      <TableCell className="p-4">
                        {renderStars(conversation.csat)}
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex flex-col items-start space-y-2">
                          <Progress
                            value={conversation.confidence}
                            className={`h-2 ${utils.colors.getStatusColorByNumber(
                              conversation.confidence
                            )}`}
                          />
                          <span className="text-xs text-gray-600">
                            {conversation.confidence}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 p-0"
                          onClick={() =>
                            router.push(`/call-logs/${conversation.id}`)
                          }
                        >
                          <Play className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Loading Skeleton for Table */}
        {loading && (
          <div className="overflow-scroll rounded-lg shadow-lg shadow-gray-200 max-h-[calc(100vh-310px)]">
            <Table className="w-full">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-left py-2 px-4 w-12">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Contact
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Channel
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Assistant
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Duration
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    CSAT
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Confidence
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 border-gray-50"
                  >
                    <TableCell className="p-4">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center space-x-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-6"></div>
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded animate-pulse w-16"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-8"></div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default CallLogs;
