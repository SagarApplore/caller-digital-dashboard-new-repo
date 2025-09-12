"use client";

import ViewCallLog from "@/components/organisms/view-call-log";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import React from "react";
import { useSearchParams } from "next/navigation";

const CallLogsPage = ({ params }: { params: { id: string } }) => {
  const searchParams = useSearchParams();
  const source = searchParams?.get('source') || '';
  
  // Determine back route based on source
  const getBackRoute = () => {
    if (source === 'campaign') {
      // Extract campaign ID from the referrer or pass it as a parameter
      const campaignId = searchParams?.get('campaignId') || '';
      if (campaignId) {
        return `/outbound-campaign-manager/${campaignId}`;
      }
      // If no campaign ID, go back to campaigns list
      return "/outbound-campaign-manager";
    }
    // Get the page number from query params to preserve pagination state
    const page = searchParams?.get('page') || '';
    return page ? `/call-logs?page=${page}` : "/call-logs";
  };

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Conversation Details",
          subtitle: { text: "" },
          backRoute: getBackRoute(),
        }}
      >
        <ViewCallLog id={params?.id} />
      </Dashboard>
    </ProtectedRoute>
  );
};

export default CallLogsPage;
