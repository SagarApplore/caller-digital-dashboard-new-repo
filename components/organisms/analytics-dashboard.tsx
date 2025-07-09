"use client";

import { VoiceAnalytics } from "../molecules/voice-analytics";
import { ChatEmailInsights } from "../molecules/chat-email-insights";
import { OmnichannelSnapshot } from "../molecules/omnichannel-snapshot";
import apiRequest from "@/utils/api";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AnalyticsDashboard() {
  const [apiData, setApiData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  const fetchAnalytics = async (days: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest("/dashboard", "GET", {}, { days });
      setApiData(response.data.data || {});
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to fetch call logs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(days);
  }, [days]);

  const handleDaysChange = (days: number) => {
    setDays(days);
  };

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-70px)] overflow-y-hidden">
          <VoiceAnalytics data={apiData.voiceAnalytics} />
          <ChatEmailInsights
            data={apiData.chatEmailInsights}
            handleDaysChange={handleDaysChange}
            days={days}
          />
          <OmnichannelSnapshot data={apiData.omnichannelInsights} />
        </div>
      )}
    </div>
  );
}
