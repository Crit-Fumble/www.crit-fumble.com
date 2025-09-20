import { 
  InteractionType, 
  InteractionResponseType, 
  ApplicationCommandOptionType,
  MessageFlags,
  GuildScheduledEventPrivacyLevel,
  GuildScheduledEventEntityType
} from 'discord-api-types/v10';
import { PrismaClient } from '@prisma/client';
import { 
  WebhookCampaignService, 
  WebhookSheetService, 
  WebhookUserService 
} from '../services/WebhookServices';
import { PermissionService } from '../services/PermissionService';
import { 
  DiscordServerOperation, 
  DiscordServerContext 
} from '../../models/permissions/PermissionModels';

/**
 * Discord Interactions Controller
 * 
 * Handles all Discord webhook interactions including slash commands,
 * button/select menu interactions, autocomplete, and modal submissions.
 * 
 * SECURITY: This controller enforces Discord permission boundaries.
 * Discord admin permissions are validated for Discord operations only
 * and NEVER grant site-wide administrative access.
 */
export class DiscordController {
  private prisma: PrismaClient;
  private campaignService: WebhookCampaignService;
  private sheetService: WebhookSheetService;
  private userService: WebhookUserService;
  private permissionService: PermissionService;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
    this.campaignService = new WebhookCampaignService(this.prisma);
    this.sheetService = new WebhookSheetService(this.prisma);
    this.userService = new WebhookUserService(this.prisma);
    this.permissionService = new PermissionService();
  }

  /**
   * Create Discord permission context from interaction
   * SECURITY: This context is ONLY for Discord operations, never site admin access
   */
  private createDiscordServerContext(interaction: any): DiscordServerContext {
    const discordUserId = interaction.member?.user?.id || interaction.user?.id;
    const guildId = interaction.guild_id;
    
    // Extract permissions from Discord interaction
    const guildPermissions = interaction.member?.permissions 
      ? this.parseDiscordPermissions(interaction.member.permissions)
      : [];
    
    // Check if user has admin permissions in Discord
    const isGuildAdmin = guildPermissions.includes('ADMINISTRATOR');
    const isGuildOwner = interaction.member?.roles?.includes(guildId); // Simplified check
    
    return this.permissionService.createDiscordServerContext(
      discordUserId,
      guildId,
      guildPermissions,
      isGuildAdmin,
      isGuildOwner
    );
  }

  /**
   * Parse Discord permission bitmask into permission strings
   */
  private parseDiscordPermissions(permissionsBitmask: string): string[] {
    const permissions = parseInt(permissionsBitmask);
    const permissionNames: string[] = [];
    
    // Discord permission flags (partial list for key permissions)
    const PERMISSION_FLAGS = {
      ADMINISTRATOR: 0x8,
      MANAGE_GUILD: 0x20,
      MANAGE_CHANNELS: 0x10,
      MANAGE_MESSAGES: 0x2000,
      MANAGE_EVENTS: 0x8000000000
    };
    
    for (const [name, flag] of Object.entries(PERMISSION_FLAGS)) {
      if (permissions & flag) {
        permissionNames.push(name);
      }
    }
    
    return permissionNames;
  }

  /**
   * Validate Discord permission for operation
   * SECURITY: This only validates Discord operations, never grants site admin access
   */
  private validateDiscordServerOperation(
    context: DiscordServerContext, 
    operation: DiscordServerOperation
  ): { allowed: boolean; reason?: string } {
    const result = this.permissionService.validateDiscordServerPermission(context, operation);
    
    if (!result.allowed) {
      console.warn(`Discord permission denied: ${operation} for user ${context.discordUserId} in guild ${context.guildId}. Reason: ${result.reason}`);
    }
    
    return result;
  }

  /**
   * Main handler for Discord interactions
   */
  async handleInteraction(interaction: any) {
    try {
      // Handle different interaction types
      switch (interaction.type) {
        case InteractionType.Ping: // Discord's verification
          return { type: InteractionResponseType.Pong };

        case InteractionType.ApplicationCommand: // Slash commands
          return await this.handleApplicationCommand(interaction);

        case InteractionType.MessageComponent: // Button/select menu interactions
          return await this.handleMessageComponent(interaction);

        case InteractionType.ApplicationCommandAutocomplete:
          return await this.handleAutocomplete(interaction);

        case InteractionType.ModalSubmit: // Form submissions
          return await this.handleModalSubmit(interaction);

        default:
          console.warn(`Unknown interaction type: ${interaction.type}`);
          return { error: 'Unknown interaction type', status: 400 };
      }
    } catch (error) {
      console.error('Error handling Discord interaction:', error);
      return { error: 'Internal server error', status: 500 };
    }
  }

  /**
   * Handle slash command interactions
   */
  private async handleApplicationCommand(interaction: any) {
    const { data } = interaction;
    
    console.log(`🎯 Command executed: /${data.name} by ${interaction.member?.user?.username || interaction.user?.username}`);

    switch (data.name) {
      case 'event':
        return await this.handleEventCommand(interaction);
      
      case 'campaign':
        return await this.handleCampaignCommand(interaction);
      
      case 'character':
        return await this.handleCharacterCommand(interaction);
      
      default:
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: `Command \`/${data.name}\` is not implemented yet.`,
            flags: MessageFlags.Ephemeral
          }
        };
    }
  }

  /**
   * Handle button/select menu interactions
   */
  private async handleMessageComponent(interaction: any) {
    const { data } = interaction;
    
    console.log(`🔘 Component interaction: ${data.custom_id} by ${interaction.member?.user?.username || interaction.user?.username}`);

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `Button/select menu interactions not implemented yet.`,
        flags: MessageFlags.Ephemeral
      }
    };
  }

  /**
   * Handle autocomplete interactions
   */
  private async handleAutocomplete(interaction: any) {
    console.log(`🔍 Autocomplete requested for: ${interaction.data.name}`);

    return {
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices: [] // Return empty choices for now
      }
    };
  }

  /**
   * Handle modal form submissions
   */
  private async handleModalSubmit(interaction: any) {
    const { data } = interaction;
    
    console.log(`📝 Modal submitted: ${data.custom_id} by ${interaction.member?.user?.username || interaction.user?.username}`);

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `Modal form submissions not implemented yet.`,
        flags: MessageFlags.Ephemeral
      }
    };
  }

  /**
   * Handle /event command
   */
  private async handleEventCommand(interaction: any) {
    const { data } = interaction;
    const subcommand = data.options?.[0]?.name;
    
    // SECURITY: Validate Discord permissions for event operations
    const permissionContext = this.createDiscordServerContext(interaction);
    
    try {
      switch (subcommand) {
        case 'create':
          // Check permission to create campaign events
          const createPermission = this.validateDiscordServerOperation(
            permissionContext, 
            DiscordServerOperation.CREATE_CAMPAIGN_EVENT
          );
          
          if (!createPermission.allowed) {
            return {
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content: `❌ You don't have permission to create events. ${createPermission.reason}`,
                flags: MessageFlags.Ephemeral
              }
            };
          }
          
          return await this.handleCreateEvent(interaction);
          
        case 'list':
          // Basic Discord user can list events
          const listPermission = this.validateDiscordServerOperation(
            permissionContext, 
            DiscordServerOperation.USE_BASIC_COMMANDS
          );
          
          if (!listPermission.allowed) {
            return {
              type: InteractionResponseType.ChannelMessageWithSource,
              data: {
                content: `❌ You don't have permission to use this command. ${listPermission.reason}`,
                flags: MessageFlags.Ephemeral
              }
            };
          }
          
          return await this.handleListEvents(interaction);
          
        default:
          return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: '❌ Invalid event command. Use `/event create` or `/event list`',
              flags: MessageFlags.Ephemeral
            }
          };
      }
    } catch (error) {
      console.error('Error handling event command:', error);
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ An error occurred while processing the event command.',
          flags: MessageFlags.Ephemeral
        }
      };
    }
  }

  /**
   * Handle /campaign command  
   */
  private async handleCampaignCommand(interaction: any) {
    const { data } = interaction;
    const subcommand = data.options?.[0]?.name;
    
    try {
      switch (subcommand) {
        case 'create':
          return await this.handleCreateCampaign(interaction);
        case 'list':
          return await this.handleListCampaigns(interaction);
        default:
          return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: '❌ Invalid campaign command. Use `/campaign create` or `/campaign list`',
              flags: MessageFlags.Ephemeral
            }
          };
      }
    } catch (error) {
      console.error('Error handling campaign command:', error);
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ An error occurred while processing the campaign command.',
          flags: MessageFlags.Ephemeral
        }
      };
    }
  }

  /**
   * Handle /character command
   */
  private async handleCharacterCommand(interaction: any) {
    const { data } = interaction;
    const subcommand = data.options?.[0]?.name;
    
    try {
      switch (subcommand) {
        case 'create':
          return await this.handleCreateCharacter(interaction);
        case 'sheet':
          return await this.handleViewCharacterSheet(interaction);
        default:
          return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: '❌ Invalid character command. Use `/character create` or `/character sheet`',
              flags: MessageFlags.Ephemeral
            }
          };
      }
    } catch (error) {
      console.error('Error handling character command:', error);
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ An error occurred while processing the character command.',
          flags: MessageFlags.Ephemeral
        }
      };
    }
  }

  /**
   * Handle creating a new Discord scheduled event
   */
  private async handleCreateEvent(interaction: any) {
    const { data, guild_id } = interaction;
    const options = data.options?.[0]?.options || [];
    
    const name = options.find((opt: any) => opt.name === 'name')?.value;
    const description = options.find((opt: any) => opt.name === 'description')?.value || '';
    
    if (!name) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Event name is required!',
          flags: MessageFlags.Ephemeral
        }
      };
    }

    if (!guild_id) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ This command can only be used in a Discord server!',
          flags: MessageFlags.Ephemeral
        }
      };
    }

    try {
      const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
      if (!botToken) {
        throw new Error('Discord bot token not configured');
      }

      // Calculate start time (1 hour from now)
      const startTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      
      // Create Discord scheduled event via API
      const eventData = {
        name: name,
        description: description,
        scheduled_start_time: startTime,
        privacy_level: GuildScheduledEventPrivacyLevel.GuildOnly,
        entity_type: GuildScheduledEventEntityType.External, // External event (no specific voice/stage channel)
        entity_metadata: {
          location: 'Virtual Tabletop' // Required for external events
        }
      };

      const response = await fetch(`https://discord.com/api/v10/guilds/${guild_id}/scheduled-events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Discord API error:', error);
        throw new Error(`Discord API responded with ${response.status}`);
      }

      const event = await response.json() as { id: string };
      
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `✅ Created event **${name}**!\n📅 Starts: <t:${Math.floor(new Date(startTime).getTime() / 1000)}:F>\n🔗 [View Event](https://discord.com/events/${guild_id}/${event.id})`,
          flags: MessageFlags.Ephemeral
        }
      };

    } catch (error) {
      console.error('Error creating Discord event:', error);
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Failed to create Discord event. Please try again later.',
          flags: MessageFlags.Ephemeral
        }
      };
    }
  }

  /**
   * Handle listing Discord scheduled events
   */
  private async handleListEvents(interaction: any) {
    const { guild_id } = interaction;
    
    if (!guild_id) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ This command can only be used in a Discord server!',
          flags: MessageFlags.Ephemeral
        }
      };
    }

    try {
      const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
      if (!botToken) {
        throw new Error('Discord bot token not configured');
      }

      const response = await fetch(`https://discord.com/api/v10/guilds/${guild_id}/scheduled-events`, {
        headers: {
          'Authorization': `Bot ${botToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Discord API responded with ${response.status}`);
      }

      const events = await response.json() as Array<{ id: string; name: string; scheduled_start_time: string }>;
      
      if (events.length === 0) {
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: '📅 No scheduled events found in this server.',
            flags: MessageFlags.Ephemeral
          }
        };
      }

      const eventList = events.map((event) => {
        const startTime = `<t:${Math.floor(new Date(event.scheduled_start_time).getTime() / 1000)}:F>`;
        return `• **${event.name}** - ${startTime}`;
      }).join('\n');

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `📅 **Scheduled Events:**\n${eventList}`,
          flags: MessageFlags.Ephemeral
        }
      };

    } catch (error) {
      console.error('Error listing Discord events:', error);
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Failed to fetch Discord events. Please try again later.',
          flags: MessageFlags.Ephemeral
        }
      };
    }
  }

  /**
   * Handle creating a new campaign
   */
  private async handleCreateCampaign(interaction: any) {
    const discordUserId = interaction.member?.user?.id || interaction.user?.id;
    
    if (!discordUserId) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Could not identify Discord user!',
          flags: MessageFlags.Ephemeral
        }
      };
    }

    try {
      // Find or create user
      let user = await this.userService.getUserByDiscordId(discordUserId);
      if (!user) {
        user = await this.userService.createUser({
          discord_id: discordUserId,
          name: interaction.member?.user?.username || interaction.user?.username || 'Unknown User',
          email: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Create campaign
      const campaign = await this.campaignService.create({
        title: `${user.name}'s Campaign`,
        description: 'Campaign created via Discord bot',
        gm_ids: [user.id],
        player_ids: [],
        data: JSON.stringify({
          user_id: user.id, // Link to database user ID
          dm_discord_id: discordUserId,
          guild_id: interaction.guild_id,
          system: 'D&D 5e',
          status: 'planning'
        }),
        created_at: new Date(),
        updated_at: new Date(),
        is_active: true
      });

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `🎲 Created campaign **${campaign.title}**!\n📋 Campaign ID: \`${campaign.id}\`\n🎯 You can now manage your campaign through the Crit-Fumble dashboard.`,
          flags: MessageFlags.Ephemeral
        }
      };

    } catch (error) {
      console.error('Error creating campaign:', error);
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Failed to create campaign. Please try again later.',
          flags: MessageFlags.Ephemeral
        }
      };
    }
  }

  /**
   * Handle listing user's campaigns
   */
  private async handleListCampaigns(interaction: any) {
    const discordUserId = interaction.member?.user?.id || interaction.user?.id;
    
    if (!discordUserId) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Could not identify Discord user!',
          flags: MessageFlags.Ephemeral
        }
      };
    }

    try {
      const campaigns = await this.campaignService.getByGmId(discordUserId);
      
      if (campaigns.length === 0) {
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: '🎲 You don\'t have any campaigns yet. Use `/campaign create` to create one!',
            flags: MessageFlags.Ephemeral
          }
        };
      }

      const campaignList = campaigns.map((campaign: any) => {
        return `• **${campaign.title}** (ID: \`${campaign.id}\`)`;
      }).join('\n');

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `🎲 **Your Campaigns:**\n${campaignList}`,
          flags: MessageFlags.Ephemeral
        }
      };

    } catch (error) {
      console.error('Error listing campaigns:', error);
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Failed to fetch campaigns. Please try again later.',
          flags: MessageFlags.Ephemeral
        }
      };
    }
  }

  /**
   * Handle creating a new character sheet
   */
  private async handleCreateCharacter(interaction: any) {
    const discordUserId = interaction.member?.user?.id || interaction.user?.id;
    
    if (!discordUserId) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Could not identify Discord user!',
          flags: MessageFlags.Ephemeral
        }
      };
    }

    try {
      // Find or create user
      let user = await this.userService.getUserByDiscordId(discordUserId);
      if (!user) {
        user = await this.userService.createUser({
          discord_id: discordUserId,
          name: interaction.member?.user?.username || interaction.user?.username || 'Unknown User',
          email: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Create character sheet
      const sheet = await this.sheetService.createSheet({
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

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `⚔️ Created character sheet **${sheet.title}**!\n📋 Sheet ID: \`${sheet.id}\`\n🎯 Visit the Crit-Fumble dashboard to complete your character details.`,
          flags: MessageFlags.Ephemeral
        }
      };

    } catch (error) {
      console.error('Error creating character sheet:', error);
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Failed to create character sheet. Please try again later.',
          flags: MessageFlags.Ephemeral
        }
      };
    }
  }

  /**
   * Handle viewing character sheet
   */
  private async handleViewCharacterSheet(interaction: any) {
    const discordUserId = interaction.member?.user?.id || interaction.user?.id;
    
    if (!discordUserId) {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Could not identify Discord user!',
          flags: MessageFlags.Ephemeral
        }
      };
    }

    try {
      // First get user by discord ID to get their user ID
      const user = await this.userService.getUserByDiscordId(discordUserId);
      if (!user) {
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: '⚔️ You don\'t have any character sheets yet. Use `/character create` to create one!',
            flags: MessageFlags.Ephemeral
          }
        };
      }

      const sheets = await this.sheetService.getByUserId(user.id);
      
      if (sheets.length === 0) {
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: '⚔️ You don\'t have any character sheets yet. Use `/character create` to create one!',
            flags: MessageFlags.Ephemeral
          }
        };
      }

      const sheetList = sheets.map((sheet: any) => {
        const characterData = sheet.data as any;
        const level = characterData?.level || 1;
        const characterClass = characterData?.class || 'Unknown';
        const race = characterData?.race || 'Unknown';
        
        return `• **${sheet.title}** - Level ${level} ${race} ${characterClass} (ID: \`${sheet.id}\`)`;
      }).join('\n');

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `⚔️ **Your Characters:**\n${sheetList}`,
          flags: MessageFlags.Ephemeral
        }
      };

    } catch (error) {
      console.error('Error viewing character sheets:', error);
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Failed to fetch character sheets. Please try again later.',
          flags: MessageFlags.Ephemeral
        }
      };
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    await this.prisma.$disconnect();
  }
}