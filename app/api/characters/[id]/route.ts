/**
 * Character By ID API Route
 * 
 * GET /api/characters/[id] - Get character by ID
 * PUT /api/characters/[id] - Update character
 * DELETE /api/characters/[id] - Delete character
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';
import { PrismaClient } from '@crit-fumble/core';

const prisma = new PrismaClient();

// GET /api/characters/[id] - Get character by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const character = await prisma.rpgCharacter.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, username: true }
        },
        sheets: {
          include: {
            rpg_system: true
          },
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    // Check access permissions
    if (character.user_id !== session.id && !session.admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ character });

  } catch (error) {
    console.error('Error fetching character:', error);
    return NextResponse.json({ error: 'Failed to fetch character' }, { status: 500 });
  }
}

// PUT /api/characters/[id] - Update character
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
    const { 
      name, 
      title, 
      description, 
      portrait_url,
      sync_with_worldanvil,
      worldanvil_world_id
    } = body;

    // Verify character exists and user has permission
    const existingCharacter = await prisma.rpgCharacter.findUnique({
      where: { id: params.id }
    });

    if (!existingCharacter) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    if (existingCharacter.user_id !== session.id && !session.admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Character name is required' }, { status: 400 });
    }

    // Generate new slug if name changed
    let slug = existingCharacter.slug;
    if (name !== existingCharacter.name) {
      const newSlug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Check if new slug already exists
      const slugExists = await prisma.rpgCharacter.findFirst({
        where: { 
          slug: newSlug,
          id: { not: params.id }
        }
      });

      slug = slugExists ? `${newSlug}-${Date.now()}` : newSlug;
    }

    // Handle World Anvil integration
    let worldAnvilCharacterId = existingCharacter.worldanvil_character_id;
    if (sync_with_worldanvil && worldanvil_world_id) {
      try {
        if (worldAnvilCharacterId) {
          // Update existing World Anvil block
          const worldAnvilResponse = await fetch(`/api/worldanvil/blocks/${worldAnvilCharacterId}`, {
            method: 'PUT',
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

          if (!worldAnvilResponse.ok) {
            console.warn('Failed to update World Anvil block:', await worldAnvilResponse.text());
          }
        } else {
          // Create new World Anvil block
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
        }
      } catch (error) {
        console.warn('Error with World Anvil integration:', error);
      }
    }

    // Update character in database
    const character = await prisma.rpgCharacter.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        title: title || null,
        description: description || null,
        portrait_url: portrait_url || null,
        worldanvil_character_id: worldAnvilCharacterId,
        updated_at: new Date()
      },
      include: {
        user: {
          select: { id: true, username: true }
        },
        sheets: {
          include: {
            rpg_system: true
          },
          orderBy: { created_at: 'desc' }
        }
      }
    });

    return NextResponse.json({ 
      character,
      message: 'Character updated successfully'
    });

  } catch (error) {
    console.error('Error updating character:', error);
    return NextResponse.json({ error: 'Failed to update character' }, { status: 500 });
  }
}

// DELETE /api/characters/[id] - Delete character
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify character exists and user has permission
    const character = await prisma.rpgCharacter.findUnique({
      where: { id: params.id },
      include: {
        sheets: true
      }
    });

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    if (character.user_id !== session.id && !session.admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Delete World Anvil block if it exists
    if (character.worldanvil_character_id) {
      try {
        await fetch(`/api/worldanvil/blocks/${character.worldanvil_character_id}`, {
          method: 'DELETE',
          headers: {
            'user-id': session.id
          }
        });
      } catch (error) {
        console.warn('Failed to delete World Anvil block:', error);
      }
    }

    // Delete character and cascade to sheets
    await prisma.rpgCharacter.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      message: 'Character deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting character:', error);
    return NextResponse.json({ error: 'Failed to delete character' }, { status: 500 });
  }
}