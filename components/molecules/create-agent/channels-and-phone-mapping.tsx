import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Phone, MapPin, Plus, Tag } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/organisms/card";
import { Textarea } from "@/components/ui/textarea";

export interface Channel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  active: boolean;
  prompt: {
    title: string;
    value: string;
    allowedCharacters: number;
  };
}

export interface PhoneNumber {
  id: string;
  number: string;
  location: string;
  type: string;
  channels: string[];
}

const ChannelsAndPhoneMapping = ({
  channels,
  toggleChannel,
  updatePrompt,
}: {
  channels: Channel[];
  toggleChannel: (channelId: string) => void;
  updatePrompt: (channelId: string, prompt: string) => void;
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
                      {channel.icon}
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
              </CardContent>
            </Card>
          ))}
        </div>
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
