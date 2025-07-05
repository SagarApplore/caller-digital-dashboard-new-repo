"use client";

import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";

interface HeaderProps {
  currentTab: number;
  tabs: {
    id: string;
    label: string;
    component: React.ReactNode;
  }[];
  onPageChange: (page: number) => void;
}

export function OutboundCampaignManagerHeader({
  currentTab,
  tabs,
  onPageChange,
}: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex overflow-x-scroll w-full">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`${
              currentTab === index
                ? "py-2 mx-4 cursor-pointer border-b-2 border-purple-600"
                : "py-2 mx-4 cursor-pointer border-b-1 border-transparent"
            }`}
            onClick={() => onPageChange(index)}
          >
            <span
              className={`${
                currentTab === index
                  ? "text-purple-600 border-purple-600 text-sm"
                  : "text-gray-500 border-transparent hover:text-gray-700 text-sm"
              }`}
            >
              {tab.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
