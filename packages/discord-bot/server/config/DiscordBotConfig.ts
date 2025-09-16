import { AuthConfig, DatabaseConfig } from '@crit-fumble/core/models/config';

/**
 * Discord Bot Configuration Interface
 */
export interface DiscordBotConfig {
  // Discord credentials
  discord: {
    token: string;
    appId: string;
    inviteUrl?: string;
  };
  
  // Bot settings
  bot: {
    name: string;
    prefix: string;
    version: string;
    description: string;
    defaultActivity: string;
    defaultActivityType: string;
    ownerIds: string[];
  };
  
  // API integration
  api: {
    baseUrl: string;
    key?: string;
    enabled: boolean;
    port: number;
  };
  
  // Feature flags
  features: {
    voiceEnabled: boolean;
    musicEnabled: boolean;
    adminCommands: boolean;
    campaignIntegration: boolean;
  };
  
  // Logging
  logging: {
    level: string;
    file?: string;
    console: boolean;
  };
  
  // Environment
  environment: 'development' | 'production' | 'test';
  
  // Core package configs
  auth?: AuthConfig;
  database?: DatabaseConfig;
}

/**
 * Load and validate Discord Bot configuration from environment variables
 */
export function loadDiscordBotConfig(): DiscordBotConfig {
  // Required environment variables
  const requiredVars = {
    DISCORD_PERSISTENT_BOT_TOKEN: process.env.DISCORD_PERSISTENT_BOT_TOKEN,
    DISCORD_PERSISTENT_APP_ID: process.env.DISCORD_PERSISTENT_APP_ID,
  };
  
  // Check for missing required variables
  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);
    
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return {
    discord: {
      token: process.env.DISCORD_PERSISTENT_BOT_TOKEN!,
      appId: process.env.DISCORD_PERSISTENT_APP_ID!,
      inviteUrl: process.env.DISCORD_BOT_INVITE_URL,
    },
    
    bot: {
      name: process.env.BOT_NAME || 'FumbleBot',
      prefix: process.env.BOT_PREFIX || '!',
      version: process.env.BOT_VERSION || '1.0.0',
      description: process.env.BOT_DESCRIPTION || 'Discord bot for the Crit Fumble RPG community',
      defaultActivity: process.env.BOT_DEFAULT_ACTIVITY || '/help for commands',
      defaultActivityType: process.env.BOT_DEFAULT_ACTIVITY_TYPE || 'PLAYING',
      ownerIds: process.env.BOT_OWNER_IDS?.split(',').map(id => id.trim()) || [],
    },
    
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      key: process.env.BOT_API_KEY,
      enabled: process.env.BOT_API_ENABLED === 'true',
      port: parseInt(process.env.BOT_API_PORT || '3001', 10),
    },
    
    features: {
      voiceEnabled: process.env.FEATURE_VOICE_ENABLED === 'true',
      musicEnabled: process.env.FEATURE_MUSIC_ENABLED === 'true',
      adminCommands: process.env.FEATURE_ADMIN_COMMANDS === 'true',
      campaignIntegration: process.env.FEATURE_CAMPAIGN_INTEGRATION === 'true',
    },
    
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      file: process.env.LOG_FILE,
      console: process.env.LOG_CONSOLE !== 'false',
    },
    
    environment: (process.env.NODE_ENV as any) || 'development',
    
    // These will be populated by core package if database access is needed
    auth: undefined,
    database: undefined,
  };
}

/**
 * Validate the Discord Bot configuration
 */
export function validateDiscordBotConfig(config: DiscordBotConfig): void {
  if (!config.discord.token) {
    throw new Error('Discord bot token is required');
  }
  
  if (!config.discord.appId) {
    throw new Error('Discord application ID is required');
  }
  
  if (config.api.enabled && !config.api.key) {
    console.warn('⚠️ API integration is enabled but no API key is configured');
  }
  
  if (config.api.port < 1 || config.api.port > 65535) {
    throw new Error('API port must be between 1 and 65535');
  }
}