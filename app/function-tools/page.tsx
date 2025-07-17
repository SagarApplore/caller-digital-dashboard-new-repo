import FunctionTools from "@/components/organisms/function-tools";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import React from "react";

const FunctionToolsPage = () => {
  return (
    <ProtectedRoute>
      <Dashboard header={{ title: "Function Tools" }}>
        <FunctionTools />
      </Dashboard>
    </ProtectedRoute>
  );
};

export default FunctionToolsPage;
