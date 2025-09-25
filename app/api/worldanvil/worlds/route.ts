/**
 * World Anvil Worlds API Route
 * 
 * GET /api/worldanvil/worlds - List user's worlds
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';
import { WorldAnvilService } from '@crit-fumble/worldanvil';

// GET /api/worldanvil/worlds - List user's worlds
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user's World Anvil token
    const worldAnvilToken = await getUserWorldAnvilToken(session.id);
    if (!worldAnvilToken) {
      return NextResponse.json({ 
        error: 'World Anvil account not connected',
        worlds: []
      }, { status: 401 });
    }

    const worldAnvilService = new WorldAnvilService(worldAnvilToken);

    try {
      const worlds = await worldAnvilService.getWorlds();
      return NextResponse.json({ worlds });
    } catch (apiError: any) {
      // Handle World Anvil API errors gracefully
      if (apiError.response?.status === 401) {
        return NextResponse.json({ 
          error: 'World Anvil token expired or invalid',
          worlds: []
        }, { status: 401 });
      }
      throw apiError;
    }

  } catch (error) {
    console.error('Error fetching World Anvil worlds:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch worlds',
      worlds: []
    }, { status: 500 });
  }
}

// Helper function to get user's World Anvil token
async function getUserWorldAnvilToken(userId: string): Promise<string | null> {
  // This is a placeholder - implement based on your token storage
  // In a real implementation, you would:
  // 1. Look up the user's connected World Anvil OAuth token
  // 2. Check if it's expired and refresh if needed
  // 3. Return null if no valid token exists
  
  // For now, using environment variable as fallback
  return process.env.WORLDANVIL_API_TOKEN || null;
}