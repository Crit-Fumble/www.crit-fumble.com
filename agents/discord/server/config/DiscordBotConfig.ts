/**
 * Discord Bot Configuration Interface and Loading Logic
 */

/**
 export function loadDiscordBotConfig(): DiscordBotConfig {
  return {
    discord: {
      token: process.env.DISCORD_PERSISTENT_BOT_TOKEN || '',
      appId: process.env.DISCORD_PERSISTENT_BOT_APP_ID || '',
      defaultActivity: process.env.DISCORD_DEFAULT_ACTIVITY || 'Crit-Fumble RPG Helper',
    },
    
    bot: {
      name: process.env.DISCORD_PERSISTENT_BOT_NAME || 'FumbleBot',
      version: process.env.BOT_VERSION || '1.0.0',
      commandPrefix: process.env.BOT_COMMAND_PREFIX || '!',
      defaultActivity: process.env.BOT_DEFAULT_ACTIVITY || 'Crit-Fumble RPG Helper',
      autoModerationEnabled: process.env.BOT_AUTO_MODERATION === 'true',
      logLevel: (process.env.BOT_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
      ownerIds: process.env.BOT_OWNER_IDS?.split(',') || [],
    },figuration Interface
 */
export interface DiscordBotConfig {
  // Discord credentials
  discord: {
    token: string;
    appId: string;
    defaultActivity: string;
  };
  
  // Bot behavior settings
  bot: {
    name: string;
    version: string;
    commandPrefix: string;
    defaultActivity: string;
    autoModerationEnabled: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    ownerIds: string[];
  };
  
  // API integration settings
  api: {
    enabled: boolean;
    baseUrl: string;
    key?: string;
    port: number;
    timeout: number;
  };
  
  // Authentication settings
  auth: {
    discordClientId: string;
    discordClientSecret?: string;
    botToken: string;
  };
  
  // Cron job settings
  cron: {
    enabled: boolean;
    timezone: string;
    eventCheckInterval: string;
  };
  
  // Logging configuration
  logging: {
    level: string;
    file?: string;
    console: boolean;
  };
  
  // Environment
  environment: 'development' | 'production' | 'test';
  
  // Optional integrations (populated by core package if needed)
  database?: {
    url?: string;
  };
  openai?: {
    apiKey?: string;
  };
  worldanvil?: {
    apiKey?: string;
    token?: string;
  };
}

/**
 * Helper function to safely get environment type
 */
function getEnvironmentType(env: string | undefined): 'development' | 'production' | 'test' {
  if (env === 'production') return 'production';
  if (env === 'test') return 'test';
  return 'development';
}

/**
 * Load and create Discord Bot configuration from environment variables
 */
export function loadDiscordBotConfig(): DiscordBotConfig {
  return {
    discord: {
      token: process.env.DISCORD_PERSISTENT_BOT_TOKEN || '',
      appId: process.env.DISCORD_PERSISTENT_BOT_APP_ID || '',
      defaultActivity: process.env.DISCORD_DEFAULT_ACTIVITY || 'Crit-Fumble RPG Helper',
    },
    
    bot: {
      name: process.env.DISCORD_PERSISTENT_BOT_NAME || 'FumbleBot',
      version: process.env.BOT_VERSION || '1.0.0',
      commandPrefix: process.env.BOT_COMMAND_PREFIX || '!',
      defaultActivity: process.env.BOT_DEFAULT_ACTIVITY || 'Crit-Fumble RPG Helper',
      autoModerationEnabled: process.env.BOT_AUTO_MODERATION === 'true',
      logLevel: (process.env.BOT_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
      ownerIds: process.env.BOT_OWNER_IDS?.split(',') || [],
    },
    
    api: {
      enabled: process.env.API_ENABLED !== 'false',
      baseUrl: process.env.API_BASE_URL || 'https://api.crit-fumble.com',
      key: process.env.API_KEY,
      port: parseInt(process.env.API_PORT || '3001', 10),
      timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
    },
    
    cron: {
      enabled: process.env.CRON_ENABLED !== 'false',
      timezone: process.env.CRON_TIMEZONE || 'UTC',
      eventCheckInterval: process.env.CRON_EVENT_CHECK_INTERVAL || '*/5 * * * *',
    },
    
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      file: process.env.LOG_FILE,
      console: process.env.LOG_CONSOLE !== 'false',
    },
    
    environment: getEnvironmentType(process.env.NODE_ENV),
    
    // Authentication configuration
    auth: {
      discordClientId: process.env.DISCORD_PERSISTENT_BOT_APP_ID || '',
      discordClientSecret: process.env.AUTH_DISCORD_SECRET,
      botToken: process.env.DISCORD_PERSISTENT_BOT_TOKEN || '',
    },
    
    // These will be populated by core package if database access is needed
    database: {
      url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    worldanvil: {
      apiKey: process.env.WORLD_ANVIL_KEY,
      token: process.env.WORLD_ANVIL_TOKEN,
    },
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
  
  if (!config.auth.discordClientId) {
    throw new Error('Discord client ID is required for authentication');
  }
  
  if (!config.auth.botToken) {
    throw new Error('Discord bot token is required for authentication');
  }
  
  if (config.api.enabled && !config.api.key) {
    console.warn('⚠️ API integration is enabled but no API key is configured');
  }
  
  if (config.api.port < 1 || config.api.port > 65535) {
    throw new Error('API port must be between 1 and 65535');
  }
}
