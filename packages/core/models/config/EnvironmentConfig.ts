/**
 * Environment configuration settings
 * Provides consistent environment handling across the application
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
   * @default Environment.Development
   */
  current: Environment;

  /**
   * Debug mode flag - enables additional logging
   * @default false
   */
  debug: boolean;
}

/**
 * Default environment configuration
 */
const defaultConfig: EnvironmentConfig = {
  current: Environment.Development,
  debug: false,
};

/**
 * Current environment configuration
 */
let currentConfig = { ...defaultConfig };

/**
 * Set environment configuration
 * 
 * @param config - Environment configuration values
 */
export function setEnvironmentConfig(config: Partial<EnvironmentConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Get current environment configuration
 * 
 * @returns Current environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  return { ...currentConfig };
}

/**
 * Check if the current environment is development
 * 
 * @returns True if in development environment
 */
export function isDevelopment(): boolean {
  return currentConfig.current === Environment.Development;
}

/**
 * Check if the current environment is production
 * 
 * @returns True if in production environment
 */
export function isProduction(): boolean {
  return currentConfig.current === Environment.Production;
}

/**
 * Check if the current environment is test
 * 
 * @returns True if in test environment
 */
export function isTest(): boolean {
  return currentConfig.current === Environment.Test;
}

/**
 * Check if debug mode is enabled
 * 
 * @returns True if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return currentConfig.debug;
}

export default {
  getEnvironmentConfig,
  setEnvironmentConfig,
  isDevelopment,
  isProduction,
  isTest,
  isDebugMode,
  Environment,
};
