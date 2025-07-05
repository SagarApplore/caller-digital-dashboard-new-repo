"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Phone,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  ThumbsUp,
  AlertTriangle,
  ExternalLink,
  Pause,
  Square,
  BarChart3,
  Users,
  MessageCircle,
  Mail,
  Settings,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "./card";

export default function OutboundCampaign() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const callData = [
    {
      time: "14:32:45",
      name: "John Smith",
      status: "Connected",
      duration: "2m 34s",
      type: "Product inquiry",
      statusColor: "text-green-600",
      borderColor: "border-l-green-500",
    },
    {
      time: "14:31:12",
      name: "Sarah Johnson",
      status: "Escalated",
      duration: "4m 12s",
      type: "Billing complaint",
      statusColor: "text-yellow-600",
      borderColor: "border-l-yellow-500",
    },
    {
      time: "14:29:58",
      name: "Mike Davis",
      status: "No Response",
      duration: "0m 30s",
      type: "Voicemail",
      statusColor: "text-red-600",
      borderColor: "border-l-red-500",
    },
    {
      time: "14:28:22",
      name: "Lisa Chen",
      status: "Connected",
      duration: "3m 45s",
      type: "Demo request",
      statusColor: "text-green-600",
      borderColor: "border-l-green-500",
    },
    {
      time: "14:27:01",
      name: "Robert Wilson",
      status: "In Progress",
      duration: "1m 23s",
      type: "General inquiry",
      statusColor: "text-blue-600",
      borderColor: "border-l-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        {/* Header */}
        <div className="py-4 gap-4 bg-white flex flex-col">
          <div className="bg-white px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  Holiday Promotion Campaign
                </h1>
                <div className="flex items-center space-x-2 bg-[#DCFCE7] rounded-full px-4 py-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">
                    Running
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Started: 2:14 PM</span>
                  <span>Duration: 1h 23m</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                  >
                    <Square className="w-4 h-4 mr-1" />
                    Stop
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Info */}
          <div className="bg-white px-6">
            <div className="flex items-center justify-between bg-[#F9FAFB] px-6 py-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Sarah AI Assistant
                </h2>
                <p className="text-sm text-gray-600">Voice Campaign</p>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Total Contacts:</div>
                  <div className="text-lg font-semibold">1,250</div>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: 12:34:56
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Phone className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Total</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">213</div>
                <div className="text-xs text-gray-500">Calls Attempted</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-600">69%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">147</div>
                <div className="text-xs text-gray-500">Connected</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-600">Live</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">8</div>
                <div className="text-xs text-gray-500">In Progress</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <XCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-sm text-red-600">10%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">22</div>
                <div className="text-xs text-gray-500">Failures</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <RotateCcw className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-600">Queue</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">37</div>
                <div className="text-xs text-gray-500">Retries</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <ThumbsUp className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-600">46%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">68</div>
                <div className="text-xs text-gray-500">Positive</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-600">7%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">11</div>
                <div className="text-xs text-gray-500">Escalations</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Live Call Timeline */}
            <div className="col-span-2">
              <Card>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded"></div>
                      </div>
                      <h3 className="text-lg font-semibold">
                        Live Call Timeline
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Auto-refresh: 10s</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {callData.map((call, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-4 border-l-4 ${call.borderColor} hover:bg-gray-50`}
                      >
                        <div className="w-16 text-sm text-gray-500 font-mono">
                          {call.time}
                        </div>
                        <div className="flex-1 ml-4">
                          <div className="font-medium text-gray-900">
                            {call.name}
                          </div>
                        </div>
                        <div className="w-24 text-center">
                          <span
                            className={`text-sm font-medium ${call.statusColor}`}
                          >
                            {call.status}
                          </span>
                        </div>
                        <div className="w-16 text-sm text-gray-500 text-center">
                          {call.duration}
                        </div>
                        <div className="w-32 text-sm text-gray-600 text-center">
                          {call.type}
                        </div>
                        <div className="w-8 flex justify-center">
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <div>
              <Card>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-semibold">System Health</h3>
                  </div>
                </div>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Voice Infrastructure
                    </span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">Healthy</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Twilio API
                    </span>
                    <span className="text-sm text-green-600">Online</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      VAPI Service
                    </span>
                    <span className="text-sm text-green-600">Online</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Token Usage
                      </span>
                      <span className="text-sm text-gray-600">1,247/min</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      AI Performance
                    </span>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-yellow-600">Monitor</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
