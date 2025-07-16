'use client';

import { useState } from 'react';
import LiveKitRoomOfficial from '@/components/molecules/livekit-room-official';

export default function TestLiveKitPage() {
  const [token, setToken] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetToken = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const room = 'test-room-' + Date.now();
      const username = 'test-user-' + Date.now();
      
      const resp = await fetch(`/api/token?room=${room}&username=${username}`);
      const data = await resp.json();
      
      if (data.token) {
        setToken(data.token);
      } else {
        setError(data.error || 'Failed to get token');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get token');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">LiveKit Test Page</h1>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {!token ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Click the button below to get a LiveKit token and test the connection.
          </p>
          <button
            onClick={handleGetToken}
            disabled={isConnecting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isConnecting ? 'Getting Token...' : 'Get LiveKit Token'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-green-600 font-medium">
            ✓ Token received! Testing LiveKit connection...
          </div>
          <div className="h-96 border rounded-lg overflow-hidden">
            <LiveKitRoomOfficial
              token={token}
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || ''}
              roomName="test-room"
              participantName="test-user"
              onConnect={(room) => console.log('Connected to room:', room.name)}
              onDisconnect={() => console.log('Disconnected from room')}
            />
          </div>
          <button
            onClick={() => setToken('')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
} 