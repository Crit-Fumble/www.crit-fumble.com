/**
 * Character Sheets API Route
 *
 * GET /api/character/[characterId]/sheets - List character's sheets
 * POST /api/character/[characterId]/sheets - Link a new sheet to character
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@crit-fumble/core';

// GET /api/character/[characterId]/sheets - List character's sheets
export async function GET(
  request: NextRequest,
  { params }: { params: { characterId: string } }
) {
  try {
    // Get user session
    const sessionCookie = cookies().get('fumble-session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);
    const { characterId } = params;

    // Verify the character belongs to the user
    const character = await prisma.rpgCharacter.findUnique({
      where: { id: characterId },
      select: {
        user_id: true,
        rpg_sheets: {
          select: {
            id: true,
            worldanvil_block_id: true,
            title: true,
            description: true,
            data: true,
            is_active: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    if (character.user_id !== userData.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      sheets: character.rpg_sheets,
    });
  } catch (error: any) {
    console.error('Error fetching character sheets:', error);
    return NextResponse.json({
      error: 'Failed to fetch character sheets',
      details: error.message
    }, { status: 500 });
  }
}

// POST /api/character/[characterId]/sheets - Link a new sheet to character
export async function POST(
  request: NextRequest,
  { params }: { params: { characterId: string } }
) {
  try {
    // Get user session
    const sessionCookie = cookies().get('fumble-session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = JSON.parse(sessionCookie.value);
    const { characterId } = params;
    const body = await request.json();
    const { worldanvilBlockId, title, description } = body;

    if (!worldanvilBlockId) {
      return NextResponse.json({
        error: 'World Anvil Block ID is required'
      }, { status: 400 });
    }

    // Verify the character belongs to the user
    const character = await prisma.rpgCharacter.findUnique({
      where: { id: characterId },
      select: { user_id: true },
    });

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    if (character.user_id !== userData.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Create the sheet link
    const sheet = await prisma.rpgSheet.create({
      data: {
        worldanvil_block_id: worldanvilBlockId,
        title: title || 'Untitled Sheet',
        description: description || null,
        rpg_character_id: characterId,
        is_active: true,
      },
    });

    console.log(`✅ Sheet linked: Character ${characterId} -> Block ${worldanvilBlockId}`);

    return NextResponse.json({
      success: true,
      message: 'Sheet linked successfully',
      sheet: {
        id: sheet.id,
        worldanvil_block_id: sheet.worldanvil_block_id,
        title: sheet.title,
        description: sheet.description,
      },
    });
  } catch (error: any) {
    console.error('Error linking character sheet:', error);

    // Check for unique constraint violation (sheet already linked)
    if (error.code === 'P2002') {
      return NextResponse.json({
        error: 'This World Anvil block is already linked to a sheet'
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Failed to link character sheet',
      details: error.message
    }, { status: 500 });
  }
}
