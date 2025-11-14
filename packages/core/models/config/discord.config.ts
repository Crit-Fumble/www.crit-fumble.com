/**
 * Discord client configuration
 */

export interface DiscordConfig {
  /**
   * Discord application client ID
   */
  clientId: string;
  
  /**
   * Discord application client secret
   */
  clientSecret: string;
  
  /**
   * Discord bot token (for bot functionality)
   */
  botToken?: string;
  
  /**
   * Discord bot application ID
   */
  applicationId?: string;
  
  /**
   * Discord application public key
   */
  publicKey?: string;
  
  /**
   * OAuth redirect URI
   */
  redirectUri?: string;
  
  /**
   * Discord server/guild ID for bot operations
   */
  serverId?: string;
  
  /**
   * Comma-separated list of Discord user IDs who are admins
   */
  adminIds?: string[];
}

/**
 * Get Discord configuration from environment
 */
export function getDiscordConfig(): DiscordConfig {
  const adminIdsString = process.env.DISCORD_ADMIN_IDS;
  const adminIds = adminIdsString ? adminIdsString.split(',').map(id => id.trim()) : [];
  
  return {
    clientId: process.env.DISCORD_CLIENT_ID || process.env.AUTH_DISCORD_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || process.env.AUTH_DISCORD_SECRET || '',
    botToken: process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_WEB_BOT_TOKEN,
    applicationId: process.env.DISCORD_APPLICATION_ID || process.env.DISCORD_WEB_BOT_APP_ID,
    publicKey: process.env.DISCORD_PUBLIC_KEY || process.env.AUTH_DISCORD_PUBLIC_KEY,
    redirectUri: process.env.DISCORD_REDIRECT_URI,
    serverId: process.env.DISCORD_SERVER_ID,
    adminIds
  };
}