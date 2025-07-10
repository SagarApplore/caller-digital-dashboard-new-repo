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
  // {
  //   id: 2,
  //   title: "Channels & Phone Mapping",
  //   icon: <RadioTower />,
  // },
  {
    id: 2,
    title: "Knowledge Base",
    icon: <Brain />,
  },
  // {
  //   id: 3,
  //   title: "Integrations",
  //   icon: <Puzzle />,
  // },
  // {
  //   id: 4,
  //   title: "Voice Integration",
  //   icon: <Mic />,
  // },
  // {
  //   id: 5,
  //   title: "Routing & Escalation",
  //   icon: <Route />,
  // },
  // {
  //   id: 6,
  //   title: "Analytics Summary",
  //   icon: <ChartLine />,
  // },
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
  systemPrompt: string;
  allowedCharacters: number;
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

const CreateAgent = () => {
  const [activeStep, setActiveStep] = useState(1);

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const [personaAndBehavior, setPersonaAndBehavior] =
    useState<PersonaAndBehavior>({
      languages: [],
      tones: [],
      systemPrompt: "",
      allowedCharacters: 2000,
    });

  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "voice",
      name: "Voice Calls",
      description: "Inbound & outbound phone calls",
      icon: <Phone className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100",
      active: true,
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "WhatsApp messaging & media",
      icon: <MessageCircle className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-100",
      active: true,
    },
    {
      id: "livechat",
      name: "Live Chat",
      description: "Website chat widget",
      icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100",
      active: false,
    },
    {
      id: "email",
      name: "Email Support",
      description: "Email ticketing system",
      icon: <Mail className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-100",
      active: true,
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
          selected: false,
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
    fetchLanguages();
    fetchTones();
  }, []);

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
    const response = await apiRequest(endpoints.assistants.create, "POST", {
      name: "Test Agent",
      description: "Test Description",
    });
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
            systemPrompt={personaAndBehavior.systemPrompt}
            allowedCharacters={personaAndBehavior.allowedCharacters}
            setSystemPrompt={(systemPrompt) =>
              setPersonaAndBehavior((prev) => ({
                ...prev,
                systemPrompt,
              }))
            }
          />
        )}

        {/* {activeStep === 2 && (
          <ChannelsAndPhoneMapping
            channels={channels}
            toggleChannel={toggleChannel}
          />
        )} */}

        {activeStep === 2 && <KnowledgeBase />}

        {/* {activeStep === 3 && (
          <Integrations
            crmIntegrations={integrations.crmIntegrations}
            communicationIntegrations={integrations.communicationIntegrations}
          />
        )}

        {activeStep === 4 && (
          <VoiceIntegration
            voiceIntegration={voiceIntegration}
            setVoiceIntegration={setVoiceIntegration}
          />
        )} */}

        {/* {activeStep === 5 && <RoutingAndEscalation />} */}

        {/* {activeStep === 7 && <AnalyticsSummary />} */}

        <NavFooter
          activeStep={activeStep}
          handleStepChange={handleStepChange}
          totalSteps={agentSteps.length}
          handleCreateAgent={handleCreateAgent}
        />
      </div>
    </div>
  );
};

export default CreateAgent;
