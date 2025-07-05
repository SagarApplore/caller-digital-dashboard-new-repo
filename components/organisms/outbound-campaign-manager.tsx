"use client";

import React, { useState } from "react";
import { OutboundCampaignManagerHeader } from "../molecules/outbound-campaign-manager-header";
import Campaigns from "../molecules/campaigns";
import CreateCampaign from "@/app/outbound-campaign-manager/create-campaign/page";

export default function OutboundCampaignManager() {
  const [currentTab, setCurrentTab] = useState<number>(0);

  const tabs = [
    {
      id: "campaigns",
      label: "Campaign List",
      component: <Campaigns />,
    },
    {
      id: "create-campaign",
      label: "Create New Campaign",
      component: <CreateCampaign />,
    },
    {
      id: "assistants",
      label: "Assistants & Numbers",
      component: <Campaigns />,
    },
  ];

  const handleTabChange = (tab: number) => {
    setCurrentTab(tab);
  };

  return (
    <div>
      <OutboundCampaignManagerHeader
        currentTab={currentTab}
        tabs={tabs}
        onPageChange={handleTabChange}
      />
      {tabs[currentTab].component}
    </div>
  );
}
