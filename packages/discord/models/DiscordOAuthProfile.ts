/**
 * Discord OAuth Profile Model
 * Represents a Discord user profile from OAuth authentication flow
 * This replaces the dependency on next-auth's DiscordProfile
 */

import { APIUser } from 'discord.js';

/**
 * Discord OAuth profile interface extends the Discord API User with OAuth tokens
 */
export interface DiscordOAuthProfile extends Partial<APIUser> {
  id: string;
  username: string;
  global_name?: string;
  discriminator?: string;
  avatar?: string;
  email?: string;
  verified?: boolean;
  
  // Auth-related properties
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  
  // Helper properties
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
