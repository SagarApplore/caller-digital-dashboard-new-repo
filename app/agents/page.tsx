"use client";

import React, { useEffect, useState } from "react";
import Agents, { AssistantCard } from "@/components/organisms/agents";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import { Loader2, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import { useRouter } from "next/navigation";
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";

export default function AgentsPage() {
  const [loading, setLoading] = useState(true);
  const [assistants, setAssistants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const router = useRouter();

  const fetchAssistants = async (search = "") => {
    try {
      setSearchLoading(true);
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      const response = await apiRequest(`${endpoints.assistants.list}${params}`, "GET");
      setAssistants(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchAssistants();
    setLoading(false);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        fetchAssistants(searchQuery.trim());
      } else {
        fetchAssistants();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Agents",
          subtitle: {
            text: searchQuery 
              ? `${assistants.length} results for "${searchQuery}"`
              : `${assistants.length} Active`,
            className:
              "text-purple-700 font-semibold text-xs bg-purple-50 px-2 py-1 rounded-full",
          },
          children: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push("/agents/new");
              }}
            >
              <Plus className="w-4 h-4" />
              Add Agent
            </Button>
          ),
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6 ml-3 mt-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search agents by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full max-w-md"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
                )}
              </div>
            </div>
            
            <Agents assistants={assistants} />
          </>
        )}
      </Dashboard>
    </ProtectedRoute>
  );
}
