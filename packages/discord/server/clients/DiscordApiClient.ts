import { Client, ClientOptions, Guild, Channel, User, GuildMember, TextChannel, Message, MessageCreateOptions } from 'discord.js';
import { IDiscordClient, DiscordClientAdapter } from '../../models/DiscordClientInterface';
import { getDiscordConfig, DiscordConfig } from '../configs/config';
import { ApiResponse, DiscordGuild, DiscordChannel } from '../../models/DiscordTypes';
import { DiscordUser, DiscordOAuthTokens } from '@crit-fumble/discord/models/DiscordUser';

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
  
  /**
   * Default redirect URI for OAuth
   */
  redirectUri?: string;
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
  private redirectUri?: string;
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
      this.redirectUri = clientConfig.redirectUri || config.redirectUri;
    } catch (e) {
      // If config isn't set yet, use only the provided client config
      this.botToken = clientConfig.botToken || '';
      this.clientId = clientConfig.clientId || '';
      this.clientSecret = clientConfig.clientSecret || '';
      this.defaultGuildId = clientConfig.defaultGuildId;
      this.redirectUri = clientConfig.redirectUri;
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
  
  /**
   * Generate an OAuth authorization URL for Discord
   * @param redirectUri Optional redirect URI, falls back to default
   * @param scope OAuth scopes to request
   * @param state Optional state parameter for CSRF protection
   * @returns Authorization URL
   */
  getAuthorizationUrl(redirectUri?: string, scope = 'identify email guilds', state?: string): string {
    if (!this.clientId) {
      throw new Error('Discord client ID not configured');
    }
    
    const useRedirect = redirectUri || this.redirectUri;
    if (!useRedirect) {
      throw new Error('No redirect URI provided and no default configured');
    }
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: useRedirect,
      response_type: 'code',
      scope
    });

    if (state) {
      params.append('state', state);
    }

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }
  
  /**
   * Exchange authorization code for Discord OAuth tokens
   * @param code Authorization code from OAuth redirect
   * @param redirectUri Redirect URI used for authorization
   * @returns API response with token data
   */
  async exchangeOAuthCode(code: string, redirectUri?: string): Promise<ApiResponse<DiscordOAuthTokens>> {
    try {
      if (!this.clientId || !this.clientSecret) {
        return this.createApiResponse<DiscordOAuthTokens>(false, {} as DiscordOAuthTokens, 'Discord client credentials not configured');
      }
      
      const useRedirect = redirectUri || this.redirectUri;
      if (!useRedirect) {
        return this.createApiResponse<DiscordOAuthTokens>(false, {} as DiscordOAuthTokens, 'No redirect URI provided and no default configured');
      }

      const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: useRedirect
        }).toString()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Discord API error exchanging code: ${response.status} ${errorText}`);
        return this.createApiResponse<DiscordOAuthTokens>(false, {} as DiscordOAuthTokens, `Failed to exchange code: ${response.status} ${errorText}`);
      }

      const tokenData = await response.json() as Record<string, any>;
      if (!tokenData || typeof tokenData !== 'object' || !('access_token' in tokenData) || !('token_type' in tokenData)) {
        console.error('Invalid token response format:', tokenData);
        return this.createApiResponse<DiscordOAuthTokens>(false, {} as DiscordOAuthTokens, 'Invalid token response from Discord');
      }
      
      // Format the token data
      const tokens: DiscordOAuthTokens = {
        access_token: String(tokenData.access_token),
        token_type: String(tokenData.token_type),
        expires_in: Number(tokenData.expires_in || 0),
        refresh_token: String(tokenData.refresh_token || ''),
        scope: String(tokenData.scope || '')
      };

      return this.createApiResponse(true, tokens);
    } catch (error) {
      console.error('Error exchanging OAuth code:', error);
      return this.createApiResponse<DiscordOAuthTokens>(false, {} as DiscordOAuthTokens, error instanceof Error ? error.message : 'Unknown error during authentication');
    }
  }
  
  /**
   * Get current user data using OAuth access token
   * @param accessToken OAuth access token
   * @param tokenType Token type (e.g., "Bearer")
   * @returns API response with user data
   */
  async getUserByOAuthToken(accessToken: string, tokenType = 'Bearer'): Promise<ApiResponse<DiscordUser>> {
    try {
      // Validate input
      if (!accessToken) {
        return this.createApiResponse<DiscordUser>(false, {} as DiscordUser, 'Access token is required');
      }
      
      // Ensure token type has proper capitalization
      const formattedTokenType = tokenType.charAt(0).toUpperCase() + tokenType.slice(1).toLowerCase();
      
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `${formattedTokenType} ${accessToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Discord API error fetching user data: ${response.status} ${errorText}`);
        return this.createApiResponse<DiscordUser>(false, {} as DiscordUser, `Failed to fetch user data: ${response.status}`);
      }

      const userData = await response.json() as Record<string, any>;
      
      // Map to DiscordUser interface
      const user: DiscordUser = {
        id: userData.id,
        username: userData.username,
        global_name: userData.global_name,
        discriminator: userData.discriminator,
        avatar: userData.avatar,
        email: userData.email,
        verified: userData.verified,
        banner: userData.banner,
        accent_color: userData.accent_color,
        premium_type: userData.premium_type,
        public_flags: userData.public_flags,
        flags: userData.flags,
        locale: userData.locale,
        mfa_enabled: userData.mfa_enabled,
        // Add computed avatar URL
        image_url: userData.avatar ? 
          `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : 
          undefined,
        provider: 'discord'
      };

      return this.createApiResponse(true, user);
    } catch (error) {
      console.error('Error fetching user by OAuth token:', error);
      return this.createApiResponse<DiscordUser>(false, {} as DiscordUser, error instanceof Error ? error.message : 'Unknown error fetching user data');
    }
  }
  
  /**
   * Get user guilds using OAuth access token
   * @param accessToken OAuth access token
   * @param tokenType Token type (e.g., "Bearer")
   * @returns API response with guilds data
   */
  async getUserGuilds(accessToken: string, tokenType = 'Bearer'): Promise<ApiResponse<DiscordGuild[]>> {
    try {
      // Validate input
      if (!accessToken) {
        return this.createApiResponse<DiscordGuild[]>(false, [], 'Access token is required');
      }
      
      // Ensure token type has proper capitalization
      const formattedTokenType = tokenType.charAt(0).toUpperCase() + tokenType.slice(1).toLowerCase();
      
      const response = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          Authorization: `${formattedTokenType} ${accessToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Discord API error fetching guilds: ${response.status} ${errorText}`);
        return this.createApiResponse<DiscordGuild[]>(false, [], `Failed to fetch guilds: ${response.status} ${errorText}`);
      }

      const guildsData = await response.json();
      if (!Array.isArray(guildsData)) {
        console.warn('Discord API returned non-array for guilds:', guildsData);
        return this.createApiResponse(true, []);
      }
      
      // Map the raw guild data to our DiscordGuild interface
      const guilds: DiscordGuild[] = guildsData.map(g => ({
        id: g.id,
        name: g.name,
        icon: g.icon || undefined,
        owner_id: g.owner_id,
        features: g.features,
        permissions: g.permissions
      }));

      return this.createApiResponse(true, guilds);
    } catch (error) {
      console.error('Error fetching guilds:', error);
      return this.createApiResponse<DiscordGuild[]>(false, [], error instanceof Error ? error.message : 'Unknown error fetching guilds');
    }
  }
  
  /**
   * Refresh OAuth token using refresh token
   * @param refreshToken Refresh token from previous authentication
   * @returns API response with new token data
   */
  async refreshOAuthToken(refreshToken: string): Promise<ApiResponse<DiscordOAuthTokens>> {
    try {
      if (!this.clientId || !this.clientSecret) {
        return this.createApiResponse<DiscordOAuthTokens>(false, {} as DiscordOAuthTokens, 'Discord client credentials not configured');
      }

      const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }).toString()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Discord API error refreshing token: ${response.status} ${errorText}`);
        return this.createApiResponse<DiscordOAuthTokens>(false, {} as DiscordOAuthTokens, `Failed to refresh token: ${response.status} ${errorText}`);
      }

      const tokenData = await response.json() as Record<string, any>;
      if (!tokenData || typeof tokenData !== 'object' || !('access_token' in tokenData) || !('token_type' in tokenData)) {
        console.error('Invalid token response format:', tokenData);
        return this.createApiResponse<DiscordOAuthTokens>(false, {} as DiscordOAuthTokens, 'Invalid token response from Discord');
      }
      
      // Format the token data
      const tokens: DiscordOAuthTokens = {
        access_token: String(tokenData.access_token),
        token_type: String(tokenData.token_type),
        expires_in: Number(tokenData.expires_in || 0),
        refresh_token: String(tokenData.refresh_token || ''),
        scope: String(tokenData.scope || '')
      };

      return this.createApiResponse(true, tokens);
    } catch (error) {
      console.error('Error refreshing OAuth token:', error);
      return this.createApiResponse<DiscordOAuthTokens>(false, {} as DiscordOAuthTokens, error instanceof Error ? error.message : 'Unknown error during token refresh');
    }
  }
  
  /**
   * Revoke an OAuth token
   * @param token Token to revoke
   * @returns API response indicating success or failure
   */
  async revokeOAuthToken(token: string): Promise<ApiResponse<void>> {
    try {
      if (!this.clientId || !this.clientSecret) {
        return this.createApiResponse(false, undefined, 'Discord client credentials not configured');
      }

      const response = await fetch('https://discord.com/api/oauth2/token/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          token
        }).toString()
      });

      return this.createApiResponse(response.ok);
    } catch (error) {
      console.error('Error revoking OAuth token:', error);
      return this.createApiResponse(false, undefined, error instanceof Error ? error.message : 'Unknown error revoking token');
    }
  }
}