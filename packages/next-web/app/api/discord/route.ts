import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from '@crit-fumble/models/Discord/types';

/**
 * Main API route for Discord integration
 * This serves as the entry point for Discord-related operations
 * Sub-routes handle specific functionality (bot, activities, etc.)
 */

// GET handler for Discord API status and information
export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    // Basic status doesn't require auth
    if (!authHeader) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          status: 'available',
          message: 'Discord API integration is available',
          version: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0',
          // Don't expose sensitive information in the public endpoint
        }
      });
    }
    
    // If auth provided, validate it for detailed information
    if (isValidApiToken(authHeader)) {
      // Return detailed status for authenticated requests
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          status: 'authenticated',
          integrations: ['bot', 'activities', 'commands'],
          version: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0',
          environment: process.env.NODE_ENV
        }
      });
    } else {
      // Invalid auth
      return NextResponse.json<ApiResponse>({ 
        success: false, 
        error: 'Invalid authentication'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Error in Discord API route:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// POST handler for general Discord operations
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
    
    // Route the request based on operation type
    if (!body.operation) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Missing operation parameter'
      }, { status: 400 });
    }
    
    // TODO: Implement operation routing logic
    // This will dispatch to appropriate handlers based on operation type
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        message: `Operation '${body.operation}' received`,
        processed: false,
        note: 'Operation routing not yet implemented'
      }
    });
  } catch (error) {
    console.error('Error in Discord API route:', error);
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
  const validToken = process.env.DISCORD_API_TOKEN;
  
  return token === validToken;
}