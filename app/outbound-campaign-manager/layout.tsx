import Dashboard from "@/components/templates/dashboard";
import { ProtectedRoute } from "@/components/protected-route";

export default function OutboundCampaignManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Dashboard>{children}</Dashboard>
    </ProtectedRoute>
  );
}
