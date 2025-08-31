/**
 * ConfigRegistry - Central configuration management for Crit-Fumble packages
 *
 * This singleton class provides centralized access to environment variables
 * and configuration values across all @cfg packages.
 */

import { ConfigOptions, ConfigSource, ConfigValidationError, ConfigValue, InitializeOptions } from '../../models/config/Config.d';

/**
 * ConfigRegistry class - Singleton for managing application configuration
 */
export class ConfigRegistry {
  private static instance: ConfigRegistry;
  private configs: ConfigSource = {};
  private initialized = false;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance of ConfigRegistry
   */
  public static getInstance(): ConfigRegistry {
    if (!ConfigRegistry.instance) {
      ConfigRegistry.instance = new ConfigRegistry();
    }
    return ConfigRegistry.instance;
  }

  /**
   * Initialize the registry with configuration values
   * @param options Initialization options
   */
  public initialize(options: InitializeOptions | ConfigSource): ConfigRegistry {
    // Handle case where source is passed directly (backward compatibility)
    const opts: InitializeOptions = (options as ConfigSource).toString === Object.prototype.toString
      ? { source: options as ConfigSource }
      : options as InitializeOptions;
      
    if (this.initialized && !opts.overwrite) {
      console.warn('ConfigRegistry already initialized. Use { overwrite: true } to force initialization.');
      return this;
    }

    this.configs = { ...opts.source };
    this.initialized = true;
    
    // Validate required configuration if requested
    if (opts.validateRequired && opts.requiredKeys) {
      this.validateConfig(opts.requiredKeys);
    }
    
    return this;
  }

  /**
   * Check if the registry has been initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get a configuration value
   * @param key The configuration key
   * @param defaultValue Optional default value if the key doesn't exist
   * @param options Configuration options
   */
  public get<T extends ConfigValue>(key: string, defaultValue?: T, options?: ConfigOptions): T {
    if (!this.initialized && !(options?.silent)) {
      console.warn('ConfigRegistry accessed before initialization');
    }

    const value = this.configs[key];
    
    if (value === undefined && defaultValue === undefined && options?.strict) {
      throw new Error(`Required configuration "${key}" is missing`);
    }
    
    return (value ?? defaultValue) as T;
  }

  /**
   * Get a configuration value, throwing an error if it's missing
   * @param key The configuration key
   */
  public requireConfig<T extends ConfigValue>(key: string): T {
    if (!this.initialized) {
      throw new Error('ConfigRegistry accessed before initialization');
    }

    const value = this.configs[key];
    if (value === undefined) {
      throw new Error(`Required configuration "${key}" is missing`);
    }
    return value as T;
  }

  /**
   * Get a section of configuration with a common prefix
   * @param prefix The prefix to filter by
   */
  public getSection(prefix: string): ConfigSource {
    if (!this.initialized) {
      console.warn('ConfigRegistry accessed before initialization');
    }

    return Object.entries(this.configs)
      .filter(([key]) => key.startsWith(prefix))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as ConfigSource);
  }

  /**
   * Reset the registry (primarily for testing)
   */
  public reset(): void {
    this.configs = {};
    this.initialized = false;
  }
  
  /**
   * Validate that specific configuration keys exist and are not undefined
   * @param keys Array of keys to validate
   * @returns Array of validation errors, empty if all keys are valid
   */
  public validateConfig(keys: string[]): ConfigValidationError[] {
    if (!this.initialized) {
      throw new Error('ConfigRegistry has not been initialized. Call initialize() first.');
    }
    
    const errors: ConfigValidationError[] = [];
    
    for (const key of keys) {
      const value = this.configs[key];
      if (value === undefined) {
        errors.push({
          key,
          message: `Required configuration "${key}" is missing`,
        });
      }
    }
    
    return errors;
  }
  
  /**
   * Get all configuration values, optionally filtered by environment
   * @param env Optional environment filter (e.g., 'development', 'production')
   */
  public getAll(env?: string): ConfigSource {
    if (!this.initialized) {
      console.warn('ConfigRegistry accessed before initialization');
    }
    
    if (!env) return { ...this.configs };
    
    // Filter by environment-specific prefix
    return Object.entries(this.configs)
      .filter(([key]) => key.startsWith(`${env.toUpperCase()}_`))
      .reduce((acc, [key, value]) => {
        // Remove the environment prefix
        const newKey = key.replace(`${env.toUpperCase()}_`, '');
        acc[newKey] = value;
        return acc;
      }, {} as ConfigSource);
  }
}

/**
 * Helper function to get configuration values directly
 * @param key The configuration key
 * @param defaultValue Optional default value if key doesn't exist
 * @returns The configuration value
 */
export function getConfig<T extends ConfigValue>(key: string, defaultValue?: T): T {
  return ConfigRegistry.getInstance().get<T>(key, defaultValue);
}

/**
 * Helper function to require a configuration value
 * @param key The configuration key
 * @returns The configuration value
 * @throws Error if the configuration doesn't exist
 */
export function requireConfig<T extends ConfigValue>(key: string): T {
  return ConfigRegistry.getInstance().requireConfig<T>(key);
}