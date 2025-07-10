"use client";

import React, { useEffect, useState } from "react";
import Agents, { AssistantCard } from "@/components/organisms/agents";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";

export default function AgentsPage() {
  const [loading, setLoading] = useState(true);
  const [assistants, setAssistants] = useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchAssistants = async () => {
      const response = await apiRequest(endpoints.assistants.list, "GET");
      setAssistants(response?.data?.data);
    };
    fetchAssistants();
    // new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
    //   setAssistants([
    //     {
    //       id: "sophia",
    //       name: "Sophia AI",
    //       role: "Customer Support",
    //       avatar: "/placeholder.svg?height=48&width=48",
    //       status: "Live",
    //       phoneNumbers: ["+1-555-0123", "+1-555-0124"],
    //       languages: ["EN", "ES", "FR"],
    //       contactMethods: ["phone", "chat", "email"],
    //       stats: {
    //         conversations: 2847,
    //         csatScore: 98,
    //         resolutionRate: 94,
    //         lastActive: "Now",
    //       },
    //       showManage: true,
    //     },
    //     {
    //       id: "max",
    //       name: "Max AI",
    //       role: "Sales Assistant",
    //       avatar: "/placeholder.svg?height=48&width=48",
    //       status: "Live",
    //       languages: ["EN", "DE"],
    //       contactMethods: ["phone", "whatsapp"],
    //       stats: {
    //         conversations: 1523,
    //         csatScore: 96,
    //         resolutionRate: 89,
    //         lastActive: "2m ago",
    //       },
    //     },
    //     {
    //       id: "emma",
    //       name: "Emma AI",
    //       role: "Technical Support",
    //       avatar: "/placeholder.svg?height=48&width=48",
    //       status: "Test",
    //       languages: ["EN"],
    //       contactMethods: ["chat", "email"],
    //       stats: {
    //         conversations: 342,
    //         csatScore: 92,
    //         resolutionRate: 90,
    //         lastActive: "Now",
    //       },
    //     },
    //   ]);
    // });
    setLoading(false);
  }, []);

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Agents",
          subtitle: {
            text: `${assistants.length} Active`,
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
          <Agents assistants={assistants} />
        )}
      </Dashboard>
    </ProtectedRoute>
  );
}
