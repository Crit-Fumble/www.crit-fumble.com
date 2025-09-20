import { NextRequest, NextResponse } from 'next/server';

/**
 * Vercel Cron Job endpoint to check Discord scheduled events
 * Replaces the persistent Discord bot's scheduled task monitoring
 */
export async function GET(request: NextRequest) {
  // Verify this is actually Vercel calling our cron job
  const userAgent = request.headers.get('user-agent');
  if (!userAgent?.includes('vercel-cron/1.0')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔄 Checking Discord scheduled events via Vercel cron...');
    
    // Get Discord bot token from environment
    const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
    if (!botToken) {
      throw new Error('DISCORD_WEB_BOT_TOKEN not configured');
    }

    // Use Discord REST API to check scheduled events across guilds
    const guilds = await fetchDiscordGuilds(botToken);
    
    for (const guild of guilds) {
      await checkGuildScheduledEvents(botToken, guild.id, guild.name);
    }

    console.log('✅ Discord event check completed');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Discord events checked successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error checking Discord events:', error);
    
    return NextResponse.json({ 
      error: 'Failed to check Discord events',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Fetch all guilds the bot is in using Discord REST API
 */
async function fetchDiscordGuilds(botToken: string) {
  const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: {
      'Authorization': `Bot ${botToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch guilds: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Check scheduled events for a specific guild
 */
async function checkGuildScheduledEvents(botToken: string, guildId: string, guildName: string) {
  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/scheduled-events`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch events for guild ${guildName}: ${response.status}`);
      return;
    }

    const events = await response.json();
    
    if (!events || events.length === 0) {
      console.log(`ℹ️ No scheduled events in guild: ${guildName}`);
      return;
    }

    console.log(`📅 Found ${events.length} event(s) in guild: ${guildName}`);

    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;

    for (const event of events) {
      // Check if event is starting soon (within next 5 minutes)
      if (event.status === 1) { // SCHEDULED
        const eventStartTime = new Date(event.scheduled_start_time).getTime();
        const timeUntilStart = eventStartTime - now;

        if (timeUntilStart > 0 && timeUntilStart <= FIVE_MINUTES) {
          console.log(`⏰ Event "${event.name}" starting soon in guild ${guildName}`);
          
          // TODO: Send notifications, update campaign status, etc.
          await handleEventStartingSoon(event, guildId);
        }
      }

      // Check if event just ended
      if (event.status === 3) { // COMPLETED
        console.log(`✅ Event "${event.name}" has completed in guild ${guildName}`);
        
        // TODO: Archive session data, update campaign progress, etc.
        await handleEventCompleted(event, guildId);
      }
    }

  } catch (error) {
    console.error(`❌ Error checking events for guild ${guildName}:`, error);
  }
}

/**
 * Handle event starting soon notifications
 */
async function handleEventStartingSoon(event: any, guildId: string) {
  // TODO: Implement your notification logic here
  // - Send Discord notifications
  // - Update database
  // - Trigger other integrations
  console.log(`🔔 Would send notification for event: ${event.name}`);
}

/**
 * Handle event completion
 */
async function handleEventCompleted(event: any, guildId: string) {
  // TODO: Implement your completion logic here
  // - Archive session data
  // - Update campaign progress
  // - Generate reports
  console.log(`📝 Would process completion for event: ${event.name}`);
}