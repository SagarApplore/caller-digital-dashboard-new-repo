import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import React from "react";

const CallLogsPage = () => {
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Call Logs",
          subtitle: { text: "Call Logs" },
        }}
      >
        <div className="flex flex-col gap-4">
          <div></div>
        </div>
      </Dashboard>
    </ProtectedRoute>
  );
};

export default CallLogsPage;
