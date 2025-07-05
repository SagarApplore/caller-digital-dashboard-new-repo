import { Button } from "@/components/ui/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/organisms/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Package, TrendingUp, Users, Plus, Edit, Trash2 } from "lucide-react"

const skuData = [
  {
    id: 1,
    name: "Basic Plan",
    sku: "BASIC-001",
    price: 99,
    billing: "monthly",
    features: ["1,000 calls/month", "Basic analytics", "Email support"],
    clients: 15,
    revenue: 1485,
    status: "Active",
  },
  {
    id: 2,
    name: "Professional Plan",
    sku: "PRO-001",
    price: 299,
    billing: "monthly",
    features: ["5,000 calls/month", "Advanced analytics", "Priority support"],
    clients: 8,
    revenue: 2392,
    status: "Active",
  },
  {
    id: 3,
    name: "Enterprise Plan",
    sku: "ENT-001",
    price: 599,
    billing: "monthly",
    features: ["Unlimited calls", "Custom analytics", "Dedicated support"],
    clients: 3,
    revenue: 1797,
    status: "Active",
  },
]

export function MonetizationPage() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SKU & Monetization Manager</h1>
              <p className="text-gray-600">Manage pricing plans, SKUs, and revenue tracking</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New SKU
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skus">SKU Management</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Strategy</TabsTrigger>
            <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold">$5,674</p>
                      <p className="text-xs text-green-600">+12.5% from last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Active Clients</p>
                      <p className="text-2xl font-bold">26</p>
                      <p className="text-xs text-blue-600">+3 new this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Package className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Active SKUs</p>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-xs text-gray-600">All plans active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Avg Revenue/Client</p>
                      <p className="text-2xl font-bold">$218</p>
                      <p className="text-xs text-orange-600">+8.3% growth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skuData.map((sku) => (
                      <div key={sku.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{sku.name}</p>
                          <p className="text-sm text-gray-600">{sku.clients} clients</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${sku.revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">${sku.price}/month</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Most Popular Plan</span>
                      <Badge>Professional</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Highest Revenue Plan</span>
                      <Badge>Professional</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="font-medium">23.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Churn Rate</span>
                      <span className="font-medium">4.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skus" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SKU Management</CardTitle>
                <CardDescription>Manage your pricing plans and SKU configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skuData.map((sku) => (
                    <div key={sku.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{sku.name}</h3>
                            <p className="text-sm text-gray-600">SKU: {sku.sku}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={sku.status === "Active" ? "default" : "secondary"}>{sku.status}</Badge>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          <p className="text-xl font-bold text-green-600">${sku.price}</p>
                          <p className="text-xs text-gray-500">per {sku.billing}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Active Clients</p>
                          <p className="text-xl font-bold">{sku.clients}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monthly Revenue</p>
                          <p className="text-xl font-bold">${sku.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Features</p>
                          <ul className="text-xs text-gray-600 mt-1">
                            {sku.features.map((feature, idx) => (
                              <li key={idx}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Strategy</CardTitle>
                <CardDescription>Configure pricing models and strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pricing Model</h3>
                    <Select defaultValue="tiered">
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tiered">Tiered Pricing</SelectItem>
                        <SelectItem value="usage">Usage-Based</SelectItem>
                        <SelectItem value="flat">Flat Rate</SelectItem>
                        <SelectItem value="freemium">Freemium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Currency</h3>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Discount Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="annual-discount">Annual Discount (%)</Label>
                      <Input id="annual-discount" type="number" defaultValue="20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="volume-discount">Volume Discount (%)</Label>
                      <Input id="volume-discount" type="number" defaultValue="15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loyalty-discount">Loyalty Discount (%)</Label>
                      <Input id="loyalty-discount" type="number" defaultValue="10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Trial Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trial-period">Free Trial Period (days)</Label>
                      <Input id="trial-period" type="number" defaultValue="14" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trial-calls">Trial Call Limit</Label>
                      <Input id="trial-calls" type="number" defaultValue="100" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="font-bold text-green-600">$5,674</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Month</span>
                      <span className="font-medium">$5,045</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Growth Rate</span>
                      <span className="font-medium text-green-600">+12.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">YTD Revenue</span>
                      <span className="font-bold">$62,340</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Client Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New Clients</span>
                      <span className="font-bold text-blue-600">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Churned Clients</span>
                      <span className="font-medium text-red-600">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Upgrade Rate</span>
                      <span className="font-medium text-green-600">18.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Downgrade Rate</span>
                      <span className="font-medium text-orange-600">3.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default MonetizationPage
