/**
 * API key management models
 */

/**
 * Supported API providers
 */
export enum ApiProvider {
  WORLD_ANVIL = 'worldanvil',
  OPENAI = 'openai',
  DISCORD = 'discord'
}

/**
 * API key structure
 */
export interface ApiKey {
  id: string;
  userId: string;
  provider: ApiProvider;
  key: string;
  token?: string; // Secondary token (e.g., WorldAnvil uses both key and token)
  name?: string;  // Optional friendly name for the key
  createdAt: Date;
  updatedAt: Date;
}

/**
 * API key creation payload
 */
export interface ApiKeyCreateInput {
  userId: string;
  provider: ApiProvider;
  key: string;
  token?: string;
  name?: string;
}

/**
 * API key update payload
 */
export interface ApiKeyUpdateInput {
  key?: string;
  token?: string;
  name?: string;
}
