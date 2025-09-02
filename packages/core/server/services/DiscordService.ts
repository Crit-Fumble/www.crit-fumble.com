import { 
  DiscordApiClient, 
  DiscordBotService, 
  DiscordEventService,
  DiscordApiClientConfig,
  DiscordGuild,
  ApiResponse
} from '@crit-fumble/discord';
import { IDiscordService } from '../../models/discord/IDiscordService';
import { ConfigRegistry } from '../config/registry';

/**
 * Core implementation of Discord service integration
 */
export class DiscordService implements IDiscordService {
  private apiClient: DiscordApiClient;
  private botService: DiscordBotService;
  private eventService: DiscordEventService;
  private initialized = false;

  /**
   * Create a new Discord service
   */
  constructor() {
    // Get configuration from the registry
    const registry = ConfigRegistry.getInstance();
    
    // Create client config from registry values
    const clientConfig: DiscordApiClientConfig = {
      botToken: registry.get<string>('DISCORD_PERSISTENT_BOT_TOKEN', ''),
      clientId: registry.get<string>('DISCORD_PERSISTENT_APP_ID', ''),
      clientSecret: registry.get<string>('DISCORD_PERSISTENT_SECRET', ''),
      defaultGuildId: registry.get<string>('DISCORD_DEFAULT_GUILD_ID', '')
    };
    
    // Initialize client and services
    this.apiClient = new DiscordApiClient(clientConfig);
    this.botService = new DiscordBotService(this.apiClient);
    this.eventService = new DiscordEventService(this.apiClient);
  }

  /**
   * Initialize the Discord service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    try {
      await this.apiClient.initialize();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Discord service:', error);
      throw error;
    }
  }

  /**
   * Get the Discord API client
   */
  getApiClient(): DiscordApiClient {
    return this.apiClient;
  }

  /**
   * Get the Discord bot service
   */
  getBotService(): DiscordBotService {
    return this.botService;
  }

  /**
   * Get the Discord event service
   */
  getEventService(): DiscordEventService {
    return this.eventService;
  }

  /**
   * Get information about a guild
   */
  async getGuild(guildId?: string): Promise<ApiResponse<DiscordGuild>> {
    try {
      const guild = await this.apiClient.getGuild(guildId);
      return this.apiClient.createApiResponse(true, this.apiClient.mapToDiscordGuild(guild));
    } catch (error) {
      console.error('Failed to get guild:', error);
      return this.apiClient.createApiResponse(false, undefined, (error as Error).message);
    }
  }

  /**
   * Send a message to a channel
   */
  async sendMessage(channelId: string, content: string | object): Promise<ApiResponse<any>> {
    try {
      const message = await this.apiClient.sendMessage(channelId, content);
      return this.apiClient.createApiResponse(true, message);
    } catch (error) {
      console.error('Failed to send message:', error);
      return this.apiClient.createApiResponse(false, undefined, (error as Error).message);
    }
  }

  /**
   * Get scheduled events for a guild
   */
  async getGuildEvents(guildId?: string): Promise<ApiResponse<any[]>> {
    return await this.eventService.getGuildEvents(guildId);
  }

  /**
   * Create a scheduled event for a guild
   */
  async createGuildEvent(guildId: string, eventData: any): Promise<ApiResponse<any>> {
    return await this.eventService.createGuildEvent(guildId, eventData);
  }

  /**
   * Register a bot command
   */
  async registerCommand(guildId: string, command: any): Promise<ApiResponse<any>> {
    return await this.botService.registerCommand(guildId, command);
  }
}
