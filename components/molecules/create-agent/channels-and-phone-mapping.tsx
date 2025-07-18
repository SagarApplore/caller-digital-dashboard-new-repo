import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Phone,
  MapPin,
  Plus,
  Tag,
  LucideProps,
  Users,
  Loader2,
} from "lucide-react";
import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/organisms/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/atoms/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/atoms/label";
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";

export interface Channel {
  id: string;
  name: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  iconBg: string;
  active: boolean;
  prompt: {
    title: string;
    value: string;
    allowedCharacters: number;
  };
  firstMessage: string;
}

export interface PhoneNumber {
  _id: string;
  phone_number: string;
}

export interface HandoffConfig {
  enabled: boolean;
  countryCode: string;
  phoneNumber: string;
  phoneNumberId: string;
}

export interface ExtraPrompts {
  summaryPrompt: string;
  successEvaluationPrompt: string;
  failureEvaluationPrompt: string;
}

const ChannelsAndPhoneMapping = ({
  channels,
  toggleChannel,
  updatePrompt,
  updateFirstMessage,
  handoffConfig,
  updateHandoffConfig,
  extraPrompts,
  updateExtraPrompts,
  agentPhoneNumber,
  updateAgentPhoneNumber,
}: {
  channels: Channel[];
  toggleChannel: (channelId: string) => void;
  updatePrompt: (channelId: string, prompt: string) => void;
  updateFirstMessage: (channelId: string, firstMessage: string) => void;
  handoffConfig: HandoffConfig;
  updateHandoffConfig: (config: HandoffConfig) => void;
  extraPrompts: ExtraPrompts;
  updateExtraPrompts: (prompts: ExtraPrompts) => void;
  agentPhoneNumber: { phoneNumber: string; phoneNumberId: string };
  updateAgentPhoneNumber: (phoneNumber: string, phoneNumberId: string) => void;
}) => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getChannelBadgeColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "voice":
        return "bg-cyan-100 text-cyan-800 border-cyan-300";
      case "whatsapp":
        return "bg-green-100 text-green-800 border-green-300";
      case "chat":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "email":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleHandoffToggle = (enabled: boolean) => {
    updateHandoffConfig({
      ...handoffConfig,
      enabled,
      // Reset phone number when disabling handoff
      phoneNumber: enabled ? handoffConfig.phoneNumber : "",
      countryCode: enabled ? handoffConfig.countryCode : "",
      phoneNumberId: enabled ? handoffConfig.phoneNumberId : "",
    });
  };

  const handleCountryCodeChange = (countryCode: string) => {
    updateHandoffConfig({
      ...handoffConfig,
      countryCode,
    });
  };

  const handlePhoneNumberChange = (
    phoneNumber: string,
    phoneNumberId: string = ""
  ) => {
    updateHandoffConfig({
      ...handoffConfig,
      phoneNumber,
      phoneNumberId,
    });
  };

  const handleSummaryPrompt = (value: string) => {
    updateExtraPrompts({
      ...extraPrompts,
      summaryPrompt: value,
    });
  };

  const handleSuccessEvaluationPrompt = (value: string) => {
    updateExtraPrompts({
      ...extraPrompts,
      successEvaluationPrompt: value,
    });
  };

  const handleFailureEvaluationPrompt = (value: string) => {
    updateExtraPrompts({
      ...extraPrompts,
      failureEvaluationPrompt: value,
    });
  };

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const response = await apiRequest(endpoints.phoneNumbers.get, "GET");
        setPhoneNumbers(response.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching phone numbers:", error);
      }
    };
    fetchPhoneNumbers();
  }, []);

  return (
    <>
      {/* Channel Configuration Section */}
      <div className="p-4 bg-white rounded-lg w-full flex flex-col gap-4 shadow-lg shadow-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Channel Configuration</h3>
          <p className="text-gray-600 text-sm">
            Enable/disable communication channels
          </p>
        </div>

        <div className="space-y-4">
          {channels.map((channel) => (
            <Card key={channel.id} className="bg-white">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${channel.iconBg} flex items-center justify-center`}
                    >
                      <channel.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {channel.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {channel.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {channel.active ? (
                      <span className="text-green-600 font-medium text-sm">
                        Active
                      </span>
                    ) : (
                      <span className="text-gray-500 font-medium text-sm">
                        Inactive
                      </span>
                    )}
                    <Switch
                      checked={channel.active}
                      onCheckedChange={() => toggleChannel(channel.id)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                </div>

                {/* Voice Prompt */}
                {channel.active && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-gray-700">
                        {channel.name} Instructions <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <Textarea
                      id="voice-instructions"
                      placeholder="Enter voice-specific instructions for phone calls..."
                      className="h-32"
                      value={channel.prompt.value}
                      onChange={(e) => updatePrompt(channel.id, e.target.value)}
                    />
                  </div>
                )}

                {/* First Message - Only for Voice and Chat Channels */}
                {channel.active && (channel.id.toLowerCase() === "voice" || channel.id.toLowerCase() === "chat") && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-gray-700">
                        First Message <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <Input
                      id="first-message"
                      placeholder="First Message..."
                      value={channel.firstMessage}
                      onChange={(e: any) =>
                        updateFirstMessage(channel.id, e.target.value)
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Extra Prompts Section */}
      <div className="p-4 bg-white rounded-lg w-full flex flex-col gap-4 shadow-lg shadow-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Extra Prompts</h3>
          <p className="text-gray-600 text-sm">
            Optional prompts for enhanced agent behavior
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="summary-prompt" className="text-sm font-medium">
              Summary Prompt
            </Label>
            <Textarea
              id="summary-prompt"
              className="h-32"
              placeholder="Enter summary prompt (optional)"
              value={extraPrompts.summaryPrompt}
              onChange={(e) => handleSummaryPrompt(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="success-evaluation-prompt" className="text-sm font-medium">
              Success Evaluation Prompt
            </Label>
            <Textarea
              id="success-evaluation-prompt"
              className="h-32"
              placeholder="Enter Success Evaluation Prompt (optional)"
              value={extraPrompts.successEvaluationPrompt}
              onChange={(e) => handleSuccessEvaluationPrompt(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="failure-evaluation-prompt" className="text-sm font-medium">
              Failure Evaluation Prompt
            </Label>
            <Textarea
              id="failure-evaluation-prompt"
              className="h-32"
              placeholder="Failure Evaluation Prompt (optional)"
              value={extraPrompts.failureEvaluationPrompt}
              onChange={(e) => handleFailureEvaluationPrompt(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Handoff Configuration Section */}
      <div className="p-4 bg-white rounded-lg w-full flex flex-col gap-4 shadow-lg shadow-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Handoff Configuration</h3>
          <p className="text-gray-600 text-sm">
            Configure call handoff to human agent
          </p>
        </div>

        <Card className="bg-white">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Human Handoff</h3>
                <p className="text-gray-600 text-sm">
                  Enable handoff to human agent when AI cannot handle the call
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="handoff-enabled"
                  checked={handoffConfig.enabled}
                  onCheckedChange={handleHandoffToggle}
                  className="data-[state=checked]:bg-purple-600"
                />
                <Label
                  htmlFor="handoff-enabled"
                  className="text-sm font-medium"
                >
                  Enable Handoff
                </Label>
              </div>
            </div>

            {/* Phone Number Input - Only show when handoff is enabled */}
            {handoffConfig.enabled && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Handoff Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <div className="w-24">
                      <Input
                        placeholder="+91"
                        value={handoffConfig.countryCode}
                        onChange={(e: any) =>
                          handleCountryCodeChange(e.target.value)
                        }
                        className="text-center"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="xxxxxxxx77"
                        value={handoffConfig.phoneNumber}
                        onChange={(e: any) =>
                          handlePhoneNumberChange(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Format: Country code + Phone number (e.g., +91xxxxxxxx77)
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Phone Number Mapping Section */}
      <div className="p-4 bg-white rounded-lg w-full flex flex-col gap-4 shadow-lg shadow-gray-200">
        <h3 className="text-lg font-semibold">Phone Number Mapping</h3>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Assign Phone Number
              </Label>
              <select
                className="border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                value={agentPhoneNumber.phoneNumber}
                onChange={(e) => {
                  const selectedPhoneNumber = phoneNumbers.find(
                    (pn) => pn.phone_number === e.target.value
                  );
                  updateAgentPhoneNumber(
                    e.target.value,
                    selectedPhoneNumber?._id || ""
                  );
                }}
              >
                <option value="">Select a phone number...</option>
                {phoneNumbers.map((phoneNumber) => (
                  <option
                    key={phoneNumber._id}
                    value={phoneNumber.phone_number}
                  >
                    {phoneNumber.phone_number}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                Choose a number to assign to this agent.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChannelsAndPhoneMapping;
