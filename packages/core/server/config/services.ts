import { ConfigRegistry } from './registry';

/**
 * Database configuration
 */
export const postgres = {
  get url() { return ConfigRegistry.getInstance().get('POSTGRES_URL', ''); },
  get url_no_ssl() { return ConfigRegistry.getInstance().get('POSTGRES_URL_NO_SSL', ''); },
  get url_non_pooling() { return ConfigRegistry.getInstance().get('POSTGRES_URL_NON_POOLING', ''); },
  get url_prisma() { return ConfigRegistry.getInstance().get('POSTGRES_URL', ''); },
  get port() { return ConfigRegistry.getInstance().get('POSTGRES_PORT', 5432); },
  get host() { return ConfigRegistry.getInstance().get('POSTGRES_HOST', ''); },
  get user() { return ConfigRegistry.getInstance().get('POSTGRES_USER', 'default'); },
  get password() { return ConfigRegistry.getInstance().get('POSTGRES_PASSWORD', ''); },
  get database() { return ConfigRegistry.getInstance().get('POSTGRES_DATABASE', ''); },
};

/**
 * OpenAI configuration
 */
export const openAi = {
  get key() { return ConfigRegistry.getInstance().get('OPENAI_API_KEY', ''); },
  get prompt() { return ConfigRegistry.getInstance().get('GPT_BASE_PROMPT', ''); },
};

/**
 * World Anvil configuration
 */
export const worldAnvil = {
  get key() { return ConfigRegistry.getInstance().get('WORLD_ANVIL_KEY', ''); },
  get token() { return ConfigRegistry.getInstance().get('WORLD_ANVIL_TOKEN', ''); },
  endpoint: 'https://www.worldanvil.com/api/external/boromir',
};

/**
 * Discord configuration
 */
export const discord = {
  id: '1002008886137589771',
  cfgAdminRole: '1056055558278479893',
  get key() { return ConfigRegistry.getInstance().get('DISCORD_PUBLIC_KEY', ''); },
  get appId() { return ConfigRegistry.getInstance().get('DISCORD_APP_ID', ''); },
  get authId() { return ConfigRegistry.getInstance().get('AUTH_DISCORD_ID', ''); },
  get authSecret() { return ConfigRegistry.getInstance().get('AUTH_DISCORD_SECRET', ''); },
};

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
