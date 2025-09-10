/**
 * Discord configuration module
 */

/**
 * Discord configuration interface
 */
export interface DiscordConfig {
  /**
   * Discord Bot Token for authentication
   */
  botToken: string;
  
  /**
   * Discord Client ID
   */
  clientId: string;
  
  /**
   * Discord Client Secret
   */
  clientSecret: string;
  
  /**
   * Default Guild ID to use if none specified
   */
  defaultGuildId?: string;

  /**
   * Default redirect URI for OAuth flows
   */
  redirectUri?: string;
}

// Default configuration (empty/placeholder values)
const defaultConfig: DiscordConfig = {
  botToken: '',
  clientId: '',
  clientSecret: '',
  defaultGuildId: undefined,
  redirectUri: undefined
};

// Singleton instance of the configuration
let configInstance: DiscordConfig = { ...defaultConfig };

/**
 * Set Discord configuration from host application
 * @param config Configuration object to use
 */
export function setDiscordConfig(config: Partial<DiscordConfig>): void {
  configInstance = { ...defaultConfig, ...config };
}

/**
 * Get Discord configuration
 * @returns Discord configuration
 * @throws Error if configuration has not been set and no defaults are available
 */
export function getDiscordConfig(): DiscordConfig {
  // Validate required fields
  if (!configInstance.botToken && !configInstance.clientId && !configInstance.clientSecret) {
    throw new Error('Discord configuration not set. Call setDiscordConfig() first.');
  }
  
  return configInstance;
}
