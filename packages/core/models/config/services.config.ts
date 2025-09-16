/**
 * Centralized services configuration
 */

import { AuthConfig, getAuthConfig } from './auth.config';
import { WorldAnvilConfig, getWorldAnvilConfig } from '@crit-fumble/worldanvil';

// Simple Discord config interface since we're using Discord.js directly
interface DiscordConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly botToken?: string;
  readonly redirectUri?: string;
}

// Get Discord config from environment
function getDiscordConfig(): DiscordConfig {
  return {
    clientId: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    botToken: process.env.DISCORD_BOT_TOKEN,
    redirectUri: process.env.DISCORD_REDIRECT_URI
  };
}

export interface ServicesConfig {
  auth: AuthConfig;
  discord: {
    readonly config: DiscordConfig;
  };
  worldAnvil: {
    readonly config: WorldAnvilConfig;
  };
}

// Initialize the services configuration
export const servicesConfig: ServicesConfig = {
  auth: getAuthConfig(),
  discord: {
    config: getDiscordConfig()
  },
  worldAnvil: {
    config: getWorldAnvilConfig()
  }
};