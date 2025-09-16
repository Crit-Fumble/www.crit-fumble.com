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
   * OAuth redirect URI
   */
  redirectUri?: string;
}

/**
 * Get Discord configuration from environment
 */
export function getDiscordConfig(): DiscordConfig {
  return {
    clientId: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    botToken: process.env.DISCORD_BOT_TOKEN,
    redirectUri: process.env.DISCORD_REDIRECT_URI
  };
}