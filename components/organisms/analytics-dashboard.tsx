import { VoiceAnalytics } from "../voice-analytics";
import { ChatEmailInsights } from "../chat-email-insights";
import { OmnichannelSnapshot } from "../omnichannel-snapshot";

export default function AnalyticsDashboard() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <VoiceAnalytics />
        <ChatEmailInsights />
        <OmnichannelSnapshot />
      </div>
    </div>
  );
}
