/**
 * Discord SSO Provider Implementation
 * Handles Discord OAuth2 authentication flow
 * Based on: https://discordjs.guide/oauth2/#a-quick-example
 */

import { BaseSsoProvider } from './ISsoProvider';
import { SsoProvider, SsoUserProfile, TokenResponse, AuthUrlParams, TokenExchangeParams } from './SsoModels';

/**
 * Discord OAuth2 endpoints
 */
const DISCORD_OAUTH_BASE = 'https://discord.com/api/oauth2';
const DISCORD_API_BASE = 'https://discord.com/api';

/**
 * Discord user response from API
 */
interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  avatar: string | null;
  email?: string;
  verified?: boolean;
  locale?: string;
  mfa_enabled?: boolean;
  premium_type?: number;
  public_flags?: number;
  flags?: number;
  bot?: boolean;
  system?: boolean;
}

/**
 * Discord OAuth2 token response
 */
interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

/**
 * Discord OAuth2 provider implementation
 */
export class DiscordSsoProvider extends BaseSsoProvider {
  readonly provider = SsoProvider.DISCORD;
  
  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    scopes: string[] = ['identify', 'email'],
    private readonly guildId?: string
  ) {
    super(clientId, clientSecret, redirectUri, scopes);
  }
  
  /**
   * Generate Discord OAuth2 authorization URL
   */
  getAuthorizationUrl(params: AuthUrlParams): string {
    // Build query string using encodeURIComponent so spaces are encoded as %20
    const query: Record<string, string> = {
      client_id: params.clientId,
      redirect_uri: params.redirectUri,
      response_type: params.responseType || 'code',
      scope: params.scopes.join(' '),
    };

    if (params.state) query.state = params.state;

    if (this.guildId) {
      query.guild_id = this.guildId;
      query.permissions = '0';
    }

    const qs = Object.entries(query)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');

    return `${DISCORD_OAUTH_BASE}/authorize?${qs}`;
  }
  
  /**
   * Exchange authorization code for Discord access token
   * Following the pattern from https://discordjs.guide/oauth2/#a-quick-example
   */
  async exchangeCodeForToken(params: TokenExchangeParams): Promise<TokenResponse> {
    const body = new URLSearchParams({
      client_id: params.clientId,
      client_secret: params.clientSecret,
      grant_type: params.grantType || 'authorization_code',
      code: params.code,
      redirect_uri: params.redirectUri,
    });
    let response: Response;
    try {
      response = await fetch(`${DISCORD_OAUTH_BASE}/token`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (err: any) {
      // Network or fetch-level errors
      throw new Error(`Failed to exchange code for token: ${err?.message || String(err)}`);
    }

    if (!response.ok) {
      // Try to parse JSON error body first, fallback to text when needed
      try {
        const errJson: any = await response.json();
        const err = (errJson && (errJson.error || errJson.message)) || JSON.stringify(errJson);
        const desc = errJson && (errJson.error_description || errJson.message || '');
        const composed = desc ? `${err} - ${desc}` : err;
        throw new Error(`Failed to exchange code for token: ${composed}`);
      } catch (jsonErr) {
        try {
          const errorText = typeof (response as any).text === 'function' ? await (response as any).text() : String(response.status);
          throw new Error(`Failed to exchange code for token: ${errorText}`);
        } catch (textErr) {
          throw new Error('Failed to exchange code for token');
        }
      }
    }

    const tokenData: DiscordTokenResponse = await response.json() as DiscordTokenResponse;

    return {
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
      scope: tokenData.scope,
    };
  }
  
  /**
   * Get Discord user profile using access token
   * Following the pattern from https://discordjs.guide/oauth2/#a-quick-example
   */
  async getUserProfile(accessToken: string): Promise<SsoUserProfile> {
    let response: Response;
    try {
      response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err: any) {
      throw new Error(`Failed to get Discord user profile: ${err?.message || String(err)}`);
    }

    if (!response.ok) {
      try {
        const errJson: any = await response.json();
        const err = (errJson && (errJson.error || errJson.message)) || JSON.stringify(errJson);
        throw new Error(`Failed to get Discord user profile: ${err}`);
      } catch (jsonErr) {
        try {
          const errorText = typeof (response as any).text === 'function' ? await (response as any).text() : String(response.status);
          throw new Error(`Failed to get Discord user profile: ${errorText}`);
        } catch (textErr) {
          throw new Error('Failed to get Discord user profile');
        }
      }
    }

    const discordUser: DiscordUser = await response.json() as DiscordUser;
    
    // Handle avatar: tests expect undefined when no avatar; otherwise canonical CDN url without size query
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${discordUser.avatar.startsWith('a_') ? 'gif' : 'png'}`
      : undefined;

    // Handle username/displayName: tests expect username to include discriminator and displayName to be the base username
    const usernameWithDiscriminator = `${discordUser.username}${discordUser.discriminator ? `#${discordUser.discriminator}` : ''}`;
    const displayName = discordUser.global_name || discordUser.username;

    return {
      id: discordUser.id,
      username: usernameWithDiscriminator,
      email: discordUser.email,
      displayName,
      avatar: avatarUrl,
      provider: SsoProvider.DISCORD,
      providerData: {
        discriminator: discordUser.discriminator,
        global_name: discordUser.global_name,
        verified: discordUser.verified,
        locale: discordUser.locale,
        mfa_enabled: discordUser.mfa_enabled,
        premium_type: discordUser.premium_type,
        public_flags: discordUser.public_flags,
        flags: discordUser.flags,
        bot: discordUser.bot,
        system: discordUser.system,
      },
    };
  }
  
  /**
   * Refresh Discord access token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
    
    let response: Response;
    try {
      response = await fetch(`${DISCORD_OAUTH_BASE}/token`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (err: any) {
      throw new Error(`Failed to refresh Discord token: ${err?.message || String(err)}`);
    }

    if (!response.ok) {
      try {
        const errJson: any = await response.json();
        const err = (errJson && (errJson.error || errJson.message)) || JSON.stringify(errJson);
        const desc = errJson && (errJson.error_description || errJson.message || '');
        const composed = desc ? `${err} - ${desc}` : err;
        throw new Error(`Failed to refresh Discord token: ${composed}`);
      } catch (jsonErr) {
        try {
          const errorText = typeof (response as any).text === 'function' ? await (response as any).text() : String(response.status);
          throw new Error(`Failed to refresh Discord token: ${errorText}`);
        } catch (textErr) {
          throw new Error('Failed to refresh Discord token');
        }
      }
    }

    const tokenData: DiscordTokenResponse = await response.json() as DiscordTokenResponse;
    
    return {
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
      scope: tokenData.scope,
    };
  }
  
  /**
   * Revoke Discord access token
   */
  async revokeToken(accessToken: string): Promise<boolean> {
    try {
      const body = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        token: accessToken,
      });
      
      const response = await fetch(`${DISCORD_OAUTH_BASE}/token/revoke`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to revoke Discord token:', error);
      return false;
    }
  }
  
  /**
   * Check if user is member of configured guild (if guild ID is set)
   */
  async checkGuildMembership(accessToken: string): Promise<boolean> {
    if (!this.guildId) {
      return true; // No guild restriction
    }
    
    try {
      // guild membership API uses v10 path
      const response = await fetch(`${DISCORD_API_BASE}/v10/users/@me/guilds/${this.guildId}/member`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Guild membership check failed:', error);
      return false;
    }
  }
}