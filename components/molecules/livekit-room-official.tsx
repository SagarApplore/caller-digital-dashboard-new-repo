'use client';

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  useRoomContext,
  useParticipants,
} from '@livekit/components-react';
import { Room, Track, RoomEvent } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState, useRef } from 'react';

interface LiveKitRoomOfficialProps {
  token: string;
  serverUrl: string;
  roomName: string;
  participantName: string;
  onConnect?: (room: Room) => void;
  onDisconnect?: () => void;
}

export default function LiveKitRoomOfficial({
  token,
  serverUrl,
  roomName,
  participantName,
  onConnect,
  onDisconnect,
}: LiveKitRoomOfficialProps) {
  const [roomInstance] = useState(() => new Room({
    adaptiveStream: true,
    dynacast: true,
  }));
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
  const disconnectRef = useRef<boolean>(false);

  useEffect(() => {
    let mounted = true;
    
    const connectToRoom = async () => {
      try {
        setError(null);
        
        // Set up event listeners
        roomInstance.on(RoomEvent.Connected, async () => {
          console.log('Connected to LiveKit room:', roomInstance.name);
          if (mounted) {
            setIsConnected(true);
            
            // Enable microphone and publish audio track
            try {
              console.log('Enabling microphone...');
              await roomInstance.localParticipant.setMicrophoneEnabled(true);
              setIsMicrophoneEnabled(true);
              console.log('Microphone enabled successfully');
            } catch (micError) {
              console.error('Failed to enable microphone:', micError);
              setError('Failed to enable microphone. Please check permissions.');
            }
            
            if (onConnect) {
              onConnect(roomInstance);
            }
          }
        });

        roomInstance.on(RoomEvent.Disconnected, () => {
          console.log('Disconnected from LiveKit room');
          if (mounted && !disconnectRef.current) {
            setIsConnected(false);
            setIsMicrophoneEnabled(false);
            if (onDisconnect) {
              onDisconnect();
            }
          }
        });

        roomInstance.on(RoomEvent.ConnectionStateChanged, (state) => {
          console.log('Connection state changed:', state);
        });

        // Set up participant event listeners
        roomInstance.on(RoomEvent.ParticipantConnected, (participant) => {
          console.log('Participant connected:', participant.identity);
          if (participant.identity.includes('agent-')) {
            console.log('Agent joined the room!');
          }
        });

        roomInstance.on(RoomEvent.ParticipantDisconnected, (participant) => {
          console.log('Participant disconnected:', participant.identity);
          if (participant.identity.includes('agent-')) {
            console.log('Agent left the room!');
          }
        });

        // Set up track event listeners
        roomInstance.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          console.log('Track subscribed:', track.kind, 'from', participant.identity);
          if (track.kind === 'audio' && participant.identity.includes('agent-')) {
            console.log('Agent audio track received!');
          }
        });

        roomInstance.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
          console.log('Track unsubscribed:', track.kind, 'from', participant.identity);
        });

        // Connect to the room
        await roomInstance.connect(serverUrl, token);
        
      } catch (err: any) {
        console.error('Failed to connect to LiveKit:', err);
        if (mounted) {
          setError(err.message || 'Failed to connect to room');
          setIsConnected(false);
        }
      }
    };

    if (token && serverUrl) {
      connectToRoom();
    }

    return () => {
      mounted = false;
      disconnectRef.current = true;
      roomInstance.disconnect();
    };
  }, [token, serverUrl, roomInstance, onConnect, onDisconnect]);

  if (error) {
    return (
      <div className="space-y-2">
        <div className="text-red-600 text-sm font-medium">Connection Error:</div>
        <div className="text-red-500 text-xs">{error}</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="space-y-2">
        <div className="text-gray-600 text-sm">Connecting to room...</div>
      </div>
    );
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" style={{ height: '100%' }}>
        {/* Video conference component */}
        <MyVideoConference />
        {/* The RoomAudioRenderer takes care of room-wide audio for you */}
        <RoomAudioRenderer />
        {/* Controls for the user to start/stop audio, video, and screen share tracks */}
        <ControlBar />
        
        {/* Status indicators */}
        {/* <div className="absolute bottom-20 left-4 space-y-1">
          <div className="text-xs text-gray-600">
            Microphone: {isMicrophoneEnabled ? '✅ Enabled' : '❌ Disabled'}
          </div>
          <div className="text-xs text-gray-600">
            Roomssss: {roomInstance.name}
          </div>
        </div> */}
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  const { room } = useRoomContext();
  const participants = useParticipants();
  
  // `useTracks` returns all camera and screen share tracks
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <div className="space-y-4">
      {/* <div className="text-sm text-gray-600">
        Room: {room?.name} | Participants: {participants.length + 1} (including you)
      </div> */}
      
      <GridLayout 
        tracks={tracks} 
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <ParticipantTile />
      </GridLayout>
    </div>
  );
} 