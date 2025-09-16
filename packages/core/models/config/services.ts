// Import all configuration types from the models folder
import { PostgresConfig } from './PostgresConfig';

// Import config types from respective packages
import { WorldAnvilConfig, setWorldAnvilConfig as setWAConfig, getWorldAnvilConfig } from '@crit-fumble/worldanvil';

// Simple Discord config since we're using Discord.js directly
interface DiscordConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly botToken?: string;
  readonly redirectUri?: string;
}

// Simple OpenAI config since we're using OpenAI SDK directly
interface OpenAiConfig {
  readonly apiKey: string;
  readonly organization?: string;
}

// Import the PostgreSQL default config
import { defaultPostgresConfig } from './PostgresConfig';

let postgresInstance = { ...defaultPostgresConfig };
let discordInstance: DiscordConfig = {
  clientId: process.env.DISCORD_CLIENT_ID || '',
  clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
  botToken: process.env.DISCORD_BOT_TOKEN,
  redirectUri: process.env.DISCORD_REDIRECT_URI
};
let openAiInstance: OpenAiConfig = {
  apiKey: process.env.OPENAI_API_KEY || '',
  organization: process.env.OPENAI_ORGANIZATION
};

/**
 * Set PostgreSQL configuration values directly
 * 
 * @param config - PostgreSQL configuration values
 */
export function setPostgresConfig(config: Partial<PostgresConfig>): void {
  postgresInstance = { ...postgresInstance, ...config };
}

/**
 * Get PostgreSQL configuration values
 */
export function getPostgresConfig(): PostgresConfig {
  return { ...postgresInstance };
}

/**
 * Set Discord configuration values directly
 */
export function setDiscordConfig(config: Partial<DiscordConfig>): void {
  discordInstance = { ...discordInstance, ...config };
}

/**
 * Get Discord configuration values
 */
export function getDiscordConfig(): DiscordConfig {
  return { ...discordInstance };
}

/**
 * Set OpenAI configuration values directly
 */
export function setOpenAiConfig(config: Partial<OpenAiConfig>): void {
  openAiInstance = { ...openAiInstance, ...config };
}

/**
 * Get OpenAI configuration values
 */
export function getOpenAiConfig(): OpenAiConfig {
  return { ...openAiInstance };
}

/**
 * PostgreSQL configuration accessor object
 */
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
 * Set configurations for all library packages directly
 * 
 * @param options - Configuration object containing values for each library
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
  if (discordConfig) setDiscordConfig(discordConfig);
  if (oaConfig) setOpenAiConfig(oaConfig);
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
