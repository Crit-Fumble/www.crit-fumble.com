import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, CommandOptions } from '@crit-fumble/models/Discord/types';

/**
 * API route for Discord slash commands management
 * Allows registration, updates, and invocation of bot commands
 */

// GET handler for Discord commands information
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
    
    // Return commands list (this would be fetched from database in production)
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        commands: [
          {
            name: 'roll',
            description: 'Roll dice with various options',
            type: 1,
            options: [
              {
                name: 'dice',
                description: 'Dice notation (e.g., 2d6+3)',
                type: 3,
                required: true
              }
            ]
          },
          {
            name: 'character',
            description: 'Character management commands',
            type: 1,
            options: [
              {
                name: 'view',
                description: 'View character sheet',
                type: 1
              },
              {
                name: 'create',
                description: 'Create new character',
                type: 1
              }
            ]
          }
        ],
        count: 2,
        version: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0'
      }
    });
  } catch (error) {
    console.error('Error in Discord commands API route:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// POST handler for registering or executing commands
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
    if (!body || !body.action) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid request body'
      }, { status: 400 });
    }
    
    // Handle different command actions
    const { action } = body;
    
    switch (action) {
      case 'register':
        // Register new command
        if (!body.command || typeof body.command !== 'object') {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Command data is required'
          }, { status: 400 });
        }
        return handleRegisterCommand(body.command);
        
      case 'update':
        // Update existing command
        if (!body.command || !body.commandId) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Command data and ID are required'
          }, { status: 400 });
        }
        return handleUpdateCommand(body.commandId, body.command);
        
      case 'delete':
        // Delete command
        if (!body.commandId) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Command ID is required'
          }, { status: 400 });
        }
        return handleDeleteCommand(body.commandId);
        
      default:
        return NextResponse.json<ApiResponse>({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in Discord commands API route:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Helper functions for command operations
async function handleRegisterCommand(command: CommandOptions): Promise<NextResponse> {
  // TODO: Implement command registration with Discord API
  // This would store the command in the database and register with Discord
  
  return NextResponse.json<ApiResponse>({
    success: true,
    data: {
      message: `Command '${command.name}' registered successfully`,
      command: {
        ...command,
        id: `cmd_${Date.now()}` // Simulated ID
      }
    }
  });
}

async function handleUpdateCommand(commandId: string, command: CommandOptions): Promise<NextResponse> {
  // TODO: Implement command update logic
  
  return NextResponse.json<ApiResponse>({
    success: true,
    data: {
      message: `Command '${command.name}' updated successfully`,
      command: {
        ...command,
        id: commandId
      }
    }
  });
}

async function handleDeleteCommand(commandId: string): Promise<NextResponse> {
  // TODO: Implement command deletion logic
  
  return NextResponse.json<ApiResponse>({
    success: true,
    data: {
      message: `Command with ID '${commandId}' deleted successfully`,
      deleted: commandId
    }
  });
}

// Helper function to validate API tokens
function isValidApiToken(authHeader: string): boolean {
  // Expected format: "Bearer TOKEN"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return false;
  }
  
  const token = parts[1];
  const validToken = process.env.DISCORD_COMMANDS_API_TOKEN || process.env.DISCORD_API_TOKEN;
  
  return token === validToken;
}
