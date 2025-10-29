import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/organisms/card";
import { Badge } from "@/components/ui/badge";
import utils from "@/utils/index.util";
import { Phone, CheckCircle, TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";
import { fetchSentimentSummary } from "@/services/index.service";
import { useState, useEffect } from "react";

export function VoiceAnalytics({ data, days = 7 }: { data: any; days?: number }) {
  const [resolutionRate, setResolutionRate] = useState<number>(0);
  const [totalCalls, setTotalCalls] = useState<number>(0);
  const [resolutionLoading, setResolutionLoading] = useState(true);
  const [totalMinutes,setTotalMinutes] = useState<number>(0);
  const [avgCallDuration,setAvgCallDuration]=useState<number>(0);

  // Fetch resolution rate data
  useEffect(() => {
    const fetchResolutionRate = async () => {
      try {
        setResolutionLoading(true);
        console.log("VoiceAnalytics - Fetching resolution rate for days:", days);
        const response = await fetchSentimentSummary(days);
        if (response.success && response.data) {
          const { sentimentScore, total ,avgCallDuration,totalMinutes} = response.data;
          console.log("Hello",sentimentScore, total)
          // Use the sentiment score from the backend
          setResolutionRate(sentimentScore);
          setTotalCalls(total);
          setAvgCallDuration(avgCallDuration)
          setTotalMinutes(totalMinutes)
          console.log("VoiceAnalytics - Resolution rate updated:", {
            days,
            sentimentScore,
            total
          });
        }
      } catch (error) {
        console.error("Error fetching resolution rate:", error);
        setResolutionRate(0);
        setTotalCalls(0);
      } finally {
        setResolutionLoading(false);
      }
    };

    fetchResolutionRate();
  }, [days]); // Added days as dependency

  // Defensive defaults for all metrics
  const totalCallsVoice =
    typeof data?.totalCalls === "number" && !isNaN(data.totalCalls)
      ? data.totalCalls
      : 0;

  const avgDuration =
    typeof data?.avgDuration === "number" && !isNaN(data.avgDuration)
      ? data.avgDuration
      : 0;

  const handOffPercentage =
    typeof data?.handOff?.percentage === "number" &&
    !isNaN(data.handOff?.percentage)
      ? data.handOff.percentage
      : 0;

  const handOffAgentWise = Array.isArray(data?.handOff?.agentWise)
    ? data.handOff.agentWise
    : [];

  const aiPercent =
    typeof data?.humanVsAgentSplit?.agent === "number" &&
    !isNaN(data.humanVsAgentSplit?.agent)
      ? data.humanVsAgentSplit.agent
      : 0;

  const humanPercent =
    typeof data?.humanVsAgentSplit?.human === "number" &&
    !isNaN(data.humanVsAgentSplit?.human)
      ? data.humanVsAgentSplit.human
      : 0;

  const humanPercentageDrop =
    typeof data?.humanVsAgentSplit?.humanPercentageDrop === "number" &&
    !isNaN(data.humanVsAgentSplit?.humanPercentageDrop)
      ? data.humanVsAgentSplit.humanPercentageDrop
      : 0;

  // const totalMinutes =
  //   typeof data?.totalDuration === "number" && !isNaN(data.totalDuration)
  //     ? data.totalDuration
  //     : 0;

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
              {/* <span
                className={`text-sm font-medium ${
                  data.percentageChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {data.percentageChange >= 0
                  ? `+${data.percentageChange}%`
                  : `${data.percentageChange}%`}
              </span> */}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {/* {utils.string.formatNumber(totalCallsVoice)}
               */}
               {totalCalls}
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
              <Badge className="bg-green-100 text-green-700 text-xs">
                Success
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {resolutionLoading ? "Loading..." : `${resolutionRate*10}%`}
            </div>
            <div className="flex items-center text-green-600 mb-2">
              {/* <TrendingUp className="w-4 h-4 mr-1" /> */}
              {/* <span className="text-sm font-medium">((Positive + Neutral) × 10) ÷ Total Calls</span> */}
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Based on {totalCalls} total calls
              </span>
            </div>
            <div className="mt-3 p-3 bg-white rounded-lg">
              <div className="text-xs text-gray-600 mb-2">Resolution Breakdown</div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">
                  Resolved: {resolutionRate*10}%
                </span>
                <span className="text-red-600 font-medium">
                  Unresolved: {100 - resolutionRate*10}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mid Row Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <span className="text-sm text-gray-600 block mb-1">
              Avg. Call Duration
            </span>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {/* {utils.string.formatDuration(avgDuration)}
               */}
               {
                utils.string.formatDuration(avgCallDuration)
               }
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
              {handOffPercentage}%
            </div>
            <div className="space-y-1">
              {handOffAgentWise.length > 0 ? (
                handOffAgentWise.map((agent: any) => (
                  <div
                    className="flex items-center justify-between text-xs"
                    key={agent.agentName || agent._id || Math.random()}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 ${utils.colors.getRandomColor()} rounded-full mr-2`}
                      ></div>
                      <span className="text-gray-600">
                        {agent.agentName ?? "N/A"}
                      </span>
                    </div>
                    <span className="font-medium">
                      {typeof agent.percentage === "number" &&
                      !isNaN(agent.percentage)
                        ? agent.percentage
                        : 0}
                      %
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400">No handoff data</div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row Metrics */}
        <div className="">
          <div className="bg-gray-100 p-4 rounded-lg">
            <span className="text-sm text-gray-600 block mb-1">
              Total Minutes
            </span>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {utils.string.formatDuration(totalMinutes)}
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
                const pieData = [
                  { name: "AI Handled", value: aiPercent },
                  { name: "Human Handled", value: humanPercent },
                ];
                const COLORS = ["#8b5cf6", "#3b82f6"];
                // If both values are zero, show a blank pie
                const hasData = aiPercent > 0 || humanPercent > 0;
                return hasData ? (
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
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">
                    No data
                  </div>
                );
              })()}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">
                  AI Handled: <strong>{aiPercent}%</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">
                  Human Handled: <strong>{humanPercent}%</strong>
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
                  {humanPercentageDrop}% less human intervention
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
