"use client";

import React, { useState } from "react";
import { OutboundCampaignManagerHeader } from "../molecules/outbound-campaign-manager-header";
import Campaigns from "../molecules/campaigns";
import Analytics from "@/pages/analytics";

export default function OutboundCampaignManager() {
  const [currentTab, setCurrentTab] = useState<number>(0);

  const tabs = [
    {
      id: "campaigns",
      label: "Campaign List",
      component: <Campaigns />,
    },
    // {
    //   id: "analytics",
    //   label: "Analytics",
    //   component: <Analytics />,
    // },
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
      <div className="h-[calc(100vh-120px)] overflow-y-auto">
        {tabs[currentTab].component}
      </div>
    </div>
  );
}
