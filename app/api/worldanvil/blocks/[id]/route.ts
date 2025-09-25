/**
 * World Anvil Block By ID API Route
 * 
 * GET /api/worldanvil/blocks/[id] - Get block by ID
 * PUT /api/worldanvil/blocks/[id] - Update block
 * DELETE /api/worldanvil/blocks/[id] - Delete block
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { WorldAnvilService } from '@crit-fumble/worldanvil';

// GET /api/worldanvil/blocks/[id] - Get block by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const worldAnvilToken = await getUserWorldAnvilToken(session.id);
    if (!worldAnvilToken) {
      return NextResponse.json({ error: 'World Anvil account not connected' }, { status: 401 });
    }

    const worldAnvilService = new WorldAnvilService(worldAnvilToken);
    const block = await worldAnvilService.getBlock(params.id);

    return NextResponse.json({ block });

  } catch (error) {
    console.error('Error fetching World Anvil block:', error);
    return NextResponse.json({ error: 'Failed to fetch block' }, { status: 500 });
  }
}

// PUT /api/worldanvil/blocks/[id] - Update block
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, is_public } = body;

    const worldAnvilToken = await getUserWorldAnvilToken(session.id);
    if (!worldAnvilToken) {
      return NextResponse.json({ error: 'World Anvil account not connected' }, { status: 401 });
    }

    const worldAnvilService = new WorldAnvilService(worldAnvilToken);

    const block = await worldAnvilService.updateBlock(params.id, {
      title,
      content,
      is_public
    });

    return NextResponse.json({ 
      block,
      message: 'Block updated successfully'
    });

  } catch (error) {
    console.error('Error updating World Anvil block:', error);
    return NextResponse.json({ error: 'Failed to update block' }, { status: 500 });
  }
}

// DELETE /api/worldanvil/blocks/[id] - Delete block
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const worldAnvilToken = await getUserWorldAnvilToken(session.id);
    if (!worldAnvilToken) {
      return NextResponse.json({ error: 'World Anvil account not connected' }, { status: 401 });
    }

    const worldAnvilService = new WorldAnvilService(worldAnvilToken);
    await worldAnvilService.deleteBlock(params.id);

    return NextResponse.json({ 
      message: 'Block deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting World Anvil block:', error);
    return NextResponse.json({ error: 'Failed to delete block' }, { status: 500 });
  }
}

// Helper function to get user's World Anvil token
async function getUserWorldAnvilToken(userId: string): Promise<string | null> {
  // This is a placeholder - implement based on your token storage
  return process.env.WORLDANVIL_API_TOKEN || null;
}