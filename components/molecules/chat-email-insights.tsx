import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/organisms/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, MessageSquare } from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ChatEmailInsights({
  data,
  handleDaysChange,
}: {
  data: any;
  handleDaysChange: (days: number) => void;
}) {
  return (
    <Card className="h-fit border-none p-4 shadow-lg shadow-gray-200">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
            Chat & Email Insights
          </CardTitle>
          <div className="flex space-x-2">
            <Badge
              className="bg-purple-100 text-purple-700 text-xs"
              onClick={() => handleDaysChange(7)}
            >
              7 Days
            </Badge>
            <Badge
              variant="outline"
              className="text-xs"
              onClick={() => handleDaysChange(30)}
            >
              30 Days
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        {/* Chat Volume Trend */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Chat Volume Trend</span>
            <Badge className="bg-purple-100 text-purple-700 text-xs">
              Chat
            </Badge>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-3xl font-bold text-gray-900">
              {data?.chat?.total ?? 0}
            </div>
            {(() => {
              const percentageChange = data?.chat?.percentageChange ?? 0;
              const isPositive = percentageChange >= 0;
              // Use ArrowUpRight for positive, ArrowDownLeft for negative
              // Import these icons at the top: import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
              const ArrowIcon = isPositive ? ArrowUpRight : ArrowDownLeft;
              const colorClass = isPositive ? "text-green-600" : "text-red-600";
              return (
                <span
                  className={`text-sm ${colorClass} font-medium flex items-center`}
                >
                  <ArrowIcon className="w-3 h-3 mr-1" />
                  {isPositive ? "+" : ""}
                  {percentageChange}% from previous period
                </span>
              );
            })()}
          </div>
          {/* Line Chart */}
          <div className="h-20 relative">
            {/* LineChart for Chat Volume Trend */}
            {(() => {
              // The API returns chatTrendData as [{ chat: number, date: string }, ...]
              const chatTrendDataRaw = data?.chat?.chatTrend ?? [];
              // Determine if this is a 7-day or 30-day chart
              const is30Days = chatTrendDataRaw.length > 7;

              // Map to recharts format: { value: number, day: string }
              // For 7 days: use weekday short name, for 30 days: use date (e.g. "Apr 2")
              const chatTrendData = chatTrendDataRaw.map((item: any) => {
                const dateObj = new Date(item.date);
                let day;
                if (is30Days) {
                  // e.g. "Apr 2"
                  day = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                } else {
                  // e.g. "Mon"
                  day = dateObj.toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                }
                return {
                  value: item.chat ?? 0,
                  day,
                  date: item.date,
                };
              });

              // For x-axis labels: 7 days = Mon-Sun, 30 days = show 5 evenly spaced dates
              let xLabels: string[] = [];
              if (is30Days) {
                // Show 5 evenly spaced labels
                const labelCount = 5;
                const step = Math.floor(
                  chatTrendData.length / (labelCount - 1)
                );
                xLabels = Array.from({ length: labelCount }, (_, i) => {
                  const idx =
                    i === labelCount - 1 ? chatTrendData.length - 1 : i * step;
                  return chatTrendData[idx]?.day ?? "";
                });
              } else {
                xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
              }

              return (
                <>
                  <div className="absolute inset-0 w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chatTrendData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <XAxis dataKey="day" hide />
                        <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
                        <Tooltip
                          contentStyle={{
                            fontSize: "0.75rem",
                            borderRadius: "0.5rem",
                          }}
                          cursor={{
                            stroke: "#8b5cf6",
                            strokeWidth: 1,
                            opacity: 0.2,
                          }}
                          labelFormatter={(_, payload) =>
                            payload && payload.length > 0
                              ? payload[0].payload.date
                              : ""
                          }
                          formatter={(value: any) => [
                            `${value} chats`,
                            "Chats",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "#8b5cf6" }}
                          activeDot={{ r: 5, fill: "#a78bfa" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-5">
                    {xLabels.map((label, idx) => (
                      <span key={idx}>{label}</span>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Email Thread Counts */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Email Thread Counts</span>
            <Badge className="bg-green-100 text-green-700 text-xs">Email</Badge>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-3xl font-bold text-gray-900">
              {data?.email?.total ?? 0}
            </div>
            {(() => {
              const percentageChange = data?.email?.percentageChange ?? 0;
              const isPositive = percentageChange >= 0;
              // Use ArrowUpRight for positive, ArrowDownLeft for negative
              // Import these icons at the top: import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
              const ArrowIcon = isPositive ? ArrowUpRight : ArrowDownLeft;
              const colorClass = isPositive ? "text-green-600" : "text-red-600";
              return (
                <span
                  className={`text-sm ${colorClass} font-medium flex items-center`}
                >
                  <ArrowIcon className="w-3 h-3 mr-1" />
                  {isPositive ? "+" : ""}
                  {percentageChange}% from previous period
                </span>
              );
            })()}
          </div>
          {/* Bar Chart */}
          <div className="h-16 flex items-end justify-between space-x-1">
            {/* Bar Chart for Email Thread Counts */}
            <ResponsiveContainer width="100%" height={60}>
              <BarChart
                data={data?.email?.emailTrend ?? []}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barCategoryGap={
                  (data?.email?.emailTrend?.length ?? 0) > 7 ? 2 : 8
                }
              >
                <Bar
                  dataKey="email"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            {(() => {
              const trend = data?.email?.emailTrend ?? [];
              if (trend.length === 30) {
                // 30 days: show 5 week labels at correct positions
                // Place W1 at 0, W2 at 6, W3 at 12, W4 at 18, W5 at 24
                const weekLabels = Array(30).fill("");
                [0, 6, 12, 18, 24].forEach((idx, i) => {
                  weekLabels[idx] = `W${i + 1}`;
                });
                return weekLabels.map((label, idx) => (
                  <span key={label + idx}>{label}</span>
                ));
              } else if (trend.length === 7) {
                // 7 days: show day labels
                const dayLabels = [
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                  "Sun",
                ];
                return dayLabels.map((label, idx) => (
                  <span key={label + idx}>{label}</span>
                ));
              } else if (trend.length > 0) {
                // fallback: show empty or index
                return trend.map((_: any, idx: number) => (
                  <span key={idx}></span>
                ));
              } else {
                return null;
              }
            })()}
          </div>

          {/* SLA Metrics */}
          <div className="flex justify-between text-sm">
            <span>
              Within SLA: <strong className="text-green-600">92%</strong>
            </span>
            <span>
              Outside SLA: <strong className="text-red-600">8%</strong>
            </span>
          </div>
        </div>

        {/* CSAT Summary */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">CSAT Summary</span>
            <button className="text-sm text-purple-600 hover:underline">
              View Sentiment Details
            </button>
          </div>

          <div className="flex gap-4 items-center mx-auto w-fit mb-3">
            <div className="text-center">
              <div className="text-2xl mb-1">😊</div>
              <div className="text-xs text-gray-600">Very Satisfied</div>
              <div className="font-bold text-lg">68%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">😐</div>
              <div className="text-xs text-gray-600">Neutral</div>
              <div className="font-bold text-lg">24%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">😞</div>
              <div className="text-xs text-gray-600">Unsatisfied</div>
              <div className="font-bold text-lg">8%</div>
            </div>
          </div>

          <div className="text-center">
            <span className="text-sm text-green-600 flex items-center justify-center">
              Trend:
              <svg
                className="w-3 h-3 mx-1"
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path
                  d="M2 8L6 4L10 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              2.5% improvement
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
