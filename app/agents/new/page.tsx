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
          backRoute: "/agents",
        }}
      >
        <CreateAgent mode="create" />
      </Dashboard>
    </ProtectedRoute>
  );
}
