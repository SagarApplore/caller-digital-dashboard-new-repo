"use client";

import { useState } from "react";
import { Sidebar } from "../sidebar";
import { CampaignsPage } from "../../pages/campaigns";
import { CreateCampaignPage } from "../../pages/create-campaign";
import { ClientsPage } from "../../pages/clients";
import { AddClientPage } from "../../pages/add-client";
import { AssistantsPage } from "../../pages/assistants";
import { AnalyticsPage } from "../../pages/analytics";
import { TranscriptsPage } from "../../pages/transcripts";
import { LLMConfigPage } from "../../pages/llm-config";
import { MonetizationPage } from "../../pages/monetization";
import PromotionCampaign from "./outbound-campaign";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("campaigns");

  const renderPage = () => {
    switch (currentPage) {
      case "campaigns":
        return <PromotionCampaign />;
      case "create-campaign":
        return <CreateCampaignPage />;
      case "clients":
        return <ClientsPage onPageChange={setCurrentPage} />;
      case "add-client":
        return <AddClientPage onPageChange={setCurrentPage} />;
      case "assistants":
        return <AssistantsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "transcripts":
        return <TranscriptsPage />;
      case "llm-config":
        return <LLMConfigPage />;
      case "monetization":
        return <MonetizationPage />;
      default:
        return <CampaignsPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header currentPage={currentPage} onPageChange={setCurrentPage} /> */}
        <div className="flex-1 overflow-hidden transition-all duration-200">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
