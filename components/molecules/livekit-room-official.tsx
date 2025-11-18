'use client';

import {
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  useRoomContext,
  useParticipants,
} from '@livekit/components-react';
import { Room, Track, RoomEvent, ConnectionState } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState, useRef } from 'react';

const LK_TRANSCRIPT_DEBUG = (
  process.env.NEXT_PUBLIC_LK_TRANSCRIPT_DEBUG === 'true' ||
  (process.env.NEXT_PUBLIC_LK_TRANSCRIPT_DEBUG !== 'false' && process.env.NODE_ENV !== 'production')
);
const debugLog = (...args: any[]) => {
  if (LK_TRANSCRIPT_DEBUG) {
    // eslint-disable-next-line no-console
    console.log('[LiveKit Transcript]', ...args);
  }
};

interface LiveKitRoomOfficialProps {
  token: string;
  serverUrl: string;
  roomName: string;
  participantName: string;
  onConnect?: (room: Room) => void;
  onDisconnect?: () => void;
  muted?: boolean;
  showControls?: boolean; // default false; when true, show default LK ControlBar (video icon, etc.)
  showOverlay?: boolean; // default true; live subtitle overlay
  onTranscriptMessage?: (msg: { id: string; role: 'agent' | 'user'; text: string; ts: number }) => void;
  onAgentStatus?: (status: 'connecting' | 'ready' | 'speaking' | 'idle') => void;
}

export default function LiveKitRoomOfficial({
  token,
  serverUrl,
  roomName,
  participantName,
  onConnect,
  onDisconnect,
  muted = false,
  showControls = false,
  showOverlay = true,
  onTranscriptMessage,
  onAgentStatus,
}: LiveKitRoomOfficialProps) {
  const [roomInstance] = useState(() => new Room({
    adaptiveStream: true,
    dynacast: true,
  }));
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
  const disconnectRef = useRef<boolean>(false);
  const [agentAudioConnected, setAgentAudioConnected] = useState(false);
  const [agentHasSpoken, setAgentHasSpoken] = useState(false);
  const [agentJoined, setAgentJoined] = useState(false);

  // Keep callback refs stable to avoid reconnect loops when parent re-renders
  const onConnectRef = useRef<typeof onConnect | undefined>(undefined);
  const onDisconnectRef = useRef<typeof onDisconnect | undefined>(undefined);
  const onAgentStatusRef = useRef<typeof onAgentStatus | undefined>(undefined);
  useEffect(() => { onConnectRef.current = onConnect; }, [onConnect]);
  useEffect(() => { onDisconnectRef.current = onDisconnect; }, [onDisconnect]);
  useEffect(() => { onAgentStatusRef.current = onAgentStatus; }, [onAgentStatus]);

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
            setAgentHasSpoken(false); // Reset for new connection
            setAgentJoined(false); // Reset for new connection
            onAgentStatusRef.current?.('connecting');
            
            onConnectRef.current?.(roomInstance);
          }
        });

        roomInstance.on(RoomEvent.Disconnected, () => {
          console.log('Disconnected from LiveKit room');
          if (mounted && !disconnectRef.current) {
            setIsConnected(false);
            setIsMicrophoneEnabled(false);
            setAgentHasSpoken(false);
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
            setAgentJoined(true);
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
          debugLog('TrackSubscribed', track.kind, participant?.identity);
          if (track.kind === 'audio' && participant?.identity?.includes?.('agent-')) {
            setAgentAudioConnected(true);
            onAgentStatusRef.current?.('ready');
          }
        });

        roomInstance.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
          debugLog('TrackUnsubscribed', track.kind, participant?.identity);
          if (track.kind === 'audio' && participant?.identity?.includes?.('agent-')) {
            setAgentAudioConnected(false);
            onAgentStatusRef.current?.('connecting');
          }
        });

        // Connect to the room
        await roomInstance.connect(serverUrl, token);

        // After connect resolves, enable local microphone
        try {
          if (roomInstance.state === ConnectionState.Connected || (roomInstance as any).state === 'connected') {
            await roomInstance.localParticipant.setMicrophoneEnabled(!muted);
            setIsMicrophoneEnabled(true);
            debugLog('Microphone enabled post-connect');
          }
        } catch (micError) {
          console.error('Failed to enable microphone:', micError);
        }
        
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
      try {
        if (roomInstance.state === ConnectionState.Connected || (roomInstance as any).state === 'connected') {
          roomInstance.disconnect();
        }
      } catch {}
    };
  }, [token, serverUrl]);

  // React to external mute changes
  useEffect(() => {
    if (!isConnected) return;
    const toggle = async () => {
      try {
        if (roomInstance.state === ConnectionState.Connected || (roomInstance as any).state === 'connected') {
          await roomInstance.localParticipant.setMicrophoneEnabled(!muted);
        }
        setIsMicrophoneEnabled(!muted);
      } catch (e) {
        console.error('Failed to apply mute state:', e);
      }
    };
    const id = setTimeout(toggle, 0);
    return () => clearTimeout(id);
  }, [muted, isConnected, roomInstance]);

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
      <div data-lk-theme="default" className="h-full flex flex-col">
        {/* Video conference component */}
        <div className="flex-1 min-h-0 relative">
          <MyVideoConference 
            showOverlay={showOverlay} 
            onTranscriptMessage={onTranscriptMessage} 
            onAgentStatus={onAgentStatus}
            setAgentHasSpoken={setAgentHasSpoken}
            resetTranscripts={isConnected} // Pass connection state to trigger reset
          />
          {/* Agent thinking / ready loader */}
          {!agentJoined && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-3 bg-black/55 text-white px-4 py-3 rounded-full shadow-lg backdrop-blur-sm">
                <div className="flex -space-x-1">
                  <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                  <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce [animation-delay:0s]"></span>
                  <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                </div>
                <span className="text-sm">Agent is getting ready…</span>
              </div>
            </div>
          )}
        </div>
        {/* The RoomAudioRenderer takes care of room-wide audio for you */}
        <RoomAudioRenderer />
        {/* Default controls hidden by default; rely on custom controls in parent modal */}
        {showControls ? (
          // Using a minimal spacer to keep layout consistent when controls are shown
          <div className="py-2" />
        ) : null}
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference({ 
  showOverlay = true, 
  onTranscriptMessage, 
  onAgentStatus,
  setAgentHasSpoken,
  resetTranscripts
}: { 
  showOverlay?: boolean; 
  onTranscriptMessage?: (msg: { id: string; role: 'agent' | 'user'; text: string; ts: number }) => void; 
  onAgentStatus?: (s: 'connecting' | 'ready' | 'speaking' | 'idle') => void;
  setAgentHasSpoken?: (hasSpoken: boolean) => void;
  resetTranscripts?: boolean;
}) {
  const room = useRoomContext();
  const participants = useParticipants();
  const [segments, setSegments] = useState<Array<{
    id: string;
    source: string;
    text: string;
    words?: Array<{ t: string; start?: number; end?: number }>;
    ts: number;
    isStreaming?: boolean;
  }>>([]);
  const [partialBySource, setPartialBySource] = useState<Record<string, string>>({});
  const agentAccumulator = useRef<Record<string, string>>({});
  const agentTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const userAccumulator = useRef<Record<string, string>>({});
  const userTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  // Queue outbound messages to avoid parent updates during render
  const outboundRef = useRef<Array<{ role: 'agent' | 'user'; text: string; ts: number }>>([]);
  const scheduleFlush = () => {
    setTimeout(() => {
      const batch = outboundRef.current.splice(0, outboundRef.current.length);
      if (onTranscriptMessage) {
        for (const item of batch) {
          onTranscriptMessage({
            id: (globalThis.crypto?.randomUUID?.() || `${item.ts}-${Math.random()}`),
            role: item.role,
            text: item.text,
            ts: item.ts,
          });
        }
      }
    }, 0);
  };
  const emitMessage = (source: string, text: string) => {
    const role: 'agent' | 'user' = source === 'agent' ? 'agent' : 'user';
    outboundRef.current.push({ role, text, ts: Date.now() });
    scheduleFlush();
  };

  const updateLiveTranscript = (source: string, text: string, isFinal: boolean = false) => {
    const now = Date.now();
    const trimmed = text.replace(/\s+/g, ' ').trim();
    if (!trimmed) return;

    debugLog('Live transcript update:', { source, text: trimmed.substring(0, 50) + '...', isFinal });

    // Mark agent as speaking when we get first transcript
    if (source === 'agent') {
      setAgentHasSpoken?.(true);
      onAgentStatus?.('speaking');
    }

    let finalText = trimmed;
    let shouldBeFinal = isFinal;

    // Special handling for agent transcripts - accumulate words into sentences
    if (source === 'agent') {
      // For agent, always accumulate regardless of isFinal flag
      const currentAccumulated = agentAccumulator.current[source] || '';
      
      // Always append new text to accumulated text
      if (currentAccumulated) {
        // Check if the new text is already included in accumulated (full transcript)
        if (trimmed.startsWith(currentAccumulated)) {
          // This is the full transcript so far
          finalText = trimmed;
        } else {
          // This is a new word/phrase to add
          finalText = currentAccumulated + ' ' + trimmed;
        }
      } else {
        // First word/phrase
        finalText = trimmed;
      }
      
      finalText = finalText.replace(/\s+/g, ' ').trim();
      agentAccumulator.current[source] = finalText;

      // EXTREMELY strict finalization - almost never finalize unless truly done
      shouldBeFinal = isFinal && (
        (finalText.length >= 100 && /[.!?]\s*$/.test(finalText)) || // Much higher minimum
        finalText.length >= 200 || // Very long text
        /\b(thank you very much|goodbye|have a great day|anything else I can help|feel free to ask any other questions)\b\s*[.!?]?\s*$/i.test(finalText) // Only very clear endings
      );

      debugLog('Agent accumulation:', { 
        originalText: trimmed, 
        currentAccumulated: currentAccumulated.substring(0, 30) + '...', 
        finalText: finalText.substring(0, 50) + '...', 
        shouldBeFinal,
        isFinal,
        length: finalText.length 
      });
      
      // If not final, always keep streaming
      if (!shouldBeFinal) {
        shouldBeFinal = false;
      }
    } else {
      // For user transcripts, use as-is (revert to original working logic)
      shouldBeFinal = isFinal;
    }

    // Find existing streaming segment or create new one
    setSegments(prev => {
      const existingIndex = prev.findIndex(seg => seg.source === source && seg.isStreaming);
      
      if (existingIndex >= 0) {
        // Update existing streaming segment
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          text: finalText,
          isStreaming: !shouldBeFinal,
          ts: now
        };
        return updated;
      } else {
        // Create new streaming segment
        return [
          ...prev,
          {
            id: (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`),
            source,
            text: finalText,
            isStreaming: !shouldBeFinal,
            ts: now,
          },
        ].slice(-50);
      }
    });

    // Handle timeouts for both agent and user speech
    if (source === 'agent') {
      // Clear existing timeout
      if (agentTimeouts.current[source]) {
        clearTimeout(agentTimeouts.current[source]);
      }
      
      // Set timeout to finalize if no more text comes in 5 seconds (much longer)
      agentTimeouts.current[source] = setTimeout(() => {
        const currentAccumulated = agentAccumulator.current[source];
        if (currentAccumulated && currentAccumulated.trim()) {
          debugLog('Agent timeout finalization:', { text: currentAccumulated.substring(0, 50) + '...' });
          
          // Force finalize the current accumulated text
          setSegments(prev => 
            prev.map(seg => 
              seg.source === source && seg.isStreaming 
                ? { ...seg, isStreaming: false }
                : seg
            )
          );
          
          emitMessage(source, currentAccumulated);
          agentAccumulator.current[source] = ''; // Clear accumulator
          setTimeout(() => onAgentStatus?.('idle'), 300);
        }
      }, 5000);
    }

    // If should be final, emit to chat, clear accumulator, and mark agent as idle
    if (shouldBeFinal) {
      emitMessage(source, finalText);
      if (source === 'agent') {
        agentAccumulator.current[source] = ''; // Clear accumulator for next sentence
        if (agentTimeouts.current[source]) {
          clearTimeout(agentTimeouts.current[source]);
        }
        setTimeout(() => onAgentStatus?.('idle'), 500);
      }
    }
  };

  // Clear transcripts when connection resets
  useEffect(() => {
    if (resetTranscripts) {
      setSegments([]);
      setPartialBySource({});
      agentAccumulator.current = {}; // Clear agent accumulator
      userAccumulator.current = {}; // Clear user accumulator
      // Clear all timeouts
      Object.values(agentTimeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      Object.values(userTimeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      agentTimeouts.current = {};
      userTimeouts.current = {};
    }
  }, [resetTranscripts]);

  // Cleanup function
  useEffect(() => {
    return () => {
      // Clean up all timeouts
      Object.values(agentTimeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      Object.values(userTimeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  useEffect(() => {
    if (!room) return;

    // Listen for transcription events directly from LiveKit (for user speech)
    const handleTranscription = (transcription: any, participant: any) => {
      debugLog('LiveKit transcription event:', { transcription, participantIdentity: participant?.identity });
      
      if (participant && !participant.identity?.includes('agent-')) {
        // Handle array of transcription segments
        const segments = Array.isArray(transcription) ? transcription : [transcription];
        
        for (const segment of segments) {
          if (segment.text && segment.text.trim()) {
            debugLog('LiveKit user transcript:', { text: segment.text, final: segment.final });
            
            // Use real-time streaming for user transcripts too
            updateLiveTranscript('user', segment.text.trim(), segment.final);
          }
        }
      }
    };

    // Try to listen for transcription events (this may vary by LiveKit version)
    if ((room as any).on && typeof (room as any).on === 'function') {
      try {
        (room as any).on('transcriptionReceived', handleTranscription);
      } catch (e) {
        debugLog('Could not subscribe to transcription events:', e);
      }
    }

    const handleData = (
      payload: Uint8Array,
      participant?: any,
      _kind?: any,
      topic?: string,
    ) => {
      try {
        debugLog('DataReceived', {
          topic,
          from: participant?.identity,
          bytes: payload?.byteLength ?? 0,
        });

        const decoded = new TextDecoder().decode(payload);
        debugLog('Decoded payload', decoded?.slice?.(0, 200));
        let data: any = null;
        try {
          data = JSON.parse(decoded);
        } catch {
          data = decoded; // plain text
        }

        // Determine source from sender identity when available
        const sourceFromIdentity: string = participant?.identity?.includes?.('agent-') ? 'agent' : 'user';
        debugLog('Message source determined:', { participantIdentity: participant?.identity, sourceFromIdentity });

        // 1) Handle built-in LiveKit transcription stream
        if (topic === 'lk.transcription') {
          const source = sourceFromIdentity;
          const isFinal = typeof data === 'object' ? (data.aligned === true || data.is_final === true || data.final === true) : false;
          const text = typeof data === 'object' ? (data.text || data.segment || '') : String(data || '');
          const words = typeof data === 'object' && Array.isArray(data.words) ? data.words : undefined;

          debugLog('lk.transcription', {
            source,
            isFinal,
            length: text?.length ?? 0,
            wordCount: words ? words.length : 0,
          });

          // Always update live transcript for real-time streaming
          updateLiveTranscript(source, text, isFinal);
          
          if (!isFinal) {
            // For partial transcripts, just update the live display
            return;
          }
          
          // Clear partial state for final transcripts
          if (isFinal) {
            setPartialBySource(prev => ({ ...prev, [source]: '' }));
          } else {
            // Store partial for overlay display
            setPartialBySource(prev => ({ ...prev, [source]: text }));
          }
          return;
        }

        // 2) Handle custom transcript payloads forwarded by DynamicAgent
        if (typeof data === 'object' && data && data.type === 'transcript') {
          let source: string = data.source || sourceFromIdentity;
          
          // Normalize user role variations to 'user'
          if (['customer', 'caller', 'human'].includes(source.toLowerCase())) {
            source = 'user';
          }
          
          debugLog('custom transcript', {
            originalSource: data.source,
            normalizedSource: source,
            aligned: !!data.aligned,
            length: (data.text || '')?.length ?? 0,
            wordCount: Array.isArray(data.words) ? data.words.length : 0,
          });
          
          const finalText = data.text || '';
          const isAligned = data.aligned;
          
          // Use real-time streaming for all transcripts
          updateLiveTranscript(source, finalText, isAligned);
          
          // Update partial state for overlay
          if (!isAligned) {
            setPartialBySource(prev => ({ ...prev, [source]: finalText }));
          } else {
            setPartialBySource(prev => ({ ...prev, [source]: '' }));
          }
        }
      } catch {
        debugLog('Failed to parse data message');
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
      try {
        (room as any).off('transcriptionReceived', handleTranscription);
      } catch (e) {
        // ignore
      }
    };
  }, [room]);
  
  // `useTracks` returns all camera and screen share tracks
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <div className="h-full flex flex-col relative">
      {/* <div className="text-sm text-gray-600">
        Room: {room?.name} | Participants: {participants.length + 1} (including you)
      </div> */}
      
      <GridLayout 
        tracks={tracks}
        className="flex-1 min-h-0"
      >
        <ParticipantTile />
      </GridLayout>

      {/* Realtime Transcript Overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-16 md:bottom-20 flex justify-center z-20">
        <div className="max-w-3xl w-[92%] md:w-[80%] bg-black/70 text-white rounded-md px-3 py-2 backdrop-blur-sm shadow-lg">
          {/* Show last 3 aligned segments and any active partials */}
          <div className="space-y-1 text-sm leading-relaxed">
            {segments.slice(-3).map(s => (
              <div key={s.id} className="flex gap-2">
                <span className="font-semibold capitalize opacity-80 min-w-[54px]">{s.source}:</span>
                <span className={s.isStreaming ? "relative" : ""}>
                  {s.text}
                  {s.isStreaming && (
                    <span className="inline-block w-1 h-4 bg-blue-400 animate-pulse ml-1 align-middle"></span>
                  )}
                </span>
              </div>
            ))}
            {/* Streaming segments are now handled in the main segments array */}
            {Object.entries(partialBySource).map(([source, text]) => (
              text ? (
                <div key={`partial-${source}`} className="flex gap-2 opacity-80">
                  <span className="font-semibold capitalize min-w-[54px]">{source}:</span>
                  <span className="italic">{text}</span>
                </div>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 