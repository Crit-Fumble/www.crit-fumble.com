/**
 * Discord User Model
 * Represents a Discord user profile from OAuth
 * This replaces the dependency on next-auth's DiscordProfile
 */

/**
 * Discord user interface obtained from OAuth flow
 */
export interface DiscordUser {
  id: string;
  username: string;
  global_name?: string;
  display_name?: string;
  avatar?: string;
  discriminator?: string;
  public_flags?: number;
  flags?: number;
  banner?: string;
  banner_color?: string;
  accent_color?: number;
  locale?: string;
  mfa_enabled?: boolean;
  premium_type?: number;
  email?: string;
  verified?: boolean;
  bot?: boolean;
  system?: boolean;
  
  // Auth-related properties
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  
  // Helper properties that might be used by the application
  image_url?: string; // Computed avatar URL
  provider?: string;   // Always 'discord' for this type of profile
}

/**
 * Discord OAuth token response
 */
export interface DiscordOAuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}
