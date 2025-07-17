export interface IKnowledgeBase {}

export interface IAIProvider {
  _id: string;
  providerName: string;
  model: string;
  API_KEY: string;
}

export interface IFunctionTool {
  _id: string;
  name: string;
  type: "API" | "QUERY";
  prompt: string;
  api?: {
    url: string;
    Headers: string;
    auth: { type: "Basic" };
    username: string;
    password: string;
    Body: Record<string, any>;
    Method: "GET" | "POST" | "PUT" | "DELETE";
    Response: Record<string, any>;
    ResponseType: string;
    ResponseHeaders: string;
    ResponseBody: Record<string, any>;
  };
}
