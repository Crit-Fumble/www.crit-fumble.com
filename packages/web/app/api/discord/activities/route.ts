import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@cfg/models/Discord/types';

/**
 * API route for Discord activities integration
 * Activities are interactive experiences users can engage with in Discord
 */

// GET handler for Discord activities information
export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    // Validate authorization
    if (!authHeader || !isValidApiToken(authHeader)) {
      return NextResponse.json<ApiResponse>({ 
        success: false, 
        error: 'Unauthorized access' 
      }, { status: 401 });
    }
    
    // Return activities list
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        activities: [
          {
            id: 'character-sheet',
            name: 'Character Sheet',
            description: 'View and edit character sheets',
            status: 'active'
          },
          {
            id: 'dice-roller',
            name: 'Dice Roller',
            description: 'Roll dice for your game',
            status: 'active'
          },
          {
            id: 'initiative-tracker',
            name: 'Initiative Tracker',
            description: 'Track combat initiative order',
            status: 'active'
          }
        ],
        version: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0'
      }
    });
  } catch (error) {
    console.error('Error in Discord activities API route:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// POST handler for Discord activities operations
export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    // Validate authorization
    if (!authHeader || !isValidApiToken(authHeader)) {
      return NextResponse.json<ApiResponse>({ 
        success: false, 
        error: 'Unauthorized access' 
      }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate request body
    if (!body || !body.activity) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid request body'
      }, { status: 400 });
    }
    
    // Handle different activities
    const { activity, action, data } = body;
    
    // TODO: Implement activity-specific logic
    // Each activity would have its own handler
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        activity,
        action,
        processed: true,
        result: `Activity ${activity} processed with action ${action}`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in Discord activities API route:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Helper function to validate API tokens
function isValidApiToken(authHeader: string): boolean {
  // Expected format: "Bearer TOKEN"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return false;
  }
  
  const token = parts[1];
  const validToken = process.env.DISCORD_ACTIVITIES_API_TOKEN || process.env.DISCORD_API_TOKEN;
  
  return token === validToken;
}
