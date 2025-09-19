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
const DISCORD_API_BASE = 'https://discord.com/api/v10';

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
    const url = new URL(`${DISCORD_OAUTH_BASE}/authorize`);
    
    url.searchParams.set('client_id', params.clientId);
    url.searchParams.set('redirect_uri', params.redirectUri);
    url.searchParams.set('response_type', params.responseType || 'code');
    url.searchParams.set('scope', params.scopes.join(' '));
    
    if (params.state) {
      url.searchParams.set('state', params.state);
    }
    
    // Add guild-specific permissions if guild ID is configured
    if (this.guildId) {
      url.searchParams.set('guild_id', this.guildId);
      url.searchParams.set('permissions', '0'); // Adjust permissions as needed
    }
    
    return url.toString();
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
    
    const response = await fetch(`${DISCORD_OAUTH_BASE}/token`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Discord token exchange failed: ${response.status} ${errorText}`);
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
    const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Discord user fetch failed: ${response.status} ${errorText}`);
    }
    
    const discordUser: DiscordUser = await response.json() as DiscordUser;
    
    // Handle avatar URL generation
    let avatarUrl: string;
    if (discordUser.avatar) {
      avatarUrl = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${discordUser.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`;
    } else {
      // Default avatar based on discriminator or user ID
      const defaultAvatarNumber = discordUser.discriminator === '0' 
        ? (parseInt(discordUser.id) >> 22) % 6 
        : parseInt(discordUser.discriminator) % 5;
      avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
    }
    
    // Handle display name (new username system vs legacy discriminator)
    const displayName = discordUser.global_name || 
      (discordUser.discriminator === '0' 
        ? discordUser.username 
        : `${discordUser.username}#${discordUser.discriminator}`);
    
    return {
      id: discordUser.id,
      username: discordUser.username,
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
    
    const response = await fetch(`${DISCORD_OAUTH_BASE}/token`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Discord token refresh failed: ${response.status} ${errorText}`);
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
      const response = await fetch(`${DISCORD_API_BASE}/users/@me/guilds/${this.guildId}/member`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Guild membership check failed:', error);
      return false;
    }
  }
}