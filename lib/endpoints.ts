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
  functionTools: {
    getAll: "/functionTools",
    create: "/functionTools/create",
    getById: "/functionTools/:id",
  },
  llmModels: {
    getModels: "/ai-models/provider",
    getProviders: "/model-providers",
    getModelsByName: "/ai-models/get-by-name",
  },
  ttsModels: {
    getModels: "/voice-models/provider",
    getProviders: "/voice-model-providers",
    getModelsByName: "/voice-models/get-by-name",
  },
  sttModels: {
    getModels: "/stt-models/provider",
    getProviders: "/stt-model-providers",
    getModelsByName: "/stt-models/get-by-name",
  },
  phoneNumbers: {
    assign: "/phone-number-assignment",
    get: "/phone-number",
  },
};

export default endpoints;
