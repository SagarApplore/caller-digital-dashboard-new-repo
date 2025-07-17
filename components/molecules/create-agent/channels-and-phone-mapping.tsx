import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Phone, MapPin, Plus, Tag, LucideProps, Users } from "lucide-react";
import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useState,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/organisms/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/atoms/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/atoms/label";

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
  id: string;
  number: string;
  location: string;
  type: string;
  channels: string[];
}

export interface HandoffConfig {
  enabled: boolean;
  countryCode: string;
  phoneNumber: string;
}

const ChannelsAndPhoneMapping = ({
  channels,
  toggleChannel,
  updatePrompt,
  updateFirstMessage,
  handoffConfig,
  updateHandoffConfig,
}: {
  channels: Channel[];
  toggleChannel: (channelId: string) => void;
  updatePrompt: (channelId: string, prompt: string) => void;
  updateFirstMessage: (channelId: string, firstMessage: string) => void;
  handoffConfig: HandoffConfig;
  updateHandoffConfig: (config: HandoffConfig) => void;
}) => {
  const [phoneNumbers] = useState<PhoneNumber[]>([
    {
      id: "1",
      number: "+1 (555) 123-4567",
      location: "New York, US",
      type: "Primary Line",
      channels: ["Voice", "WhatsApp"],
    },
  ]);

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
    });
  };

  const handleCountryCodeChange = (countryCode: string) => {
    updateHandoffConfig({
      ...handoffConfig,
      countryCode,
    });
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    updateHandoffConfig({
      ...handoffConfig,
      phoneNumber,
    });
  };

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
                    <Textarea
                      id="voice-instructions"
                      placeholder="Enter voice-specific instructions for phone calls..."
                      className="h-32"
                      value={channel.prompt.value}
                      onChange={(e) => updatePrompt(channel.id, e.target.value)}
                    />
                  </div>
                )}

                {/* First Message */}
                {channel.active && (
                  <div className="flex flex-col gap-4">
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
                    Handoff Phone Number <span className="text-red-500">*</span>
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Phone Number Mapping</h3>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold h-8">
            <Plus className="w-4 h-4" />
            Add Number
          </Button>
        </div>

        <div className="space-y-4">
          {phoneNumbers.map((phoneNumber) => (
            <Card
              key={phoneNumber.id}
              className="bg-green-50 border border-green-200"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {phoneNumber.number}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-600 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{phoneNumber.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600 text-sm">
                          <Tag className="w-4 h-4" />
                          <span>{phoneNumber.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {phoneNumber.channels.map((channel) => (
                      <Badge
                        key={channel}
                        className={`${getChannelBadgeColor(
                          channel
                        )} text-xs font-semibold border-none`}
                      >
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChannelsAndPhoneMapping;
