/**
 * Discord Auth Service
 * Handles Discord OAuth authentication processes
 */

import { IDiscordClient } from '../../models/DiscordClientInterface';
import { DiscordApiClient } from '../clients/DiscordApiClient';
import { getDiscordConfig } from '../configs/config';

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
  private client: DiscordApiClient;
  private clientId: string;
  private clientSecret: string;

  /**
   * Initialize Discord Auth Service
   * @param customClient Optional custom Discord client for testing
   */
  constructor(customClient?: IDiscordClient) {
    try {
      const config = getDiscordConfig();
      this.clientId = config.clientId;
      this.clientSecret = config.clientSecret;
    } catch (e) {
      this.clientId = '';
      this.clientSecret = '';
    }
    
    this.client = new DiscordApiClient({
      clientId: this.clientId,
      clientSecret: this.clientSecret
    }, customClient);
  }

  /**
   * Initialize the auth service
   */
  async initialize(): Promise<void> {
    await this.client.initialize();
  }

  /**
   * Get OAuth2 authorization URL for Discord login
   * @param redirectUri URI to redirect after authentication
   * @param scope Requested OAuth scopes
   * @param state Optional state parameter for security
   * @returns URL to redirect user to for Discord OAuth
   */
  getAuthorizationUrl(redirectUri: string, scope = 'identify email guilds', state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
    });

    if (state) {
      params.append('state', state);
    }

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Exchange auth code for access token
   * @param code Authorization code from Discord OAuth
   * @param redirectUri Redirect URI used in initial request
   * @returns Authentication result with token and user data
   */
  async exchangeCode(code: string, redirectUri: string): Promise<DiscordAuthResult> {
    try {
      if (!this.clientId || !this.clientSecret) {
        return {
          success: false,
          error: 'Discord client credentials not configured'
        };
      }

      // Exchange code for token using Discord OAuth API
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri
        }).toString()
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        return {
          success: false,
          error: `Failed to exchange code: ${error}`
        };
      }

      const token = await tokenResponse.json();

      // Get user information using the access token
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`
        }
      });

      if (!userResponse.ok) {
        return {
          success: false,
          error: 'Failed to fetch user data',
          token
        };
      }

      const user = await userResponse.json();

      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          discriminator: user.discriminator,
          avatar: user.avatar,
          email: user.email
        }
      };
    } catch (error) {
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
      if (!this.clientId || !this.clientSecret) {
        return {
          success: false,
          error: 'Discord client credentials not configured'
        };
      }

      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
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

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        return {
          success: false,
          error: `Failed to refresh token: ${error}`
        };
      }

      const token = await tokenResponse.json();

      return {
        success: true,
        token
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during token refresh'
      };
    }
  }

  /**
   * Get user guilds (servers) using access token
   * @param accessToken User's Discord access token
   * @returns List of guilds the user is a member of
   */
  async getUserGuilds(accessToken: string): Promise<any> {
    try {
      const response = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch guilds: ${await response.text()}`
        };
      }

      const guilds = await response.json();
      return {
        success: true,
        guilds
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error fetching guilds'
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
      if (!this.clientId || !this.clientSecret) {
        return {
          success: false,
          error: 'Discord client credentials not configured'
        };
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

      return {
        success: response.ok
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error revoking token'
      };
    }
  }
}
