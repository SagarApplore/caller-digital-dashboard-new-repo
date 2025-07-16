"use client";

import { useState, useEffect, useRef } from "react";
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
import LiveKitRoomOfficial from "@/components/molecules/livekit-room-official";
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

  const handleStartTest = async () => {
    if (!agent) return;

    setIsConnecting(true);
    setError(null);

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

      // Build query parameters with agent metadata
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

      const params = new URLSearchParams({
        room: newRoomName,
        username: newParticipantName,
        agentId: agent._id,
        agentName: agent.agentName || '',
        agentChannels: JSON.stringify(agent.channels || []),
        agentLanguages: JSON.stringify(agent.languages || []),
        agentVoice: JSON.stringify(agent.voice || {}),
        agentEmail: JSON.stringify(agent.email || {}),
        agentChats: JSON.stringify(agent.chats || {}),
        clientId: clientIdValue,
        workspaceId: agent.workspace || ''
      });

      console.log('Client ID being sent:', clientIdValue);
      console.log('Full params:', params.toString());

      // Use the new Next.js token API with metadata
      const tokenResponse = await fetch(`/api/token?${params.toString()}`);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
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
                <p className="text-sm text-gray-500">
                  You can now speak with your agent
                </p>
              </div>

              {/* LiveKit Room Component using official components */}
              {liveKitToken && (
                <div className="h-96 border rounded-lg overflow-hidden">
                  <LiveKitRoomOfficial
                    token={liveKitToken}
                    serverUrl={serverUrl}
                    roomName={roomName}
                    participantName={participantName}
                    onConnect={(connectedRoom) => setRoom(connectedRoom)}
                    onDisconnect={() => setRoom(null)}
                  />
                </div>
              )}

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
                  {isMuted ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
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
