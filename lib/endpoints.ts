const endpoints = {
  auth: {
    login: "/auth/login",
    me: "/auth/me",
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
  clients: {
    list: "/users/getClients",
    create: "/our-clients/create",
    get: "/our-clients/:id",
    getByUserId: "/our-clients/user/:userId",
    update: "/our-clients/:id",
    updateByUserId: "/our-clients/user/:userId",
    delete: "/users/deactivate/:id",
  },
  knowledgeBase: {
    getAll: "/knowledgeBase",
    create: "/knowledgeBase",
    getById: "/knowledgeBase/:id",
    delete: "/knowledgeBase/:id",
    download: "/knowledgeBase/:id/download",
  },
  functionTools: {
    getAll: "/functionTools",
    create: "/functionTools/create",
    getById: "/functionTools/:id",
    delete: "/functionTools/:id",
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
  pricingModels: {
    getAll: "/pricing-models",
  },
  workspaces: {
    available: "/workspaces/available",
    switch: "/workspaces/switch",
    current: "/workspaces/current",
  },
};

export default endpoints;
