import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

// Do not cache endpoint result
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get('room');
  const username = req.nextUrl.searchParams.get('username');
  const agentId = req.nextUrl.searchParams.get('agentId');
  const agentName = req.nextUrl.searchParams.get('agentName');
  const agentChannels = req.nextUrl.searchParams.get('agentChannels');
  const agentLanguages = req.nextUrl.searchParams.get('agentLanguages');
  const agentVoice = req.nextUrl.searchParams.get('agentVoice');
  const agentEmail = req.nextUrl.searchParams.get('agentEmail');
  const agentChats = req.nextUrl.searchParams.get('agentChats');
  const clientId = req.nextUrl.searchParams.get('clientId');
  const workspaceId = req.nextUrl.searchParams.get('workspaceId');
  
  // Debug logging
  console.log('Received clientId parameter:', clientId);
  console.log('ClientId type:', typeof clientId);
  
  if (!room) {
    return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
  } else if (!username) {
    return NextResponse.json({ error: 'Missing "username" query parameter' }, { status: 400 });
  }

  // Use the correct environment variable names
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json({ 
      error: 'Server misconfigured',
      details: {
        apiKey: !!apiKey,
        apiSecret: !!apiSecret,
        wsUrl: !!wsUrl
      }
    }, { status: 500 });
  }

  // Prepare metadata object
  const metadata: any = {
    roomName: room,
    participantName: username,
    timestamp: new Date().toISOString(),
  };

  // Add agent data if provided, parsing JSON strings to objects
  if (agentId) metadata.agentId = agentId;
  if (agentName) metadata.agentName = agentName;
  
  // Parse JSON strings to objects
  if (agentChannels) {
    try {
      metadata.agentChannels = JSON.parse(agentChannels);
    } catch (e) {
      metadata.agentChannels = agentChannels;
    }
  }
  
  if (agentLanguages) {
    try {
      metadata.agentLanguages = JSON.parse(agentLanguages);
    } catch (e) {
      metadata.agentLanguages = agentLanguages;
    }
  }
  
  if (agentVoice) {
    try {
      metadata.agentVoice = JSON.parse(agentVoice);
    } catch (e) {
      metadata.agentVoice = agentVoice;
    }
  }
  
  if (agentEmail) {
    try {
      metadata.agentEmail = JSON.parse(agentEmail);
    } catch (e) {
      metadata.agentEmail = agentEmail;
    }
  }
  
  if (agentChats) {
    try {
      metadata.agentChats = JSON.parse(agentChats);
    } catch (e) {
      metadata.agentChats = agentChats;
    }
  }
  
  // Handle clientId - improved handling
  if (clientId && clientId !== 'undefined' && clientId !== 'null') {
    console.log('Processing clientId:', clientId);
    
    // If it's already a string ID, use it directly
    if (typeof clientId === 'string' && clientId.length === 24 && /^[0-9a-fA-F]+$/.test(clientId)) {
      // Looks like a MongoDB ObjectId
      metadata.clientId = clientId;
      console.log('Using clientId as MongoDB ObjectId:', clientId);
    } else {
      // Try to parse as JSON
      try {
        const parsedClientId = JSON.parse(clientId);
        console.log('Parsed clientId JSON:', parsedClientId);
        
        if (typeof parsedClientId === 'object' && parsedClientId !== null) {
          metadata.clientId = parsedClientId._id || parsedClientId.id || parsedClientId.toString();
        } else {
          metadata.clientId = parsedClientId;
        }
        console.log('Final clientId after parsing:', metadata.clientId);
      } catch (e) {
        console.log('Failed to parse clientId as JSON, using as string:', clientId);
        metadata.clientId = clientId;
      }
    }
  } else {
    console.log('No valid clientId provided');
    metadata.clientId = null;
  }
  
  if (workspaceId) metadata.workspaceId = workspaceId;

  console.log('Final metadata clientId:', metadata.clientId);
  console.log('Generated metadata:', JSON.stringify(metadata, null, 2));

  const at = new AccessToken(apiKey, apiSecret, { 
    identity: username,
    metadata: JSON.stringify(metadata)
  });
  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  return NextResponse.json(
    { token: await at.toJwt() },
    { headers: { "Cache-Control": "no-store" } },
  );
} 