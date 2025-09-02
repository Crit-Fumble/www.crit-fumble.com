/**
 * Export all World Anvil configuration related files
 */
// Re-export types with 'export type'
export type { WorldAnvilConfig } from './config';

// Re-export functions and constants
export {
  getWorldAnvilConfig,
  setWorldAnvilConfig,
  resetWorldAnvilConfigForTests,
  REQUIRED_CONFIG_KEYS as REQUIRED_WORLD_ANVIL_CONFIG_KEYS
} from './config';

// Environment variable keys for WorldAnvil configuration
export const WORLD_ANVIL_ENV_KEYS = {
  API_URL: 'WORLD_ANVIL_API_URL',
  API_KEY: 'WORLD_ANVIL_CLIENT_ID',
  CLIENT_SECRET: 'WORLD_ANVIL_CLIENT_SECRET'
};
