/**
 * Discord Package
 * Exports all Discord-related functionality
 */

// Export models
export * from './models';

// Export server components
export * from './server';

// Export client components
export * from './client';

// Export configuration utilities directly
export type { DiscordConfig } from './server/configs/config';
export { setDiscordConfig, getDiscordConfig } from './server/configs/config';

/**
 * Initialize the Discord package with the provided configuration
 * @param config Discord configuration to use
 */
export function initializeDiscord(config: Partial<import('./server/configs/config').DiscordConfig>) {
  // Set the provided configuration
  const { setDiscordConfig } = require('./server/configs/config');
  setDiscordConfig(config);
}