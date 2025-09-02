/**
 * Discord Controller
 * Handles HTTP endpoints for Discord-related operations
 */

// Generic HTTP interfaces instead of Next.js dependencies
interface HttpRequest {
  query?: Record<string, string | string[]>;
  body?: any;
  headers?: Record<string, string | string[]>;
}

interface HttpResponse {
  status(code: number): {
    json(body: any): void;
    send(body: any): void;
  };
}
import { 
  ApiResponse,
  CommandOptions,
  GuildScheduledEvent,
  ActivityRequest
} from '../../models/DiscordTypes';
import { DiscordEventService } from '../services/DiscordEventService';
import { DiscordBotService } from '../services/DiscordBotService';
import { DiscordAuthService, DiscordAuthResult } from '../services/DiscordAuthService';

export class DiscordController {
  private eventService: DiscordEventService;
  private botService: DiscordBotService;
  private authService: DiscordAuthService;

  /**
   * Initialize Discord Controller with required services
   * @param eventService Optional custom DiscordEventService for testing
   * @param botService Optional custom DiscordBotService for testing
   * @param authService Optional custom DiscordAuthService for testing
   */
  constructor(
    eventService?: DiscordEventService, 
    botService?: DiscordBotService,
    authService?: DiscordAuthService
  ) {
    this.eventService = eventService || new DiscordEventService();
    this.botService = botService || new DiscordBotService();
    this.authService = authService || new DiscordAuthService();
  }

  /**
   * Initialize controller and underlying services
   */
  async initialize(): Promise<void> {
    await Promise.all([
      this.eventService.initialize(),
      this.botService.initialize(),
      this.authService.initialize()
    ]);
  }

  /**
   * Handle GET requests for guild events
   * @param req Next.js API request
   * @param res Next.js API response
   */
  async getGuildEvents(req: HttpRequest, res: HttpResponse): Promise<void> {
    const guildId = req.query?.guildId;
    
    const response = await this.eventService.getGuildEvents(
      Array.isArray(guildId) ? guildId[0] : guildId as string
    );
    
    res.status(response.success ? 200 : 500).json(response);
  }
  
  /**
   * Handle POST requests to create guild events
   * @param req Next.js API request
   * @param res Next.js API response
   */
  async createGuildEvent(req: HttpRequest, res: HttpResponse): Promise<void> {
    const guildId = req.query?.guildId;
    const eventData = req.body as Partial<GuildScheduledEvent>;
    
    if (!guildId) {
      res.status(400).json({ 
        success: false, 
        error: 'Guild ID is required' 
      });
      return;
    }
    
    const response = await this.eventService.createGuildEvent(
      guildId as string,
      eventData
    );
    
    res.status(response.success ? 201 : 500).json(response);
  }
  
  /**
   * Handle PUT requests to update guild events
   * @param req Next.js API request
   * @param res Next.js API response
   */
  async updateGuildEvent(req: HttpRequest, res: HttpResponse): Promise<void> {
    const guildId = req.query?.guildId;
    const eventId = req.query?.eventId;
    const eventData = req.body as Partial<GuildScheduledEvent>;
    
    if (!guildId || !eventId) {
      res.status(400).json({ 
        success: false, 
        error: 'Guild ID and Event ID are required' 
      });
      return;
    }
    
    const response = await this.eventService.updateGuildEvent(
      guildId as string,
      eventId as string,
      eventData
    );
    
    res.status(response.success ? 200 : 500).json(response);
  }
  
  /**
   * Handle DELETE requests to remove guild events
   * @param req Next.js API request
   * @param res Next.js API response
   */
  async deleteGuildEvent(req: HttpRequest, res: HttpResponse): Promise<void> {
    const guildId = req.query?.guildId;
    const eventId = req.query?.eventId;
    
    if (!guildId || !eventId) {
      res.status(400).json({ 
        success: false, 
        error: 'Guild ID and Event ID are required' 
      });
      return;
    }
    
    const response = await this.eventService.deleteGuildEvent(
      guildId as string,
      eventId as string
    );
    
    res.status(response.success ? 200 : 500).json(response);
  }
  
  /**
   * Handle POST requests to register bot commands
   * @param req Next.js API request
   * @param res Next.js API response
   */
  async registerCommand(req: HttpRequest, res: HttpResponse): Promise<void> {
    const guildId = req.query?.guildId;
    const commandData = req.body as CommandOptions;
    
    if (!guildId) {
      res.status(400).json({ 
        success: false, 
        error: 'Guild ID is required' 
      });
      return;
    }
    
    const response = await this.botService.registerCommand(
      guildId as string,
      commandData
    );
    
    res.status(response.success ? 201 : 500).json(response);
  }
  
  /**
   * Handle GET requests for bot commands
   * @param req Next.js API request
   * @param res Next.js API response
   */
  async getCommands(req: HttpRequest, res: HttpResponse): Promise<void> {
    const guildId = req.query?.guildId;
    
    const response = await this.botService.getCommands(guildId as string);
    
    res.status(response.success ? 200 : 500).json(response);
  }
  
  /**
   * Handle POST requests to send channel messages
   * @param req Next.js API request
   * @param res Next.js API response
   */
  async sendChannelMessage(req: HttpRequest, res: HttpResponse): Promise<void> {
    const channelId = req.query?.channelId;
    const { message } = req.body;
    
    if (!channelId || !message) {
      res.status(400).json({ 
        success: false, 
        error: 'Channel ID and message are required' 
      });
      return;
    }
    
    const response = await this.botService.sendChannelMessage(
      channelId as string,
      message
    );
    
    res.status(response.success ? 200 : 500).json(response);
  }
  
  /**
   * Handle POST requests for Discord activity interactions
   * @param req Next.js API request
   * @param res Next.js API response
   */
  async handleActivityRequest(req: HttpRequest, res: HttpResponse): Promise<void> {
    const activityRequest = req.body as ActivityRequest;
    
    if (!activityRequest.activity || !activityRequest.action) {
      res.status(400).json({ 
        success: false, 
        error: 'Activity and action are required' 
      });
      return;
    }
    
    const response = await this.botService.processActivityRequest(activityRequest);
    
    res.status(response.processed ? 200 : 500).json(response);
  }
  
  /**
   * Get authorization URL for Discord OAuth
   * @param req HTTP request
   * @param res HTTP response
   */
  getAuthUrl(req: HttpRequest, res: HttpResponse): void {
    const redirectUri = req.query?.redirectUri as string;
    const scope = req.query?.scope as string || 'identify email guilds';
    const state = req.query?.state as string;
    
    if (!redirectUri) {
      res.status(400).json({
        success: false,
        error: 'Redirect URI is required'
      });
      return;
    }
    
    try {
      const authUrl = this.authService.getAuthorizationUrl(redirectUri, scope, state);
      res.status(200).json({
        success: true,
        url: authUrl
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate auth URL'
      });
    }
  }
  
  /**
   * Handle OAuth callback with code exchange
   * @param req HTTP request
   * @param res HTTP response
   */
  async handleAuthCallback(req: HttpRequest, res: HttpResponse): Promise<void> {
    const code = req.query?.code as string;
    const redirectUri = req.query?.redirectUri as string;
    
    if (!code || !redirectUri) {
      res.status(400).json({
        success: false,
        error: 'Authorization code and redirect URI are required'
      });
      return;
    }
    
    try {
      const authResult = await this.authService.exchangeCode(code, redirectUri);
      if (authResult.success) {
        res.status(200).json(authResult);
      } else {
        res.status(401).json(authResult);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      });
    }
  }
  
  /**
   * Refresh an OAuth token
   * @param req HTTP request
   * @param res HTTP response
   */
  async refreshToken(req: HttpRequest, res: HttpResponse): Promise<void> {
    const refreshToken = req.body?.refresh_token;
    
    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
      return;
    }
    
    try {
      const result = await this.authService.refreshToken(refreshToken);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed'
      });
    }
  }
  
  /**
   * Get user guilds
   * @param req HTTP request
   * @param res HTTP response
   */
  async getUserGuilds(req: HttpRequest, res: HttpResponse): Promise<void> {
    const accessToken = req.headers?.authorization?.toString().replace('Bearer ', '');
    
    if (!accessToken) {
      res.status(401).json({
        success: false,
        error: 'Authorization token is required'
      });
      return;
    }
    
    try {
      const result = await this.authService.getUserGuilds(accessToken);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user guilds'
      });
    }
  }
  
  /**
   * Revoke an OAuth token
   * @param req HTTP request
   * @param res HTTP response
   */
  async revokeToken(req: HttpRequest, res: HttpResponse): Promise<void> {
    const token = req.body?.token;
    
    if (!token) {
      res.status(400).json({
        success: false,
        error: 'Token is required'
      });
      return;
    }
    
    try {
      const result = await this.authService.revokeToken(token);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to revoke token'
      });
    }
  }
}
