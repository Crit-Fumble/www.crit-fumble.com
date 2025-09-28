import { NextResponse } from 'next/server';
import { PrismaClient } from '@crit-fumble/core';
import { getSession } from '../../../lib/auth';

const prisma = new PrismaClient();

/**
 * API endpoint to fetch and manage RPG Systems
 * Admin only - requires admin authentication
 */
export async function GET() {
  try {
    // Check authentication and admin status
    const session = await getSession();
    if (!session || !session.admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch all RPG systems from database
    const systems = await prisma.rpgSystem.findMany({
      orderBy: { title: 'asc' },
      include: {
        _count: {
          select: {
            rpg_campaigns: true,
            rpg_sheets: true
          }
        }
      }
    });

    return NextResponse.json({ systems });
  } catch (error) {
    console.error('Error fetching RPG systems:', error);
    return NextResponse.json({ error: 'Failed to fetch systems' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication and admin status
    const session = await getSession();
    if (!session || !session.admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const data = await request.json();
    const {
      title,
      slug,
      description,
      worldanvil_system_id,
      discord_role_id,
      discord_chat_id,
      discord_forum_id,
      discord_voice_id,
      discord_thread_id,
      discord_post_id
    } = data;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const system = await prisma.rpgSystem.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description || null,
        worldanvil_system_id: worldanvil_system_id || null,
        discord_role_id: discord_role_id || null,
        discord_chat_id: discord_chat_id || null,
        discord_forum_id: discord_forum_id || null,
        discord_voice_id: discord_voice_id || null,
        discord_thread_id: discord_thread_id || null,
        discord_post_id: discord_post_id || null,
      },
      include: {
        _count: {
          select: {
            rpg_campaigns: true,
            rpg_sheets: true
          }
        }
      }
    });

    return NextResponse.json({ system });
  } catch (error) {
    console.error('Error creating RPG system:', error);
    return NextResponse.json({ error: 'Failed to create system' }, { status: 500 });
  }
}