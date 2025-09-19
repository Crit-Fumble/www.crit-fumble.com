/**
 * Environment configuration settings
 */

import { config } from 'dotenv';
import { resolve } from 'path';

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

/**
 * Environment file loading options
 */
export interface EnvironmentLoadOptions {
  /**
   * Base directory to resolve paths from (defaults to process.cwd())
   */
  baseDir?: string;
  
  /**
   * Additional environment files to load (in order of precedence)
   */
  envFiles?: string[];
  
  /**
   * Whether to log loading information
   */
  verbose?: boolean;
}

/**
 * Load environment variables from multiple .env files in order of precedence
 * Later files override earlier files
 * 
 * Default loading order:
 * 1. {baseDir}/.env (workspace defaults)
 * 2. {baseDir}/.env.local (local overrides)
 * 3. {baseDir}/.env.{NODE_ENV} (environment-specific)
 * 4. Custom files from options.envFiles
 */
export function loadEnvironment(options: EnvironmentLoadOptions = {}): void {
  const { 
    baseDir = process.cwd(), 
    envFiles = [], 
    verbose = false 
  } = options;
  
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Default environment files in order of precedence (lowest to highest)
  const defaultFiles = [
    '.env',                    // Base environment
    '.env.local',              // Local overrides
    `.env.${nodeEnv}`,         // Environment-specific
  ];
  
  // Combine default files with custom files
  const allFiles = [...defaultFiles, ...envFiles];
  
  if (verbose) {
    console.info('🔧 Loading environment variables...');
    console.info(`📁 Base directory: ${baseDir}`);
    console.info(`🌍 NODE_ENV: ${nodeEnv}`);
  }
  
  // Load each file, later files override earlier ones
  allFiles.forEach(envFile => {
    const envPath = resolve(baseDir, envFile);
    
    try {
      const result = config({ path: envPath, override: true });
      
      if (verbose) {
        if (result.error) {
          console.info(`⚠️  ${envFile}: Not found or error - ${result.error.message}`);
        } else {
          console.info(`✅ ${envFile}: Loaded successfully`);
        }
      }
    } catch (error) {
      if (verbose) {
        console.info(`⚠️  ${envFile}: Error loading - ${error}`);
      }
    }
  });
  
  if (verbose) {
    console.info('🔧 Environment loading complete');
  }
}

/**
 * Load environment for a workspace package
 * Automatically loads from root workspace and package-specific locations
 */
export function loadWorkspaceEnvironment(packagePath: string = process.cwd(), options: Omit<EnvironmentLoadOptions, 'baseDir'> = {}): void {
  // Try to find workspace root by looking for package.json with workspaces
  let workspaceRoot = packagePath;
  let currentDir = packagePath;
  
  // Walk up directories to find workspace root
  for (let i = 0; i < 10; i++) { // Limit to prevent infinite loops
    try {
      const parentDir = resolve(currentDir, '..');
      if (parentDir === currentDir) break; // Reached filesystem root
      
      currentDir = parentDir;
      
      // Check if this directory has a package.json with workspaces
      const packageJsonPath = resolve(currentDir, 'package.json');
      try {
        const packageJson = require(packageJsonPath);
        if (packageJson.workspaces) {
          workspaceRoot = currentDir;
          break;
        }
      } catch {
        // Continue searching
      }
    } catch {
      break;
    }
  }
  
  // Load environment files in order:
  // 1. Workspace root environment files
  // 2. Package-specific environment files
  loadEnvironment({
    baseDir: workspaceRoot,
    envFiles: [
      // Package-specific overrides
      resolve(packagePath, '.env.local'),
      resolve(packagePath, '.env.package'),
    ],
    ...options
  });
}
