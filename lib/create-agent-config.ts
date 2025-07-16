import { Channel } from "@/components/molecules/create-agent/channels-and-phone-mapping";
import { Integration } from "@/components/molecules/create-agent/integrations";
import {
  Brain,
  ChartBar,
  Mail,
  MailIcon,
  MessageSquare,
  Mic,
  Phone,
  RadioTower,
  User,
} from "lucide-react";

export const rawTones = [
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

export const crmIntegrations: Integration[] = [
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

export const communicationIntegrations: Integration[] = [
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

export const agentSteps = [
  {
    id: 1,
    title: "Persona & Behavior",
    icon: User,
  },
  {
    id: 2,
    title: "Channels & Phone Mapping",
    icon: RadioTower,
  },
  {
    id: 3,
    title: "Knowledge Base",
    icon: Brain,
  },
  {
    id: 4,
    title: "Voice Integration",
    icon: Mic,
  },
  {
    id: 5,
    title: "Chat Integration",
    icon: ChartBar,
  },
  {
    id: 6,
    title: "Email Integration",
    icon: MailIcon,
  },
  // {
  //   id: 4,
  //   title: "Integrations",
  //   icon: <Puzzle />,
  // },
  // {
  //   id: 6,
  //   title: "Routing & Escalation",
  //   icon: <Route />,
  // },
];

export const initialChannels: Channel[] = [
  {
    id: "voice",
    name: "Voice Calls",
    description: "Inbound & outbound phone calls",
    icon: Phone,
    iconBg: "bg-blue-100",
    active: false,
    prompt: {
      title: "Voice Instructions",
      value: "Test",
      allowedCharacters: 2000,
    },
    firstMessage: "What's up?",
  },
  {
    id: "chat",
    name: "Live Chat",
    description: "Website chat widget",
    icon: MessageSquare,
    iconBg: "bg-purple-100",
    active: false,
    prompt: {
      title: "Live Chat Instructions",
      value: "Test",
      allowedCharacters: 2000,
    },
    firstMessage: "What's up?",
  },
  {
    id: "email",
    name: "Email Support",
    description: "Email ticketing system",
    icon: Mail,
    iconBg: "bg-green-100",
    active: false,
    prompt: {
      title: "Email Instructions",
      value: "Test",
      allowedCharacters: 2000,
    },
    firstMessage: "What's up?",
  },
];
