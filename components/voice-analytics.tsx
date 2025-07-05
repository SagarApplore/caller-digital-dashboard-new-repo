import { Card, CardContent, CardHeader, CardTitle } from "@/components/organisms/card"
import { Badge } from "@/components/ui/badge"
import { Phone } from "lucide-react"

export function VoiceAnalytics() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Phone className="w-5 h-5 mr-2 text-blue-600" />
            Voice Analytics
          </CardTitle>
          <Badge className="bg-green-100 text-green-700 text-xs">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Row Metrics */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Total Calls</span>
              <span className="text-sm text-green-600 font-medium">+8.5%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">1,248</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Resolution Rate</span>
              <span className="text-sm text-green-600 font-medium">+2.1%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">92.4%</div>
            <div className="w-full bg-purple-100 rounded-lg h-8 relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 32">
                <path d="M0,24 Q20,8 40,12 T80,10 L100,8" stroke="#a855f7" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Row Metrics */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-gray-600 block mb-1">Avg. Call Duration</span>
            <div className="text-3xl font-bold text-gray-900 mb-2">4m 12s</div>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600 block mb-1">Handoff %</span>
            <div className="text-3xl font-bold text-gray-900 mb-2">18.7%</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Sophia AI</span>
                </div>
                <span className="font-medium">12%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Max AI</span>
                </div>
                <span className="font-medium">24%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI vs Human Split */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">AI vs Human Split</span>
            <span className="text-xs text-gray-500">Last 7 days</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
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
                  strokeDasharray="81.3, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="18.7, 100"
                  strokeDashoffset="-81.3"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">
                  AI Handled: <strong>81.3%</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">
                  Human Handled: <strong>18.7%</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M3.5 6L5 7.5L8.5 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                <span className="text-sm">2.3% less human intervention</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
