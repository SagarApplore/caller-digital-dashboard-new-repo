"use client";

import KnowledgeBase, {
  KnowledgeBaseItem,
  KnowledgeBaseProps,
} from "@/components/molecules/knowledge-base";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import endpoints from "@/lib/endpoints";
import apiRequest from "@/utils/api";
import React, { useEffect, useState } from "react";

const KnowledgeBasePage = () => {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>([]);

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      try {
        const response = await apiRequest(
          endpoints.knowledgeBase.getAll,
          "GET"
        );
        setKnowledgeBase(response?.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching knowledge base:", error);
        setKnowledgeBase([]);
      }
    };
    fetchKnowledgeBase();
  }, []);

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Knowledge Base",
          subtitle: {
            text: "Your knowledge bases",
            className: "bg-purple-200 text-purple-700",
          },
          children: <div className="flex items-center gap-2"></div>,
        }}
      >
        <KnowledgeBase
          knowledgeBase={knowledgeBase}
          setKnowledgeBase={setKnowledgeBase}
        />
      </Dashboard>
    </ProtectedRoute>
  );
};

export default KnowledgeBasePage;
