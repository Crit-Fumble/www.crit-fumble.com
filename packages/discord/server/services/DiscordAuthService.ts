/**
 * Discord Auth Service
 * Handles Discord OAuth authentication processes
 * Uses DiscordApiClient for API communication
 */

import { DiscordApiClient } from '../clients/DiscordApiClient';
import { ApiResponse, DiscordGuild } from '../../models/DiscordTypes';
import { DiscordUser, DiscordOAuthTokens } from '../../models/DiscordUser';

export interface DiscordAuthResult {
  success: boolean;
  user?: {
    id: string;
    username: string;
    discriminator?: string;
    avatar?: string;
    email?: string;
  };
  token?: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
  };
  error?: string;
}

export interface OAuthOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
}

export class DiscordAuthService {
  private apiClient: DiscordApiClient;

  /**
   * Initialize Discord Auth Service
   * @param configOptions Optional configuration options
   * @param customClient Optional custom Discord client for testing
   */
  constructor(configOptions?: {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
  }, customClient?: any) {
    // Create the Discord API client
    this.apiClient = new DiscordApiClient({
      clientId: configOptions?.clientId,
      clientSecret: configOptions?.clientSecret,
      redirectUri: configOptions?.redirectUri
    }, customClient);
  }

  /**
   * Initialize the auth service
   */
  async initialize(): Promise<void> {
    await this.apiClient.initialize();
  }

  /**
   * Get OAuth2 authorization URL for Discord login
   * @param redirectUri URI to redirect after authentication
   * @param scope Requested OAuth scopes
   * @param state Optional state parameter for security
   * @returns URL to redirect user to for Discord OAuth
   */
  getAuthorizationUrl(redirectUri: string, scope = 'identify email guilds', state?: string): string {
    return this.apiClient.getAuthorizationUrl(redirectUri, scope, state);
  }

  /**
   * Exchange auth code for access token
   * @param code Authorization code from Discord OAuth
   * @param redirectUri Redirect URI used in initial request
   * @returns Authentication result with token and user data
   */
  async exchangeCode(code: string, redirectUri: string): Promise<DiscordAuthResult> {
    try {
      // Exchange code for token using the API client
      const tokenResult = await this.apiClient.exchangeOAuthCode(code, redirectUri);
      
      if (!tokenResult.success || !tokenResult.data) {
        return {
          success: false,
          error: tokenResult.error || 'Failed to exchange code'
        };
      }
      
      const token = tokenResult.data;
      
      // Get user information using the token
      const userResult = await this.apiClient.getUserByOAuthToken(
        token.access_token,
        token.token_type
      );
      
      if (!userResult.success || !userResult.data) {
        return {
          success: false,
          error: userResult.error || 'Failed to fetch user data',
          token
        };
      }
      
      const user = userResult.data;
      
      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          discriminator: user.discriminator || '',
          avatar: user.avatar,
          email: user.email
        }
      };
    } catch (error) {
      console.error('Error in exchangeCode:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during authentication'
      };
    }
  }

  /**
   * Refresh an existing OAuth token
   * @param refreshToken Refresh token from previous auth
   * @returns New auth result with refreshed token
   */
  async refreshToken(refreshToken: string): Promise<DiscordAuthResult> {
    try {
      // Use the API client to refresh the token
      const tokenResult = await this.apiClient.refreshOAuthToken(refreshToken);
      
      if (!tokenResult.success || !tokenResult.data) {
        return {
          success: false,
          error: tokenResult.error || 'Failed to refresh token'
        };
      }
      
      return {
        success: true,
        token: tokenResult.data
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during token refresh'
      };
    }
  }

  /**
   * Revoke an access token
   * @param token The token to revoke
   * @returns Success status of the revocation
   */
  async revokeToken(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Use the API client to revoke the token
      const result = await this.apiClient.revokeOAuthToken(token);
      return {
        success: result.success,
        error: result.error
      };
    } catch (error) {
      console.error('Error revoking token:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error revoking token'
      };
    }
  }

  /**
   * Get user guilds (servers) using access token
   * @param accessToken User's Discord access token
   * @param tokenType Optional token type, defaults to 'Bearer'
   * @returns List of guilds the user is a member of
   */
  async getUserGuilds(accessToken: string, tokenType = 'Bearer'): Promise<ApiResponse<DiscordGuild[]>> {
    try {
      // Use the API client to get the user's guilds
      return await this.apiClient.getUserGuilds(accessToken, tokenType);
    } catch (error) {
      console.error('Error fetching user guilds:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error fetching guilds'
      };
    }
  }
  
  /**
   * Get Discord user profile using access token
   * @param accessToken Access token from OAuth
   * @param tokenType Token type (Bearer, etc)
   * @returns User profile information
   */
  async getUserProfile(accessToken: string, tokenType = 'Bearer'): Promise<ApiResponse<DiscordUser>> {
    return this.apiClient.getUserByOAuthToken(accessToken, tokenType);
  }
}
