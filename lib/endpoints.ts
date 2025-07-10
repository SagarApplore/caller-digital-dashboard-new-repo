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
  },
};

export default endpoints;
