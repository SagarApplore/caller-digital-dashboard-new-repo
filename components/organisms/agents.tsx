"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Phone,
  MessageCircle,
  Mail,
  Settings,
  ArrowUpDown,
  BarChart3,
  ChevronDown,
  Globe,
  Languages,
  Play,
  Trash2,
  MoreVertical,
  Copy,
} from "lucide-react";
import { Card, CardContent } from "@/components/organisms/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TestAgentModal from "./test-agent-modal";
import apiRequest from "@/utils/api";
import { toast } from "react-toastify";

export interface AssistantStats {
  conversations: number;
  csatScore: number;
  sentimentScore: number;
  lastActive: string;
}

export interface AssistantCard {
  _id: string;
  agentName: string;
  createdAt: string;
  updatedAt: string;
  chats: {
    agentPrompt: string;
    knowledgeBase: any;
  };
  email: {
    agentPrompt: string;
    knowledgeBase: any;
  };
  voice: {
    agentPrompt: string;
    knowledgeBase: any;
  };
  client: any;
  status: string;
}

interface FilterState {
  status: string;
  channels: string;
  languages: string;
  regions: string;
  sortBy: string;
}

const ContactMethodIcon = ({ method }: { method: string }) => {
  switch (method) {
    case "phone":
      return <Phone className="w-4 h-4 text-blue-600" />;
    case "chat":
      return <MessageCircle className="w-4 h-4 text-purple-600" />;
    case "email":
      return <Mail className="w-4 h-4 text-green-600" />;
    case "whatsapp":
      return <MessageCircle className="w-4 h-4 text-green-600" />;
    default:
      return null;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "bg-green-100 text-green-800 border-green-300";
      case "Test":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Offline":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} font-medium`}>{status}</Badge>
  );
};

const formatNumber = (num: number) => {
  return num.toLocaleString();
};

const getScoreColor = (score: number) => {
  if (score >= 9.5) return "text-green-600";
  if (score >= 9) return "text-yellow-600";
  return "text-red-600";
};

const getActiveColor = (lastActive: string) => {
  if (lastActive === "Now") return "text-green-600";
  if (lastActive.includes("m ago")) return "text-green-600";
  return "text-gray-600";
};

export default function Agents({ assistants }: { assistants: any[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    status: "All Status",
    channels: "All Channels",
    languages: "All Languages",
    regions: "All Regions",
    sortBy: "Sort by Usage",
  });
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [agentMetrics, setAgentMetrics] = useState<{[key: string]: {totalMinutes: number, totalHandoffs: number, sentimentScore:number}}>({});

  // Fetch agent metrics for all agents
  useEffect(() => {
    const fetchAgentMetrics = async () => {
      const metrics: {[key: string]: {totalMinutes: number, totalHandoffs: number, sentimentScore: number}} = {};
      
      for (const assistant of assistants) {
        try {
          const response = await apiRequest(`/vapi/call-logs/agent/${assistant._id}/metrics`, "GET");
          metrics[assistant._id] = {
            totalMinutes: response.data.totalMinutes || 0,
            totalHandoffs: response.data.totalHandoffs || 0,
            sentimentScore:response.data.sentimentScore || 0
          };
        } catch (error) {
          console.error(`Error fetching metrics for agent ${assistant._id}:`, error);
          metrics[assistant._id] = {
            totalMinutes: 0,
            totalHandoffs: 0,
            sentimentScore:0
          };
        }
      }
      
      setAgentMetrics(metrics);
    };

    if (assistants.length > 0) {
      fetchAgentMetrics();
    }
  }, [assistants]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "live", label: "Live" },
    { value: "test", label: "Test" },
    { value: "offline", label: "Offline" },
  ];

  const channelOptions = [
    { value: "all", label: "All Channels" },
    { value: "phone", label: "Phone" },
    { value: "chat", label: "Chat" },
    { value: "email", label: "Email" },
    { value: "whatsapp", label: "WhatsApp" },
  ];

  const languageOptions = [
    { value: "all", label: "All Languages" },
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
  ];

  const regionOptions = [
    { value: "all", label: "All Regions" },
    { value: "us", label: "United States" },
    { value: "eu", label: "Europe" },
    { value: "asia", label: "Asia Pacific" },
    { value: "global", label: "Global" },
  ];

  const sortOptions = [
    { value: "usage", label: "Sort by Usage" },
    { value: "conversations", label: "Sort by Conversations" },
    { value: "csat", label: "Sort by CSAT Score" },
    { value: "resolution", label: "Sort by Resolution Rate" },
    { value: "name", label: "Sort by Name" },
  ];

  const handleTestAgent = (assistant: any) => {
    setSelectedAgent(assistant);
    setIsTestModalOpen(true);
  };

  // Add delete handler function
  const handleDeleteAgent = async (assistant: any) => {
    if (!confirm(`Are you sure you want to delete "${assistant.agentName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiRequest(`/agents/${assistant._id}`, "DELETE");
      if (response?.data?.success) {
        // Refresh the page or update the assistants list
        window.location.reload();
      } else {
        alert("Failed to delete agent. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      alert("Failed to delete agent. Please try again.");
    }
  };

  // Add clone agent handler function
  const handleCloneAgent = async (assistant: any) => {
    try {
      const response = await apiRequest(`/agents/${assistant._id}/clone`, "POST");
      if (response?.data?.success) {
        toast.success(`Agent "${assistant.agentName}" cloned successfully!`);
        // Refresh the page to show the new agent
        window.location.reload();
      } else {
        toast.error("Failed to clone agent. Please try again.");
      }
    } catch (error) {
      console.error("Error cloning agent:", error);
      toast.error("Failed to clone agent. Please try again.");
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center space-x-4 px-4 pb-4 pt-2 bg-white">
        {/* Status Filter */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-white border-gray-300 hover:bg-gray-50"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">{filters.status}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 p-4 bg-white z-20 translate-x-[-20px] shadow-lg rounded-sm shadow-gray-200"
          >
            {statusOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => updateFilter("status", option.label)}
                className="flex items-center space-x-2"
              >
                {option.value !== "all" && (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      option.value === "live"
                        ? "bg-green-500"
                        : option.value === "test"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                )}
                <span>{option.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Channels Filter */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-white border-gray-300 hover:bg-gray-50"
            >
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">{filters.channels}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 p-4 bg-white z-20 translate-x-[-20px] shadow-lg rounded-sm shadow-gray-200"
          >
            {channelOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => updateFilter("channels", option.label)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Languages Filter */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-white border-gray-300 hover:bg-gray-50"
            >
              <Languages className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">{filters.languages}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 p-4 bg-white z-20 translate-x-[-20px] shadow-lg rounded-sm shadow-gray-200"
          >
            {languageOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => updateFilter("languages", option.label)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Regions Filter */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-white border-gray-300 hover:bg-gray-50"
            >
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">{filters.regions}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 p-4 bg-white z-20 translate-x-[-20px] shadow-lg rounded-sm shadow-gray-200"
          >
            {regionOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => updateFilter("regions", option.label)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Sort Filter */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-white border-gray-300 hover:bg-gray-50"
            >
              <ArrowUpDown className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">{filters.sortBy}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 p-4 bg-white z-20 translate-x-[-20px] shadow-lg rounded-sm shadow-gray-200"
          >
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => updateFilter("sortBy", option.label)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      {/* Agents */}
      <div className="p-6 bg-gray-50 h-[calc(100vh-150px)] overflow-y-scroll">
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {assistants.map((assistant) => (
            <Card
              key={assistant._id}
              className="bg-white shadow-lg shadow-gray-200 hover:shadow-md transition-shadow border-none"
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={assistant.agentName || "/placeholder.svg"}
                          alt={assistant.agentName}
                        />
                        <AvatarFallback>
                          {assistant.agentName
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {assistant.agentName}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {assistant.client?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg p-1">
                        <DropdownMenuItem
                          onClick={() => handleTestAgent(assistant)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer rounded-md transition-colors"
                        >
                          <Play className="w-4 h-4 mr-3" />
                          Test
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/agents/edit/${assistant._id}`)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 cursor-pointer rounded-md transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCloneAgent(assistant)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer rounded-md transition-colors"
                        >
                          <Copy className="w-4 h-4 mr-3" />
                          Clone
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteAgent(assistant)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-3" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Phone Numbers (if available) */}
                {assistant?.phoneNumbers && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Phone Numbers
                      </span>
                      {assistant?.showManage && (
                        <Button
                          variant="link"
                          size="sm"
                          className="text-purple-600 hover:text-purple-700 p-0 h-auto"
                        >
                          Manage
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {assistant?.phoneNumbers?.map((number: any) => (
                        <Badge
                          key={number}
                          variant="outline"
                          className="text-xs"
                        >
                          {number}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Methods & Languages */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    {assistant?.contactMethods?.map((method: any) => (
                      <ContactMethodIcon key={method} method={method} />
                    ))}
                    <div className="flex items-center space-x-1 ml-auto">
                      {assistant?.languages?.map((lang: any, index: any) => (
                        <span key={lang} className="text-sm text-gray-600">
                          {lang}
                          {index < assistant?.languages?.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Conversations
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(assistant?.conversations ?? 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Minutes</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {agentMetrics[assistant._id]?.totalMinutes?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Resolution Rate
                    </div>
                    <div
                      className={`text-2xl font-bold ${getScoreColor(
                        agentMetrics[assistant._id]?.sentimentScore
                      )}`}
                    >
                      {agentMetrics[assistant._id]?.sentimentScore*10 || 0}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Total Handoffs
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {agentMetrics[assistant._id]?.totalHandoffs || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <TestAgentModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        agent={selectedAgent}
      />
    </div>
  );
}
