import Dashboard from "@/components/templates/dashboard";
import { ProtectedRoute } from "@/components/protected-route";
import AnalyticsDashboard from "@/components/organisms/analytics-dashboard";
import { title } from "process";

export default function Page() {
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Dashboard",
          subtitle: {
            text: "Beta",
            className: "bg-purple-100 text-purple-700",
          },
        }}
        children={<AnalyticsDashboard />}
      />
    </ProtectedRoute>
  );
}
