import OutboundCampaignManager from "@/components/organisms/outbound-campaign-manager";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";

export default function OutboundCampaignManagerPage() {
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Outbound Campaign Manager",
          subtitle: {
            text: "Client Panel",
            className: "bg-cyan-100 text-cyan-700",
          },
        }}
      >
        <OutboundCampaignManager />
      </Dashboard>
    </ProtectedRoute>
  );
}
