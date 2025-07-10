import CreateAgent from "@/components/organisms/create-agent";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import React from "react";

export default function NewAgentPage() {
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Create Agent",
          subtitle: { text: "Create a new agent", className: "text-gray-500" },
          backRoute: "/agents",
        }}
      >
        <CreateAgent mode="create" />
      </Dashboard>
    </ProtectedRoute>
  );
}
