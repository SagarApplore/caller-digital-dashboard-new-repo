import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Zap, Shield, Plus, Edit, Trash2 } from "lucide-react"

const llmProviders = [
  {
    id: 1,
    name: "OpenAI GPT-4",
    provider: "OpenAI",
    model: "gpt-4-turbo",
    status: "Active",
    usage: "2.3M tokens",
    cost: "$45.60",
    latency: "1.2s",
  },
  {
    id: 2,
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    model: "claude-3-sonnet",
    status: "Active",
    usage: "1.8M tokens",
    cost: "$36.00",
    latency: "0.9s",
  },
  {
    id: 3,
    name: "Gemini Pro",
    provider: "Google",
    model: "gemini-pro",
    status: "Inactive",
    usage: "0.5M tokens",
    cost: "$7.50",
    latency: "1.5s",
  },
]

export function LLMConfigPage() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LLM Provider Configuration</h1>
              <p className="text-gray-600">Manage AI language models and their configurations</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Provider
            </Button>
          </div>
        </div>

        <Tabs defaultValue="providers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="models">Model Settings</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-6">
            {/* Provider Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Active Providers</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Usage</p>
                      <p className="text-2xl font-bold">4.6M</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Monthly Cost</p>
                      <p className="text-2xl font-bold">$89.10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Provider List */}
            <Card>
              <CardHeader>
                <CardTitle>LLM Providers</CardTitle>
                <CardDescription>Manage your AI language model providers and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {llmProviders.map((provider) => (
                    <div key={provider.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                            <p className="text-sm text-gray-600">
                              {provider.provider} • {provider.model}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={provider.status === "Active" ? "default" : "secondary"}>
                            {provider.status}
                          </Badge>
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
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Usage</p>
                          <p className="font-medium">{provider.usage}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Cost</p>
                          <p className="font-medium">{provider.cost}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Latency</p>
                          <p className="font-medium">{provider.latency}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Configuration</CardTitle>
                <CardDescription>Configure parameters for your AI models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature</Label>
                      <Input id="temperature" type="number" step="0.1" min="0" max="2" defaultValue="0.7" />
                      <p className="text-xs text-gray-500">
                        Controls randomness (0.0 = deterministic, 2.0 = very random)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">Max Tokens</Label>
                      <Input id="max-tokens" type="number" defaultValue="2048" />
                      <p className="text-xs text-gray-500">Maximum number of tokens to generate</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="top-p">Top P</Label>
                      <Input id="top-p" type="number" step="0.1" min="0" max="1" defaultValue="0.9" />
                      <p className="text-xs text-gray-500">Nucleus sampling parameter</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequency-penalty">Frequency Penalty</Label>
                      <Input id="frequency-penalty" type="number" step="0.1" min="0" max="2" defaultValue="0.0" />
                      <p className="text-xs text-gray-500">Reduces repetition of tokens</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    placeholder="Enter the system prompt that will guide the AI's behavior..."
                    className="min-h-32"
                    defaultValue="You are a professional sales assistant helping with outbound calls. Be friendly, professional, and helpful."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable usage alerts</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="usage-threshold">Usage Threshold (%)</Label>
                      <Input id="usage-threshold" type="number" defaultValue="80" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost-limit">Monthly Cost Limit ($)</Label>
                      <Input id="cost-limit" type="number" defaultValue="500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable latency alerts</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="latency-threshold">Latency Threshold (ms)</Label>
                      <Input id="latency-threshold" type="number" defaultValue="2000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="error-threshold">Error Rate Threshold (%)</Label>
                      <Input id="error-threshold" type="number" defaultValue="5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and privacy settings for your LLM providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Encryption</p>
                      <p className="text-sm text-gray-600">Encrypt all data sent to LLM providers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Retention</p>
                      <p className="text-sm text-gray-600">Automatically delete conversation logs</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">PII Detection</p>
                      <p className="text-sm text-gray-600">Detect and mask personally identifiable information</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention-period">Data Retention Period (days)</Label>
                  <Input id="retention-period" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowed-domains">Allowed Domains</Label>
                  <Textarea
                    id="allowed-domains"
                    placeholder="Enter allowed domains, one per line..."
                    defaultValue="api.openai.com&#10;api.anthropic.com&#10;generativelanguage.googleapis.com"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
