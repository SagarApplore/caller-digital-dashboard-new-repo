import { IAIProvider, IKnowledgeBase } from "./common";

export interface IAgent {
  _id?: string;
  agentName: string;
  status: "active" | "inactive";
  languages: EAgentLanguages[];
  tones: EAgentTones[];
  call_type: TAgentCallType;
  client: any;
  workspace: string;
  summaryPrompt: string;
  successEvaluationPrompt: string;
  failureEvaluationPrompt: string;
  channels: EAgentChannels[];
  knowledgeBase: IKnowledgeBase[] | string[];
  functionTools: string[];
  voice?: {
    llmProvider: IAIProvider;
    voiceProvider: IAIProvider;
    tracscriberProvider: IAIProvider;
    firstMessageMode: string;
    firstMessage: string;
    agentPrompt: string;
    temperature: string;
    maxTokens: number;
  };
  email?: {
    llmProvider: IAIProvider;
    firstMessage?: string;
    agentPrompt: string;
    temperature: string;
    maxTokens: number;
  };
  chats?: {
    llmProvider: IAIProvider;
    firstMessage?: string;
    agentPrompt: string;
    temperature: string;
    maxTokens: number;
  };
  createdAt?: string;
  updatedAt?: string;
  conversations?: number;
}

export enum EAgentChannels {
  CHAT = "chat",
  VOICE = "voice",
  EMAIL = "email",
}

export enum EAgentLanguages {
  ENGLISH = "EN",
  SPANISH = "ES",
  FRENCH = "FR",
}

export type TAgentCallType = EAgentCallType.INBOUND | EAgentCallType.OUTBOUND;

export enum EAgentCallType {
  INBOUND = "INBOUND",
  OUTBOUND = "OUTBOUND",
}

export enum EAgentTones {
  EMPATHETIC = "empathetic",
  PROFESSIONAL = "professional",
}
