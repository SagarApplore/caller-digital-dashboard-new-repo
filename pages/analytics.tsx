import utils from "@/utils/index.util";
import {
  Clock,
  EllipsisVertical,
  Percent,
  Phone,
  PhoneCall,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const quickStats = [
  {
    title: "Total Leads Dialed",
    value: 15847,
    type: "number",
    icon: <Phone className="w-6 h-6" />,
    percentageChange: 12.5,
    color: "purple",
  },
  {
    title: "Connected Calls",
    value: 10924,
    type: "number",
    icon: <PhoneCall className="w-6 h-6" />,
    percentageChange: 8.3,
    color: "green",
  },
  {
    title: "Connect Rate",
    value: 68.9,
    type: "percentage",
    icon: <Percent className="w-6 h-6" />,
    percentageChange: -2.1,
    color: "cyan",
  },
  {
    title: "Avg Call Duration",
    value: "4:32",
    type: "ratio",
    icon: <Clock className="w-6 h-6" />,
    percentageChange: 5.7,
    color: "yellow",
  },
];

const assistantPerformance = [
  {
    name: "Sophia AI",
    connectRate: 72.3,
    type: "percentage",
    totalCalls: 6247,
    image: "/images/sophia.png",
  },
  {
    name: "Max AI",
    connectRate: 68.7,
    type: "percentage",
    totalCalls: 5892,
    image: "/images/max.png",
  },
  {
    name: "Emma AI",
    connectRate: 64.2,
    type: "percentage",
    totalCalls: 3708,
    image: "/images/emma.png",
  },
];

const campaignStatus = {
  running: 12,
  completed: 8,
  paused: 3,
  draft: 5,
};

const topPerforming = [
  {
    name: "Q4 Lead Follow-up",
    totalCalls: 1847,
    connectRate: 78.5,
  },
  {
    name: "Product Demo",
    totalCalls: 1200,
    connectRate: 72.3,
  },
  {
    name: "CSAT Survey",
    totalCalls: 850,
    connectRate: 65.2,
  },
];

export function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7D" | "30D">(
    "7D"
  );

  return (
    <div className="overflow-auto flex flex-col p-4 gap-6">
      <div className="grid grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <div
            key={stat.title}
            className="flex flex-col w-full bg-white p-4 rounded-lg shadow-lg shadow-gray-100 gap-1"
          >
            <div className="flex items-center justify-between w-full">
              <div
                className={`bg-${stat.color}-100 text-${stat.color}-700 h-12 w-12 flex items-center justify-center rounded-md`}
              >
                {stat.icon}
              </div>
              <div
                className={`text-sm font-semibold ${
                  stat.percentageChange > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.percentageChange > 0 ? "+" : ""}
                {stat.percentageChange}%
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-lg shadow-gray-100 gap-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Call Volume Trend</div>
            <div className="flex items-center gap-2">
              <div
                onClick={() => setSelectedTimeframe("7D")}
                className={`text-sm px-2 py-1 rounded-md cursor-pointer ${
                  selectedTimeframe === "7D"
                    ? "bg-purple-100 text-purple-700 font-semibold"
                    : "text-gray-700"
                }`}
              >
                7D
              </div>
              <div
                onClick={() => setSelectedTimeframe("30D")}
                className={`text-sm px-2 py-1 rounded-md cursor-pointer ${
                  selectedTimeframe === "30D"
                    ? "bg-purple-100 text-purple-700 font-semibold"
                    : "text-gray-700"
                }`}
              >
                30D
              </div>
            </div>
          </div>
          <div className="h-[300px]"></div>
        </div>
        <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-lg shadow-gray-100 gap-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Call Outcomes</div>
            <div className="h-8 w-8 hover:bg-gray-100 rounded-md flex items-center justify-center">
              <EllipsisVertical className="w-4 h-4" />
            </div>
          </div>
          <div className="h-[300px]"></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Assistant Performance */}
        <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-lg shadow-gray-100 gap-4">
          <div className="font-semibold text-lg">Assistant Performance</div>
          <div className="flex flex-col gap-2 h-[160px] overflow-y-auto">
            {assistantPerformance.map((assistant) => (
              <div
                key={assistant.name}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/call.svg"
                    alt={assistant.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-lg text-gray-700">
                      {assistant.name}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {utils.string.formatNumber(assistant.totalCalls)} calls
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-lg font-semibold ${
                      assistant.connectRate > 70
                        ? "text-green-500"
                        : assistant.connectRate > 60
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {assistant.connectRate}%
                  </span>
                  <span className="text-sm text-gray-500">Connect Rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Status */}
        <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-lg shadow-gray-100 gap-4">
          <div className="font-semibold text-lg">Campaign Status</div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div>Running</div>
              </div>
              <div className="font-semibold">{campaignStatus.running}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div>Completed</div>
              </div>
              <div className="font-semibold">{campaignStatus.completed}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div>Paused</div>
              </div>
              <div className="font-semibold">{campaignStatus.paused}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <div>Draft</div>
              </div>
              <div className="font-semibold">{campaignStatus.draft}</div>
            </div>
          </div>
        </div>

        {/* Top Performing */}
        <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-lg shadow-gray-100 gap-4">
          <div className="font-semibold text-lg">Top Performing</div>
          <div className="flex flex-col gap-4">
            {topPerforming.map((campaign) => (
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-base">{campaign.name}</div>
                  <div className="text-sm text-gray-500">
                    {campaign.totalCalls} calls
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div
                    className={`text-base font-semibold ${
                      campaign.connectRate > 70
                        ? "text-green-500"
                        : campaign.connectRate > 60
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {utils.string.formatNumberAccToType(
                      campaign.connectRate,
                      "percentage"
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Success Rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
