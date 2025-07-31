"use client";

import { VoiceAnalytics } from "../molecules/voice-analytics";
import { ChatEmailInsights } from "../molecules/chat-email-insights";
import { OmnichannelSnapshot } from "../molecules/omnichannel-snapshot";
import apiRequest from "@/utils/api";
import { useEffect, useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { useAuth } from "../providers/auth-provider";

interface CreditInfo {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
}

export default function AnalyticsDashboard() {
  const [apiData, setApiData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);
  const [creditInfo, setCreditInfo] = useState<CreditInfo | null>(null);
  const { user } = useAuth();

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

  const fetchCreditInfo = async () => {
    if (!user) return;

    try {
      // Fix: Use the correct endpoint path
      const response = await apiRequest('/credits/current-user', 'GET');
      console.log('Credit response:', response.data); // Debug log
      
      if (response.data?.success && response.data?.data) {
        setCreditInfo(response.data.data);
      } else {
        console.log('No credit info found in response');
      }
    } catch (error) {
      console.error('Error fetching credit info:', error);
    }
  };

  useEffect(() => {
    fetchAnalytics(days);
    fetchCreditInfo();
  }, [days, user]);

  const handleDaysChange = (days: number) => {
    setDays(days);
  };

  return (
    <div className="p-6 overflow-y-auto h-full">
      {/* Credit Display Section */}
      {/* {creditInfo && (
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Credits Remaining</h3>
                  <p className="text-sm text-gray-600">Current credit balance</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {creditInfo.remainingCredits.toLocaleString()}
                  <span className="text-lg text-gray-500 font-normal"> / {creditInfo.totalCredits.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {creditInfo.totalCredits > 0 
                    ? `${((creditInfo.usedCredits / creditInfo.totalCredits) * 100).toFixed(1)}% used`
                    : 'No credits allocated'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Analytics Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <VoiceAnalytics data={apiData.voiceAnalytics} days={days} />
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
