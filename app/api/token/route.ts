import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

// Do not cache endpoint result
export const revalidate = 0;

// Handle both GET and POST requests
async function handleTokenRequest(params: any) {
  const { room, username, agentId, agentName, agentChannels, agentLanguages, agentVoice, agentEmail, agentChats, clientId, workspaceId, agentPrompt } = params;
  
  if (!room) {
    return NextResponse.json({ error: 'Missing "room" parameter' }, { status: 400 });
  } else if (!username) {
    return NextResponse.json({ error: 'Missing "username" parameter' }, { status: 400 });
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

  // Add agent data if provided
  if (agentId) metadata.agentId = agentId;
  if (agentName) metadata.agentName = agentName;
  if (agentPrompt) metadata.agentPrompt = agentPrompt;
  
  // Parse JSON strings to objects
  if (agentChannels) {
    try {
      metadata.agentChannels = typeof agentChannels === 'string' ? JSON.parse(agentChannels) : agentChannels;
    } catch (e) {
      metadata.agentChannels = agentChannels;
    }
  }
  
  if (agentLanguages) {
    try {
      metadata.agentLanguages = typeof agentLanguages === 'string' ? JSON.parse(agentLanguages) : agentLanguages;
    } catch (e) {
      metadata.agentLanguages = agentLanguages;
    }
  }
  
  if (agentVoice) {
    try {
      metadata.agentVoice = typeof agentVoice === 'string' ? JSON.parse(agentVoice) : agentVoice;
    } catch (e) {
      metadata.agentVoice = agentVoice;
    }
  }
  
  if (agentEmail) {
    try {
      metadata.agentEmail = typeof agentEmail === 'string' ? JSON.parse(agentEmail) : agentEmail;
    } catch (e) {
      metadata.agentEmail = agentEmail;
    }
  }
  
  if (agentChats) {
    try {
      metadata.agentChats = typeof agentChats === 'string' ? JSON.parse(agentChats) : agentChats;
    } catch (e) {
      metadata.agentChats = agentChats;
    }
  }
  
  // Handle clientId
  if (clientId && clientId !== 'undefined' && clientId !== 'null') {
    // If it's already a string ID, use it directly
    if (typeof clientId === 'string' && clientId.length === 24 && /^[0-9a-fA-F]+$/.test(clientId)) {
      // Looks like a MongoDB ObjectId
      metadata.clientId = clientId;
    } else {
      // Try to parse as JSON
      try {
        const parsedClientId = typeof clientId === 'string' ? JSON.parse(clientId) : clientId;
        
        if (typeof parsedClientId === 'object' && parsedClientId !== null) {
          metadata.clientId = parsedClientId._id || parsedClientId.id || parsedClientId.toString();
        } else {
          metadata.clientId = parsedClientId;
        }
      } catch (e) {
        metadata.clientId = clientId;
      }
    }
  } else {
    metadata.clientId = null;
  }
  
  if (workspaceId) metadata.workspaceId = workspaceId;

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

// POST method for handling large data
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return handleTokenRequest(body);
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// GET method for backward compatibility
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
  const agentPrompt = req.nextUrl.searchParams.get('agentPrompt');
  
  // Debug logging
  console.log('Received clientId parameter:', clientId);
  console.log('ClientId type:', typeof clientId);
  
  // Use the handleTokenRequest function with the query parameters
  return handleTokenRequest({
    room,
    username,
    agentId,
    agentName,
    agentChannels,
    agentLanguages,
    agentVoice,
    agentEmail,
    agentChats,
    clientId,
    workspaceId,
    agentPrompt
  });
}