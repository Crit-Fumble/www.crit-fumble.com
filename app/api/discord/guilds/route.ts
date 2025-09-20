import { NextRequest, NextResponse } from 'next/server';

/**
 * Discord Guilds API
 * Manage guild-specific functionality and information
 */

/**
 * GET /api/discord/guilds - List all guilds the bot is in
 */
export async function GET(request: NextRequest) {
  try {
    const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }

    const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        'Authorization': `Bot ${botToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch guilds' }, { status: 500 });
    }

    const guilds = await response.json();

    // Transform guild data to include useful information
    const guildData = guilds.map((guild: any) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      owner: guild.owner,
      permissions: guild.permissions,
      memberCount: guild.approximate_member_count,
      features: guild.features,
    }));

    return NextResponse.json({
      guilds: guildData,
      count: guildData.length,
    });

  } catch (error) {
    console.error('Error fetching guilds:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}