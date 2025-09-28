import { NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';

/**
 * API endpoint to fetch Discord channels
 * Admin only - requires admin authentication
 */
export async function GET() {
  try {
    // Check authentication and admin status
    const session = await getSession();
    if (!session || !session.admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch Discord channels using bot token
    if (!process.env.DISCORD_SERVER_ID || !process.env.DISCORD_WEB_BOT_TOKEN) {
      return NextResponse.json({ 
        error: 'Discord configuration missing',
        details: 'DISCORD_SERVER_ID or DISCORD_WEB_BOT_TOKEN not configured' 
      }, { status: 500 });
    }

    const response = await fetch(`https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/channels`, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_WEB_BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
    }

    const channels = await response.json();
    
    // Organize channels by type and sort
    const organizedChannels = channels
      .map((channel: any) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
        position: channel.position || 0,
        parent_id: channel.parent_id,
        permission_overwrites: channel.permission_overwrites?.length || 0
      }))
      .sort((a: any, b: any) => a.position - b.position);

    // Group by channel types for easier selection
    const channelTypes = {
      text: organizedChannels.filter((ch: any) => ch.type === 0), // GUILD_TEXT
      voice: organizedChannels.filter((ch: any) => ch.type === 2), // GUILD_VOICE  
      category: organizedChannels.filter((ch: any) => ch.type === 4), // GUILD_CATEGORY
      forum: organizedChannels.filter((ch: any) => ch.type === 15), // GUILD_FORUM
      thread: organizedChannels.filter((ch: any) => [10, 11, 12].includes(ch.type)) // Various thread types
    };

    return NextResponse.json({ channels: organizedChannels, channelTypes });

  } catch (error) {
    console.error('Error fetching Discord channels:', error);
    return NextResponse.json({
      error: 'Failed to fetch Discord channels',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}