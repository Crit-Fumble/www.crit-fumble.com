import { NextRequest, NextResponse } from 'next/server';

/**
 * Discord Bot Management API
 * Provides endpoints for managing bot status, guilds, and configuration
 */

/**
 * GET /api/discord/bot - Get bot status and information
 */
export async function GET(request: NextRequest) {
  try {
    const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }

    // Get bot user information
    const botResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        'Authorization': `Bot ${botToken}`,
      },
    });

    if (!botResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch bot info' }, { status: 500 });
    }

    const botUser = await botResponse.json();

    // Get guild count
    const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        'Authorization': `Bot ${botToken}`,
      },
    });

    const guilds = guildsResponse.ok ? await guildsResponse.json() : [];

    return NextResponse.json({
      bot: {
        id: botUser.id,
        username: botUser.username,
        discriminator: botUser.discriminator,
        avatar: botUser.avatar,
        verified: botUser.verified,
        public: botUser.public,
      },
      stats: {
        guildCount: guilds.length,
        lastCheck: new Date().toISOString(),
      },
      status: 'online', // Since we're using webhooks, always online
    });

  } catch (error) {
    console.error('Error fetching bot status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/discord/bot - Update bot configuration or trigger actions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'register_commands':
        return await registerGlobalCommands();
      
      case 'clear_commands':
        return await clearGlobalCommands();
      
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error handling bot action:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Register global slash commands with Discord
 */
async function registerGlobalCommands() {
  const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
  const applicationId = process.env.DISCORD_WEB_BOT_APP_ID;

  if (!botToken || !applicationId) {
    return NextResponse.json({ error: 'Bot credentials not configured' }, { status: 500 });
  }

  // Define Discord slash commands
  const commands = [
    {
      name: 'help',
      description: 'Provides information about bot commands.',
      options: [],
    },
    {
      name: 'roll',
      description: 'Roll dice using standard notation (e.g., 3d6+2)',
      options: [
        {
          type: 3, // STRING
          name: 'dice',
          description: 'Dice notation (e.g., 1d20, 3d6+2, 2d10+5)',
          required: true,
        },
      ],
    },
    {
      name: 'character',
      description: 'Character sheet commands',
      options: [
        {
          type: 1, // SUB_COMMAND
          name: 'show',
          description: 'Display your character sheet',
          options: [
            {
              type: 3, // STRING
              name: 'name',
              description: 'Character name (optional, uses default if not specified)',
              required: false,
            },
          ],
        },
        {
          type: 1, // SUB_COMMAND
          name: 'list',
          description: 'List all your characters',
        },
      ],
    },
  ];

  // Register the commands with Discord
  const response = await fetch(`https://discord.com/api/v10/applications/${applicationId}/commands`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bot ${botToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to register commands:', error);
    return NextResponse.json({ error: 'Failed to register commands' }, { status: 500 });
  }

  return NextResponse.json({ status: 'success', commands });
}

/**
 * Clear all global slash commands
 */
async function clearGlobalCommands() {
  const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
  const applicationId = process.env.DISCORD_WEB_BOT_APP_ID;

  if (!botToken || !applicationId) {
    return NextResponse.json({ error: 'Bot credentials not configured' }, { status: 500 });
  }

  const response = await fetch(`https://discord.com/api/v10/applications/${applicationId}/commands`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bot ${botToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([]), // Empty array clears all commands
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to clear commands:', error);
    return NextResponse.json({ error: 'Failed to clear commands' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'All global commands cleared',
  });
}

// Webhook handler moved to /api/discord/events/route.ts

export const runtime = 'edge';