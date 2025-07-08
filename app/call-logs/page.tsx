import CallLogs from "@/components/organisms/call-logs";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";

const CallLogsPage = () => {
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Call Logs",
          subtitle: { text: "Call Logs" },
        }}
      >
        <CallLogs />
      </Dashboard>
    </ProtectedRoute>
  );
};

export default CallLogsPage;
