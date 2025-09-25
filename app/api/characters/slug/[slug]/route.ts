/**
 * Character By Slug API Route
 * 
 * GET /api/characters/slug/[slug] - Get character by slug (public view)
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@crit-fumble/core';
import { getSession } from '../../../../lib/auth';

const prisma = new PrismaClient();

// GET /api/characters/slug/[slug] - Get character by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getSession();

    const character = await prisma.rpgCharacter.findUnique({
      where: { slug: params.slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
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

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    // Check if user can view this character
    const isOwner = session && character.user_id === session.id;
    const isAdmin = session && session.admin;
    const canView = isOwner || isAdmin;

    // Return character data with ownership info
    const response = {
      character: {
        ...character,
        // Include sensitive data only for owners/admins
        worldanvil_character_id: canView ? character.worldanvil_character_id : null
      },
      isOwner,
      canEdit: canView
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching character by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch character' }, { status: 500 });
  }
}