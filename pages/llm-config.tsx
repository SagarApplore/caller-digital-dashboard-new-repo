import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/organisms/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Zap,
  Shield,
  Plus,
  Edit,
  Trash2,
  Circle,
  RotateCcw,
  Key,
  Route,
} from "lucide-react";
import Image from "next/image";
import utils from "@/utils/index.util";
import { Progress } from "@/components/ui/progress";
import { useCallback } from "react";
import { Separator } from "@/components/ui/separator";

const llmProviders = [
  {
    id: 1,
    name: "OpenAI GPT-4",
    status: "Active",
    apiKey: "sk-proj-1234567890",
    usage: "2.3M tokens",
    cost: "$45.60",
    maxTpm: 90000,
    todayUsage: 68,
    provider: "OpenAI",
    model: "gpt-4-turbo",
    latency: "1.2s",
  },
  {
    id: 2,
    name: "Claude 3 Sonnet",
    status: "Active",
    apiKey: "sk-proj-1234567890",
    usage: "1.8M tokens",
    cost: "$36.00",
    maxTpm: 100000,
    todayUsage: 45,
    provider: "Anthropic",
    model: "claude-3-sonnet",
    latency: "0.9s",
  },
  {
    id: 3,
    name: "Gemini Pro",
    status: "Limited",
    apiKey: "sk-proj-1234567890",
    usage: "0.5M tokens",
    cost: "$7.50",
    maxTpm: 60000,
    todayUsage: 85,
    provider: "Google",
    model: "gemini-pro",
    latency: "1.5s",
  },
];

const rules = [
  {
    id: 1,
    name: "Default Provider",
    description: "Primary model for all requests",
    model: "UX Pilot AI GPT-4",
  },
  {
    id: 2,
    name: "Latency Fallback",
    description: "If response time > 3s → Switch to UX Pilot AI GPT-4",
  },
];

export function LLMConfigPage() {
  const getProgressColor = useCallback((connectRate: number) => {
    if (connectRate >= 70) return "bg-green-500";
    if (connectRate >= 40) return "bg-yellow-500";
    return "bg-red-500";
  }, []);
  return (
    <>
      <Tabs defaultValue="providers" className="">
        <div className="bg-white px-4 pb-4 pt-2">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="models">Model Settings</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="providers" className="p-4 mt-0 flex flex-col gap-8">
          {/* Provider List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {llmProviders.map((provider) => {
              return (
                <Card
                  key={provider.id}
                  className="border-none shadow-lg shadow-gray-200 hover:shadow-gray-300 transition-all duration-300 p-4 gap-4 flex flex-col"
                >
                  <CardHeader className="flex flex-row items-center justify-between p-0">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                          <Image
                            src={`call.svg`}
                            alt={provider.provider}
                            width={10}
                            height={10}
                            className="rounded-lg w-1/2 h-1/2 object-contain"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-md font-medium">
                            {provider.name}
                          </CardTitle>
                          <CardDescription className="text-xs text-gray-500 flex items-center gap-1">
                            <div
                              className={`flex items-center gap-1 ${utils.colors.getStatusColor(
                                provider.status
                              )} bg-transparent`}
                            >
                              <Circle
                                className="w-2 h-2"
                                fill="currentColor"
                                stroke="currentColor"
                              />
                              <span className="text-xs">{provider.status}</span>
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 p-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">API Key</span>
                      <span className="text-sm">{provider.apiKey}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Token Pricing
                      </span>
                      <span className="text-sm">
                        {provider.cost}/{provider.usage}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Max TPM</span>
                      <span className="text-sm">
                        {utils.string.formatNumber(provider.maxTpm)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Usage Today</span>
                      <div className="flex items-center gap-4">
                        <Progress
                          value={provider.todayUsage}
                          max={100}
                          className={`h-2 w-[100px] ${getProgressColor(
                            provider.todayUsage
                          )}`}
                        />
                        <span className="text-xs text-gray-500">
                          {provider.todayUsage}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="p-0 flex flex-row gap-4">
                    <Button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                      <Edit className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </Button>
                    <Button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                      <Key className="w-4 h-4" />
                      <span className="text-sm font-medium">Rotate Key</span>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Rules */}
          <Card className="w-full max-w-md border-none shadow-lg shadow-gray-200 hover:shadow-gray-300 transition-all duration-300 p-4 max-h-[300px] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-purple-500" />
                <span className="text-lg font-semibold">Routing Rules</span>
              </div>
              <Button className="w-fit bg-purple-100 text-purple-700 hover:bg-purple-200">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Rule</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 mt-6 p-0">
              {rules.map((rule) => {
                return (
                  <div
                    key={rule.id}
                    className="flex p-4 bg-gray-100 rounded-lg justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{rule.name}</span>
                      <span className="text-xs text-gray-500">
                        {rule.description}
                      </span>
                    </div>
                    {rule.model && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 font-medium">
                          {rule.model}
                        </span>
                        <Edit className="w-4 h-4 text-purple-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="p-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>
                Configure parameters for your AI models
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      defaultValue="0.7"
                    />
                    <p className="text-xs text-gray-500">
                      Controls randomness (0.0 = deterministic, 2.0 = very
                      random)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-tokens">Max Tokens</Label>
                    <Input id="max-tokens" type="number" defaultValue="2048" />
                    <p className="text-xs text-gray-500">
                      Maximum number of tokens to generate
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="top-p">Top P</Label>
                    <Input
                      id="top-p"
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      defaultValue="0.9"
                    />
                    <p className="text-xs text-gray-500">
                      Nucleus sampling parameter
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency-penalty">Frequency Penalty</Label>
                    <Input
                      id="frequency-penalty"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      defaultValue="0.0"
                    />
                    <p className="text-xs text-gray-500">
                      Reduces repetition of tokens
                    </p>
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

        <TabsContent value="monitoring" className="p-4 mt-0">
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
                    <Input
                      id="usage-threshold"
                      type="number"
                      defaultValue="80"
                    />
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
                    <Label htmlFor="latency-threshold">
                      Latency Threshold (ms)
                    </Label>
                    <Input
                      id="latency-threshold"
                      type="number"
                      defaultValue="2000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="error-threshold">
                      Error Rate Threshold (%)
                    </Label>
                    <Input
                      id="error-threshold"
                      type="number"
                      defaultValue="5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="p-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and privacy settings for your LLM providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Encryption</p>
                    <p className="text-sm text-gray-600">
                      Encrypt all data sent to LLM providers
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Retention</p>
                    <p className="text-sm text-gray-600">
                      Automatically delete conversation logs
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">PII Detection</p>
                    <p className="text-sm text-gray-600">
                      Detect and mask personally identifiable information
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention-period">
                  Data Retention Period (days)
                </Label>
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
    </>
  );
}

export default LLMConfigPage;
