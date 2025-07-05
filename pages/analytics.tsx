import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/organisms/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Phone, Users, Clock, Target } from "lucide-react"

export function AnalyticsPage() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Track campaign performance and key metrics</p>
            </div>
            <Select defaultValue="30d">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
            <TabsTrigger value="assistants">Assistant Analytics</TabsTrigger>
            <TabsTrigger value="clients">Client Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Calls</p>
                      <p className="text-2xl font-bold">12,847</p>
                      <div className="flex items-center text-xs">
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-green-600">+15.3%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Target className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Connect Rate</p>
                      <p className="text-2xl font-bold">68.5%</p>
                      <div className="flex items-center text-xs">
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-green-600">+2.1%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Avg Call Duration</p>
                      <p className="text-2xl font-bold">4:32</p>
                      <div className="flex items-center text-xs">
                        <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                        <span className="text-red-600">-0.8%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold">23.7%</p>
                      <div className="flex items-center text-xs">
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-green-600">+5.2%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Call Volume Trend</CardTitle>
                  <CardDescription>Daily call volume over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart visualization would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Success Rate by Hour</CardTitle>
                  <CardDescription>Best performing hours of the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart visualization would go here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Detailed performance metrics for each campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Q4 Lead Follow-up", calls: 1847, connects: 1265, rate: 68.5, status: "Running" },
                    { name: "Product Demo Outreach", calls: 1200, connects: 868, rate: 72.3, status: "Completed" },
                    { name: "Customer Satisfaction Survey", calls: 423, connects: 276, rate: 65.2, status: "Paused" },
                  ].map((campaign, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <Badge
                          variant={
                            campaign.status === "Running"
                              ? "default"
                              : campaign.status === "Completed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Calls</p>
                          <p className="font-bold">{campaign.calls.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Successful Connects</p>
                          <p className="font-bold">{campaign.connects.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Connect Rate</p>
                          <p className="font-bold text-green-600">{campaign.rate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assistants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assistant Performance</CardTitle>
                <CardDescription>Compare AI assistant effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sophia AI", calls: 4200, rate: 71.2, duration: "4:45", satisfaction: 4.6 },
                    { name: "Max AI", calls: 3800, rate: 68.9, duration: "4:12", satisfaction: 4.4 },
                    { name: "Emma AI", calls: 2900, rate: 65.8, duration: "3:58", satisfaction: 4.2 },
                  ].map((assistant, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{assistant.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">★ {assistant.satisfaction}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Calls</p>
                          <p className="font-bold">{assistant.calls.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Connect Rate</p>
                          <p className="font-bold text-green-600">{assistant.rate}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Duration</p>
                          <p className="font-bold">{assistant.duration}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Satisfaction</p>
                          <p className="font-bold text-purple-600">{assistant.satisfaction}/5</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Insights</CardTitle>
                <CardDescription>Performance metrics by client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Acme Corporation", campaigns: 5, calls: 2400, rate: 72.1, revenue: 1497 },
                    { name: "TechStart Inc", campaigns: 3, calls: 1800, rate: 68.5, revenue: 897 },
                    { name: "Global Solutions", campaigns: 1, calls: 600, rate: 64.2, revenue: 99 },
                  ].map((client, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{client.name}</h3>
                        <span className="text-sm text-green-600 font-medium">${client.revenue}/month</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Active Campaigns</p>
                          <p className="font-bold">{client.campaigns}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Calls</p>
                          <p className="font-bold">{client.calls.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Success Rate</p>
                          <p className="font-bold text-green-600">{client.rate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AnalyticsPage
