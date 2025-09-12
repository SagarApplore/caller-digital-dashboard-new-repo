"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Play, Square, Mic, MicOff } from "lucide-react";
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";
import AudioVisualizer from "@/components/molecules/audio-visualizer";
import LiveKitRoomOfficial from "@/components/molecules/livekit-room-official";
import LiveTranscriptChat, { LiveTranscriptMessage } from "@/components/molecules/live-transcript-chat";
import { getLiveKitServerUrl } from "@/lib/livekit-config";

interface TestAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: any;
}

export default function TestAgentModal({
  isOpen,
  onClose,
  agent,
}: TestAgentModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liveKitToken, setLiveKitToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<any>(null);
  const [serverUrl] = useState<string>(getLiveKitServerUrl());
  const [roomName, setRoomName] = useState<string>('');
  const [participantName, setParticipantName] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<LiveTranscriptMessage[]>([]);
  const [agentStatus, setAgentStatus] = useState<'connecting' | 'ready' | 'speaking' | 'idle'>('connecting');
  const [transcriptionReady, setTranscriptionReady] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setChatMessages([]);
      setAgentStatus('connecting');
      setIsConnected(false);
      setIsConnecting(false);
      setTranscriptionReady(false);
      setError(null);
    } else {
      // Clear everything when modal closes
      setChatMessages([]);
      setIsConnected(false);
      setIsConnecting(false);
      setError(null);
      setLiveKitToken(null);
      setRoom(null);
    }
  }, [isOpen]);

  const handleStartTest = async () => {
    if (!agent) return;

    setIsConnecting(true);
    setError(null);
    // Clear previous chat messages for new call
    setChatMessages([]);
    setAgentStatus('connecting');

    try {
      // Get LiveKit token from Next.js API
      const newRoomName = `test-${agent._id}-${Date.now()}`;
      const newParticipantName = `user-${Date.now()}`;

      console.log('Requesting LiveKit token with:', {
        roomName: newRoomName,
        participantName: newParticipantName,
        agentId: agent._id,
        serverUrl
      });

      // Prepare agent data for token request
      console.log('Agent data for token request:', {
        agentId: agent._id,
        agentName: agent.agentName,
        client: agent.client,
        clientType: typeof agent.client,
        clientId: agent.client?._id,
        clientKeys: agent.client ? Object.keys(agent.client) : [],
        workspace: agent.workspace
      });

      // Handle clientId - check if it's already a string or an object
      let clientIdValue = '';
      if (typeof agent.client === 'string') {
        clientIdValue = agent.client;
      } else if (agent.client && typeof agent.client === 'object') {
        clientIdValue = agent.client._id || agent.client.id || '';
      }
      
      // Create request body with all agent data
      const requestBody = {
        room: newRoomName,
        username: newParticipantName,
        agentId: agent._id,
        agentName: agent.agentName || '',
        agentChannels: agent.channels || [],
        agentLanguages: agent.languages || [],
        agentVoice: agent.voice || {},
        agentEmail: agent.email || {},
        agentChats: agent.chats || {},
        clientId: clientIdValue,
        workspaceId: agent.workspace || '',
        agentPrompt: agent.prompt || ''
      };

      console.log('Client ID being sent:', clientIdValue);
      
      // Use POST request to avoid URL length limitations
      const tokenResponse = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      const data = await tokenResponse.json();

      console.log('Token response:', data);

      if (data.error) {
        throw new Error(data.error || "Failed to get LiveKit token");
      }

      const token = data.token;
      console.log('Received token, length:', token.length);
      setLiveKitToken(token);
      setRoomName(newRoomName);
      setParticipantName(newParticipantName);
      setIsConnected(true);

    } catch (err: any) {
      console.error('Error getting LiveKit token:', err);
      setError(err.message || "Failed to get LiveKit token");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStopTest = async () => {
    try {
      // The LiveKit component will handle disconnection automatically
      setIsConnected(false);
      setLiveKitToken(null);
      setRoom(null);
      setRoomName('');
      setParticipantName('');
    } catch (err) {
      console.error("Error stopping agent:", err);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // Mute/unmute will be handled by LiveKit component
  };

  useEffect(() => {
    if (!isOpen) {
      setIsConnected(false);
      setLiveKitToken(null);
      setError(null);
      setRoom(null);
      setRoomName('');
      setParticipantName('');
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle>Agent: {agent?.agentName}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0 flex flex-col">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!isConnected ? (
            <div className="p-4">
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Start a test session with your agent to test voice interactions.
                </p>
              <Button
                onClick={handleStartTest}
                disabled={isConnecting || transcriptionReady}
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
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col">
              {liveKitToken && (
                <div className="hidden">
                  <LiveKitRoomOfficial
                    token={liveKitToken}
                    serverUrl={serverUrl}
                    roomName={roomName}
                    participantName={participantName}
                    onConnect={(connectedRoom) => {
                      setRoom(connectedRoom);
                      setTranscriptionReady(true);
                    }}
                    onDisconnect={() => {
                      setRoom(null);
                      setTranscriptionReady(false);
                    }}
                    muted={isMuted}
                    showControls={false}
                    showOverlay={false}
                    onTranscriptMessage={(msg) => {
                      setChatMessages((prev) => {
                        const last = prev[prev.length - 1];
                        if (last && last.role === msg.role && last.text === msg.text) return prev;
                        return [...prev, msg].slice(-300);
                      });
                    }}
                    onAgentStatus={(s) => setAgentStatus(s)}
                  />
                </div>
              )}

              <LiveTranscriptChat title="Call Transcript" messages={chatMessages} />
            </div>
          )}
          
          {/* Show transcript even when not connected if we have messages */}
          {!isConnected && chatMessages.length > 0 && (
            <LiveTranscriptChat title="Call Transcript" messages={chatMessages} />
          )}
        </div>

          {isConnected && (
            <div className="border-t p-3 flex items-center justify-center gap-3 sticky bottom-0 bg-white">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleMute}
                className={isMuted ? "text-red-600" : "text-green-600"}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isMuted ? "Unmute" : "Mute"}
              </Button>
              <Button variant="destructive" size="sm" onClick={handleStopTest}>
                <Square className="w-4 h-4" />
                End Call
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
