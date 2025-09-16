/**
 * Configuration system for Crit-Fumble
 * 
 * This module provides simple, dependency-injection-friendly configuration management.
 * Each config follows the pattern: Interface + Function that reads from environment.
 * 
 * Usage:
 * ```typescript
 * import { getDatabaseConfig, getDiscordConfig, getOpenAIConfig } from '@crit-fumble/core/models/config';
 * 
 * const dbConfig = getDatabaseConfig();
 * const discordConfig = getDiscordConfig();
 * const openaiConfig = getOpenAIConfig();
 * 
 * // Pass to client constructors
 * const prisma = new PrismaClient({ datasources: { db: { url: dbConfig.url } } });
 * const discord = new Client(discordConfig);
 * const openai = new OpenAI({ apiKey: openaiConfig.apiKey });
 * ```
 */

// Database configuration
export { DatabaseConfig, getDatabaseConfig } from './database.config';

// Authentication configuration  
export { AuthConfig } from './auth.config';

// Discord client configuration
export { DiscordConfig, getDiscordConfig } from './discord.config';

// OpenAI client configuration
export { OpenAIConfig, getOpenAIConfig } from './openai.config';

// Environment configuration
export { 
  Environment, 
  EnvironmentConfig, 
  getEnvironmentConfig,
  isDevelopment,
  isProduction, 
  isTest,
  isDebugMode 
} from './EnvironmentConfig';

// WorldAnvil configuration (re-export from package)
export { WorldAnvilConfig, getWorldAnvilConfig } from '@crit-fumble/worldanvil';

// UI configuration
export { DEFAULT as UI_DEFAULTS } from './views';
