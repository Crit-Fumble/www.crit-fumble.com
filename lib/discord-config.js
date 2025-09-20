/**
 * Environment Configuration for Discord Command Registration
 * 
 * This file contains the configuration logic for when and how
 * Discord commands should be automatically registered.
 */

export const discordConfig = {
  /**
   * Should commands be auto-registered on app startup?
   * - In production: always true
   * - In development: only if explicitly enabled
   */
  autoRegisterOnStartup: process.env.NODE_ENV === 'production' || 
                        process.env.DISCORD_AUTO_REGISTER_COMMANDS === 'true',

  /**
   * Should commands be registered during build process?
   * - Always true unless explicitly disabled
   */
  registerOnBuild: process.env.DISCORD_REGISTER_ON_BUILD !== 'false',

  /**
   * Environment-specific settings
   */
  environment: process.env.NODE_ENV || 'development',
  applicationId: process.env.DISCORD_WEB_BOT_APP_ID,
  botToken: process.env.DISCORD_WEB_BOT_TOKEN,
  publicKey: process.env.AUTH_DISCORD_PUBLIC_KEY,

  /**
   * Validate Discord configuration
   */
  isConfigured() {
    return !!(this.applicationId && this.botToken && this.publicKey);
  },

  /**
   * Get registration strategy based on environment
   */
  getRegistrationStrategy() {
    if (this.environment === 'production') {
      return 'startup'; // Register on app startup in production
    } else if (this.environment === 'development') {
      return 'manual'; // Manual registration in development
    } else {
      return 'build'; // Register during build for other environments
    }
  }
};

export default discordConfig;