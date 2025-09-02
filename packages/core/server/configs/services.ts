import { ConfigSource } from '../../models/config/Config';

// Import all configuration types from the models folder
import { 
  PostgresConfig,
  WorldAnvilConfig,
  DiscordConfig,
  OpenAiConfig
} from '../../models/configs';

// Import the PostgreSQL default config
import { defaultPostgresConfig } from '../../models/database';

// Import configuration setters and getters from library packages
import { 
  setWorldAnvilConfig as setWAConfig,
  getWorldAnvilConfig
} from '@crit-fumble/worldanvil';

import {
  setDiscordConfig as setDConfig,
  getDiscordConfig
} from '@crit-fumble/discord';

// Note: The OpenAI package exports these functions via index.ts
import {
  setOpenAiConfig as setOAConfig,
  getOpenAiConfig
} from '@crit-fumble/openai';

let postgresInstance = { ...defaultPostgresConfig };

export function setPostgresConfig(config: Partial<PostgresConfig>): void {
  postgresInstance = { ...postgresInstance, ...config };
}

export const postgres = {
  get url() { return postgresInstance.url; },
  get url_no_ssl() { return postgresInstance.url_no_ssl; },
  get url_non_pooling() { return postgresInstance.url_non_pooling; },
  get url_prisma() { return postgresInstance.url_prisma || postgresInstance.url; },
  get port() { return postgresInstance.port; },
  get host() { return postgresInstance.host; },
  get user() { return postgresInstance.user; },
  get password() { return postgresInstance.password; },
  get database() { return postgresInstance.database; },
};


/**
 * Re-export configuration getters from library packages
 */
export const openAi = {
  get config() { return getOpenAiConfig(); },
};

export const worldAnvil = {
  get config() { return getWorldAnvilConfig(); },
};

export const discord = {
  get config() { return getDiscordConfig(); },
};

/**
 * Set configurations for all library packages
 */
export function setLibraryConfigs({
  worldAnvil: waConfig,
  discord: discordConfig,
  openAi: oaConfig
}: {
  worldAnvil?: Partial<WorldAnvilConfig>,
  discord?: Partial<DiscordConfig>,
  openAi?: Partial<OpenAiConfig>
} = {}): void {
  if (waConfig) setWAConfig(waConfig);
  if (discordConfig) setDConfig(discordConfig);
  if (oaConfig) setOAConfig(oaConfig);
}

/**
 * Roll20 configuration
 */
export const roll20 = {
  id: '6244861',
  name: 'Crit Fumble Gaming',
  slug: 'crit-fumble-gaming',
};

/**
 * D&D Beyond configuration (placeholder)
 */
export const dndBeyond = {};

/**
 * Default export of services
 */
const config = { 
  worldAnvil,
  discord,
};

export default config;
