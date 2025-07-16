import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/organisms/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, MessageSquare, Mail } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";
import React from "react";

export function OmnichannelSnapshot({ data }: { data: any }) {
  // Defensive defaults and error handling
  let error = null;
  let channelWise = {
    voicePercentage: 0,
    chatPercentage: 0,
    emailPercentage: 0,
    whatsappPercentage: 0,
  };
  let topAgent = {
    agentName: "Sophia AI",
  };

  try {
    if (!data || typeof data !== "object") {
      throw new Error("No data available");
    }
    if (data.channelWise && typeof data.channelWise === "object") {
      channelWise = {
        voicePercentage:
          typeof data.channelWise.voicePercentage === "number" &&
          !isNaN(data.channelWise.voicePercentage)
            ? data.channelWise.voicePercentage
            : 0,
        chatPercentage:
          typeof data.channelWise.chatPercentage === "number" &&
          !isNaN(data.channelWise.chatPercentage)
            ? data.channelWise.chatPercentage
            : 0,
        emailPercentage:
          typeof data.channelWise.emailPercentage === "number" &&
          !isNaN(data.channelWise.emailPercentage)
            ? data.channelWise.emailPercentage
            : 0,
        whatsappPercentage:
          typeof data.channelWise.whatsappPercentage === "number" &&
          !isNaN(data.channelWise.whatsappPercentage)
            ? data.channelWise.whatsappPercentage
            : 0,
      };
    }
    if (data.topAgent && typeof data.topAgent === "object") {
      topAgent = {
        agentName:
          typeof data.topAgent.agentName === "string" &&
          data.topAgent.agentName.trim().length > 0
            ? data.topAgent.agentName
            : "Sophia AI",
      };
    }
  } catch (e: any) {
    error = e.message || "An error occurred while loading data.";
  }

  return (
    <Card className="h-fit border-none p-4 shadow-lg shadow-gray-200">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
            Omnichannel Snapshot
          </CardTitle>
          <span className="text-xs text-gray-500">Updated 5 min ago</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        {/* Channel-wise Usage */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <span className="text-sm text-gray-600 mb-3 block">
            Channel-wise Usage
          </span>
          {error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20">
                {/* Pie chart using recharts */}
                {(() => {
                  // Prepare data for recharts PieChart
                  const channelData = [
                    {
                      name: "Voice",
                      value: channelWise.voicePercentage,
                      color: "#3b82f6",
                    },
                    {
                      name: "Chat",
                      value: channelWise.chatPercentage,
                      color: "#8b5cf6",
                    },
                    {
                      name: "Email",
                      value: channelWise.emailPercentage,
                      color: "#10b981",
                    },
                    {
                      name: "WhatsApp",
                      value: channelWise.whatsappPercentage,
                      color: "#22c55e",
                    },
                  ];

                  // Only show if at least one value is > 0
                  const hasData = channelData.some((c) => c.value > 0);

                  return (
                    <div className="w-20 h-20 flex items-center justify-center">
                      {hasData ? (
                        <PieChart width={80} height={80}>
                          <Pie
                            data={channelData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={22}
                            outerRadius={36}
                            paddingAngle={2}
                            stroke="none"
                          >
                            {channelData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                          </Pie>
                          {/* Optionally, add a tooltip */}
                          {/* <Tooltip /> */}
                        </PieChart>
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center text-xs text-gray-400">
                          No Data
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">
                    Voice: <strong>{channelWise.voicePercentage}%</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">
                    Chat: <strong>{channelWise.chatPercentage}%</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">
                    Email: <strong>{channelWise.emailPercentage}%</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm">
                    WhatsApp: <strong>{channelWise.whatsappPercentage}%</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CSAT Trendline */}
        {/* <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">CSAT Trendline</span>
            <span className="text-xs text-gray-500">Last 7 days</span>
          </div>
          <div className="h-12 bg-gray-50 rounded-lg relative overflow-hidden mb-2">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 48"
            >
              <path
                d="M5,35 L20,30 L35,25 L50,22 L65,20 L80,18 L95,15"
                stroke="#8b5cf6"
                strokeWidth="2"
                fill="none"
              />
              {[5, 20, 35, 50, 65, 80, 95].map((x, i) => (
                <circle key={i} cx={x} cy={35 - i * 3} r="2" fill="#8b5cf6" />
              ))}
            </svg>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>
              Overall Score: <strong>4.3/5</strong>
            </span>
            <span>
              Response Rate: <strong>68%</strong>
            </span>
          </div>
        </div> */}

        {/* Top Assistant */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <span className="text-sm text-gray-600 mb-3 block">
            Top Assistant
          </span>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  SA
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {topAgent.agentName}
              </div>
              <div className="text-sm text-gray-600">
                CSAT N/A • Last active: Now
              </div>
              <div className="flex space-x-1 mt-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <MessageSquare className="w-3 h-3 text-gray-400" />
                <Mail className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* AI System Summary */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <span className="text-sm text-gray-600 mb-3 block">
            AI System Summary
          </span>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-2">Confidence Score</div>
              <div className="relative w-12 h-12 mx-auto mb-1">
                <svg
                  className="w-12 h-12 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeDasharray="86, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  86%
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-2">
                Avg. Interruptions
              </div>
              <div className="text-xl font-bold text-gray-900">0.8</div>
              <div className="text-xs text-gray-500">per call</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-2">Fallback Rate</div>
              <div className="h-6 flex items-end justify-center space-x-0.5 mb-1">
                {[60, 80, 70, 90, 85].map((height, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-green-400 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className="text-xl font-bold text-gray-900">4.2%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
