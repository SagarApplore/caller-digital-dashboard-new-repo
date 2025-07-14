"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, Square, Mic, MicOff } from "lucide-react";
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";
import AudioVisualizer from "@/components/molecules/audio-visualizer";

interface TestAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: any;
}

export default function TestAgentModal({ isOpen, onClose, agent }: TestAgentModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liveKitToken, setLiveKitToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartTest = async () => {
    if (!agent) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // Step 1: Get LiveKit token
      const roomName = `test-${agent._id}-${Date.now()}`;
      const participantName = `user-${Date.now()}`;
      
      const tokenResponse = await apiRequest(
        `${endpoints.assistants.list}/livekit-token`,
        "POST",
        {
          roomName,
          participantName,
        }
      );

      if (!tokenResponse.data?.success) {
        throw new Error("Failed to get LiveKit token");
      }

      setLiveKitToken(tokenResponse.data.token);

      // Step 2: Call Python agent endpoint
      const agentResponse = await apiRequest(
        "/api/test-agent",
        "POST",
        {
          agentId: agent._id,
          roomName,
          liveKitToken: tokenResponse.data.token,
          agentData: {
            name: agent.agentName,
            voice: agent.voice,
            email: agent.email,
            chats: agent.chats,
          },
        }
      );

      if (!agentResponse.data?.success) {
        throw new Error("Failed to start agent");
      }

      setIsConnected(true);
    } catch (err: any) {
      setError(err.message || "Failed to start agent test");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStopTest = async () => {
    try {
      // Call endpoint to stop the agent
      await apiRequest(
        "/api/stop-agent",
        "POST",
        {
          agentId: agent._id,
        }
      );
    } catch (err) {
      console.error("Error stopping agent:", err);
    } finally {
      setIsConnected(false);
      setLiveKitToken(null);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // Implement mute/unmute logic for LiveKit
  };

  useEffect(() => {
    if (!isOpen) {
      setIsConnected(false);
      setLiveKitToken(null);
      setError(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Test Agent: {agent?.agentName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!isConnected ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Start a test session with your agent to test voice interactions.
              </p>
              <Button
                onClick={handleStartTest}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Start Test</span>
                  </div>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-green-600 font-medium">Connected to Agent</p>
                <p className="text-sm text-gray-500">You can now speak with your agent</p>
              </div>

              {/* Audio Visualizer */}
              <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                <AudioVisualizer isActive={isConnected} barCount={5} />
              </div>

              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleMute}
                  className={isMuted ? "text-red-600" : "text-green-600"}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleStopTest}
                >
                  <Square className="w-4 h-4" />
                  Stop Test
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 