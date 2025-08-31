/**
 * Type definitions for the configuration system
 */

/**
 * Basic configuration value types supported by the registry
 */
export type ConfigValue = string | number | boolean | null | undefined;

/**
 * Configuration source object (typically from process.env or other sources)
 */
export type ConfigSource = Record<string, ConfigValue>;

/**
 * Configuration options interface
 */
export interface ConfigOptions {
  /** Whether to throw errors on missing values instead of returning undefined */
  strict?: boolean;
  
  /** Whether to silence warnings about accessing uninitialized registry */
  silent?: boolean;
}

/**
 * Base type for typed configuration schemas
 */
export interface ConfigSchema {
  [key: string]: ConfigValue | ConfigSchema;
}

/**
 * Environment-specific configuration requirements
 */
export interface EnvironmentConfig {
  /** Required configuration keys for the Next.js web application */
  NEXT_WEB: string[];
  
  /** Required configuration keys for the Discord bot */
  DISCORD_BOT: string[];
  
  /** Required configuration keys for Discord apps */
  DISCORD_APP: string[];
  
  /** Required configuration keys for Discord activities */
  DISCORD_ACTIVITY: string[];
}

/**
 * Configuration validation error details
 */
export interface ConfigValidationError {
  key: string;
  message: string;
  value?: ConfigValue;
}

/**
 * Configuration initialization options
 */
export interface InitializeOptions {
  /** Source of configuration values */
  source: ConfigSource;
  
  /** Whether to allow overwriting existing values */
  overwrite?: boolean;
  
  /** Whether to validate required keys immediately */
  validateRequired?: boolean;
  
  /** Keys to validate if validateRequired is true */
  requiredKeys?: string[];
}
