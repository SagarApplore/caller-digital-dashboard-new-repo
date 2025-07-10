import { Input } from "@/components/atoms/input";
import { Card, CardContent } from "@/components/organisms/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Frown, RotateCcw, Clock, HelpCircle, Plus } from "lucide-react";
import React, { useState } from "react";

// Use a simple button instead of react-day-picker's Button to avoid DayPickerProvider error
const Button = ({
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface EscalationTrigger {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  active: boolean;
}

export default function RoutingAndEscalation() {
  const [voiceTimeout, setVoiceTimeout] = useState([45]);
  const [chatTimeout, setChatTimeout] = useState([120]); // 2 minutes in seconds
  const [emailSLA, setEmailSLA] = useState("15-minutes");
  const [whatsappSLA, setWhatsappSLA] = useState("5-minutes");

  const [escalationTriggers, setEscalationTriggers] = useState<
    EscalationTrigger[]
  >([
    {
      id: "negative-sentiment",
      title: "Negative Sentiment Detection",
      description: "Escalate when sentiment score < -0.5",
      icon: <Frown className="w-5 h-5 text-red-700" />,
      iconBg: "bg-red-200",
      active: true,
    },
    {
      id: "repeat-query",
      title: "Repeat Query Detection",
      description: "Escalate after 3 similar queries",
      icon: <RotateCcw className="w-5 h-5 text-orange-700" />,
      iconBg: "bg-orange-200",
      active: true,
    },
    {
      id: "sla-breach",
      title: "SLA Breach Warning",
      description: "Escalate 80% into SLA timeout",
      icon: <Clock className="w-5 h-5 text-yellow-700" />,
      iconBg: "bg-yellow-200",
      active: true,
    },
    {
      id: "keyword-detection",
      title: "Keyword Detection",
      description: "Manager, supervisor, human agent",
      icon: <HelpCircle className="w-5 h-5 text-purple-700" />,
      iconBg: "bg-purple-200",
      active: false,
    },
  ]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${minutes}m`;
    }
  };

  const toggleTrigger = (id: string) => {
    setEscalationTriggers((prev) =>
      prev.map((trigger) =>
        trigger.id === id ? { ...trigger, active: !trigger.active } : trigger
      )
    );
  };
  return (
    <div className="bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* SLA & Timeout Settings */}
        <Card className="bg-white border-none shadow-lg shadow-gray-200">
          <CardContent className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">SLA & Timeout Settings</h1>
              <span className="text-gray-600 text-sm">
                Configure response time limits
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4 w-full">
                <div className="flex flex-col gap-2 flex-1">
                  <span className="text-gray-600 text-sm font-semibold">
                    Response Timeout (Voice)
                  </span>
                  <div className="flex items-center gap-4 w-full">
                    <Slider
                      min={1}
                      max={120}
                      step={1}
                      value={voiceTimeout}
                      onValueChange={setVoiceTimeout}
                      className="w-full h-2"
                    />
                    <div className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded-md font-semibold max-w-[100px] w-full text-center">
                      {formatTime(voiceTimeout[0])}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <span className="text-gray-600 text-sm font-semibold">
                    WhatsApp Response SLA
                  </span>
                  <Select value={whatsappSLA} onValueChange={setWhatsappSLA}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a SLA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-minutes">5 minutes</SelectItem>
                      <SelectItem value="10-minutes">10 minutes</SelectItem>
                      <SelectItem value="15-minutes">15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <span className="text-gray-600 text-sm font-semibold">
                    Chat Response Timeout
                  </span>
                  <div className="flex items-center gap-4 w-full">
                    <Slider
                      min={1}
                      max={120}
                      step={1}
                      value={chatTimeout}
                      onValueChange={setChatTimeout}
                      className="w-full h-2"
                    />
                    <div className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded-md font-semibold max-w-[100px] w-full text-center">
                      {formatTime(chatTimeout[0])}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <span className="text-gray-600 text-sm font-semibold">
                    Email Response SLA
                  </span>
                  <Select value={emailSLA} onValueChange={setEmailSLA}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a SLA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-minutes">5 minutes</SelectItem>
                      <SelectItem value="10-minutes">10 minutes</SelectItem>
                      <SelectItem value="15-minutes">15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Escalation Triggers */}
        <Card className="bg-white border-none shadow-lg shadow-gray-200">
          <CardContent className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Escalation Triggers</h1>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2">
                <Plus className="w-5 h-5 mr-2" />
                Add Trigger
              </Button>
            </div>

            <div className="space-y-4">
              {escalationTriggers.map((trigger) => (
                <Card
                  key={trigger.id}
                  className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-lg ${trigger.iconBg} flex items-center justify-center`}
                        >
                          {trigger.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {trigger.title}
                          </h3>
                          <p className="text-gray-600">{trigger.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {trigger.active && (
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        )}
                        <Switch
                          checked={trigger.active}
                          onCheckedChange={() => toggleTrigger(trigger.id)}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
