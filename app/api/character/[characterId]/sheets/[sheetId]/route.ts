/**
 * Character Sheet API Route
 *
 * GET /api/character/[characterId]/sheets/[sheetId] - Get sheet details
 * DELETE /api/character/[characterId]/sheets/[sheetId] - Unlink sheet from character
 * PATCH /api/character/[characterId]/sheets/[sheetId] - Update sheet metadata
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@crit-fumble/core';

// GET /api/character/[characterId]/sheets/[sheetId] - Get sheet details
export async function GET(
  request: NextRequest,
  { params }: { params: { characterId: string; sheetId: string } }
) {
  try {
    // Get user session
    const sessionCookie = cookies().get('fumble-session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);
    const { characterId, sheetId } = params;

    // Fetch the sheet and verify ownership
    const sheet = await prisma.rpgSheet.findUnique({
      where: { id: sheetId },
      include: {
        rpg_character: {
          select: {
            id: true,
            user_id: true,
            name: true,
          },
        },
      },
    });

    if (!sheet) {
      return NextResponse.json({ error: 'Sheet not found' }, { status: 404 });
    }

    if (sheet.rpg_character_id !== characterId) {
      return NextResponse.json({ error: 'Sheet does not belong to this character' }, { status: 400 });
    }

    if (sheet.rpg_character?.user_id !== userData.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      sheet,
    });
  } catch (error: any) {
    console.error('Error fetching sheet:', error);
    return NextResponse.json({
      error: 'Failed to fetch sheet',
      details: error.message
    }, { status: 500 });
  }
}

// PATCH /api/character/[characterId]/sheets/[sheetId] - Update sheet metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: { characterId: string; sheetId: string } }
) {
  try {
    // Get user session
    const sessionCookie = cookies().get('fumble-session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);
    const { characterId, sheetId } = params;
    const body = await request.json();
    const { title, description, is_active } = body;

    // Fetch the sheet and verify ownership
    const sheet = await prisma.rpgSheet.findUnique({
      where: { id: sheetId },
      include: {
        rpg_character: {
          select: { user_id: true },
        },
      },
    });

    if (!sheet) {
      return NextResponse.json({ error: 'Sheet not found' }, { status: 404 });
    }

    if (sheet.rpg_character_id !== characterId) {
      return NextResponse.json({ error: 'Sheet does not belong to this character' }, { status: 400 });
    }

    if (sheet.rpg_character?.user_id !== userData.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the sheet
    const updatedSheet = await prisma.rpgSheet.update({
      where: { id: sheetId },
      data: {
        title: title !== undefined ? title : sheet.title,
        description: description !== undefined ? description : sheet.description,
        is_active: is_active !== undefined ? is_active : sheet.is_active,
        updated_at: new Date(),
      },
    });

    console.log(`✅ Sheet updated: ${sheetId}`);

    return NextResponse.json({
      success: true,
      message: 'Sheet updated successfully',
      sheet: updatedSheet,
    });
  } catch (error: any) {
    console.error('Error updating sheet:', error);
    return NextResponse.json({
      error: 'Failed to update sheet',
      details: error.message
    }, { status: 500 });
  }
}

// DELETE /api/character/[characterId]/sheets/[sheetId] - Unlink sheet from character
export async function DELETE(
  request: NextRequest,
  { params }: { params: { characterId: string; sheetId: string } }
) {
  try {
    // Get user session
    const sessionCookie = cookies().get('fumble-session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);
    const { characterId, sheetId } = params;

    // Fetch the sheet and verify ownership
    const sheet = await prisma.rpgSheet.findUnique({
      where: { id: sheetId },
      include: {
        rpg_character: {
          select: { user_id: true },
        },
      },
    });

    if (!sheet) {
      return NextResponse.json({ error: 'Sheet not found' }, { status: 404 });
    }

    if (sheet.rpg_character_id !== characterId) {
      return NextResponse.json({ error: 'Sheet does not belong to this character' }, { status: 400 });
    }

    if (sheet.rpg_character?.user_id !== userData.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the sheet
    await prisma.rpgSheet.delete({
      where: { id: sheetId },
    });

    console.log(`✅ Sheet unlinked: ${sheetId} from Character ${characterId}`);

    return NextResponse.json({
      success: true,
      message: 'Sheet unlinked successfully',
    });
  } catch (error: any) {
    console.error('Error unlinking sheet:', error);
    return NextResponse.json({
      error: 'Failed to unlink sheet',
      details: error.message
    }, { status: 500 });
  }
}
