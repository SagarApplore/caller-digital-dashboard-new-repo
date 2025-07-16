"use client";

import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';

interface LiveKitRoomProps {
  token: string;
  serverUrl: string;
  onConnect?: (room: any) => void;
  onDisconnect?: () => void;
  onMuteChange?: (isMuted: boolean) => void;
}

export interface LiveKitRoomRef {
  disconnect: () => Promise<void>;
}

const LiveKitRoom = forwardRef<LiveKitRoomRef, LiveKitRoomProps>(({ 
  token, 
  serverUrl, 
  onConnect, 
  onDisconnect,
  onMuteChange 
}, ref) => {
  const [room, setRoom] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const localParticipantRef = useRef<any>(null);

  // Expose disconnect function to parent component
  useImperativeHandle(ref, () => ({
    disconnect: async () => {
      if (room) {
        try {
          console.log('Disconnecting from LiveKit room:', room.name);
          await room.disconnect();
          setRoom(null);
          setIsConnected(false);
          if (onDisconnect) {
            onDisconnect();
          }
        } catch (err) {
          console.error('Error disconnecting from room:', err);
        }
      }
    }
  }));

  useEffect(() => {
    if (!token || !serverUrl) return;

    const connectToRoom = async () => {
      try {
        // Import LiveKit client
        const { Room, RoomEvent } = await import('livekit-client');
        
        // Create room and connect using the Room's connect method
        const livekitRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
        });
        
        // Set up event listeners
        livekitRoom.on(RoomEvent.ParticipantConnected, (participant) => {
          console.log('Participant connected:', participant.identity);
        });

        livekitRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
          console.log('Participant disconnected:', participant.identity);
        });

        livekitRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          console.log('Track subscribed:', track.kind, 'from', participant.identity);
        });

        livekitRoom.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
          console.log('Track unsubscribed:', track.kind, 'from', participant.identity);
        });

        // Request audio permissions before connecting
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true, 
            video: false 
          });
          setHasAudioPermission(true);
          stream.getTracks().forEach(track => track.stop()); // Stop the test stream
        } catch (audioError) {
          console.error('Audio permission denied:', audioError);
          setError('Microphone access is required for voice calls');
          return;
        }
        
        await livekitRoom.connect(serverUrl, token);
        console.log('Connected to LiveKit room:', livekitRoom.name);
        
        // Get local participant and set up audio
        localParticipantRef.current = livekitRoom.localParticipant;
        
        // Publish local audio track
        try {
          await localParticipantRef.current.setMicrophoneEnabled(true);
          console.log('Microphone enabled');
        } catch (micError) {
          console.error('Failed to enable microphone:', micError);
          setError('Failed to enable microphone');
        }
        
        setRoom(livekitRoom);
        setIsConnected(true);
        setError(null);
        
        if (onConnect) {
          onConnect(livekitRoom);
        }
      } catch (err: any) {
        console.error('Failed to connect to LiveKit:', err);
        setError(err.message || 'Failed to connect to room');
        setIsConnected(false);
      }
    };

    connectToRoom();

    return () => {
      // if (room) {
      //   room.disconnect();
      //   setIsConnected(false);
      //   if (onDisconnect) {
      //     onDisconnect();
      //   }
      // }
    };
  }, [token, serverUrl, onConnect, onDisconnect]);

  const toggleMute = async () => {
    if (!localParticipantRef.current) return;
    
    try {
      const newMutedState = !isMuted;
      await localParticipantRef.current.setMicrophoneEnabled(!newMutedState);
      setIsMuted(newMutedState);
      if (onMuteChange) {
        onMuteChange(newMutedState);
      }
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  };

  if (error) {
    return (
      <div className="space-y-2">
        <div className="text-red-600 text-sm font-medium">Connection Error:</div>
        <div className="text-red-500 text-xs">{error}</div>
        <div className="text-gray-500 text-xs">
          Please check your microphone permissions and try again.
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="space-y-2">
        <div className="text-gray-600 text-sm">Connecting to room...</div>
        {!hasAudioPermission && (
          <div className="text-yellow-600 text-xs">
            Requesting microphone access...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-green-600 text-sm font-medium">
        ✓ Connected to room: {room?.name}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Microphone: {isMuted ? 'Muted' : 'Active'}
        </div>
        <button
          onClick={toggleMute}
          className={`px-3 py-1 rounded text-xs font-medium ${
            isMuted 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>
      
      <div className="text-xs text-gray-500">
        Participants: {(room?.participants?.size || 0) + 1} (including you)
      </div>
    </div>
  );
});

LiveKitRoom.displayName = 'LiveKitRoom';

export default LiveKitRoom; 