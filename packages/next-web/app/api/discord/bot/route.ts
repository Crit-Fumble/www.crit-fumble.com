import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@cfg/models/Discord/types';

/**
 * API route for Discord bot interactions with the web app
 */

// GET handler to fetch bot status
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
    
    // Return bot status
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        status: 'online',
        uptime: process.uptime(),
        version: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0'
      }
    });
  } catch (error) {
    console.error('Error in discord/bot API route:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// POST handler to send commands to the bot
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
    if (!body || !body.command) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid request body'
      }, { status: 400 });
    }
    
    // Process command
    // TODO: Implement command processing logic
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        received: body.command,
        processed: true
      }
    });
  } catch (error) {
    console.error('Error in discord/bot API route:', error);
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
  const validToken = process.env.DISCORD_PERSISTENT_BOT_API_TOKEN;
  
  return token === validToken;
}
