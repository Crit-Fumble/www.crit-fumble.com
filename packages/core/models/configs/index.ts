/**
 * Re-export configuration interfaces from library packages
 * This allows other parts of the application to import types from a single location
 */

// Re-export database model types
export type { PostgresConfig } from '../database';

// Re-export library package configs
export type { WorldAnvilConfig } from '@crit-fumble/worldanvil';
export type { DiscordConfig } from '@crit-fumble/discord';
export type { OpenAiConfig } from '@crit-fumble/openai';

// Export environment configuration
export type { EnvironmentConfig } from './EnvironmentConfig';
export { 
  Environment,
  setEnvironmentConfig,
  getEnvironmentConfig,
  isDevelopment,
  isProduction,
  isTest,
  isDebugMode,
} from './EnvironmentConfig';
