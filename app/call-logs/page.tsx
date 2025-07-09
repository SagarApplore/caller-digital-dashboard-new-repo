import CallLogs from "@/components/organisms/call-logs";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";

const CallLogsPage = () => {
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Conversation Logs",
          subtitle: { text: "Live", className: "text-gray-700 bg-green-200" },
        }}
      >
        <CallLogs />
      </Dashboard>
    </ProtectedRoute>
  );
};

export default CallLogsPage;
