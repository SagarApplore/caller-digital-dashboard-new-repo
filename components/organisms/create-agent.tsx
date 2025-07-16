"use client";

import { Loader2, Mail, MessageSquare, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Language,
  PersonaAndBehavior,
  Tone,
} from "../molecules/create-agent/persona-and-behavior";
import ChannelsAndPhoneMapping, {
  Channel,
} from "../molecules/create-agent/channels-and-phone-mapping";
import { KnowledgeBaseItem } from "../molecules/knowledge-base";
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

interface IPersonaAndBehavior {
  languages: Language[];
  tones: Tone[];
  agentName: string;
  summaryPrompt: string;
  successEvaluationPrompt: string;
  failureEvaluationPrompt: string;
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
  const [personaAndBehavior, setPersonaAndBehavior] =
    useState<IPersonaAndBehavior>({
      languages: [],
      tones: [],
      agentName: initialData?.agentName || "",
      summaryPrompt: initialData?.summaryPrompt || "",
      successEvaluationPrompt: initialData?.successEvaluationPrompt || "",
      failureEvaluationPrompt: initialData?.failureEvaluationPrompt || "",
    });
  const [channels, setChannels] = useState<Channel[]>(
    initialChannels.map((channel) => ({
      ...channel,
    }))
  );
  const [integrations, setIntegrations] = useState<{
    crmIntegrations: Integration[];
    communicationIntegrations: Integration[];
  }>({
    crmIntegrations: crmIntegrations,
    communicationIntegrations: communicationIntegrations,
  });
  const [voiceIntegration, setVoiceIntegration] = useState({
    selectedTTSModel: null,
    selectedTTSModelName: null,
    selectedTTSProvider: null,
    selectedTTSProviderName: null,
    selectedSTTModel: null,
    selectedSTTModelName: null,
    selectedSTTProvider: null,
    selectedSTTProviderName: null,
    selectedLLMModel: null,
    selectedLLMModelName: null,
    selectedLLMProvider: null,
    selectedLLMProviderName: null,
  });
  const [emailIntegration, setEmailIntegration] = useState({
    selectedLLMModel: null,
    selectedLLMModelName: null,
    selectedLLMProvider: null,
    selectedLLMProviderName: null,
  });
  const [chatIntegration, setChatIntegration] = useState({
    selectedLLMModel: null,
    selectedLLMModelName: null,
    selectedLLMProvider: null,
    selectedLLMProviderName: null,
  });

  const router = useRouter();
  const { user } = useAuth();

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      setLoading(true);
      const response = await apiRequest(endpoints.knowledgeBase.getAll, "GET");
      setKnowledgeBaseData((prev) => ({
        ...prev,
        knowledgeBases: response?.data?.data || [],
      }));
      setLoading(false);
    };
    fetchKnowledgeBases();
  }, []);

  useEffect(() => {
    const fetchLanguages = async () => {
      //   const response = await fetch("/api/languages");
      //   const data = await response.json();
      const response = [
        {
          id: 1,
          name: "English",
          key: "EN",
        },
        {
          id: 2,
          name: "Spanish",
          key: "ES",
        },
        {
          id: 3,
          name: "French",
          key: "FR",
        },
      ];
      setPersonaAndBehavior((prev) => ({
        ...prev,
        languages: response.map((language) => ({
          ...language,
          selected: initialData?.languages?.includes(language.name) || false,
        })),
      }));
    };
    const fetchTones = async () => {
      const response = rawTones;
      setPersonaAndBehavior((prev) => ({
        ...prev,
        tones: response,
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

          setPersonaAndBehavior((prev) => ({
            ...prev,
          }));

          setChannels((prev) =>
            prev.map((channel) => ({
              ...channel,
              prompt: {
                ...channel.prompt,
                value: agentData[channel.id]?.agentPrompt || "",
              },
            }))
          );
        } catch (error) {
          console.error("Error fetching agent data:", error);
        }
      }
    };

    fetchLanguages();
    fetchTones();
    fetchAgentData();
  }, [mode, agentId, initialData]);

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

  const handleSummaryPrompt = (message: string) => {
    setPersonaAndBehavior((prev) => ({
      ...prev,
      summaryPrompt: message,
    }));
  };

  const handleSuccessEvaluationPrompt = (message: string) => {
    setPersonaAndBehavior((prev) => ({
      ...prev,
      successEvaluationPrompt: message,
    }));
  };
  const handleFailureEvaluationPrompt = (message: string) => {
    setPersonaAndBehavior((prev) => ({
      ...prev,
      failureEvaluationPrompt: message,
    }));
  };

  const toggleChannel = (channelId: string) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === channelId
          ? { ...channel, active: !channel.active }
          : channel
      )
    );
  };

  const selectKnowledgeBase = (knowledgeBases: KnowledgeBaseItem[]) => {
    setKnowledgeBaseData((prev) => ({
      ...prev,
      selectedKnowledgeBases: knowledgeBases,
    }));
  };

  async function handleCreateAgent(): Promise<void> {
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
      agent_number: "+15550123", // Phone number for the agent
      summaryPrompt: personaAndBehavior.summaryPrompt,
      successEvaluationPrompt: personaAndBehavior.successEvaluationPrompt,
      failureEvaluationPrompt: personaAndBehavior.failureEvaluationPrompt,
      knowledgeBase: knowledgeBaseData.selectedKnowledgeBases.map(
        (selectKnowledgeBase) => selectKnowledgeBase._id
      ), // Array of knowledge base ObjectIds
      functionTools: [], // Array of function tool ObjectIds
      voice: {
        llmProvider: {
          model: voiceIntegration.selectedLLMModelName,
          providerName: voiceIntegration.selectedLLMProviderName,
        },
        voiceProvider: {
          model: voiceIntegration.selectedTTSModelName,
          providerName: voiceIntegration.selectedTTSProviderName,
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
      chats: {
        llmProvider: {
          model: chatIntegration.selectedLLMModelName,
          providerName: chatIntegration.selectedLLMProviderName,
        },
        firstMessage: channels.filter(
          (channel) => channel.id.toLowerCase() === "chat"
        )?.[0]?.firstMessage,
        agentPrompt: channels.filter(
          (channel) => channel.id.toLowerCase() === "chat"
        )?.[0]?.prompt?.value,
        temperature: 100,
        maxTokens: 100,
      },
      email: {
        llmProvider: {
          model: emailIntegration.selectedLLMModelName,
          providerName: emailIntegration.selectedLLMProviderName,
        },
        firstMessage: channels.filter(
          (channel) => channel.id.toLowerCase() === "email"
        )?.[0]?.firstMessage,
        agentPrompt: channels.filter(
          (channel) => channel.id.toLowerCase() === "email"
        )?.[0]?.prompt?.value,
        temperature: 100,
        maxTokens: 100,
      },
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
    toast.success(responseMessages.agent.create);
    // router.back();
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
          {agentSteps.map((step) => (
            <li
              key={step.id}
              className={`flex items-center gap-2 p-4 rounded-md cursor-pointer ${
                activeStep === step.id
                  ? "bg-purple-100 text-purple-700"
                  : "bg-white text-gray-500"
              }`}
              // onClick={() => setActiveStep(step.id)}
            >
              <div className="flex items-center gap-2">
                <step.icon />
                <span>{step.title}</span>
              </div>
            </li>
          ))}
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
              summaryPrompt={personaAndBehavior.summaryPrompt}
              failureEvaluationPrompt={
                personaAndBehavior.failureEvaluationPrompt
              }
              successEvaluationPrompt={
                personaAndBehavior.successEvaluationPrompt
              }
              handleSummaryPrompt={handleSummaryPrompt}
              handleSuccessEvaluationPrompt={handleSuccessEvaluationPrompt}
              hanldeFailureEvaluationPrompt={handleFailureEvaluationPrompt}
            />
          )}

          {activeStep === 2 && (
            <ChannelsAndPhoneMapping
              channels={channels}
              toggleChannel={toggleChannel}
              updatePrompt={updatePrompt}
              updateFirstMessage={updateFirstMessage}
            />
          )}

          {activeStep === 3 && (
            <KnowledgeBase
              knowledgeBases={knowledgeBaseData.knowledgeBases}
              selectedKnowledgeBases={knowledgeBaseData.selectedKnowledgeBases}
              selectKnowledgeBase={selectKnowledgeBase}
            />
          )}

          {activeStep === 4 && (
            <VoiceIntegration
              voiceIntegration={voiceIntegration}
              setVoiceIntegration={setVoiceIntegration}
            />
          )}

          {activeStep === 5 && (
            <ChatIntegration
              chatIntegration={chatIntegration}
              setChatIntegration={setChatIntegration}
            />
          )}

          {activeStep === 6 && (
            <EmailIntegration
              emailIntegration={emailIntegration}
              setEmailIntegration={setEmailIntegration}
            />
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
          totalSteps={agentSteps.length}
          handleCreateAgent={handleCreateAgent}
          mode={mode}
          creating={creating}
        />
      </div>
    </div>
  );
};

export default CreateAgent;
