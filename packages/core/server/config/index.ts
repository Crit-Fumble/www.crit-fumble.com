/**
 * Configuration system for Crit-Fumble
 * 
 * This module provides centralized configuration management through the ConfigRegistry
 */

// Export core registry functionality
export { ConfigRegistry } from './registry';
export { initializeConfig, verifyRequiredConfig, REQUIRED_CONFIG } from './initialize';

// Export configuration objects
export { default as authConfig } from './auth';
export { default as servicesConfig } from './services';
export * from './services';  // Named exports for individual services
export * from './views';     // UI configuration
