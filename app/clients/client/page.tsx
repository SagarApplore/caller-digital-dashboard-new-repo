import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import { AddClientPage } from "@/pages/add-client";

export default function ClientPage() {
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Client Setup",
          subtitle: {
            text: "Super Admin",
            className: "text-red-700 bg-red-100",
          },
          backRoute: "/clients",
        }}
      >
        <AddClientPage />
      </Dashboard>
    </ProtectedRoute>
  );
}
