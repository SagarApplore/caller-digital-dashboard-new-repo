import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId } = body;

    // Validate required fields
    if (!agentId) {
      return NextResponse.json(
        { success: false, message: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // Call your Python agent service to stop the agent
    // Replace with your actual Python agent endpoint
    const pythonAgentUrl = process.env.PYTHON_AGENT_URL || 'http://localhost:5001';
    
    const response = await fetch(`${pythonAgentUrl}/stop-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Python agent service responded with status: ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Agent stopped successfully',
      data: result,
    });

  } catch (error: any) {
    console.error('Error stopping agent:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to stop agent' 
      },
      { status: 500 }
    );
  }
} 