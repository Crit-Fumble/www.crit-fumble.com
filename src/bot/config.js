import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

// Load environment variables - try bot-specific .env first, then fall back to main .env
const botEnvPath = path.join(rootDir, '.env.bot');
const mainEnvPath = path.join(rootDir, '.env');

if (fs.existsSync(botEnvPath)) {
  dotenv.config({ path: botEnvPath });
} else if (fs.existsSync(mainEnvPath)) {
  dotenv.config({ path: mainEnvPath });
} else {
  console.warn('No .env file found. Using environment variables from system.');
}

// Configuration object with default values
const config = {
  // Discord Bot Settings
  discord: {
    token: process.env.DISCORD_PERSISTENT_BOT_TOKEN,
    appId: process.env.DISCORD_PERSISTENT_BOT_APP_ID,
    inviteUrl: process.env.DISCORD_BOT_INVITE_URL,
    prefix: process.env.BOT_PREFIX || '!',
    ownerIds: (process.env.BOT_OWNER_IDS || '').split(',').filter(id => id),
  },
  
  // Bot Details
  bot: {
    name: process.env.BOT_NAME || 'FumbleBot',
    version: process.env.BOT_VERSION || '1.0.0',
    description: process.env.BOT_DESCRIPTION || 'Discord bot for the Crit Fumble RPG community',
    defaultActivity: process.env.BOT_DEFAULT_ACTIVITY || '/help for commands',
    defaultActivityType: process.env.BOT_DEFAULT_ACTIVITY_TYPE || 'PLAYING',
  },
  
  // API Integration
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    key: process.env.BOT_API_KEY,
    port: parseInt(process.env.BOT_API_PORT || '3001', 10),
    enabled: process.env.BOT_API_ENABLED === 'true',
  },
  
  // Database
  database: {
    url: process.env.DATABASE_URL,
    enabled: !!process.env.DATABASE_URL,
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/bot.log',
    console: process.env.LOG_CONSOLE !== 'false',
  },
  
  // Feature Flags
  features: {
    voiceEnabled: process.env.FEATURE_VOICE_ENABLED === 'true',
    musicEnabled: process.env.FEATURE_MUSIC_ENABLED === 'true',
    adminCommands: process.env.FEATURE_ADMIN_COMMANDS !== 'false',
    campaignIntegration: process.env.FEATURE_CAMPAIGN_INTEGRATION !== 'false',
  },
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Paths
  paths: {
    root: rootDir,
    bot: __dirname,
    commands: path.join(__dirname, 'commands'),
    cronJobs: path.join(__dirname, 'cronJobs'),
    logs: path.join(rootDir, 'logs'),
  },
};

// Validate required configuration
export function validateConfig() {
  const requiredVars = [
    { key: 'discord.token', value: config.discord.token, name: 'DISCORD_PERSISTENT_BOT_TOKEN' },
    { key: 'discord.appId', value: config.discord.appId, name: 'DISCORD_PERSISTENT_BOT_APP_ID' },
  ];
  
  const missingVars = requiredVars.filter(v => !v.value);
  
  if (missingVars.length > 0) {
    const missingList = missingVars.map(v => v.name).join(', ');
    throw new Error(`Missing required environment variables: ${missingList}`);
  }
  
  return true;
}

// Create required directories if they don't exist
export function ensureDirectories() {
  // Ensure logs directory exists
  if (!fs.existsSync(config.paths.logs)) {
    fs.mkdirSync(config.paths.logs, { recursive: true });
  }
}

export default config;
