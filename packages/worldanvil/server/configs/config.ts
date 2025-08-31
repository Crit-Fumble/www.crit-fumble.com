/**
 * World Anvil configuration module
 * Provides access to World Anvil related environment variables
 */

/**
 * World Anvil config type definition
 */
export interface WorldAnvilConfig {
  apiUrl: string;
  apiKey: string;
  accessToken?: string;
}

/**
 * Environment variable keys for World Anvil configuration
 */
export const WORLD_ANVIL_ENV_KEYS = {
  API_URL: 'WORLD_ANVIL_API_URL',
  API_KEY: 'WORLD_ANVIL_KEY',
  ACCESS_TOKEN: 'WORLD_ANVIL_TOKEN',
};

/**
 * Gets World Anvil configuration from environment variables
 * @returns WorldAnvilConfig object with World Anvil API configuration
 */
export function getWorldAnvilConfig(): WorldAnvilConfig {
  const apiUrl = process.env[WORLD_ANVIL_ENV_KEYS.API_URL];
  const apiKey = process.env[WORLD_ANVIL_ENV_KEYS.API_KEY];
  const accessToken = process.env[WORLD_ANVIL_ENV_KEYS.ACCESS_TOKEN];

  if (!apiUrl) {
    throw new Error(`Missing required environment variable: ${WORLD_ANVIL_ENV_KEYS.API_URL}`);
  }

  if (!apiKey) {
    throw new Error(`Missing required environment variable: ${WORLD_ANVIL_ENV_KEYS.API_KEY}`);
  }

  return {
    apiUrl,
    apiKey,
    accessToken,
  };
}

/**
 * Required World Anvil environment variables
 */
export const REQUIRED_WORLD_ANVIL_CONFIG = [
  WORLD_ANVIL_ENV_KEYS.API_URL,
  WORLD_ANVIL_ENV_KEYS.API_KEY,
];
