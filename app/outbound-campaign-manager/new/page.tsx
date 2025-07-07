import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import CreateCampaign from "@/pages/create-campaign";

export default function NewCampaignPage() {
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Create New Campaign",
          subtitle: {
            text: "Wizard Setup",
            className: "bg-cyan-100 text-cyan-700",
          },
          backRoute: "/outbound-campaign-manager",
        }}
      >
        <CreateCampaign />
      </Dashboard>
    </ProtectedRoute>
  );
}
