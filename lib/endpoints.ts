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
};

export default endpoints;
