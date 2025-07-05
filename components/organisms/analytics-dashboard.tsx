import { VoiceAnalytics } from "../molecules/voice-analytics";
import { ChatEmailInsights } from "../molecules/chat-email-insights";
import { OmnichannelSnapshot } from "../molecules/omnichannel-snapshot";

export default function AnalyticsDashboard() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-70px)] overflow-y-hidden">
        <VoiceAnalytics />
        <ChatEmailInsights />
        <OmnichannelSnapshot />
      </div>
    </div>
  );
}
