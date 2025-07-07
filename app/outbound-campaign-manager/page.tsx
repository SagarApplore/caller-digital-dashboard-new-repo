"use client";

import OutboundCampaignManager from "@/components/organisms/outbound-campaign-manager";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function OutboundCampaignManagerPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Outbound Campaign Manager",
          subtitle: {
            text: "Client Panel",
            className: "bg-cyan-100 text-cyan-700",
          },
          children: (
            <Button
              className="bg-purple-700 hover:bg-purple-800"
              onClick={() => {
                router.push("/outbound-campaign-manager/new");
              }}
            >
              <PlusIcon className="w-4 h-4" />
              Create New Campaign
            </Button>
          ),
        }}
      >
        <OutboundCampaignManager />
      </Dashboard>
    </ProtectedRoute>
  );
}
