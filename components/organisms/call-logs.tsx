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
import React, { useMemo, useState } from "react";
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
}

const CallLogs = () => {
  const [selectedConversations, setSelectedConversations] = useState<string[]>(
    []
  );
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

  // Sample data - in real app this would come from API
  const allConversations: Conversation[] = [
    {
      id: "1",
      contact: {
        name: "John Smith",
        identifier: "+1 555-0123",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      channel: "voice",
      assistant: {
        name: "Sophia AI",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      timestamp: "2 min ago",
      timestampDate: new Date(Date.now() - 2 * 60 * 1000),
      duration: "4m 32s",
      durationSeconds: 272,
      status: "resolved",
      csat: 4.8,
      confidence: 92,
      language: "english",
    },
    {
      id: "2",
      contact: {
        name: "Sarah Johnson",
        identifier: "sarah@email.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      channel: "chat",
      assistant: {
        name: "Max AI",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      timestamp: "5 min ago",
      timestampDate: new Date(Date.now() - 5 * 60 * 1000),
      duration: "2m 15s",
      durationSeconds: 135,
      status: "escalated",
      csat: 3.2,
      confidence: 78,
      language: "english",
    },
    {
      id: "3",
      contact: {
        name: "Maria Garcia",
        identifier: "+1 555-0456",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      channel: "whatsapp",
      assistant: {
        name: "Emma AI",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      timestamp: "10 min ago",
      timestampDate: new Date(Date.now() - 10 * 60 * 1000),
      duration: "6m 45s",
      durationSeconds: 405,
      status: "resolved",
      csat: 4.5,
      confidence: 85,
      language: "spanish",
    },
    {
      id: "4",
      contact: {
        name: "David Wilson",
        identifier: "david@company.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      channel: "email",
      assistant: {
        name: "Sophia AI",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      timestamp: "15 min ago",
      timestampDate: new Date(Date.now() - 15 * 60 * 1000),
      duration: "8m 20s",
      durationSeconds: 500,
      status: "escalated",
      csat: 2.8,
      confidence: 65,
      language: "english",
    },
    {
      id: "5",
      contact: {
        name: "Lisa Chen",
        identifier: "+1 555-0789",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      channel: "voice",
      assistant: {
        name: "Max AI",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      timestamp: "1 hour ago",
      timestampDate: new Date(Date.now() - 60 * 60 * 1000),
      duration: "12m 30s",
      durationSeconds: 750,
      status: "pending",
      csat: 3.8,
      confidence: 72,
      language: "english",
    },
  ];

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

      // Assistant filter
      if (filters.assistant !== "all-assistants") {
        const assistantName = conversation.assistant.name.toLowerCase();
        if (!assistantName.includes(filters.assistant.toLowerCase())) {
          return false;
        }
      }

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
  }, [filters]);

  // Calculate metrics based on filtered data
  const metrics = useMemo(() => {
    const totalConversations = filteredConversations.length;
    const resolvedConversations = filteredConversations.filter(
      (c) => c.status === "resolved"
    ).length;
    const escalatedConversations = filteredConversations.filter(
      (c) => c.status === "escalated"
    ).length;
    const avgDuration =
      filteredConversations.reduce((sum, c) => sum + c.durationSeconds, 0) /
        totalConversations || 0;
    const avgCSAT =
      filteredConversations.reduce((sum, c) => sum + c.csat, 0) /
        totalConversations || 0;

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
        value: `${(
          (resolvedConversations / totalConversations) * 100 || 0
        ).toFixed(1)}%`,
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
  }, [filteredConversations]);

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
              <SelectItem value="sophia">Sophia AI</SelectItem>
              <SelectItem value="max">Max AI</SelectItem>
              <SelectItem value="emma">Emma AI</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.dateRange}
            onValueChange={(value) => updateFilter("dateRange", value)}
          >
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-24-hours">Last 24 hours</SelectItem>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

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

      {/* Results Summary */}
      {hasActiveFilters() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Showing {filteredConversations.length} of {allConversations.length}{" "}
            conversations
            {filters.searchQuery && ` matching "${filters.searchQuery}"`}
          </p>
        </div>
      )}

      <div className="m-6 space-y-6 h-full">
        {/* Metrics Cards */}
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

        {/* Data Table */}
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
                    No conversations found matching your filters.
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
                              conversation.contact.avatar || "/placeholder.svg"
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
      </div>
    </>
  );
};

export default CallLogs;
