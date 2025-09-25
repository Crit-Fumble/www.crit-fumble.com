/**
 * Characters API Route
 * 
 * GET /api/characters - List user's characters
 * POST /api/characters - Create new character
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../lib/auth';
import { RpgCharacterService } from '@crit-fumble/core/server/services';
import { PrismaClient } from '@crit-fumble/core';

const prisma = new PrismaClient();

// GET /api/characters - List user's characters
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.id;

    // Verify user can access these characters
    if (userId !== session.id && !session.admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch characters with their sheets
    const characters = await prisma.rpgCharacter.findMany({
      where: { user_id: userId },
      include: {
        rpg_sheets: {
          include: {
            rpg_system: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ characters });

  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 });
  }
}

// POST /api/characters - Create new character
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      title, 
      description, 
      portrait_url, 
      sync_with_worldanvil,
      worldanvil_world_id,
      user_id 
    } = body;

    // Verify user can create for this user ID
    if (user_id !== session.id && !session.admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Character name is required' }, { status: 400 });
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check if slug already exists
    const existingCharacter = await prisma.rpgCharacter.findFirst({
      where: { slug }
    });

    const finalSlug = existingCharacter 
      ? `${slug}-${Date.now()}`
      : slug;

    // Create character data
    const characterData: any = {
      name,
      slug: finalSlug,
      title: title || null,
      description: description || null,
      portrait_url: portrait_url || null,
      user: { connect: { id: user_id } }
    };

    // Handle World Anvil integration
    let worldAnvilCharacterId = null;
    if (sync_with_worldanvil && worldanvil_world_id) {
      try {
        // Create World Anvil block
        const worldAnvilResponse = await fetch('/api/worldanvil/blocks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user-id': session.id
          },
          body: JSON.stringify({
            title: name,
            content: `# ${name}\n\n${title ? `**Title:** ${title}\n\n` : ''}${description || 'Character description...'}`,
            world_id: worldanvil_world_id,
            is_public: false
          })
        });

        if (worldAnvilResponse.ok) {
          const worldAnvilData = await worldAnvilResponse.json();
          worldAnvilCharacterId = worldAnvilData.block.id;
        } else {
          console.warn('Failed to create World Anvil block:', await worldAnvilResponse.text());
        }
      } catch (error) {
        console.warn('Error creating World Anvil block:', error);
      }
    }

    if (worldAnvilCharacterId) {
      characterData.worldanvil_character_id = worldAnvilCharacterId;
    }

    // Create character in database
    const character = await prisma.rpgCharacter.create({
      data: characterData,
      include: {
        user: {
          select: { id: true, name: true }
        },
        rpg_sheets: {
          include: {
            rpg_system: {
              select: { id: true, title: true }
            }
          }
        }
      }
    });

    return NextResponse.json({ 
      character,
      message: 'Character created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json({ error: 'Failed to create character' }, { status: 500 });
  }
}