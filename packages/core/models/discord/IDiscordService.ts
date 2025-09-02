import { 
  DiscordApiClient,
  DiscordBotService, 
  DiscordEventService,
  DiscordGuild,
  ApiResponse
} from '@crit-fumble/discord';

/**
 * Core interface for Discord service integration
 */
export interface IDiscordService {
  /**
   * Initialize the Discord service
   */
  initialize(): Promise<void>;

  /**
   * Get the underlying Discord API client
   */
  getApiClient(): DiscordApiClient;

  /**
   * Get the underlying Discord bot service
   */
  getBotService(): DiscordBotService;

  /**
   * Get the underlying Discord event service
   */
  getEventService(): DiscordEventService;

  /**
   * Get information about a guild
   */
  getGuild(guildId?: string): Promise<ApiResponse<DiscordGuild>>;

  /**
   * Send a message to a channel
   */
  sendMessage(channelId: string, content: string | object): Promise<ApiResponse<any>>;

  /**
   * Get scheduled events for a guild
   */
  getGuildEvents(guildId?: string): Promise<ApiResponse<any[]>>;

  /**
   * Create a scheduled event for a guild
   */
  createGuildEvent(guildId: string, eventData: any): Promise<ApiResponse<any>>;
  
  /**
   * Register a bot command
   */
  registerCommand(guildId: string, command: any): Promise<ApiResponse<any>>;
}
