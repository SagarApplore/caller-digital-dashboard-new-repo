import { Button } from "@/components/ui/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/organisms/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Phone, Plus, Edit, Play, Pause } from "lucide-react"

const assistants = [
  {
    id: 1,
    name: "Sophia AI",
    voice: "Professional Female",
    language: "English (US)",
    status: "Active",
    campaigns: 3,
    callsToday: 247,
    successRate: 71.2,
    phoneNumbers: ["+1 (555) 001-0001", "+1 (555) 001-0002"],
  },
  {
    id: 2,
    name: "Max AI",
    voice: "Professional Male",
    language: "English (US)",
    status: "Active",
    campaigns: 2,
    callsToday: 189,
    successRate: 68.9,
    phoneNumbers: ["+1 (555) 002-0001"],
  },
  {
    id: 3,
    name: "Emma AI",
    voice: "Friendly Female",
    language: "English (UK)",
    status: "Inactive",
    campaigns: 0,
    callsToday: 0,
    successRate: 65.8,
    phoneNumbers: ["+1 (555) 003-0001", "+1 (555) 003-0002", "+1 (555) 003-0003"],
  },
]

export function AssistantsPage() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assistant & Numbers</h1>
              <p className="text-gray-600">Manage AI assistants and phone number assignments</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Assistant
            </Button>
          </div>
        </div>

        <Tabs defaultValue="assistants" className="space-y-6">
          <TabsList>
            <TabsTrigger value="assistants">AI Assistants</TabsTrigger>
            <TabsTrigger value="numbers">Phone Numbers</TabsTrigger>
            <TabsTrigger value="voices">Voice Settings</TabsTrigger>
            <TabsTrigger value="scripts">Call Scripts</TabsTrigger>
          </TabsList>

          <TabsContent value="assistants" className="space-y-6">
            <div className="grid gap-6">
              {assistants.map((assistant) => (
                <Card key={assistant.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {assistant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{assistant.name}</h3>
                          <p className="text-sm text-gray-600">
                            {assistant.voice} • {assistant.language}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={assistant.status === "Active" ? "default" : "secondary"}>
                          {assistant.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            {assistant.status === "Active" ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Active Campaigns</p>
                        <p className="text-xl font-bold">{assistant.campaigns}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Calls Today</p>
                        <p className="text-xl font-bold">{assistant.callsToday}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Success Rate</p>
                        <p className="text-xl font-bold text-green-600">{assistant.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Numbers</p>
                        <p className="text-xl font-bold">{assistant.phoneNumbers.length}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Assigned Phone Numbers</p>
                      <div className="flex flex-wrap gap-2">
                        {assistant.phoneNumbers.map((number, idx) => (
                          <Badge key={idx} variant="outline" className="font-mono">
                            {number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="numbers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Phone Number Management</CardTitle>
                <CardDescription>Manage and assign phone numbers to AI assistants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Available Numbers</h3>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Purchase Numbers
                  </Button>
                </div>

                <div className="grid gap-4">
                  {[
                    { number: "+1 (555) 001-0001", assigned: "Sophia AI", status: "Active", location: "New York, NY" },
                    { number: "+1 (555) 001-0002", assigned: "Sophia AI", status: "Active", location: "New York, NY" },
                    { number: "+1 (555) 002-0001", assigned: "Max AI", status: "Active", location: "Los Angeles, CA" },
                    { number: "+1 (555) 003-0001", assigned: "Emma AI", status: "Inactive", location: "Chicago, IL" },
                    { number: "+1 (555) 004-0001", assigned: "Unassigned", status: "Available", location: "Miami, FL" },
                  ].map((phone, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-mono font-medium">{phone.number}</p>
                            <p className="text-sm text-gray-600">{phone.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{phone.assigned}</p>
                            <Badge
                              variant={
                                phone.status === "Active"
                                  ? "default"
                                  : phone.status === "Available"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {phone.status}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            {phone.assigned === "Unassigned" ? "Assign" : "Reassign"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Voice Configuration</CardTitle>
                <CardDescription>Configure voice settings for AI assistants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="voice-provider">Voice Provider</Label>
                      <Select defaultValue="elevenlabs">
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                          <SelectItem value="openai">OpenAI TTS</SelectItem>
                          <SelectItem value="google">Google Cloud TTS</SelectItem>
                          <SelectItem value="amazon">Amazon Polly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="voice-model">Voice Model</Label>
                      <Select defaultValue="professional-female">
                        <SelectTrigger>
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional-female">Professional Female</SelectItem>
                          <SelectItem value="professional-male">Professional Male</SelectItem>
                          <SelectItem value="friendly-female">Friendly Female</SelectItem>
                          <SelectItem value="friendly-male">Friendly Male</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="speech-rate">Speech Rate</Label>
                      <Input id="speech-rate" type="range" min="0.5" max="2" step="0.1" defaultValue="1" />
                      <p className="text-xs text-gray-500">1.0x (Normal speed)</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pitch">Pitch</Label>
                      <Input id="pitch" type="range" min="-20" max="20" step="1" defaultValue="0" />
                      <p className="text-xs text-gray-500">0 (Normal pitch)</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voice-sample">Voice Sample Text</Label>
                  <Textarea
                    id="voice-sample"
                    placeholder="Enter text to test voice settings..."
                    defaultValue="Hello, this is a sample of how your AI assistant will sound during calls."
                  />
                  <Button variant="outline" className="mt-2 bg-transparent">
                    <Play className="w-4 h-4 mr-2" />
                    Test Voice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scripts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Scripts</CardTitle>
                <CardDescription>Manage call scripts and conversation flows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      name: "Lead Generation Script",
                      type: "Cold Calling",
                      lastModified: "2 days ago",
                      status: "Active",
                    },
                    { name: "Follow-up Script", type: "Warm Leads", lastModified: "1 week ago", status: "Active" },
                    { name: "Survey Script", type: "Customer Feedback", lastModified: "3 days ago", status: "Draft" },
                  ].map((script, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <MessageSquare className="w-5 h-5 text-purple-600" />
                          <div>
                            <h3 className="font-medium">{script.name}</h3>
                            <p className="text-sm text-gray-600">
                              {script.type} • Modified {script.lastModified}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={script.status === "Active" ? "default" : "secondary"}>{script.status}</Badge>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              Duplicate
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Script
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AssistantsPage
