/**
 * Configuration system for Crit-Fumble
 * 
 * This module provides centralized configuration management for services
 */

// Export configuration objects
export { default as servicesConfig } from './services';
export * from './services';       // Named exports for individual services
export * from './services.config'; // Services configuration
export * from './auth.config';     // Auth configuration
export * from './views';           // UI configuration
