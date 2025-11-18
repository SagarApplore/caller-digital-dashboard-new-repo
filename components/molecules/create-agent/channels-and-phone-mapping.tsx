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
  useImperativeHandle,
  forwardRef,
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
  firstMessageError?: string;
  firstMessageMode?: string;

}

export interface PhoneNumber {
  _id: string;
  phone_number: string;
  numberType: string;
  displayName: string;
}

export interface HandoffConfig {
  enabled: boolean;
  handoff_number: string;
    warmTransfer?: boolean; 
  error?: string;
}

export interface InactivityConfiguration {
  duration: number;
  inactivity_prompt: string;
}

export interface ExtraPrompts {
  summaryPrompt: string;
  successEvaluationPrompt: string;
  failureEvaluationPrompt: string;
  inactivity_configuration: InactivityConfiguration[];
}

export interface ChannelsAndPhoneMappingRef {
  isPhoneNumberValid: () => boolean;
}

interface ChannelsAndPhoneMappingProps {
  channels: Channel[];
  toggleChannel: (channelId: string) => void;
  updatePrompt: (channelId: string, prompt: string) => void;
  updateFirstMessage: (channelId: string, firstMessage: string, errorMessage?: string) => void;
  handoffConfig: HandoffConfig;
  updateHandoffConfig: (config: HandoffConfig) => void;
  extraPrompts: ExtraPrompts;
  updateExtraPrompts: (prompts: ExtraPrompts) => void;
  agentPhoneNumber: { phoneNumber: string; phoneNumberId: string; numberType?: string };
  updateAgentPhoneNumber: (phoneNumber: string, phoneNumberId: string, numberType?: string) => void;
  mode?: "create" | "edit";
  updateFirstMessageMode: (channelId: string, mode: "AI_SPEAKS_FIRST" | "HUMAN_SPEAKS_FIRST") => void;

}

const ChannelsAndPhoneMapping = forwardRef<ChannelsAndPhoneMappingRef, ChannelsAndPhoneMappingProps>(
  ({
    channels,
    toggleChannel,
    updatePrompt,
    updateFirstMessage,
    
    handoffConfig,
    updateHandoffConfig,
    extraPrompts,
    updateExtraPrompts,
    updateFirstMessageMode,
    agentPhoneNumber,
    updateAgentPhoneNumber,
    mode = "create",
  }, ref) => {
    // Debug: log mode
    console.log("ChannelsAndPhoneMapping mode:", mode);
    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const filteredPhoneNumbers = React.useMemo(() => {
      if (mode !== "edit") {
        return phoneNumbers;
      }
      const type = (agentPhoneNumber?.numberType || "").toLowerCase();
      if (type !== "inbound" && type !== "outbound") {
        return phoneNumbers;
      }
      return phoneNumbers.filter((pn) => (pn.numberType || "").toLowerCase() === type);
    }, [mode, phoneNumbers, agentPhoneNumber?.numberType]);

    // Debug logging for agent phone number
    console.log("ChannelsAndPhoneMapping - agentPhoneNumber:", agentPhoneNumber);
    console.log("ChannelsAndPhoneMapping - phoneNumbers:", phoneNumbers);
    console.log("ChannelsAndPhoneMapping - extraPrompts:", extraPrompts);

    // Validation function for parent
    // useImperativeHandle(ref, () => ({
    //   isPhoneNumberValid: () => {
    //     if (mode === "edit" && !agentPhoneNumber.phoneNumber) {
    //       return false;
    //     }
    //     return true;
    //   }
    // }));

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
      let error = undefined;
       if (enabled && !handoffConfig.handoff_number) {
    error = "Phone number is required when handoff is enabled";
  }

  if (enabled && handoffConfig.warmTransfer && !handoffConfig.handoff_number) {
  error = "Warm Transfer requires a valid phone number.";
}
      updateHandoffConfig({
        ...handoffConfig,
        enabled,
        // Reset phone number when disabling handoff
        handoff_number: enabled ? handoffConfig.handoff_number : "",
        error
      });
    };

    const handleHandoffNumberChange = (handoff_number: string) => {
      // Remove white spaces from the input
      const cleanedNumber = handoff_number.replace(/\s+/g, '');
      
      // Validate phone number - should be at least 10 digits
      const digitsOnly = cleanedNumber.replace(/\D/g, '');
      let error = undefined;
      
      if (cleanedNumber && digitsOnly.length < 10) {
        error = "Phone number must be at least 10 digits long";
      }
      
      updateHandoffConfig({
        ...handoffConfig,
        handoff_number: cleanedNumber,
        error: error
      });
    };

    const handleSummaryPrompt = (value: string) => {
      console.log("handleSummaryPrompt called with:", value);
      const updatedPrompts: ExtraPrompts = {
        ...extraPrompts,
        summaryPrompt: value,
      };
      updateExtraPrompts(updatedPrompts);
    };

    const handleSuccessEvaluationPrompt = (value: string) => {
      console.log("handleSuccessEvaluationPrompt called with:", value);
      const updatedPrompts: ExtraPrompts = {
        ...extraPrompts,
        successEvaluationPrompt: value,
      };
      updateExtraPrompts(updatedPrompts);
    };

    const handleFailureEvaluationPrompt = (value: string) => {
      console.log("handleFailureEvaluationPrompt called with:", value);
      const updatedPrompts: ExtraPrompts = {
        ...extraPrompts,
        failureEvaluationPrompt: value,
      };
      updateExtraPrompts(updatedPrompts);
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
                      <div className="flex flex-col gap-2">
                        <Input
                          id="first-message"
                          placeholder="First Message..."
                          value={channel.firstMessage}
                          className={channel.firstMessageError ? "border-red-500" : ""}
                          onChange={(e: any) => {
                            const value = e.target.value;
                            // Validate for emojis and special characters
                            const regex = /^[a-zA-Z0-9\s.,?!'"-:;()]+$/;
                            
                            if (!value || regex.test(value)) {
                              // Valid input or empty
                              updateFirstMessage(channel.id, value, "");
                            } else {
                              // Invalid input with special characters or emojis
                              updateFirstMessage(channel.id, value, "Emojis and special characters are not allowed in the First Message.");
                            }
                          }}
                        />
                        {channel.firstMessageError && (
                          <p className="text-red-500 text-sm">{channel.firstMessageError}</p>
                        )}
                      </div>
                      {/* First Message Mode */}
<div className="flex flex-col gap-2 mt-2">
  <Label className="text-sm font-medium text-gray-700">
    First Message Mode
  </Label>

  <select
    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={channel.firstMessageMode || "AI_SPEAKS_FIRST"}
    onChange={(e) =>
      updateFirstMessageMode(
        channel.id,
        e.target.value as "AI_SPEAKS_FIRST" | "HUMAN_SPEAKS_FIRST"
      )
    }
  >
    <option value="AI_SPEAKS_FIRST">AI_SPEAKS_FIRST</option>
    <option value="HUMAN_SPEAKS_FIRST">HUMAN_SPEAKS_FIRST</option>
  </select>

  <p className="text-xs text-gray-500">Choose who starts the conversation first.</p>
</div>


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
              <div className="text-xs text-gray-500 mb-1">
                Current value: "{extraPrompts.summaryPrompt}"
              </div>
              <Textarea
                id="summary-prompt"
                className="h-32 border-2 border-blue-200 focus:border-blue-500"
                placeholder="Enter summary prompt (optional)"
                value={extraPrompts.summaryPrompt}
                onChange={(e) => handleSummaryPrompt(e.target.value)}
                disabled={false}
                readOnly={false}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="success-evaluation-prompt" className="text-sm font-medium">
                Success Evaluation Prompt
              </Label>
              <div className="text-xs text-gray-500 mb-1">
                Current value: "{extraPrompts.successEvaluationPrompt}"
              </div>
              <Textarea
                id="success-evaluation-prompt"
                className="h-32 border-2 border-blue-200 focus:border-blue-500"
                placeholder="Enter Success Evaluation Prompt (optional)"
                value={extraPrompts.successEvaluationPrompt}
                onChange={(e) => handleSuccessEvaluationPrompt(e.target.value)}
                disabled={false}
                readOnly={false}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="failure-evaluation-prompt" className="text-sm font-medium">
                Failure Evaluation Prompt
              </Label>
              <div className="text-xs text-gray-500 mb-1">
                Current value: "{extraPrompts.failureEvaluationPrompt}"
              </div>
              <Textarea
                id="failure-evaluation-prompt"
                className="h-32 border-2 border-blue-200 focus:border-blue-500"
                placeholder="Failure Evaluation Prompt (optional)"
                value={extraPrompts.failureEvaluationPrompt}
                onChange={(e) => handleFailureEvaluationPrompt(e.target.value)}
                disabled={false}
                readOnly={false}
              />
            </div>
            </div>
        </div>

            {/* Inactivity Prompts Section */}
            {/* <div className="flex flex-col gap-4">
             */}
             <div className="p-4 bg-white rounded-lg w-full flex flex-col gap-4 shadow-lg shadow-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Inactivity Messages</h4>
                  <p className="text-gray-600 text-sm">
                    Messages to play when the user is inactive for a specified duration.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    const newInactivityConfig: InactivityConfiguration = {
                      duration: 7,
                      inactivity_prompt: "Are you still there? Please let me know if you need assistance."
                    };
                    const updatedPrompts: ExtraPrompts = {
                      ...extraPrompts,
                      inactivity_configuration: [...(extraPrompts.inactivity_configuration || []), newInactivityConfig]
                    };
                    updateExtraPrompts(updatedPrompts);
                  }}
                  className="bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Message
                </Button>
              </div>

              <div className="space-y-4">
                {(extraPrompts.inactivity_configuration || []).map((config, index) => (
                  <Card key={index} className="bg-gray-50 border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-semibold text-gray-900">Message {index + 1}</h5>
                        <Button
                          type="button"
                          onClick={() => {
                            const updatedConfigs = (extraPrompts.inactivity_configuration || []).filter((_, i) => i !== index);
                            const updatedPrompts: ExtraPrompts = {
                              ...extraPrompts,
                              inactivity_configuration: updatedConfigs
                            };
                            updateExtraPrompts(updatedPrompts);
                          }}
                          variant="destructive"
                          size="sm"
                          className="text-red-600 bg-red-50 border border-red-200 hover:bg-red-100"
                        >
                          
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Duration (s)
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            value={config.duration}
                            onChange={(e) => {
                              const updatedConfigs = [...(extraPrompts.inactivity_configuration || [])];
                              updatedConfigs[index] = {
                                ...config,
                                duration: parseInt(e.target.value) || 1
                              };
                              const updatedPrompts: ExtraPrompts = {
                                ...extraPrompts,
                                inactivity_configuration: updatedConfigs
                              };
                              updateExtraPrompts(updatedPrompts);
                            }}
                            className="border-gray-300 focus:border-blue-500"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label className="text-sm font-medium text-gray-700">
                            End Behavior
                          </Label>
                          <select
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value="unspecified"
                            disabled
                          >
                            <option value="unspecified">Unspecified</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Message
                        </Label>
                        <Textarea
                          value={config.inactivity_prompt}
                          onChange={(e) => {
                            const updatedConfigs = [...(extraPrompts.inactivity_configuration || [])];
                            updatedConfigs[index] = {
                              ...config,
                              inactivity_prompt: e.target.value
                            };
                            const updatedPrompts: ExtraPrompts = {
                              ...extraPrompts,
                              inactivity_configuration: updatedConfigs
                            };
                            updateExtraPrompts(updatedPrompts);
                          }}
                          placeholder="Enter inactivity message..."
                          className="min-h-[80px] border-gray-300 focus:border-blue-500 resize-y"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!extraPrompts.inactivity_configuration || extraPrompts.inactivity_configuration.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No inactivity messages configured.</p>
                    <p className="text-sm">Click "Add Message" to create your first inactivity prompt.</p>
                  </div>
                )}
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
                    <Input
                      placeholder="Enter handoff phone number (e.g., +91xxxxxxxx77)"
                      value={handoffConfig.handoff_number}
                      onChange={(e: any) => handleHandoffNumberChange(e.target.value)}
                      className={handoffConfig.error ? "border-red-500" : ""}
                    />
                    {handoffConfig.error ? (
                      <p className="text-xs text-red-500">
                        {handoffConfig.error}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Format: Country code + Phone number (e.g., +91xxxxxxxx77)
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
  <Checkbox
    id="warm-transfer"
    checked={handoffConfig.warmTransfer || false}
    onCheckedChange={(checked) => {
      updateHandoffConfig({
        ...handoffConfig,
        warmTransfer: checked,
      });
    }}
    className="data-[state=checked]:bg-purple-600"
  />
  <Label
    htmlFor="warm-transfer"
    className="text-sm font-medium text-gray-700"
  >
    Enable Warm Transfer
  </Label>
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
                {/* Debug display */}
                <div className="text-xs text-gray-500 mb-2">
                  Current agent phone number: "{agentPhoneNumber.phoneNumber}"
                </div>
                <select
                  className="border border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                  value={agentPhoneNumber.phoneNumber}
                  onChange={(e) => {
                    const selectedPhoneNumber = phoneNumbers.find(
                      (pn) => pn.phone_number === e.target.value
                    );
                    console.log("Phone number selection changed:", {
                      selectedValue: e.target.value,
                      agentPhoneNumber: agentPhoneNumber.phoneNumber,
                      selectedPhoneNumber,
                      allPhoneNumbers: phoneNumbers
                    });
                    updateAgentPhoneNumber(
                      e.target.value,
                      selectedPhoneNumber?._id || "",
                      selectedPhoneNumber?.numberType || undefined
                    );
                  }}
                >
                  <option value="">Select a phone number...</option>
                  {/* Add the current agent's phone number if it's not in the list */}
                  {agentPhoneNumber.phoneNumber && 
                   !filteredPhoneNumbers.find(pn => pn.phone_number === agentPhoneNumber.phoneNumber) && (
                    <option value={agentPhoneNumber.phoneNumber}>
                      {agentPhoneNumber.phoneNumber} (Current)
                    </option>
                  )}
                  {filteredPhoneNumbers.map((phoneNumber) => (
                    <option
                      key={phoneNumber._id}
                      value={phoneNumber.phone_number}
                    >
                      {phoneNumber.displayName}
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
  }
);

export default ChannelsAndPhoneMapping;
