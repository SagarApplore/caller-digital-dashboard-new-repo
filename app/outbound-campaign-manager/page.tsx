"use client";

import OutboundCampaignManager from "@/components/organisms/outbound-campaign-manager";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import { PlusIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/api";
import endpoints from "@/lib/endpoints";

export default function OutboundCampaignManagerPage() {
  const router = useRouter();

  // Export all campaigns data
  const handleExportAllCampaigns = async () => {
    try {
      toast.info("Preparing export... This may take a moment.");

      const response = await apiRequest(
        endpoints.outboundCampaign.exportAll,
        "GET"
      );

      if (response.data?.success) {
        const exportData = response.data.data;

        // Create workbook
        const wb = XLSX.utils.book_new();

        // Create worksheet from data
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, "All Campaigns Data");

        // Download the file
        const fileName = `all_campaigns_data_${new Date()
          .toISOString()
          .split("T")[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);

        toast.success(`Exported ${exportData.length} records successfully!`);
      } else {
        toast.error(response.data?.message || "Failed to export data");
      }
    } catch (error) {
      console.error("Error exporting campaigns:", error);
      toast.error("Failed to export campaigns data");
    }
  };

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Outbound Campaign Manager",
          subtitle: {
            text: "Beta",
            className: "bg-cyan-100 text-cyan-700",
          },
          children: (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExportAllCampaigns}
                className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export All Campaigns Data
              </Button>
              <Button
                className="bg-purple-700 hover:bg-purple-800"
                onClick={() => {
                  router.push("/outbound-campaign-manager/new");
                }}
              >
                <PlusIcon className="w-4 h-4" />
                Create New Campaign
              </Button>
            </div>
          ),
        }}
      >
        <OutboundCampaignManager />
      </Dashboard>
    </ProtectedRoute>
  );
}
