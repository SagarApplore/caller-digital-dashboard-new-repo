"use client";

import {
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Language,
  PersonaAndBehavior,
  Tone,
} from "../molecules/create-agent/persona-and-behavior";
import ChannelsAndPhoneMapping, {
  Channel,
  HandoffConfig,
} from "../molecules/create-agent/channels-and-phone-mapping";
import { KnowledgeBaseItem } from "../molecules/knowledge-base";
import { IFunctionTool } from "@/types/common";
import KnowledgeBase from "../molecules/create-agent/knowledge-base";
import { Integration } from "../molecules/create-agent/integrations";
import VoiceIntegration from "../molecules/create-agent/voice-integration";
import NavFooter from "../molecules/create-agent/nav-footer";
import endpoints from "@/lib/endpoints";
import apiRequest from "@/utils/api";
import { useAuth } from "../providers/auth-provider";
import {
  agentSteps,
  communicationIntegrations,
  crmIntegrations,
  initialChannels,
  rawTones,
} from "@/lib/create-agent-config";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import responseMessages from "@/lib/responseMessages";
import ChatIntegration from "../molecules/create-agent/chat-integration";
import EmailIntegration from "../molecules/create-agent/email-integration";
import { Button } from "@/components/ui/button";

interface IPersonaAndBehavior {
  languages: Language[];
  tones: Tone[];
  agentName: string;
}

interface CreateAgentProps {
  mode?: "create" | "edit";
  agentId?: string;
  initialData?: any;
}

const CreateAgent = ({
  mode = "create",
  agentId,
  initialData,
}: CreateAgentProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [knowledgeBaseData, setKnowledgeBaseData] = useState<{
    knowledgeBases: KnowledgeBaseItem[];
    selectedKnowledgeBases: KnowledgeBaseItem[];
  }>({
    knowledgeBases: [],
    selectedKnowledgeBases: [],
  });

  const [functionToolsData, setFunctionToolsData] = useState<{
    functionTools: IFunctionTool[];
    selectedFunctionTools: IFunctionTool[];
  }>({
    functionTools: [],
    selectedFunctionTools: [],
  });

  const [personaAndBehavior, setPersonaAndBehavior] =
    useState<IPersonaAndBehavior>({
      languages: [],
      tones: [],
      agentName: initialData?.agentName || "",
    });

  const [extraPrompts, setExtraPrompts] = useState({
    summaryPrompt: initialData?.summaryPrompt || "",
    successEvaluationPrompt: initialData?.successEvaluationPrompt || "",
    failureEvaluationPrompt: initialData?.failureEvaluationPrompt || "",
  });

  // Initialize channels with existing data
  const initializeChannels = (): Channel[] => {
    return initialChannels.map((channel) => {
      const channelId = channel.id.toLowerCase();
      const existingChannel = initialData?.[channelId];

      return {
        ...channel,
        active: initialData?.channels?.includes(channelId) || false,
        prompt: {
          ...channel.prompt,
          value: existingChannel?.agentPrompt || channel.prompt.value,
        },
        firstMessage: existingChannel?.firstMessage || channel.firstMessage,
      };
    });
  };

  const [channels, setChannels] = useState<Channel[]>(initializeChannels());

  const [integrations, setIntegrations] = useState<{
    crmIntegrations: Integration[];
    communicationIntegrations: Integration[];
  }>({
    crmIntegrations: crmIntegrations,
    communicationIntegrations: communicationIntegrations,
  });

  // Initialize voice integration with existing data
  const initializeVoiceIntegration = () => ({
    selectedTTSModel: initialData?.voice?.voiceProvider?.model || null,
    selectedTTSModelName: initialData?.voice?.voiceProvider?.model || null,
    selectedTTSProvider:
      initialData?.voice?.voiceProvider?.providerName || null,
    selectedTTSProviderName:
      initialData?.voice?.voiceProvider?.providerName || null,
    selectedSTTModel: initialData?.voice?.transcriberProvider?.model || null,
    selectedSTTModelName:
      initialData?.voice?.transcriberProvider?.model || null,
    selectedSTTProvider:
      initialData?.voice?.transcriberProvider?.providerName || null,
    selectedSTTProviderName:
      initialData?.voice?.transcriberProvider?.providerName || null,
    selectedTTSVoiceId: initialData?.voice?.voiceProvider?.voiceId || null,
    selectedTTSVoiceName: initialData?.voice?.voiceProvider?.voiceName || null,
    selectedLLMModel: initialData?.voice?.llmProvider?.model || null,
    selectedLLMModelName: initialData?.voice?.llmProvider?.model || null,
    selectedLLMProvider: initialData?.voice?.llmProvider?.providerName || null,
    selectedLLMProviderName:
      initialData?.voice?.llmProvider?.providerName || null,
  });

  const [voiceIntegration, setVoiceIntegration] = useState(
    initializeVoiceIntegration()
  );

  // Initialize email integration with existing data
  const initializeEmailIntegration = () => ({
    selectedLLMModel: initialData?.email?.llmProvider?.model || null,
    selectedLLMModelName: initialData?.email?.llmProvider?.model || null,
    selectedLLMProvider: initialData?.email?.llmProvider?.providerName || null,
    selectedLLMProviderName:
      initialData?.email?.llmProvider?.providerName || null,
  });

  const [emailIntegration, setEmailIntegration] = useState(
    initializeEmailIntegration()
  );

  // Initialize chat integration with existing data
  const initializeChatIntegration = () => ({
    selectedLLMModel: initialData?.chats?.llmProvider?.model || null,
    selectedLLMModelName: initialData?.chats?.llmProvider?.model || null,
    selectedLLMProvider: initialData?.chats?.llmProvider?.providerName || null,
    selectedLLMProviderName:
      initialData?.chats?.llmProvider?.providerName || null,
  });

  const [chatIntegration, setChatIntegration] = useState(
    initializeChatIntegration()
  );

  // Initialize handoff configuration
  const initializeHandoffConfig = (): HandoffConfig => {
    if (initialData?.handoff) {
      const handoffNumber = initialData.handoff.handoff_number || "";
      const countryCode = handoffNumber.startsWith("+")
        ? handoffNumber.substring(0, 3)
        : "";
      const phoneNumber = handoffNumber.startsWith("+")
        ? handoffNumber.substring(3)
        : handoffNumber;

      return {
        enabled: initialData.handoff.enabled || false,
        countryCode: countryCode,
        phoneNumber: phoneNumber,
        phoneNumberId: initialData.handoff.phoneNumberId || "",
      };
    }
    return {
      enabled: false,
      countryCode: "",
      phoneNumber: "",
      phoneNumberId: "",
    };
  };

  const [handoffConfig, setHandoffConfig] = useState<HandoffConfig>(
    initializeHandoffConfig()
  );

  // Add separate state for agent phone number mapping
  const [agentPhoneNumber, setAgentPhoneNumber] = useState<{
    phoneNumber: string;
    phoneNumberId: string;
  }>({
    phoneNumber: initialData?.agent_number || "",
    phoneNumberId: initialData?.phone_number_assignment || "",
  });

  const router = useRouter();
  const { user } = useAuth();

  // Validation functions for each step
  const validateStep1 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!personaAndBehavior.agentName.trim()) {
      errors.push("Agent name is required");
    }

    const selectedLanguages = personaAndBehavior.languages.filter(
      (lang) => lang.selected
    );
    if (selectedLanguages.length === 0) {
      errors.push("At least one language must be selected");
    }

    const selectedTones = personaAndBehavior.tones.filter(
      (tone) => tone.selected
    );
    if (selectedTones.length === 0) {
      errors.push("At least one tone must be selected");
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateStep2 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    const activeChannels = channels.filter((channel) => channel.active);
    if (activeChannels.length === 0) {
      errors.push("At least one channel must be selected");
      return { isValid: false, errors };
    }

    // Validate each active channel
    activeChannels.forEach((channel) => {
      if (!channel.prompt.value.trim()) {
        errors.push(`${channel.name} prompt is required`);
      }
      if (!channel.firstMessage.trim()) {
        errors.push(`${channel.name} first message is required`);
      }
    });

    // Validate handoff configuration
    if (handoffConfig.enabled) {
      if (!handoffConfig.countryCode.trim()) {
        errors.push("Handoff country code is required");
      }
      if (!handoffConfig.phoneNumber.trim()) {
        errors.push("Handoff phone number is required");
      }
    }

    // Validate agent phone number mapping (optional but recommended for voice channel)
    const voiceChannel = channels.find((channel) => channel.id.toLowerCase() === "voice");
    if (voiceChannel?.active && !agentPhoneNumber.phoneNumber.trim()) {
      errors.push("Agent phone number is recommended for voice channel");
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateStep3 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Knowledge base is optional, so no validation needed
    return { isValid: true, errors };
  };

  const validateStep4 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    const voiceChannel = channels.find(
      (channel) => channel.id.toLowerCase() === "voice"
    );
    if (voiceChannel?.active) {
      if (!voiceIntegration.selectedLLMModelName) {
        errors.push("Voice LLM model is required");
      }
      if (!voiceIntegration.selectedLLMProviderName) {
        errors.push("Voice LLM provider is required");
      }
      if (!voiceIntegration.selectedTTSModelName) {
        errors.push("Voice TTS model is required");
      }
      if (!voiceIntegration.selectedTTSProviderName) {
        errors.push("Voice TTS provider is required");
      }
      if (!voiceIntegration.selectedSTTModelName) {
        errors.push("Voice STT model is required");
      }
      if (!voiceIntegration.selectedSTTProviderName) {
        errors.push("Voice STT provider is required");
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateStep5 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    const chatChannel = channels.find(
      (channel) => channel.id.toLowerCase() === "chat"
    );
    if (chatChannel?.active) {
      if (!chatIntegration.selectedLLMModelName) {
        errors.push("Chat LLM model is required");
      }
      if (!chatIntegration.selectedLLMProviderName) {
        errors.push("Chat LLM provider is required");
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateStep6 = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    const emailChannel = channels.find(
      (channel) => channel.id.toLowerCase() === "email"
    );
    if (emailChannel?.active) {
      if (!emailIntegration.selectedLLMModelName) {
        errors.push("Email LLM model is required");
      }
      if (!emailIntegration.selectedLLMProviderName) {
        errors.push("Email LLM provider is required");
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  // Additional validation for final submission
  const validateAllSteps = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check if at least one channel is active
    const activeChannels = channels.filter((channel) => channel.active);
    if (activeChannels.length === 0) {
      errors.push("At least one channel must be selected");
    }

    // Validate that each active channel has its corresponding integration configured
    activeChannels.forEach((channel) => {
      const channelId = channel.id.toLowerCase();

      if (channelId === "voice") {
        if (
          !voiceIntegration.selectedLLMModelName ||
          !voiceIntegration.selectedLLMProviderName
        ) {
          errors.push("Voice integration is incomplete");
        }
      } else if (channelId === "chat") {
        if (
          !chatIntegration.selectedLLMModelName ||
          !chatIntegration.selectedLLMProviderName
        ) {
          errors.push("Chat integration is incomplete");
        }
      } else if (channelId === "email") {
        if (
          !emailIntegration.selectedLLMModelName ||
          !emailIntegration.selectedLLMProviderName
        ) {
          errors.push("Email integration is incomplete");
        }
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  const validateCurrentStep = (): { isValid: boolean; errors: string[] } => {
    switch (activeStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      case 5:
        return validateStep5();
      case 6:
        return validateStep6();
      default:
        return { isValid: true, errors: [] };
    }
  };

  const isStepValid = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return validateStep1().isValid;
      case 2:
        return validateStep2().isValid;
      case 3:
        return validateStep3().isValid;
      case 4:
        return validateStep4().isValid;
      case 5:
        return validateStep5().isValid;
      case 6:
        return validateStep6().isValid;
      default:
        return true;
    }
  };

  const handleStepChange = (step: number) => {
    // Only allow navigation to next step if current step is valid
    if (step > activeStep) {
      const validation = validateCurrentStep();
      if (!validation.isValid) {
        toast.error(
          `Please complete all required fields: ${validation.errors.join(", ")}`
        );
        return;
      }
    }

    // Check if the target step should be skipped based on channel activation
    const chatChannelActive = channels.find(ch => ch.id.toLowerCase() === "chat")?.active;
    const emailChannelActive = channels.find(ch => ch.id.toLowerCase() === "email")?.active;

    // If trying to navigate to step 5 (Chat Integration) but chat is not active, skip to next available step
    if (step === 5 && !chatChannelActive) {
      // If email is active, go to step 6, otherwise go to step 7 (or the last step)
      const nextStep = emailChannelActive ? 6 : 7;
      setActiveStep(nextStep);
      return;
    }

    // If trying to navigate to step 6 (Email Integration) but email is not active, skip to next available step
    if (step === 6 && !emailChannelActive) {
      setActiveStep(7); // Go to the next step after email integration
      return;
    }

    setActiveStep(step);
  };

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      setLoading(true);
      try {
        const response = await apiRequest(
          endpoints.knowledgeBase.getAll,
          "GET"
        );
        const knowledgeBases = response?.data?.data || [];

        // If in edit mode, find and select existing knowledge bases
        let selectedKnowledgeBases: KnowledgeBaseItem[] = [];
        if (mode === "edit" && initialData?.knowledgeBase) {
          selectedKnowledgeBases = knowledgeBases.filter(
            (kb: KnowledgeBaseItem) =>
              initialData.knowledgeBase.includes(kb._id)
          );
        }

        setKnowledgeBaseData({
          knowledgeBases,
          selectedKnowledgeBases,
        });
      } catch (error) {
        console.error("Error fetching knowledge bases:", error);
      }
      setLoading(false);
    };
    fetchKnowledgeBases();
  }, [mode, initialData]);

  useEffect(() => {
    const fetchFunctionTools = async () => {
      try {
        const response = await apiRequest(
          endpoints.functionTools.getAll,
          "GET"
        );
        const functionTools = response?.data?.data || [];

        // If in edit mode, find and select existing function tools
        let selectedFunctionTools: IFunctionTool[] = [];
        if (mode === "edit" && initialData?.functionTools) {
          selectedFunctionTools = functionTools.filter((tool: IFunctionTool) =>
            initialData.functionTools.includes(tool._id)
          );
        }

        setFunctionToolsData({
          functionTools,
          selectedFunctionTools,
        });
      } catch (error) {
        console.error("Error fetching function tools:", error);
      }
    };
    fetchFunctionTools();
  }, [mode, initialData]);

  useEffect(() => {
    const fetchLanguages = async () => {
      const response = [
        {
          id: 1,
          name: "English",
          key: "EN",
        },
        {
          id: 2,
          name: "Hindi",
          key: "HI",
        },
        
      ];

      setPersonaAndBehavior((prev) => ({
        ...prev,
        languages: response.map((language) => ({
          ...language,
          selected:
            mode === "edit" && initialData?.languages
              ? initialData.languages.includes(language.key)
              : false,
        })),
      }));
    };

    const fetchTones = async () => {
      // Initialize tones with existing selections
      const tones = rawTones.map((tone) => ({
        ...tone,
        selected:
          mode === "edit" && initialData?.tone
            ? initialData.tone.includes(tone.name.toLowerCase())
            : false,
      }));

      setPersonaAndBehavior((prev) => ({
        ...prev,
        tones,
      }));
    };

    const fetchAgentData = async () => {
      if (mode === "edit" && agentId && !initialData) {
        try {
          const response = await apiRequest(
            `${endpoints.assistants.get}/${agentId}`,
            "GET"
          );
          const agentData = response.data?.data;

          // Update all state with fetched data
          setPersonaAndBehavior((prev) => ({
            ...prev,
            agentName: agentData.agentName || "",
            summaryPrompt: agentData.summaryPrompt || "",
            successEvaluationPrompt: agentData.successEvaluationPrompt || "",
            failureEvaluationPrompt: agentData.failureEvaluationPrompt || "",
            languages: prev.languages.map((language) => ({
              ...language,
              selected: agentData.languages?.includes(language.key) || false,
            })),
            tones: prev.tones.map((tone) => ({
              ...tone,
              selected:
                agentData.tone?.includes(tone.name.toLowerCase()) || false,
            })),
          }));

          // Update channels
          setChannels(
            initialChannels.map((channel) => {
              const channelId = channel.id.toLowerCase();
              const existingChannel = agentData[channelId];

              return {
                ...channel,
                active: agentData.channels?.includes(channelId) || false,
                prompt: {
                  ...channel.prompt,
                  value: existingChannel?.agentPrompt || channel.prompt.value,
                },
                firstMessage:
                  existingChannel?.firstMessage || channel.firstMessage,
              };
            })
          );

          // Update integrations
          setVoiceIntegration({
            selectedTTSModel: agentData.voice?.voiceProvider?.model || null,
            selectedTTSModelName: agentData.voice?.voiceProvider?.model || null,
            selectedTTSProvider:
              agentData.voice?.voiceProvider?.providerName || null,
            selectedTTSProviderName:
              agentData.voice?.voiceProvider?.providerName || null,
            selectedSTTModel:
              agentData.voice?.transcriberProvider?.model || null,
            selectedSTTModelName:
              agentData.voice?.transcriberProvider?.model || null,
            selectedSTTProvider:
              agentData.voice?.transcriberProvider?.providerName || null,
            selectedSTTProviderName:
              agentData.voice?.transcriberProvider?.providerName || null,
            selectedTTSVoiceId: agentData.voice?.voiceProvider?.voiceId || null,
            selectedTTSVoiceName:
              agentData.voice?.voiceProvider?.voiceName || null,
            selectedLLMModel: agentData.voice?.llmProvider?.model || null,
            selectedLLMModelName: agentData.voice?.llmProvider?.model || null,
            selectedLLMProvider:
              agentData.voice?.llmProvider?.providerName || null,
            selectedLLMProviderName:
              agentData.voice?.llmProvider?.providerName || null,
          });

          setEmailIntegration({
            selectedLLMModel: agentData.email?.llmProvider?.model || null,
            selectedLLMModelName: agentData.email?.llmProvider?.model || null,
            selectedLLMProvider:
              agentData.email?.llmProvider?.providerName || null,
            selectedLLMProviderName:
              agentData.email?.llmProvider?.providerName || null,
          });

          setChatIntegration({
            selectedLLMModel: agentData.chats?.llmProvider?.model || null,
            selectedLLMModelName: agentData.chats?.llmProvider?.model || null,
            selectedLLMProvider:
              agentData.chats?.llmProvider?.providerName || null,
            selectedLLMProviderName:
              agentData.chats?.llmProvider?.providerName || null,
          });

          // Update knowledge base selection
          if (
            agentData.knowledgeBase &&
            knowledgeBaseData.knowledgeBases.length > 0
          ) {
            const selectedKnowledgeBases =
              knowledgeBaseData.knowledgeBases.filter((kb: KnowledgeBaseItem) =>
                agentData.knowledgeBase.includes(kb._id)
              );
            setKnowledgeBaseData((prev) => ({
              ...prev,
              selectedKnowledgeBases,
            }));
          }

          // Update function tools selection
          if (
            agentData.functionTools &&
            functionToolsData.functionTools.length > 0
          ) {
            const selectedFunctionTools =
              functionToolsData.functionTools.filter((tool: IFunctionTool) =>
                agentData.functionTools.includes(tool._id)
              );
            setFunctionToolsData((prev) => ({
              ...prev,
              selectedFunctionTools,
            }));
          }

          // Update handoff configuration
          if (agentData.handoff) {
            const handoffNumber = agentData.handoff.handoff_number || "";
            const countryCode = handoffNumber.startsWith("+")
              ? handoffNumber.substring(0, 3)
              : "";
            const phoneNumber = handoffNumber.startsWith("+")
              ? handoffNumber.substring(3)
              : handoffNumber;

            setHandoffConfig({
              enabled: agentData.handoff.enabled || false,
              countryCode: countryCode,
              phoneNumber: phoneNumber,
              phoneNumberId: agentData.handoff.phoneNumberId || "",
            });
          }

          // Update agent phone number mapping
          setAgentPhoneNumber({
            phoneNumber: agentData.agent_number || "",
            phoneNumberId: agentData.phone_number_assignment || "",
          });
        } catch (error) {
          console.error("Error fetching agent data:", error);
        }
      }
    };

    fetchLanguages();
    fetchTones();
    fetchAgentData();
  }, [mode, agentId, initialData]);

  // Real-time validation feedback
  useEffect(() => {
    const validation = validateCurrentStep();
    if (!validation.isValid && validation.errors.length > 0) {
      // You can add additional visual feedback here if needed
      // For now, we'll just log the validation errors for debugging
      console.log(`Step ${activeStep} validation errors:`, validation.errors);
    }
  }, [
    activeStep,
    personaAndBehavior,
    channels,
    voiceIntegration,
    chatIntegration,
    emailIntegration,
    handoffConfig,
    agentPhoneNumber,
  ]);

  const handleLanguageClick = (id: number) => {
    setPersonaAndBehavior((prev) => ({
      ...prev,
      languages: prev.languages.map((language) =>
        language.id === id
          ? { ...language, selected: !language.selected }
          : language
      ),
    }));
  };

  const handleToneClick = (id: number) => {
    setPersonaAndBehavior((prev) => ({
      ...prev,
      tones: prev.tones.map((tone) =>
        tone.id === id ? { ...tone, selected: !tone.selected } : tone
      ),
    }));
  };

  const toggleChannel = (channelId: string) => {
    setChannels((prev) => {
      const updatedChannels = prev.map((channel) =>
        channel.id === channelId
          ? { ...channel, active: !channel.active }
          : channel
      );

      // Check if we need to handle step navigation after toggling
      const chatChannelActive = updatedChannels.find(ch => ch.id.toLowerCase() === "chat")?.active;
      const emailChannelActive = updatedChannels.find(ch => ch.id.toLowerCase() === "email")?.active;

      // If user is on step 5 (Chat Integration) and chat is being disabled, move to next available step
      if (activeStep === 5 && channelId.toLowerCase() === "chat" && !chatChannelActive) {
        const nextStep = emailChannelActive ? 6 : 7;
        setActiveStep(nextStep);
      }

      // If user is on step 6 (Email Integration) and email is being disabled, move to next available step
      if (activeStep === 6 && channelId.toLowerCase() === "email" && !emailChannelActive) {
        setActiveStep(7);
      }

      return updatedChannels;
    });
  };

  const selectKnowledgeBase = (knowledgeBases: KnowledgeBaseItem[]) => {
    setKnowledgeBaseData((prev) => ({
      ...prev,
      selectedKnowledgeBases: knowledgeBases,
    }));
  };

  const selectFunctionTools = (functionTools: IFunctionTool[]) => {
    setFunctionToolsData((prev) => ({
      ...prev,
      selectedFunctionTools: functionTools,
    }));
  };

  async function handleCreateAgent(): Promise<void> {
    // Validate all steps before creating/updating
    const validation = validateAllSteps();
    if (!validation.isValid) {
      toast.error(
        `Please complete all required fields: ${validation.errors.join(", ")}`
      );
      setCreating(false);
      return;
    }

    setCreating(true);
    const agentData = {
      agentName: personaAndBehavior.agentName,
      client: user?.id,
      status: "active",
      channels: channels
        .filter((channel) => {
          if (channel.active) {
            return channel;
          }
        })
        .map((channel) => channel.id.toLowerCase()),
      languages: personaAndBehavior.languages.map((language) => language.key),
      tone: personaAndBehavior.tones
        .filter((tone) => tone.selected)
        .map((tone) => tone.name.toLowerCase()),
      call_type: "OUTBOUND", // or "inbound", etc.
      agent_number: agentPhoneNumber.phoneNumber || "", // Phone number for the agent
      phone_number_assignment: agentPhoneNumber.phoneNumberId || null, // Phone number assignment ID
      summaryPrompt: extraPrompts.summaryPrompt,
      successEvaluationPrompt: extraPrompts.successEvaluationPrompt,
      failureEvaluationPrompt: extraPrompts.failureEvaluationPrompt,
      knowledgeBase: knowledgeBaseData.selectedKnowledgeBases.map(
        (selectKnowledgeBase) => selectKnowledgeBase._id
      ), // Array of knowledge base ObjectIds
      functionTools: functionToolsData.selectedFunctionTools.map(
        (tool) => tool._id
      ), // Array of function tool ObjectIds
      handoff: handoffConfig.enabled
        ? {
            enabled: handoffConfig.enabled,
            handoff_number: `${handoffConfig.countryCode}${handoffConfig.phoneNumber}`,
            phoneNumberId: handoffConfig.phoneNumberId,
          }
        : {
            enabled: false,
            handoff_number: null,
            phoneNumberId: null,
          },
      voice: {
        llmProvider: {
          model: voiceIntegration.selectedLLMModelName,
          providerName: voiceIntegration.selectedLLMProviderName,
        },
        voiceProvider: {
          model: voiceIntegration.selectedTTSModelName,
          providerName: voiceIntegration.selectedTTSProviderName,
          voiceId: voiceIntegration.selectedTTSVoiceId,
          voiceName: voiceIntegration.selectedTTSVoiceName,
        },
        transcriberProvider: {
          model: voiceIntegration.selectedSTTModelName,
          providerName: voiceIntegration.selectedSTTProviderName,
        },
        firstMessageMode: "AI_SPEAKS_FIRST",
        firstMessage: channels.filter(
          (channel) => channel.id.toLowerCase() === "voice"
        )?.[0]?.firstMessage,
        agentPrompt: channels.filter(
          (channel) => channel.id.toLowerCase() === "voice"
        )?.[0]?.prompt?.value,
        temperature: 100,
        maxTokens: 100,
      },
      ...(channels.find(ch => ch.id.toLowerCase() === "chat")?.active && {
        chats: {
          llmProvider: {
            model: chatIntegration.selectedLLMModelName,
            providerName: chatIntegration.selectedLLMProviderName,
          },
          agentPrompt: channels.filter(
            (channel) => channel.id.toLowerCase() === "chat"
          )?.[0]?.prompt?.value,
          temperature: 100,
          maxTokens: 100,
        },
      }),
      ...(channels.find(ch => ch.id.toLowerCase() === "email")?.active && {
        email: {
          llmProvider: {
            model: emailIntegration.selectedLLMModelName,
            providerName: emailIntegration.selectedLLMProviderName,
          },
          agentPrompt: channels.filter(
            (channel) => channel.id.toLowerCase() === "email"
          )?.[0]?.prompt?.value,
          temperature: 100,
          maxTokens: 100,
        },
      }),
    };

    if (mode === "edit" && agentId) {
      // Update existing agent - merge with existing data
      const updateData = {
        ...initialData,
        ...agentData,
      };
      await apiRequest(
        `${endpoints.assistants.update}/${agentId}`,
        "PUT",
        updateData
      );
    } else {
      try {
        await apiRequest(endpoints.assistants.create, "POST", agentData);
      } catch (error) {
        console.error(error);
      }
    }

    setCreating(false);
    toast.success(
      mode === "edit"
        ? responseMessages.agent.update
        : responseMessages.agent.create
    );
    router.back();
  }

  const updatePrompt = (channelId: string, prompt: string) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === channelId
          ? { ...channel, prompt: { ...channel.prompt, value: prompt } }
          : channel
      )
    );
  };

  const updateFirstMessage = (channelId: string, firstMessage: string) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === channelId
          ? { ...channel, firstMessage: firstMessage }
          : channel
      )
    );
  };

  // Calculate actual total steps based on channel activation
  const getTotalSteps = () => {
    const chatChannelActive = channels.find(ch => ch.id.toLowerCase() === "chat")?.active;
    const emailChannelActive = channels.find(ch => ch.id.toLowerCase() === "email")?.active;
    
    let totalSteps = 4; // Base steps: 1, 2, 3, 4
    
    if (chatChannelActive) {
      totalSteps++;
    }
    
    if (emailChannelActive) {
      totalSteps++;
    }
    
    return totalSteps;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-full">
      <div className="bg-white p-4 w-full max-w-[250px] h-full">
        <ul className="flex flex-col gap-2 list-none">
          {agentSteps.map((step) => {
            // Check if step should be shown based on channel activation
            const chatChannelActive = channels.find(ch => ch.id.toLowerCase() === "chat")?.active;
            const emailChannelActive = channels.find(ch => ch.id.toLowerCase() === "email")?.active;
            
            // Hide step 5 if chat is not active
            if (step.id === 5 && !chatChannelActive) {
              return null;
            }
            
            // Hide step 6 if email is not active
            if (step.id === 6 && !emailChannelActive) {
              return null;
            }

            return (
              <li
                key={step.id}
                className={`flex items-center gap-2 p-4 rounded-md cursor-pointer ${
                  activeStep === step.id
                    ? "bg-purple-100 text-purple-700"
                    : step.id < activeStep
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-white text-gray-500"
                }`}
                onClick={() => handleStepChange(step.id)}
              >
                <div className="flex items-center gap-2 w-full justify-between">
                  <div className="flex items-center gap-2">
                    <step.icon />
                    <span>{step.title}</span>
                  </div>
                  {step.id < activeStep && isStepValid(step.id) && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {step.id === activeStep && !isStepValid(step.id) && (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="py-4 mr-4 flex flex-col gap-4 w-full h-full">
        <div className="flex flex-col gap-4 w-full h-[calc(100vh-170px)] overflow-y-scroll">
          {activeStep === 1 && (
            <PersonaAndBehavior
              languages={personaAndBehavior.languages}
              handleLanguageClick={handleLanguageClick}
              tones={personaAndBehavior.tones}
              handleToneClick={handleToneClick}
              agentName={personaAndBehavior.agentName}
              setAgentName={(agentName) =>
                setPersonaAndBehavior((prev) => ({
                  ...prev,
                  agentName,
                }))
              }
            />
          )}

          {activeStep === 2 && (
            <ChannelsAndPhoneMapping
              channels={channels}
              toggleChannel={toggleChannel}
              updatePrompt={updatePrompt}
              updateFirstMessage={updateFirstMessage}
              handoffConfig={handoffConfig}
              updateHandoffConfig={setHandoffConfig}
              extraPrompts={extraPrompts}
              updateExtraPrompts={setExtraPrompts}
              agentPhoneNumber={agentPhoneNumber}
              updateAgentPhoneNumber={(phoneNumber, phoneNumberId) => 
                setAgentPhoneNumber({ phoneNumber, phoneNumberId })
              }
            />
          )}

          {activeStep === 3 && (
            <KnowledgeBase
              knowledgeBases={knowledgeBaseData.knowledgeBases}
              selectedKnowledgeBases={knowledgeBaseData.selectedKnowledgeBases}
              selectKnowledgeBase={selectKnowledgeBase}
              selectedFunctionTools={functionToolsData.selectedFunctionTools}
              selectFunctionTools={selectFunctionTools}
            />
          )}

          {activeStep === 4 && (
            <VoiceIntegration
              voiceIntegration={voiceIntegration}
              setVoiceIntegration={setVoiceIntegration}
              mode={mode}
            />
          )}

          {activeStep === 5 && channels.find(ch => ch.id.toLowerCase() === "chat")?.active && (
            <ChatIntegration
              chatIntegration={chatIntegration}
              setChatIntegration={setChatIntegration}
              mode={mode}
            />
          )}

          {activeStep === 5 && !channels.find(ch => ch.id.toLowerCase() === "chat")?.active && (
            <div className="p-8 bg-white rounded-lg shadow-lg shadow-gray-200 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat Integration Not Available</h3>
              <p className="text-gray-600 mb-4">
                Please enable the Live Chat channel in the Channels & Phone Mapping step to configure chat integration.
              </p>
              <Button 
                onClick={() => handleStepChange(2)}
                className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold"
              >
                Go to Channels & Phone Mapping
              </Button>
            </div>
          )}

          {activeStep === 6 && channels.find(ch => ch.id.toLowerCase() === "email")?.active && (
            <EmailIntegration
              emailIntegration={emailIntegration}
              setEmailIntegration={setEmailIntegration}
              mode={mode}
            />
          )}

          {activeStep === 6 && !channels.find(ch => ch.id.toLowerCase() === "email")?.active && (
            <div className="p-8 bg-white rounded-lg shadow-lg shadow-gray-200 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Integration Not Available</h3>
              <p className="text-gray-600 mb-4">
                Please enable the Email Support channel in the Channels & Phone Mapping step to configure email integration.
              </p>
              <Button 
                onClick={() => handleStepChange(2)}
                className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold"
              >
                Go to Channels & Phone Mapping
              </Button>
            </div>
          )}

          {/* {activeStep === 4 && (
          <Integrations
            crmIntegrations={integrations.crmIntegrations}
            communicationIntegrations={integrations.communicationIntegrations}
          />
        )} */}

          {/* {activeStep === 6 && <RoutingAndEscalation />} */}
        </div>

        <NavFooter
          activeStep={activeStep}
          handleStepChange={handleStepChange}
          totalSteps={getTotalSteps()}
          handleCreateAgent={handleCreateAgent}
          mode={mode}
          creating={creating}
          validateCurrentStep={validateCurrentStep}
        />
      </div>
    </div>
  );
};

export default CreateAgent;
