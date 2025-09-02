import { DiscordConfig } from '../../../server/configs/config';

/**
 * Mock implementation of Discord config for testing
 */
export const mockDiscordConfig: DiscordConfig = {
  botToken: 'mock-token',
  clientId: 'mock-client-id',
  clientSecret: 'mock-client-secret',
  defaultGuildId: 'guild-123'
};

/**
 * Mock function to get Discord config
 */
export function getDiscordConfig(): DiscordConfig {
  return mockDiscordConfig;
}
