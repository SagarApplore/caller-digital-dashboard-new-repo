"use client";

import React from "react";
import { OutboundCampaignManagerHeader } from "../molecules/outbound-campaign-manager-header";

export default function OutboundCampaignManager() {
  return (
    <div>
      <OutboundCampaignManagerHeader
        currentPage="campaigns"
        onPageChange={() => {}}
      />
    </div>
  );
}
