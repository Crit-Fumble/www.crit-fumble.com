import { NextRequest, NextResponse } from 'next/server';
import { verifyKey } from 'discord-interactions';
import { PrismaClient, DiscordController } from '@crit-fumble/core';

// Initialize Prisma client for database operations
const prisma = new PrismaClient();
const discordController = new DiscordController(prisma);

/**
 * Discord Interaction endpoint - replaces persistent bot for slash commands
 * Discord will POST to this endpoint when users interact with your bot
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();

    // Verify the request is actually from Discord
    const publicKey = process.env.AUTH_DISCORD_PUBLIC_KEY;
    if (!publicKey || !signature || !timestamp) {
      return NextResponse.json({ error: 'Missing required headers' }, { status: 401 });
    }

    const isValid = verifyKey(body, signature, timestamp, publicKey);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const interaction = JSON.parse(body);

    // Handle different interaction types
    switch (interaction.type) {
      case InteractionType.Ping: // Discord's verification
        return NextResponse.json({ type: InteractionResponseType.Pong });

      case InteractionType.ApplicationCommand: // Slash commands
        return await handleApplicationCommand(interaction);

      case InteractionType.MessageComponent: // Button/select menu interactions
        return await handleMessageComponent(interaction);

      case InteractionType.ApplicationCommandAutocomplete:
        return await handleAutocomplete(interaction);

      case InteractionType.ModalSubmit: // Form submissions
        return await handleModalSubmit(interaction);

      default:
        console.warn(`Unknown interaction type: ${interaction.type}`);
        return NextResponse.json({ error: 'Unknown interaction type' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error handling Discord interaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Handle slash command interactions
 */
async function handleApplicationCommand(interaction: any) {
  const { data } = interaction;
  
  console.log(`🎯 Command executed: /${data.name} by ${interaction.member?.user?.username || interaction.user?.username}`);

  switch (data.name) {
    case 'event':
      return await handleEventCommand(interaction);
    
    case 'campaign':
      return await handleCampaignCommand(interaction);
    
    case 'character':
      return await handleCharacterCommand(interaction);
    
    default:
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Command \`/${data.name}\` is not implemented yet.`,
          flags: MessageFlags.Ephemeral
        }
      });
  }
}

/**
 * Handle button/select menu interactions
 */
async function handleMessageComponent(interaction: any) {
  const { data } = interaction;
  
  console.log(`🔘 Component interaction: ${data.custom_id} by ${interaction.member?.user?.username || interaction.user?.username}`);

  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Button/select menu interactions not implemented yet.`,
      flags: MessageFlags.Ephemeral
    }
  });
}

/**
 * Handle autocomplete interactions
 */
async function handleAutocomplete(interaction: any) {
  console.log(`🔍 Autocomplete requested for: ${interaction.data.name}`);

  return NextResponse.json({
    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
    data: {
      choices: [] // Return empty choices for now
    }
  });
}

/**
 * Handle modal form submissions
 */
async function handleModalSubmit(interaction: any) {
  const { data } = interaction;
  
  console.log(`📝 Modal submitted: ${data.custom_id} by ${interaction.member?.user?.username || interaction.user?.username}`);

  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Modal form submissions not implemented yet.`,
      flags: MessageFlags.Ephemeral
    }
  });
}

/**
 * Handle /event command
 */
async function handleEventCommand(interaction: any) {
  const { data } = interaction;
  const subcommand = data.options?.[0]?.name;
  
  try {
    switch (subcommand) {
      case 'create':
        return await handleCreateEvent(interaction);
      case 'list':
        return await handleListEvents(interaction);
      default:
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: '❌ Invalid event command. Use `/event create` or `/event list`',
            flags: MessageFlags.Ephemeral
          }
        });
    }
  } catch (error) {
    console.error('Error handling event command:', error);
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ An error occurred while processing the event command.',
        flags: MessageFlags.Ephemeral
      }
    });
  }
}

/**
 * Handle /campaign command  
 */
async function handleCampaignCommand(interaction: any) {
  const { data } = interaction;
  const subcommand = data.options?.[0]?.name;
  
  try {
    switch (subcommand) {
      case 'create':
        return await handleCreateCampaign(interaction);
      case 'list':
        return await handleListCampaigns(interaction);
      default:
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: '❌ Invalid campaign command. Use `/campaign create` or `/campaign list`',
            flags: MessageFlags.Ephemeral
          }
        });
    }
  } catch (error) {
    console.error('Error handling campaign command:', error);
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ An error occurred while processing the campaign command.',
        flags: MessageFlags.Ephemeral
      }
    });
  }
}

/**
 * Handle /character command
 */
async function handleCharacterCommand(interaction: any) {
  const { data } = interaction;
  const subcommand = data.options?.[0]?.name;
  
  try {
    switch (subcommand) {
      case 'create':
        return await handleCreateCharacter(interaction);
      case 'sheet':
        return await handleViewCharacterSheet(interaction);
      default:
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: '❌ Invalid character command. Use `/character create` or `/character sheet`',
            flags: MessageFlags.Ephemeral
          }
        });
    }
  } catch (error) {
    console.error('Error handling character command:', error);
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ An error occurred while processing the character command.',
        flags: MessageFlags.Ephemeral
      }
    });
  }
}

/**
 * Handle creating a new Discord scheduled event
 */
async function handleCreateEvent(interaction: any) {
  const { data, guild_id } = interaction;
  const options = data.options?.[0]?.options || [];
  
  const name = options.find((opt: any) => opt.name === 'name')?.value;
  const description = options.find((opt: any) => opt.name === 'description')?.value || '';
  
  if (!name) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ Event name is required!',
        flags: MessageFlags.Ephemeral
      }
    });
  }

  if (!guild_id) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ This command can only be used in a Discord server!',
        flags: MessageFlags.Ephemeral
      }
    });
  }

  try {
    const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
    if (!botToken) {
      throw new Error('Bot token not configured');
    }

    // Set event to start in 1 hour by default (Discord requires future time)
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 1);

    const eventData = {
      name: name,
      description: description || `D&D session created via Crit-Fumble bot`,
      scheduled_start_time: startTime.toISOString(),
      privacy_level: GuildScheduledEventPrivacyLevel.GuildOnly, // GUILD_ONLY
      entity_type: GuildScheduledEventEntityType.External, // External event (no specific voice/stage channel)
      entity_metadata: {
        location: 'Discord Voice Channel or External Platform'
      }
    };

    const response = await fetch(`https://discord.com/api/v10/guilds/${guild_id}/scheduled-events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Discord API error:', error);
      throw new Error(`Discord API error: ${response.status}`);
    }

    const event = await response.json();
    
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `✅ **Event Created Successfully!**\n\n📅 **${event.name}**\n📝 ${event.description}\n⏰ Scheduled for: <t:${Math.floor(new Date(event.scheduled_start_time).getTime() / 1000)}:F>\n\n*Event will appear in the server's Events section.*`,
        flags: MessageFlags.Ephemeral
      }
    });

  } catch (error) {
    console.error('Error creating Discord event:', error);
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ Failed to create event. Please try again later.',
        flags: MessageFlags.Ephemeral
      }
    });
  }
}

/**
 * Handle listing Discord scheduled events
 */
async function handleListEvents(interaction: any) {
  const { guild_id } = interaction;
  
  if (!guild_id) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ This command can only be used in a Discord server!',
        flags: MessageFlags.Ephemeral
      }
    });
  }

  try {
    const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
    if (!botToken) {
      throw new Error('Bot token not configured');
    }

    const response = await fetch(`https://discord.com/api/v10/guilds/${guild_id}/scheduled-events`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    const events = await response.json();
    
    if (!events || events.length === 0) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '📅 **No scheduled events found**\n\nUse `/event create` to create a new event!',
          flags: MessageFlags.Ephemeral
        }
      });
    }

    // Format events list
    const eventsList = events.map((event: any) => {
      const startTime = Math.floor(new Date(event.scheduled_start_time).getTime() / 1000);
      const statusEmoji = event.status === 1 ? '🟢' : event.status === 2 ? '🔴' : '⚪';
      return `${statusEmoji} **${event.name}**\n   📝 ${event.description || 'No description'}\n   ⏰ <t:${startTime}:F>`;
    }).join('\n\n');

    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `📅 **Scheduled Events (${events.length})**\n\n${eventsList}`,
        flags: MessageFlags.Ephemeral
      }
    });

  } catch (error) {
    console.error('Error fetching Discord events:', error);
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ Failed to fetch events. Please try again later.',
        flags: MessageFlags.Ephemeral
      }
    });
  }
}

/**
 * Handle creating a new campaign
 */
async function handleCreateCampaign(interaction: any) {
  // For now, create a simple campaign with minimal data
  // TODO: Add more sophisticated campaign creation with modals for detailed input
  
  try {
    // Get or create authenticated user
    const user = await getOrCreateUserFromDiscord(interaction);
    
    // Create a basic campaign entry
    const campaignService = new WebhookCampaignService(prisma);
    
    const campaign = await campaignService.create({
      title: `${user.name}'s Campaign`,
      description: 'Campaign created via Discord bot',
      gm_ids: [user.id], // Store database user ID as GM
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    });

    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `✅ **Campaign Created Successfully!**\n\n🎲 **${campaign.title}**\n📝 ${campaign.description}\n🆔 Campaign ID: \`${campaign.id}\`\n👤 Linked to user: **${user.name}**\n\n*Use \`/campaign list\` to see all your campaigns.*`,
        flags: MessageFlags.Ephemeral
      }
    });

  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ Failed to create campaign. Please try again later.',
        flags: MessageFlags.Ephemeral
      }
    });
  }
}

/**
 * Handle listing user's campaigns
 */
async function handleListCampaigns(interaction: any) {
  try {
    // Get or create authenticated user
    const user = await getOrCreateUserFromDiscord(interaction);
    
    const campaignService = new WebhookCampaignService(prisma);
    
    // Get campaigns where the user is a GM (using database user ID)
    const campaigns = await campaignService.getByGmId(user.id);
    
    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `🎲 **No campaigns found for ${user.name}**\n\nUse \`/campaign create\` to create your first campaign!`,
          flags: MessageFlags.Ephemeral
        }
      });
    }

    // Format campaigns list
    const campaignsList = campaigns.map((campaign: any) => {
      const createdDate = Math.floor(new Date(campaign.created_at).getTime() / 1000);
      const statusEmoji = campaign.is_active ? '🟢' : '🔴';
      return `${statusEmoji} **${campaign.title}**\n   📝 ${campaign.description || 'No description'}\n   📅 Created: <t:${createdDate}:D>\n   🆔 ID: \`${campaign.id}\``;
    }).join('\n\n');

    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `🎲 **${user.name}'s Campaigns (${campaigns.length})**\n\n${campaignsList}`,
        flags: MessageFlags.Ephemeral
      }
    });

  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ Failed to fetch campaigns. Please try again later.',
        flags: MessageFlags.Ephemeral
      }
    });
  }
}

/**
 * Handle creating a new character sheet
 */
async function handleCreateCharacter(interaction: any) {
  try {
    // Get or create authenticated user
    const user = await getOrCreateUserFromDiscord(interaction);
    
    // Create a basic character sheet
    // TODO: Add more sophisticated character creation with modals for detailed input
    const sheetService = new WebhookSheetService(prisma);
    
    const sheet = await sheetService.createSheet({
      title: `${user.name}'s Character`,
      summary: 'Character sheet created via Discord bot',
      data: {
        user_id: user.id, // Link to database user ID
        player_discord_id: interaction.member?.user?.id || interaction.user?.id,
        level: 1,
        class: 'To be determined',
        race: 'To be determined',
        background: 'To be determined'
      }
    });

    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `✅ **Character Sheet Created Successfully!**\n\n⚔️ **${sheet.title}**\n📝 ${sheet.summary}\n🆔 Sheet ID: \`${sheet.id}\`\n👤 Linked to user: **${user.name}**\n\n*Use \`/character sheet\` to view your character sheets.*`,
        flags: MessageFlags.Ephemeral
      }
    });

  } catch (error) {
    console.error('Error creating character sheet:', error);
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ Failed to create character sheet. Please try again later.',
        flags: MessageFlags.Ephemeral
      }
    });
  }
}

/**
 * Handle viewing character sheets
 */
async function handleViewCharacterSheet(interaction: any) {
  try {
    // Get or create authenticated user
    const user = await getOrCreateUserFromDiscord(interaction);
    
    const sheetService = new WebhookSheetService(prisma);
    
    // Get all sheets for this user (filtering by user_id in data field)
    const sheets = await sheetService.getAll();
    const userSheets = sheets.filter((sheet: any) => {
      try {
        const data = sheet.data ? JSON.parse(sheet.data as string) : {};
        return data.user_id === user.id;
      } catch {
        return false;
      }
    });
    
    if (!userSheets || userSheets.length === 0) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `⚔️ **No character sheets found for ${user.name}**\n\nUse \`/character create\` to create your first character!`,
          flags: MessageFlags.Ephemeral
        }
      });
    }

    // Format character sheets list
    const sheetsList = userSheets.map((sheet: any) => {
      const createdDate = Math.floor(new Date(sheet.created_at).getTime() / 1000);
      const statusEmoji = sheet.is_active ? '🟢' : '🔴';
      let characterDetails = '';
      
      try {
        const data = sheet.data ? JSON.parse(sheet.data as string) : {};
        const level = data.level || '?';
        const charClass = data.class || 'Unknown';
        const race = data.race || 'Unknown';
        characterDetails = `Level ${level} ${race} ${charClass}`;
      } catch {
        characterDetails = 'Character details unavailable';
      }
      
      return `${statusEmoji} **${sheet.title}**\n   🎭 ${characterDetails}\n   📝 ${sheet.summary || 'No description'}\n   📅 Created: <t:${createdDate}:D>\n   🆔 ID: \`${sheet.id}\``;
    }).join('\n\n');

    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `⚔️ **${user.name}'s Character Sheets (${userSheets.length})**\n\n${sheetsList}`,
        flags: MessageFlags.Ephemeral
      }
    });

  } catch (error) {
    console.error('Error fetching character sheets:', error);
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '❌ Failed to fetch character sheets. Please try again later.',
        flags: MessageFlags.Ephemeral
      }
    });
  }
}

/**
 * Get or create user based on Discord interaction data
 */
async function getOrCreateUserFromDiscord(interaction: any) {
  const userId = interaction.member?.user?.id || interaction.user?.id;
  const username = interaction.member?.user?.username || interaction.user?.username;
  const globalName = interaction.member?.user?.global_name || interaction.user?.global_name;
  const discriminator = interaction.member?.user?.discriminator || interaction.user?.discriminator;
  const avatar = interaction.member?.user?.avatar || interaction.user?.avatar;

  if (!userId || !username) {
    throw new Error('Unable to identify Discord user');
  }

  const userService = new WebhookUserService(prisma);
  
  // Try to find existing user by Discord ID
  let user = await userService.getUserById(userId);
  
  if (!user) {
    // Create new user linked to Discord
    user = await userService.createUser({
      discord_id: userId,
      name: globalName || username,
      email: null, // Discord doesn't always provide email in interactions
      slug: `${username}-${Date.now()}`, // Generate unique slug
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        discord: {
          username,
          global_name: globalName,
          discriminator,
          avatar
        }
      }
    });
  }

  return user;
}