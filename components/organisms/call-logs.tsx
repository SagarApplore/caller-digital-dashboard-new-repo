"use client";

import {
  Badge,
  Phone,
  MessageCircle,
  Star,
  Calendar,
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Play,
} from "lucide-react";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "./card";
import * as XLSX from 'xlsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
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
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { toast } from "react-toastify";
import { debounce } from "lodash";

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
  status: "resolved" | "escalated" | "answered" | "unanswered";
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
  cost?: ({ total?: number } & { [key: string]: number });
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
  const [totalMinutes, setTotalMinutes] = useState<number>(0);
  const [totalCostAllCalls, setTotalCostAllCalls] = useState<number>(0);
  const [escalationMetrics, setEscalationMetrics] = useState<{
    totalCalls: number;
    escalatedCalls: number;
    escalationRate: number;
    aiResolutionPercentage: number;
  }>({
    totalCalls: 0,
    escalatedCalls: 0,
    escalationRate: 0,
    aiResolutionPercentage: 100,
  });

  const [sentimentMetrics, setSentimentMetrics]=useState<{
    totalCalls: number;
    positiveSentiments: number;
    neutralSentiments: number;
    negativeSentiments: number;
    sentimentScore:number
  }>({
   totalCalls: 0,
    positiveSentiments: 0,
    neutralSentiments: 0,
    negativeSentiments: 0,
    sentimentScore:0
  });
  
  
  // Pagination state
  const searchParams = useSearchParams();
  const pageParam = searchParams?.get('page');
  const [currentPage, setCurrentPage] = useState<number>(pageParam ? parseInt(pageParam) : 1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Fetch call logs data from API
  const fetchCallLogs = async (
    assistantId?: string,
    startDate?: string,
    endDate?: string,
    page: number = currentPage,
    limit: number = pageSize,
    status?: string,
    searchQuery?: string
  ) => {
    try {
      const params: any = {
        page: page.toString(),
        limit: limit.toString(),
      };
      if (assistantId && assistantId !== "all-assistants") {
        params.assistantId = assistantId;
      }
      if (startDate) {
        params.createdAtGe = startDate;
      }
      if (endDate) {
        params.createdAtLe = endDate;
      }
      if (status && status !== "all-status") {
        if( status==="escalated" || status==="resolved"){
          params.hand_off = status === "escalated";
        }
        else{
          params.status =status
        }
        
      }
      if (searchQuery && searchQuery.trim() !== "") {
        params.search = searchQuery.trim();
      }

      console.log('🔍 Frontend API params:', params);

      const response = await apiRequest(
        "/vapi/call-logs/getData",
        "GET",
        {},
        params
      );
      setApiData(response.data.data || []);
      setTotalCount(response.data.totalCount || 0);
      setTotalMinutes(response.data.totalMinutes || 0);
      setTotalCostAllCalls(response.data.totalCostAllCalls || 0);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
      setEscalationMetrics(response.data.escalationMetrics || {
        totalCalls: 0,
        escalatedCalls: 0,
        escalationRate: 0,
        aiResolutionPercentage: 100,
      });
      setSentimentMetrics(response.data?.sentimentMetrics)
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

  // Fetch all data (used for retry button)
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the current page from state
      const page = currentPage;
      console.log("fetch 1")
      await Promise.all([
        fetchCallLogs(filters.assistant, dateInputs.startDate, dateInputs.endDate, page, pageSize, filters.status, filters.searchQuery),
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
      // Reset to page 1 when filtering by assistant
      setCurrentPage(1);
      // Update URL to reflect page reset
      router.push(`/call-logs?page=1`, { scroll: false });
      console.log("fetch 2 with page: 1 (reset for assistant filter)")
      await fetchCallLogs(assistantId, dateInputs.startDate, dateInputs.endDate, 1, pageSize, filters.status, filters.searchQuery);
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
      setCurrentPage(1); // Reset to first page when filter changes
       console.log("fetch 3")
      await fetchCallLogs(
        filters.assistant,
        dateInputs.startDate,
        dateInputs.endDate,
        1,
        pageSize,
        filters.status,
        filters.searchQuery
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
    setCurrentPage(1); // Reset to first page when filter changes
    // Refetch data without date filter
     console.log("fetch 4")
    fetchCallLogs(filters.assistant, undefined, undefined, 1, pageSize, filters.status, filters.searchQuery);
  };

  // Handle apply date filter from temp state
  const handleApplyDateFilter = async () => {
    // Validate that end date is not earlier than start date
    if (tempDateFilter.startDate && tempDateFilter.endDate) {
      const startDate = new Date(tempDateFilter.startDate);
      const endDate = new Date(tempDateFilter.endDate);
      
      if (endDate < startDate) {
        toast.error("End date cannot be earlier than start date");
        return;
      }
    }
    
    setDateInputs(tempDateFilter);
    setShowDateFilter(false);
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1); // Reset to first page when filter changes
       console.log("fetch 5")
      await fetchCallLogs(
        filters.assistant,
        tempDateFilter.startDate,
        tempDateFilter.endDate,
        1,
        pageSize,
        filters.status,
        filters.searchQuery
      );
    } catch (err: any) {
      console.error("Error applying date filter:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Use the page from URL parameters when component mounts
    const initialPage = pageParam ? parseInt(pageParam) : 1;
    // Set current page from URL parameter
    setCurrentPage(initialPage);
    // Fetch data with the correct page
     console.log("fetch 6")
    fetchCallLogs(filters.assistant, dateInputs.startDate, dateInputs.endDate, initialPage, pageSize, filters.status, filters.searchQuery);
    fetchAgents();
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
          name: `Customer\t\t(${item?.customer_phone_number})` || `Customer ${index + 1}`,
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
        status: item.call_type === "inbound" ? (item.hand_off ? "escalated" : "resolved") : (item.status === "answered" ?"answered":"unanswered" ), // Use hand_off to determine status
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
        cost: item.cost || undefined,
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

      // Status filter is now handled server-side via API
      // No need for client-side filtering

      // Language filter is now handled server-side via API
      // No need for client-side filtering

      // Search query is now handled server-side via API
      // No need for client-side filtering

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
        value: escalationMetrics.totalCalls > 0 ? `${escalationMetrics.aiResolutionPercentage}%` : "N/A",
        change: "N/A",
        trend: "up" as const,
      },
      {
        label: "Escalation Rate",
        value: escalationMetrics.totalCalls > 0 ? `${escalationMetrics.escalationRate}%` : "N/A",
        change: "N/A",
        trend: "down" as const,
      },
      // {
      //   label: "Total Cost",
      //   value: `₹${totalCostAllCalls.toFixed(2)}`,
      //   change: "N/A",
      //   trend: "up" as const,
      // },
      {
        label: " Sentiment Score",
        value:   sentimentMetrics?.sentimentScore,
        change: "N/A",
        trend: "up" as const,
      },
      {
        label: "Total Minutes",
        value: `${totalMinutes.toFixed(2)} min`,
        change: "N/A",
        trend: "down" as const,
      },
    ];
  }, [filteredConversations, totalCount, totalMinutes, totalCostAllCalls, escalationMetrics]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      try {
        setLoading(true);
        setError(null);
        // For search, we still want to reset to page 1 as this is expected behavior
        setCurrentPage(1); 
        console.log("fetch 7")
        await fetchCallLogs(filters.assistant, dateInputs.startDate, dateInputs.endDate, 1, pageSize, filters.status, searchQuery);
      } catch (err: any) {
        console.error("Error fetching call logs with search:", err);
        setError(err.message || "Failed to fetch call logs");
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms delay
    [filters.assistant, dateInputs.startDate, dateInputs.endDate, filters.status, pageSize]
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    updateFilter("searchQuery", value);
    debouncedSearch(value);
  };


    // Function to fetch transcript content from URL

  const fetchTranscriptContent = async (transcriptUrl: string): Promise<string> => {
  if (!transcriptUrl) return "";

  try {
    // Request transcript file (could be .txt, .json, or .vtt depending on how it's stored)
    const response = await fetch(transcriptUrl, {
      method: "GET",
      headers: {
        Accept: "text/plain,application/json,text/vtt",
      },
    });

    if (response.ok) {
      const contentType = response.headers.get("Content-Type") || "";

      let content = "";
      if (contentType.includes("application/json")) {
        const jsonData = await response.json();
        // Assuming transcript JSON has an array of items with "text"
        if (Array.isArray(jsonData)) {
          content = jsonData.map((line: any) => line.text || "").join(" ");
        } else if (jsonData.transcript) {
          content = jsonData.transcript;
        } else {
          content = JSON.stringify(jsonData, null, 2);
        }
      } else {
        // For plain text, VTT, or SRT
        content = await response.text();
      }

      return content.trim();
    } else {
      console.warn(`Failed to fetch transcript from ${transcriptUrl}: ${response.status} ${response.statusText}`);
      return `[Failed to fetch transcript: ${response.status}]`;
    }
  } catch (error) {
    console.error(`Error fetching transcript from ${transcriptUrl}:`, error);
    return `[Error: ${error instanceof Error ? error.message : "Unknown error"}]`;
  }
};


  // Function to fetch summary content from URL

  const fetchSummaryContent = async (summaryUrl: string): Promise<string> => {
    if (!summaryUrl) return "";
    
    try {
      // Add CORS headers for S3 requests
      const response = await fetch(summaryUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain,text/html',
        },
      });
      
      if (response.ok) {
        const content = await response.text();
        return content.trim();
      } else {
        console.warn(`Failed to fetch summary from ${summaryUrl}: ${response.status} ${response.statusText}`);
        return `[Failed to fetch: ${response.status}]`;
      }
    } catch (error) {
      console.error(`Error fetching summary from ${summaryUrl}:`, error);
      return `[Error: ${error instanceof Error ? error.message : 'Unknown error'}]`;
    }
  };

  const handleExportCallLogs = async (callLogs: any, format: 'csv' | 'xlsx') => {
    if (!callLogs || !Array.isArray(callLogs) || callLogs.length === 0) {
      console.warn("No call log data available to export");
      return;
    }

    // Show loading state
    toast.info("Preparing export... This may take a moment while fetching summary content.");

    try {
      // Fetch summary content for all logs
      const exportDataPromises = callLogs.map(async (log) => {
        const summaryContent = await fetchSummaryContent(log.summary_uri);
        const transcriptContent = await fetchTranscriptContent((log.transcript_uri))
        // Process entity_result data
        let entityResultData = "";
        if (log.entity_result) {
          if (typeof log.entity_result === 'object' && log.entity_result !== null) {
            // Convert object to key-value pairs
            const entityPairs = Object.entries(log.entity_result).map(([key, value]) => {
              const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
              const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
              return `${formattedKey}: ${formattedValue}`;
            });
            entityResultData = entityPairs.join(' | ');
          } else if (Array.isArray(log.entity_result)) {
            // Handle array format
            const entityPairs = log.entity_result.map((item: any) => {
              if (typeof item === 'object' && item !== null) {
                return Object.entries(item).map(([key, value]) => {
                  const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                  const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                  return `${formattedKey}: ${formattedValue}`;
                }).join(', ');
              }
              return String(item);
            });
            entityResultData = entityPairs.join(' | ');
          }
        }
        
        return {
          "Customer Number": log.customer_phone_number || "",
          "Customer Name": log.clientId?.name || "",
          "Agent Name": log.agentId?.agentName || "",
          "Duration (mins)": log.call_duration || "",
          "Transcript Content":transcriptContent || "",
          "Summary Content": summaryContent || "",
          "Transcript URL":log.transcript_uri ||"",
          "Summary URL": log.summary_uri || "",
          "Audio URL": log.recording_uri || "",
          "Agent Number": log.agent_phone_number || "",
          "Tags": log.tags || [],
          "Intent": log.intent || "",
          "Sentiment": log.sentiment || "",
          "AI Analysis": log.ai_analysis || "",
          "Language": log.agentId?.languages?.join(",") || "",
          "Entity Result": entityResultData || ""
        };
      });

      const exportData = await Promise.all(exportDataPromises);

      if (format === 'csv') {
        const csvContent = [
          Object.keys(exportData[0]),
          ...exportData.map(row => Object.values(row)),
        ].map(row =>
          row
            .map(field => {
              // Escape quotes and commas
              if (typeof field === 'string' && /[",\n]/.test(field)) {
                return `"${field.replace(/"/g, '""')}"`;
              }
              return field;
            })
            .join(',')
        ).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'call_logs_report.csv';
        link.click();
      } else {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Call Logs');
        
        // Create separate sheet for entity results if any exist
        const entityResultsData: any[] = [];
        callLogs.forEach((log, index) => {
          if (log.entity_result) {
            if (typeof log.entity_result === 'object' && log.entity_result !== null) {
              entityResultsData.push({
                "Call Log ID": log._id || `Call ${index + 1}`,
                "Customer Number": log.customer_phone_number || "",
                "Customer Name": log.clientId?.name || "",
                ...Object.fromEntries(
                  Object.entries(log.entity_result).map(([key, value]) => [
                    key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
                    typeof value === 'object' ? JSON.stringify(value) : String(value)
                  ])
                )
              });
            } else if (Array.isArray(log.entity_result)) {
              log.entity_result.forEach((item: any, itemIndex: number) => {
                if (typeof item === 'object' && item !== null) {
                  entityResultsData.push({
                    "Call Log ID": log._id || `Call ${index + 1}`,
                    "Customer Number": log.customer_phone_number || "",
                    "Customer Name": log.clientId?.name || "",
                    "Entity Index": itemIndex + 1,
                    ...Object.fromEntries(
                      Object.entries(item).map(([key, value]) => [
                        key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
                        typeof value === 'object' ? JSON.stringify(value) : String(value)
                      ])
                    )
                  });
                }
              });
            }
          }
        });
        
        if (entityResultsData.length > 0) {
          const entityWs = XLSX.utils.json_to_sheet(entityResultsData);
          XLSX.utils.book_append_sheet(wb, entityWs, 'Entity Results');
        }
        
        XLSX.writeFile(wb, 'call_logs_report.xlsx');
      }

      toast.success("Export completed successfully!");
    } catch (error) {
      console.error("Error during export:", error);
      toast.error("Export failed. Please try again.");
    }
  };

  const toggleQuickFilter = (filterName: keyof FilterState["quickFilters"]) => {
    setFilters((prev) => ({
      ...prev,
      quickFilters: {
        ...prev.quickFilters,
        [filterName]: !prev.quickFilters[filterName],
      },
    }));
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
    setDateInputs({ startDate: "", endDate: "" });
    setTempDateFilter({ startDate: "", endDate: "" });
    setShowDateFilter(false);
    setCurrentPage(1); // Reset to first page when clearing filters
     console.log("fetch 8")
    fetchCallLogs("all-assistants", undefined, undefined, 1, pageSize, filters.status, filters.searchQuery);
  };

  // Pagination functions
  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(page);
      // Update URL with the new page parameter
      router.push(`/call-logs?page=${page}`, { scroll: false });
       console.log("fetch 9")
      await fetchCallLogs(
        filters.assistant,
        dateInputs.startDate,
        dateInputs.endDate,
        page,
        pageSize,
        filters.status,
        filters.searchQuery
      );
    } catch (err: any) {
      console.error("Error changing page:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSizeChange = async (newPageSize: number) => {
    try {
      setLoading(true);
      setError(null);
      setPageSize(newPageSize);
      setCurrentPage(1); // Reset to first page when changing page size
       console.log("fetch 10")
      await fetchCallLogs(
        filters.assistant,
        dateInputs.startDate,
        dateInputs.endDate,
        1,
        newPageSize,
        filters.status,
        filters.searchQuery
      );
    } catch (err: any) {
      console.error("Error changing page size:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleConversationSelection = (id: string) => {
    // This function is no longer needed as there's no checkbox
  };

  const toggleAllConversations = () => {
    // This function is no longer needed as there's no checkbox
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
      case "answered":
        return (
          <div className="bg-green-100 text-green-800 border-green-300 px-2 py-1 rounded-full w-fit font-semibold text-xs">
            Answered
          </div>
        );
         case "unanswered":
        return (
          <div className="bg-red-100 text-red-800 border-red-300 px-2 py-1 rounded-full w-fit font-semibold text-xs">
            UnAnswered
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-lg shadow-sm gap-4">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
          <Select
            value={filters.channel}
            onValueChange={(value) => updateFilter("channel", value)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Channels" />
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
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Assistants" />
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

          <div className="relative date-filter-container flex items-center w-full sm:w-auto">
            <Button
              variant="outline"
              className={`flex items-center h-10 px-4 py-2 rounded-md border text-base font-normal shadow-sm min-w-[160px] w-full sm:w-auto ${
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
            onValueChange={async (value) => {
              try {
                console.log('🔍 Status filter changed to:', value);
                setLoading(true);
                setError(null);
                updateFilter("status", value);
                // Trigger API call when status changes
                 console.log("fetch 11")
                await fetchCallLogs(filters.assistant, dateInputs.startDate, dateInputs.endDate, 1, pageSize, value, filters.searchQuery);
              } catch (err: any) {
                console.error("Error fetching call logs with status filter:", err);
                setError(err.message || "Failed to fetch call logs");
              } finally {
                setLoading(false);
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="answered">Answered</SelectItem>
              <SelectItem value="unanswered">Unanswered</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.language}
            onValueChange={(value) => updateFilter("language", value)}
          >
            {/* <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Languages" />
            </SelectTrigger> */}
            {/* <SelectContent>
              <SelectItem value="all-languages">All Languages</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
            </SelectContent> */}
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by assistant or contact"
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <button onClick={() => handleExportCallLogs(apiData, 'xlsx')} className="text-white bg-lime-600 rounded-md px-2 py-1 cursor-pointer">Export Data</button>

          {/* <div className="flex flex-row flex-wrap items-center gap-2">
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
          </div> */}

          {/* {hasActiveFilters() && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )} */}
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
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

      <div className="m-2 sm:m-6 space-y-6">
        {/* Metrics Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
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
          <div className="overflow-x-auto rounded-lg shadow-lg shadow-gray-200">
            <Table className="w-full min-w-[700px]">
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Contact
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Channel
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Assistant
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Duration
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Status
                  </TableHead>
                  {/* <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Total Cost
                  </TableHead> */}
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="bg-white">
                {filteredConversations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
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
                      <TableCell className="p-2 sm:p-4">
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
                            <div className="font-medium text-gray-900 text-xs sm:text-base">
                              {conversation.contact.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              {conversation.contact.identifier}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-2 sm:p-4">
                        {getChannelIcon(conversation.channel)}
                      </TableCell>
                      <TableCell className="p-2 sm:p-4">
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
                          <span className="text-xs sm:text-sm font-medium">
                            {conversation.assistant.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-2 sm:p-4 text-xs sm:text-sm text-gray-600">
                        {conversation.timestamp}
                      </TableCell>
                      <TableCell className="p-2 sm:p-4 text-xs sm:text-sm font-medium">
                        {conversation.duration}
                      </TableCell>
                      <TableCell className="p-2 sm:p-4">
                        {getStatusBadge(conversation.status)}
                      </TableCell>
                      {/* <TableCell className="p-2 sm:p-4 text-xs sm:text-sm font-medium"> */}
                        {/* {conversation.cost && typeof conversation.cost.total === "number" ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-pointer underline decoration-dotted">
                                  ₹{conversation.cost.total.toFixed(2)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="p-4 max-w-sm">
                                <div className="space-y-3">
                                  <div className="border-b border-gray-200 pb-2">
                                    <h4 className="font-semibold text-sm text-gray-900">Cost Breakdown</h4>
                                    <p className="text-xs text-gray-500">Per call cost components</p>
                                  </div>
                                  <div className="space-y-2">
                                    {Object.entries(conversation.cost)
                                      .filter(([k]) => k !== "total")
                                      .map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center text-xs py-1">
                                          <span className="text-gray-600 capitalize pr-4">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                          </span>
                                          <span className="font-medium text-gray-900 min-w-[60px] text-right">₹{value.toFixed(2)}</span>
                                        </div>
                                      ))}
                                  </div>
                                  <div className="border-t border-gray-200 pt-2">
                                    <div className="flex justify-between items-center">
                                      <span className="font-semibold text-sm text-gray-900">Total</span>
                                      <span className="font-bold text-sm text-purple-600">₹{conversation.cost.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )} */}
                      {/* </TableCell> */}
                      {/* <TableCell className="p-4">
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
                      </TableCell> */}
                      <TableCell className="p-2 sm:p-4">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 p-0"
                          onClick={() =>
                            router.push(`/call-logs/${conversation.id}?page=${currentPage}`)
                          }
                        >
                          <Play className="w-4 h-4 mr-1" />
                          <span className="hidden xs:inline">View Details</span>
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
          <div className="overflow-x-auto rounded-lg shadow-lg shadow-gray-200">
            <Table className="w-full min-w-[700px]">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  {/* <TableHead className="text-left py-2 px-2 sm:px-4 w-12">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableHead> */}
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Contact
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Channel
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Assistant
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Duration
                  </TableHead>
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </TableHead>
                  {/* <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Total Cost
                  </TableHead> */}
                  {/* <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    CSAT
                  </TableHead>
                  <TableHead className="text-left py-2 px-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Confidence
                  </TableHead> */}
                  <TableHead className="text-left py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
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
                    {/* <TableCell className="p-2 sm:p-4">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell> */}
                    <TableCell className="p-2 sm:p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                    </TableCell>
                    {/* <TableCell className="p-4">
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
                    </TableCell> */}
                    <TableCell className="p-2 sm:p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => handlePageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">entries per page</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {((currentPage - 1) * pageSize) + 1} to{" "}
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1"
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="px-3 py-1 min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}


    </>
  );
};

export default CallLogs;
