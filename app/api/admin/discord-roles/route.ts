import { NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';

/**
 * API endpoint to fetch Discord server roles
 * Admin only - requires admin authentication
 */
export async function GET() {
  try {
    // Check authentication and admin status
    const session = await getSession();
    if (!session || !session.admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch Discord server roles using bot token
    if (!process.env.DISCORD_SERVER_ID || !process.env.DISCORD_WEB_BOT_TOKEN) {
      return NextResponse.json({ 
        error: 'Discord server configuration missing',
        details: 'DISCORD_SERVER_ID or DISCORD_WEB_BOT_TOKEN not configured'
      }, { status: 500 });
    }

    const response = await fetch(`https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/roles`, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_WEB_BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        error: 'Failed to fetch Discord roles',
        status: response.status,
        statusText: response.statusText
      }, { status: response.status });
    }

    const roles = await response.json();

    // Filter out @everyone role and sort by position (higher = more important)
    const filteredRoles = roles
      .filter((role: any) => role.name !== '@everyone')
      .sort((a: any, b: any) => b.position - a.position);

    return NextResponse.json({
      success: true,
      roles: filteredRoles.map((role: any) => ({
        id: role.id,
        name: role.name,
        color: role.color,
        position: role.position,
        permissions: role.permissions,
        mentionable: role.mentionable,
        hoist: role.hoist
      }))
    });

  } catch (error) {
    console.error('Error fetching Discord roles:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}