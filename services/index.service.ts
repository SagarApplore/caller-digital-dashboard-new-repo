import configs from "./config-service";
import apiRequest from "@/utils/api";

export const fetchSentimentSummary = async (days: number = 7) => {
  try {
    const response = await apiRequest("/vapi/sentiment-summary", "GET", {}, { days });
    return response.data;
  } catch (error) {
    console.error("Error fetching sentiment summary:", error);
    throw error;
  }
};

const services = {
  configs,
};

export default services;
