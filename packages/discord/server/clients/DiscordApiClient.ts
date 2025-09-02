import { Client, ClientOptions, Guild, Channel, User, GuildMember, TextChannel, Message, MessageCreateOptions } from 'discord.js';
import { IDiscordClient, DiscordClientAdapter } from '../../models/DiscordClientInterface';
import { getDiscordConfig, DiscordConfig } from '../configs/config';
import { DiscordGuild, DiscordUser, DiscordChannel, ApiResponse } from '../../models/DiscordTypes';

export interface DiscordApiClientConfig {
  /**
   * Discord Bot Token
   */
  botToken?: string;

  /**
   * Discord Client ID
   */
  clientId?: string;

  /**
   * Discord Client Secret
   */
  clientSecret?: string;
  
  /**
   * Default Guild ID
   */
  defaultGuildId?: string;
}

/**
 * Discord API Client
 * Client for interacting with the Discord API using discord.js
 */
export class DiscordApiClient {
  private client: IDiscordClient;
  private botToken: string;
  private clientId: string;
  private clientSecret: string;
  private defaultGuildId?: string;
  private isReady: boolean = false;

  /**
   * Create a new DiscordApiClient
   * @param clientConfig Optional configuration options
   * @param customClient Optional custom client for testing/mocking
   */
  constructor(clientConfig: DiscordApiClientConfig = {}, customClient?: IDiscordClient) {
    // Get the config either from params or the configured instance
    try {
      const config = getDiscordConfig();
      this.botToken = clientConfig.botToken || config.botToken;
      this.clientId = clientConfig.clientId || config.clientId;
      this.clientSecret = clientConfig.clientSecret || config.clientSecret;
      this.defaultGuildId = clientConfig.defaultGuildId || config.defaultGuildId;
    } catch (e) {
      // If config isn't set yet, use only the provided client config
      this.botToken = clientConfig.botToken || '';
      this.clientId = clientConfig.clientId || '';
      this.clientSecret = clientConfig.clientSecret || '';
      this.defaultGuildId = clientConfig.defaultGuildId;
    }
    
    // Use the provided client (for tests) or initialize a new one
    if (customClient) {
      this.client = customClient;
    } else {
      // Initialize the Discord.js client with intents
      this.client = new DiscordClientAdapter({
        intents: [
          'Guilds', 
          'GuildMembers', 
          'GuildMessages', 
          'MessageContent',
          'GuildVoiceStates',
          'DirectMessages'
        ]
      });
      
      // Set up ready event listener
      this.client.once('ready', () => {
        this.isReady = true;
        console.log('Discord client is ready!');
      });
    }
  }

  /**
   * Initialize the Discord client and log in with the bot token
   * @returns Promise resolving to the client
   */
  async initialize(): Promise<IDiscordClient> {
    try {
      if (!this.isReady) {
        await this.client.login(this.botToken);
      }
      return this.client;
    } catch (error) {
      console.error('Failed to initialize Discord client:', error);
      throw error;
    }
  }

  /**
   * Get the raw Discord.js client
   * @returns The underlying Discord.js client instance
   */
  getRawClient(): IDiscordClient {
    return this.client;
  }

  /**
   * Destroy the client connection
   */
  destroy(): void {
    this.client.destroy();
    this.isReady = false;
  }

  /**
   * Fetch a guild by ID
   * @param guildId Guild ID (defaults to the default guild ID if set)
   * @returns Promise resolving to the Guild
   */
  async getGuild(guildId?: string): Promise<Guild> {
    const targetGuildId = guildId || this.defaultGuildId;
    
    if (!targetGuildId) {
      throw new Error('No guild ID provided and no default guild ID set');
    }
    
    try {
      return await this.client.guilds.fetch(targetGuildId);
    } catch (error) {
      console.error(`Failed to fetch guild ${targetGuildId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch a channel by ID
   * @param channelId Channel ID
   * @returns Promise resolving to the Channel
   * @throws Error if channel not found
   */
  async getChannel(channelId: string): Promise<Channel> {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel) {
        throw new Error(`Channel ${channelId} not found`);
      }
      return channel;
    } catch (error) {
      console.error(`Failed to fetch channel ${channelId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch a user by ID
   * @param userId User ID
   * @returns Promise resolving to the User
   */
  async getUser(userId: string): Promise<User> {
    try {
      return await this.client.users.fetch(userId);
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Send a message to a text channel
   * @param channelId Target channel ID
   * @param content Message content or options
   * @returns Promise resolving to the sent message
   */
  async sendMessage(channelId: string, content: string | MessageCreateOptions): Promise<Message> {
    try {
      const channel = await this.getChannel(channelId);
      
      // Check if channel has the send method, which is available on TextChannel
      // This is more robust than instanceof for tests
      if (!channel || typeof (channel as any).send !== 'function') {
        throw new Error(`Channel ${channelId} is not a text channel or does not support sending messages`);
      }
      
      // Cast to TextChannel since we've verified it has the send method
      return await (channel as TextChannel).send(content);
    } catch (error) {
      console.error(`Failed to send message to channel ${channelId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch a guild member
   * @param guildId Guild ID
   * @param userId User ID
   * @returns Promise resolving to the GuildMember
   */
  async getGuildMember(guildId: string, userId: string): Promise<GuildMember> {
    try {
      const guild = await this.client.guilds.fetch(guildId);
      return await guild.members.fetch(userId);
    } catch (error) {
      console.error(`Failed to fetch member ${userId} in guild ${guildId}:`, error);
      throw error;
    }
  }

  /**
   * Convert Discord.js Guild to simplified DiscordGuild type
   * @param guild Guild object from Discord.js
   * @returns Simplified DiscordGuild object
   */
  mapToDiscordGuild(guild: Guild): DiscordGuild {
    return {
      id: guild.id,
      name: guild.name,
      icon: guild.icon || undefined,
      owner_id: guild.ownerId
    };
  }

  /**
   * Convert Discord.js User to simplified DiscordUser type
   * @param user User object from Discord.js
   * @returns Simplified DiscordUser object
   */
  mapToDiscordUser(user: User): DiscordUser {
    return {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar || undefined,
      bot: user.bot
    };
  }

  /**
   * Convert Discord.js Channel to simplified DiscordChannel type
   * @param channel Channel object from Discord.js
   * @returns Simplified DiscordChannel object
   */
  mapToDiscordChannel(channel: Channel): DiscordChannel {
    const guildChannel = channel as any; // Type assertion to access properties
    
    return {
      id: channel.id,
      type: guildChannel.type,
      guild_id: guildChannel.guildId,
      name: guildChannel.name,
      topic: guildChannel.topic,
      parent_id: guildChannel.parentId
    };
  }

  /**
   * Create a standard API response
   * @param success Whether the operation was successful
   * @param data Optional data to include
   * @param error Optional error message
   * @returns ApiResponse object
   */
  createApiResponse<T>(success: boolean, data?: T, error?: string): ApiResponse<T> {
    return {
      success,
      data,
      error
    };
  }
}