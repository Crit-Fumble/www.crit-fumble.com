import { ConfigRegistry } from './registry';
import { ConfigValidationError, EnvironmentConfig } from '../../models/config/Config.d';

/**
 * Initialize the ConfigRegistry with environment variables
 * 
 * This function should be called at application startup
 * - In Next.js: Call in app layout or equivalent bootstrap file
 * - In Discord bot: Call at entry point before starting the bot
 * 
 * @param options Optional configuration options
 * @param options.validateRequired Whether to validate required config immediately
 * @param options.requiredConfigType Which type of required config to validate (e.g. 'NEXT_WEB', 'DISCORD_BOT')
 * @param options.overwrite Whether to overwrite existing configuration values
 */
export function initializeConfig(options?: {
  validateRequired?: boolean;
  requiredConfigType?: keyof typeof REQUIRED_CONFIG;
  overwrite?: boolean;
}): void {
  const registry = ConfigRegistry.getInstance();
  
  // Only initialize if not already done or if overwrite is specified
  if (registry.isInitialized() && !options?.overwrite) {
    return;
  }

  // Determine which keys to validate if validation is requested
  const requiredKeys = options?.validateRequired && options?.requiredConfigType
    ? REQUIRED_CONFIG[options.requiredConfigType]
    : undefined;

  // Initialize the registry with process.env
  registry.initialize({
    source: process.env,
    overwrite: options?.overwrite,
    validateRequired: options?.validateRequired,
    requiredKeys
  });
}

/**
 * Verify that all required configuration values are present
 * 
 * @param requiredKeys Array of required environment variable keys
 * @param throwOnError Whether to throw an error if validation fails (default: true)
 * @returns Array of validation errors, empty if all keys are valid
 * @throws Error if any required keys are missing and throwOnError is true
 */
export function verifyRequiredConfig(requiredKeys: string[], throwOnError = true): ConfigValidationError[] {
  const registry = ConfigRegistry.getInstance();
  
  if (!registry.isInitialized()) {
    throw new Error('ConfigRegistry has not been initialized. Call initializeConfig() first.');
  }

  // Use the new validateConfig method for consistent validation
  const errors = registry.validateConfig(requiredKeys);

  // Throw error if any keys are missing and throwOnError is true
  if (errors.length > 0 && throwOnError) {
    const missingKeys = errors.map(err => err.key);
    throw new Error(`Missing required configuration: ${missingKeys.join(', ')}`);
  }
  
  return errors;
}

/**
 * Required environment variables for each application
 */
export const REQUIRED_CONFIG: EnvironmentConfig = {
  NEXT_WEB: [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'DISCORD_WEB_APP_ID',
    'DISCORD_WEB_SECRET',
    'DISCORD_WEB_BOT_TOKEN',
    'DISCORD_DEFAULT_GUILD_ID',
    'AUTH_GITHUB_ID',
    'AUTH_GITHUB_SECRET',
    'POSTGRES_URL',
  ],
  DISCORD_BOT: [
    'DISCORD_PERSISTENT_BOT_TOKEN',
    'DISCORD_PERSISTENT_APP_ID',
    'DISCORD_PERSISTENT_SECRET',
    'DISCORD_DEFAULT_GUILD_ID',
    'POSTGRES_URL',
  ],
};

// Export ConfigRegistry for convenience
export { ConfigRegistry };
