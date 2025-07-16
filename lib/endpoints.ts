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
};

export default endpoints;
