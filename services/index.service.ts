import configs from "./config-service";
import apiRequest from "@/utils/api";

export const fetchSentimentSummary = async (days: number = 7) => {
  try {
    // Calculate date range based on days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const response = await apiRequest("/vapi/call-logs/getData", "GET", {}, { 
      createdAtGe: startDate.toISOString(),
      createdAtLe: endDate.toISOString(),
      page: 1,
      limit: 1 // We only need the sentiment metrics, not the actual data
    });
    
    if (response.data && response.data.sentimentMetrics) {
      const { sentimentMetrics } = response.data;
      const total = sentimentMetrics.totalCalls;
      const totalMinutes = response.data.totalMinutes
      const avgCallDuration = (totalMinutes)/total
      
      // Calculate percentages
      const positive = total > 0 ? Math.round((sentimentMetrics.positiveSentiments / total) * 100) : 0;
      const neutral = total > 0 ? Math.round((sentimentMetrics.neutralSentiments / total) * 100) : 0;
      const negative = total > 0 ? Math.round((sentimentMetrics.negativeSentiments / total) * 100) : 0;
      
      return {
        success: true,
        data: {
          positive,
          neutral,
          negative,
          total,
          totalMinutes,
          avgCallDuration,
          sentimentScore: sentimentMetrics.sentimentScore
        }
      };
    }
    
    return {
      success: false,
      data: {
        positive: 0,
        neutral: 0,
        negative: 0,
        total: 0,
        totalMinutes:0,
        avgCallDuration:0,
        sentimentScore: 0
      }
    };
  } catch (error) {
    console.error("Error fetching sentiment summary:", error);
    return {
      success: false,
      data: {
        positive: 0,
        neutral: 0,
        negative: 0,
        total: 0,
        sentimentScore: 0
      }
    };
  }
};

const services = {
  configs,
};

export default services;
