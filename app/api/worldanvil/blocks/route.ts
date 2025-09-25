/**
 * World Anvil Blocks API Route
 * 
 * GET /api/worldanvil/blocks - List blocks
 * POST /api/worldanvil/blocks - Create new block
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';
import { WorldAnvilService } from '@crit-fumble/worldanvil';

// GET /api/worldanvil/blocks - List blocks
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const worldId = searchParams.get('world_id');

    // Get user's World Anvil token from session/database
    // This would need to be implemented based on your auth system
    const worldAnvilToken = await getUserWorldAnvilToken(session.id);
    if (!worldAnvilToken) {
      return NextResponse.json({ error: 'World Anvil account not connected' }, { status: 401 });
    }

    const worldAnvilService = new WorldAnvilService(worldAnvilToken);

    const blocks = await worldAnvilService.getBlocks({
      world_id: worldId || undefined
    });

    return NextResponse.json({ blocks });

  } catch (error) {
    console.error('Error fetching World Anvil blocks:', error);
    return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 500 });
  }
}

// POST /api/worldanvil/blocks - Create new block
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, world_id, is_public, template_id } = body;

    if (!title || !world_id) {
      return NextResponse.json({ error: 'Title and world_id are required' }, { status: 400 });
    }

    // Get user's World Anvil token
    const worldAnvilToken = await getUserWorldAnvilToken(session.id);
    if (!worldAnvilToken) {
      return NextResponse.json({ error: 'World Anvil account not connected' }, { status: 401 });
    }

    const worldAnvilService = new WorldAnvilService(worldAnvilToken);

    const block = await worldAnvilService.createBlock({
      title,
      content: content || '',
      world_id,
      is_public: is_public || false,
      template_id
    });

    return NextResponse.json({ 
      block,
      message: 'Block created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating World Anvil block:', error);
    return NextResponse.json({ error: 'Failed to create block' }, { status: 500 });
  }
}

// Helper function to get user's World Anvil token
// This would be implemented based on your auth/token storage system
async function getUserWorldAnvilToken(userId: string): Promise<string | null> {
  // This is a placeholder - implement based on your token storage
  // You might store tokens in the database, session, or separate service
  return process.env.WORLDANVIL_API_TOKEN || null;
}