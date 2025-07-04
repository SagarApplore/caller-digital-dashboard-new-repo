import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"

export function ChatEmailInsights() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
            Chat & Email Insights
          </CardTitle>
          <div className="flex space-x-2">
            <Badge className="bg-purple-100 text-purple-700 text-xs">7 Days</Badge>
            <Badge variant="outline" className="text-xs">
              30 Days
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chat Volume Trend */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Chat Volume Trend</span>
            <Badge className="bg-purple-100 text-purple-700 text-xs">Chat</Badge>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-3xl font-bold text-gray-900">3,842</div>
            <span className="text-sm text-green-600 font-medium flex items-center">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 2L10 6H8V10H4V6H2L6 2Z" />
              </svg>
              12% from previous period
            </span>
          </div>
          {/* Line Chart */}
          <div className="h-20 relative">
            <svg className="w-full h-full" viewBox="0 0 280 80">
              <path
                d="M20,60 L60,45 L100,35 L140,40 L180,30 L220,35 L260,40"
                stroke="#8b5cf6"
                strokeWidth="2"
                fill="none"
              />
              {[20, 60, 100, 140, 180, 220, 260].map((x, i) => (
                <circle key={i} cx={x} cy={[60, 45, 35, 40, 30, 35, 40][i]} r="3" fill="#8b5cf6" />
              ))}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-5">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Email Thread Counts */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Email Thread Counts</span>
            <Badge className="bg-green-100 text-green-700 text-xs">Email</Badge>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-3xl font-bold text-gray-900">1,567</div>
            <span className="text-sm text-red-600 font-medium flex items-center">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 10L2 6H4V2H8V6H10L6 10Z" />
              </svg>
              3% from previous period
            </span>
          </div>
          {/* Bar Chart */}
          <div className="h-16 flex items-end justify-between space-x-1">
            {[250, 280, 300, 290, 310, 280, 290].map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-8 bg-green-500 rounded-t" style={{ height: `${(value / 310) * 50}px` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
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

        {/* CSAT Summary */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">CSAT Summary</span>
            <button className="text-sm text-purple-600 hover:underline">View Sentiment Details</button>
          </div>

          <div className="flex justify-between items-center mb-3">
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
              <svg className="w-3 h-3 mx-1" viewBox="0 0 12 12" fill="currentColor">
                <path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              2.5% improvement
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
