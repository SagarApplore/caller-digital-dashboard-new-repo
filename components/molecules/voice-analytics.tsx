import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/organisms/card";
import { Badge } from "@/components/ui/badge";
import utils from "@/utils/index.util";
import { Phone } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

export function VoiceAnalytics({ data }: { data: any }) {
  return (
    <Card className="h-fit border-none p-4 shadow-lg shadow-gray-200">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Phone className="w-5 h-5 mr-2 text-blue-600" />
            Voice Analytics
          </CardTitle>
          <Badge className="bg-green-100 text-green-700 text-xs">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        {/* Top Row Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Total Calls</span>
              <span
                className={`text-sm font-medium ${
                  data.percentageChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {data.percentageChange >= 0
                  ? `+${data.percentageChange}%`
                  : `${data.percentageChange}%`}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {utils.string.formatNumber(data.totalCalls)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Resolution Rate</span>
              <span className="text-sm text-green-600 font-medium">+2.1%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">92.4%</div>
            <div className="w-full bg-purple-100 rounded-lg h-8 relative overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 32"
              >
                <path
                  d="M0,24 Q20,8 40,12 T80,10 L100,8"
                  stroke="#a855f7"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Row Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <span className="text-sm text-gray-600 block mb-1">
              Avg. Call Duration
            </span>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {utils.string.formatDuration(data.avgDuration ?? 0)}
            </div>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <span className="text-sm text-gray-600 block mb-1">Handoff %</span>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {data.handOff?.percentage ?? 0}%
            </div>
            <div className="space-y-1">
              {data.handOff?.agentWise?.map((agent: any) => (
                <div
                  className="flex items-center justify-between text-xs"
                  key={agent.agentName}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 ${utils.colors.getRandomColor()} rounded-full mr-2`}
                    ></div>
                    <span className="text-gray-600">{agent.agentName}</span>
                  </div>
                  <span className="font-medium">{agent.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI vs Human Split */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">AI vs Human Split</span>
            <span className="text-xs text-gray-500">Last 7 days</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24">
              {/* Pie chart using recharts for AI vs Human Split */}
              {(() => {
                // Prepare data for recharts PieChart
                const aiPercent = data?.humanVsAgentSplit?.agent ?? 0;
                const humanPercent = data?.humanVsAgentSplit?.human ?? 0;
                const pieData = [
                  { name: "AI Handled", value: aiPercent },
                  { name: "Human Handled", value: humanPercent },
                ];
                const COLORS = ["#8b5cf6", "#3b82f6"];
                // Lazy import PieChart components if not already at top
                // import { PieChart, Pie, Cell } from "recharts";
                return (
                  <PieChart width={96} height={96}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={48}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                );
              })()}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">
                  AI Handled:{" "}
                  <strong>{data?.humanVsAgentSplit?.agent ?? 0}%</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">
                  Human Handled:{" "}
                  <strong>{data?.humanVsAgentSplit?.human ?? 0}%</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <path
                    d="M3.5 6L5 7.5L8.5 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
                <span className="text-sm">
                  {data?.humanVsAgentSplit?.humanPercentageDrop ?? 0}% less
                  human intervention
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
