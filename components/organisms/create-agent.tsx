"use client";

import {
  Brain,
  ChartLine,
  Mail,
  MessageCircle,
  MessageSquare,
  Mic,
  Phone,
  Puzzle,
  RadioTower,
  Route,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Language,
  PersonaAndBehavior,
  Tone,
} from "../molecules/create-agent/persona-and-behavior";
import ChannelsAndPhoneMapping, {
  Channel,
} from "../molecules/create-agent/channels-and-phone-mapping";
import KnowledgeBase from "../molecules/create-agent/knowledge-base";
import Integrations, {
  Integration,
} from "../molecules/create-agent/integrations";
import VoiceIntegration from "../molecules/create-agent/voice-integration";
import RoutingAndEscalation from "../molecules/create-agent/routing-and-escalation";
import NavFooter from "../molecules/create-agent/nav-footer";
import endpoints from "@/lib/endpoints";
import apiRequest from "@/utils/api";

const agentSteps = [
  {
    id: 1,
    title: "Persona & Behavior",
    icon: <User />,
  },
  {
    id: 2,
    title: "Channels & Phone Mapping",
    icon: <RadioTower />,
  },
  {
    id: 3,
    title: "Knowledge Base",
    icon: <Brain />,
  },
  {
    id: 4,
    title: "Integrations",
    icon: <Puzzle />,
  },
  {
    id: 5,
    title: "Voice Integration",
    icon: <Mic />,
  },
  {
    id: 6,
    title: "Routing & Escalation",
    icon: <Route />,
  },
  {
    id: 7,
    title: "Analytics Summary",
    icon: <ChartLine />,
  },
];

const rawTones = [
  {
    id: 1,
    name: "Friendly",
    selected: false,
  },
  {
    id: 2,
    name: "Professional",
    selected: false,
  },
  {
    id: 3,
    name: "Neutral",
    selected: false,
  },
  {
    id: 4,
    name: "Empathetic",
    selected: false,
  },
];

interface PersonaAndBehavior {
  languages: Language[];
  tones: Tone[];
  agentName: string;
}

interface KnowledgeBaseItem {
  file: string;
  prompt: string;
  _id: string;
}

interface KnowledgeBaseData {
  voiceDocuments: KnowledgeBaseItem[];
  emailDocuments: KnowledgeBaseItem[];
  chatDocuments: KnowledgeBaseItem[];
}

const crmIntegrations: Integration[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    description: "CRM & Sales automation",
    icon: "🧡",
    iconBg: "bg-orange-100",
    connected: true,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Enterprise CRM platform",
    icon: "☁️",
    iconBg: "bg-blue-100",
    connected: false,
  },
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Customer support tickets",
    icon: "💚",
    iconBg: "bg-green-100",
    connected: true,
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Database & workflow",
    icon: "🔴",
    iconBg: "bg-red-100",
    connected: false,
  },
];

const communicationIntegrations: Integration[] = [
  {
    id: "twilio",
    name: "Twilio",
    description: "Voice & SMS services",
    icon: "📞",
    iconBg: "bg-red-100",
    connected: true,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Cloud API",
    description: "Meta's official WhatsApp API",
    icon: "💚",
    iconBg: "bg-green-100",
    connected: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team notifications & alerts",
    icon: "💜",
    iconBg: "bg-purple-100",
    connected: false,
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Team collaboration platform",
    icon: "🔵",
    iconBg: "bg-blue-100",
    connected: false,
  },
];

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

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const [personaAndBehavior, setPersonaAndBehavior] =
    useState<PersonaAndBehavior>({
      languages: [],
      tones: [],
      agentName: initialData?.agentName || "",
    });

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseData>({
    voiceDocuments: initialData?.voice?.knowledgeBase || [],
    emailDocuments: initialData?.email?.knowledgeBase || [],
    chatDocuments: initialData?.chats?.knowledgeBase || [],
  });

  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "voice",
      name: "Voice Calls",
      description: "Inbound & outbound phone calls",
      icon: <Phone className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100",
      active: true,
      prompt: {
        title: "Voice Instructions",
        value: "",
        allowedCharacters: 2000,
      },
    },
    {
      id: "livechat",
      name: "Live Chat",
      description: "Website chat widget",
      icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100",
      active: false,
      prompt: {
        title: "Live Chat Instructions",
        value: "",
        allowedCharacters: 2000,
      },
    },
    {
      id: "email",
      name: "Email Support",
      description: "Email ticketing system",
      icon: <Mail className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-100",
      active: true,
      prompt: {
        title: "Email Instructions",
        value: "",
        allowedCharacters: 2000,
      },
    },
  ]);

  const [integrations, setIntegrations] = useState<{
    crmIntegrations: Integration[];
    communicationIntegrations: Integration[];
  }>({
    crmIntegrations: crmIntegrations,
    communicationIntegrations: communicationIntegrations,
  });

  const [voiceIntegration, setVoiceIntegration] = useState({
    voiceProvider: "elevenlabs",
    voiceModel: "sophia-professional",
    speakingSpeed: [1],
    pitch: [1],
    emotion: "neutral",
    language: "en-us",
    selectedTTS: "elevenlabs-turbo",
    selectedSTT: "deepgram-nova",
    interruptSensitivity: [50],
    responseDelay: [1000],
    enableDTMF: true,
    backgroundNoiseSuppression: false,
  });

  useEffect(() => {
    const fetchLanguages = async () => {
      //   const response = await fetch("/api/languages");
      //   const data = await response.json();
      const response = [
        {
          id: 1,
          name: "English",
        },
        {
          id: 2,
          name: "Spanish",
        },
        {
          id: 3,
          name: "French",
        },
        {
          id: 4,
          name: "German",
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

          setKnowledgeBase({
            voiceDocuments: agentData?.voice?.knowledgeBase || [],
            emailDocuments: agentData?.email?.knowledgeBase || [],
            chatDocuments: agentData?.chats?.knowledgeBase || [],
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
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === channelId
          ? { ...channel, active: !channel.active }
          : channel
      )
    );
  };

  async function handleCreateAgent(): Promise<void> {
    const agentData = {
      agentName: personaAndBehavior.agentName || "New Agent",
      description: "Agent Description",
      voice: {
        agentPrompt:
          channels.find((channel) => channel.id === "voice")?.prompt.value ||
          "",
        knowledgeBase: knowledgeBase.voiceDocuments,
      },
      email: {
        agentPrompt:
          channels.find((channel) => channel.id === "email")?.prompt.value ||
          "",
        knowledgeBase: knowledgeBase.emailDocuments,
      },
      chats: {
        agentPrompt:
          channels.find((channel) => channel.id === "livechat")?.prompt.value ||
          "",
        knowledgeBase: knowledgeBase.chatDocuments,
      },
      languages: personaAndBehavior.languages
        .filter((lang) => lang.selected)
        .map((lang) => lang.name),
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
      // Create new agent
      await apiRequest(endpoints.assistants.create, "POST", agentData);
    }
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
              onClick={() => setActiveStep(step.id)}
            >
              <div className="flex items-center gap-2">
                <span>{step.icon}</span>
                <span>{step.title}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="py-4 mr-4 flex flex-col gap-4 w-full overflow-y-auto">
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
          />
        )}

        {activeStep === 3 && (
          <KnowledgeBase
            knowledgeBase={knowledgeBase}
            setKnowledgeBase={setKnowledgeBase}
          />
        )}

        {activeStep === 4 && (
          <Integrations
            crmIntegrations={integrations.crmIntegrations}
            communicationIntegrations={integrations.communicationIntegrations}
          />
        )}

        {activeStep === 5 && (
          <VoiceIntegration
            voiceIntegration={voiceIntegration}
            setVoiceIntegration={setVoiceIntegration}
          />
        )}

        {activeStep === 6 && <RoutingAndEscalation />}

        {/* {activeStep === 7 && <AnalyticsSummary />} */}

        <NavFooter
          activeStep={activeStep}
          handleStepChange={handleStepChange}
          totalSteps={agentSteps.length}
          handleCreateAgent={handleCreateAgent}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default CreateAgent;
