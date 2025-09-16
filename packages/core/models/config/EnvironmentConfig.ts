/**
 * Environment configuration settings
 */

/**
 * Environment types supported by the application
 */
export enum Environment {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  /**
   * Current environment
   */
  current: Environment;

  /**
   * Debug mode flag
   */
  debug: boolean;
}

/**
 * Get environment configuration from environment variables
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const debug = process.env.DEBUG === 'true' || nodeEnv === 'development';
  
  let current: Environment;
  switch (nodeEnv) {
    case 'production':
      current = Environment.Production;
      break;
    case 'test':
      current = Environment.Test;
      break;
    default:
      current = Environment.Development;
  }

  return {
    current,
    debug
  };
}

/**
 * Check if the current environment is development
 */
export function isDevelopment(): boolean {
  return getEnvironmentConfig().current === Environment.Development;
}

/**
 * Check if the current environment is production
 */
export function isProduction(): boolean {
  return getEnvironmentConfig().current === Environment.Production;
}

/**
 * Check if the current environment is test
 */
export function isTest(): boolean {
  return getEnvironmentConfig().current === Environment.Test;
}

/**
 * Check if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return getEnvironmentConfig().debug;
}
