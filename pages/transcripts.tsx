import { Button } from "@/components/ui/button"
import { Input } from "@/components/atoms/input"
import { Card, CardContent } from "@/components/organisms/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Play, FileText, Clock, Phone } from "lucide-react"

const transcripts = [
  {
    id: 1,
    callId: "CALL-2024-001",
    campaign: "Q4 Lead Follow-up",
    assistant: "Sophia AI",
    contact: "John Smith",
    company: "Acme Corp",
    duration: "4:32",
    outcome: "Interested",
    date: "Dec 15, 2024 2:30 PM",
    sentiment: "Positive",
  },
  {
    id: 2,
    callId: "CALL-2024-002",
    campaign: "Product Demo Outreach",
    assistant: "Max AI",
    contact: "Sarah Johnson",
    company: "TechStart Inc",
    duration: "3:45",
    outcome: "Callback Scheduled",
    date: "Dec 15, 2024 1:15 PM",
    sentiment: "Neutral",
  },
  {
    id: 3,
    callId: "CALL-2024-003",
    campaign: "Customer Satisfaction Survey",
    assistant: "Emma AI",
    contact: "Mike Wilson",
    company: "Global Solutions",
    duration: "2:18",
    outcome: "Not Interested",
    date: "Dec 15, 2024 11:45 AM",
    sentiment: "Negative",
  },
]

export function TranscriptsPage() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Call Transcripts</h1>
              <p className="text-gray-600">Review and analyze call transcripts and recordings</p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search transcripts..." className="pl-10" />
                </div>
              </div>
              <Select defaultValue="all-campaigns">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-campaigns">All Campaigns</SelectItem>
                  <SelectItem value="q4-follow-up">Q4 Lead Follow-up</SelectItem>
                  <SelectItem value="demo-outreach">Product Demo Outreach</SelectItem>
                  <SelectItem value="satisfaction-survey">Customer Satisfaction Survey</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-assistants">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Assistant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-assistants">All Assistants</SelectItem>
                  <SelectItem value="sophia">Sophia AI</SelectItem>
                  <SelectItem value="max">Max AI</SelectItem>
                  <SelectItem value="emma">Emma AI</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-outcomes">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-outcomes">All Outcomes</SelectItem>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="callback">Callback Scheduled</SelectItem>
                  <SelectItem value="not-interested">Not Interested</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transcript List */}
        <div className="space-y-4">
          {transcripts.map((transcript) => (
            <Card key={transcript.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{transcript.callId}</h3>
                      <p className="text-sm text-gray-600">{transcript.campaign}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        transcript.outcome === "Interested"
                          ? "default"
                          : transcript.outcome === "Callback Scheduled"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {transcript.outcome}
                    </Badge>
                    <Badge
                      variant={
                        transcript.sentiment === "Positive"
                          ? "default"
                          : transcript.sentiment === "Neutral"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {transcript.sentiment}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-purple-100 text-purple-600">
                        {transcript.assistant
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{transcript.assistant}</p>
                      <p className="text-xs text-gray-500">Assistant</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{transcript.contact}</p>
                    <p className="text-xs text-gray-500">{transcript.company}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{transcript.duration}</span>
                  </div>
                  <div>
                    <p className="text-sm">{transcript.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Play
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Call Summary</h4>
                  <p className="text-sm text-gray-700">
                    {transcript.outcome === "Interested" &&
                      "Contact showed strong interest in our product offering. Discussed pricing and implementation timeline. Follow-up scheduled for next week."}
                    {transcript.outcome === "Callback Scheduled" &&
                      "Initial conversation went well. Contact requested more information and scheduled a callback to discuss further details with decision maker."}
                    {transcript.outcome === "Not Interested" &&
                      "Contact indicated they are not currently in the market for our services. Politely declined further engagement at this time."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-6">
          <Button variant="outline">Load More Transcripts</Button>
        </div>
      </div>
    </div>
  )
}

export default TranscriptsPage
