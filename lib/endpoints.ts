const endpoints = {
  auth: {
    login: "/auth/login",
  },
  outboundCampaign: {
    getAll: "/outbound-campaigns",
    getById: "/outbound-campaigns/:id",
    create: "/outbound-campaigns",
  },
  assistants: {
    list: "/agents",
    create: "/agents/createAgents",
    get: "/agents",
    update: "/agents",
  },
  knowledgeBase: {
    getAll: "/knowledgeBase",
    create: "/knowledgeBase",
    getById: "/knowledgeBase/:id",
  },
  llmModels: {
    getModels: "/ai-models/provider",
    getProviders: "/model-providers",
  },
  ttsModels: {
    getModels: "/voice-models/provider",
    getProviders: "/voice-model-providers",
  },
  sttModels: {
    getModels: "/stt-models/provider",
    getProviders: "/stt-model-providers",
  },
};

export default endpoints;
