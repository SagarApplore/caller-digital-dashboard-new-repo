"use client";

import CreateAgent from "@/components/organisms/create-agent";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";
import { Loader2 } from "lucide-react";

export default function EditAgentPage() {
  const params = useParams();
  const agentId = params?.id as string;
  const [agentData, setAgentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await apiRequest(
          `${endpoints.assistants.get}/${agentId}`,
          "GET"
        );
        setAgentData(response.data?.data?.[0]);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgentData();
    }
  }, [agentId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <Dashboard
          header={{
            title: "Edit Agent",
            subtitle: {
              text: "Loading agent data...",
              className: "text-gray-500",
            },
            backRoute: "/agents",
          }}
        >
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </Dashboard>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Edit Agent",
          subtitle: {
            text: agentData?.agentName || "Edit agent configuration",
            className: "text-gray-500",
          },
          backRoute: "/agents",
        }}
      >
        <CreateAgent mode="edit" agentId={agentId} initialData={agentData} />
      </Dashboard>
    </ProtectedRoute>
  );
}
