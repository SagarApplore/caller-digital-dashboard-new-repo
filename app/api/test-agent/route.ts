import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, roomName, liveKitToken, agentData } = body;

    // Validate required fields
    if (!agentId || !roomName || !liveKitToken || !agentData) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call your Python agent service
    // Replace with your actual Python agent endpoint
    const pythonAgentUrl = process.env.PYTHON_AGENT_URL || 'http://localhost:5001';
    
    const response = await fetch(`${pythonAgentUrl}/start-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId,
        roomName,
        liveKitToken,
        agentData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Python agent service responded with status: ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Agent started successfully',
      data: result,
    });

  } catch (error: any) {
    console.error('Error starting agent:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to start agent' 
      },
      { status: 500 }
    );
  }
} 