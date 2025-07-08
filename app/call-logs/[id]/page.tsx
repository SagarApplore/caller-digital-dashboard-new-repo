import ViewCallLog from "@/components/organisms/view-call-log";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import React from "react";

const CallLogsPage = ({ params }: { params: { id: string } }) => {
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Call Logs",
          subtitle: { text: "Call Logs" },
        }}
      >
        <ViewCallLog id={params.id} />
      </Dashboard>
    </ProtectedRoute>
  );
};

export default CallLogsPage;
