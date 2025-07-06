import OutboundCampaign from "@/components/organisms/outbound-campaign";
import Dashboard from "@/components/templates/dashboard";
import { ProtectedRoute } from "@/components/protected-route";
import React from "react";
import { Button } from "@/components/ui/button";
import { Pause, Square } from "lucide-react";

export default function OutboundCampaignPage() {
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Holiday Promotion Campaign",
          subtitle: {
            text: "Running",
            className: "bg-green-100 text-green-700",
          },
          backRoute: "/outbound-campaign-manager",
          children: (
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Started: 2:14 PM</span>
                <span>Duration: 1h 23m</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                >
                  <Square className="w-4 h-4 mr-1" />
                  Stop
                </Button>
              </div>
            </div>
          ),
        }}
      >
        <OutboundCampaign />
      </Dashboard>
    </ProtectedRoute>
  );
}
