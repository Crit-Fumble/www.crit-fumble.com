/**
 * SSO Authentication Models
 * Defines interfaces and types for Single Sign-On authentication
 */

/**
 * Supported SSO providers
 */
export enum SsoProvider {
  DISCORD = 'discord',
  WORLDANVIL = 'worldanvil'
}

/**
 * SSO provider configuration
 */
export interface SsoProviderConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

/**
 * Discord-specific configuration
 */
export interface DiscordSsoConfig extends SsoProviderConfig {
  guildId?: string; // Optional guild restriction
}

/**
 * WorldAnvil-specific configuration
 */
export interface WorldAnvilSsoConfig extends SsoProviderConfig {
  // WorldAnvil specific options can be added here
}

/**
 * Combined SSO configuration
 */
export interface SsoConfig {
  discord?: DiscordSsoConfig;
  worldanvil?: WorldAnvilSsoConfig;
}

/**
 * OAuth2 authorization URL parameters
 */
export interface AuthUrlParams {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  state?: string;
  responseType?: string;
}

/**
 * OAuth2 token exchange parameters
 */
export interface TokenExchangeParams {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  grantType?: string;
}

/**
 * OAuth2 token response
 */
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

/**
 * User profile from SSO provider
 */
export interface SsoUserProfile {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  avatar?: string;
  provider: SsoProvider;
  providerData?: any; // Additional provider-specific data
}

/**
 * SSO authentication result
 */
export interface SsoAuthResult {
  success: boolean;
  user?: SsoUserProfile;
  tokens?: TokenResponse;
  error?: string;
}

/**
 * User linking result for multiple SSO accounts
 */
export interface UserLinkResult {
  success: boolean;
  userId: string;
  linkedProviders: SsoProvider[];
  error?: string;
}

/**
 * JWT payload with SSO information
 */
export interface SsoTokenPayload {
  userId: string;
  providers: {
    [key in SsoProvider]?: {
      id: string;
      username: string;
    };
  };
  iat: number;
  exp: number;
}

/**
 * User session with SSO data
 */
export interface SsoUserSession {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  slug: string | null;
  providers: {
    discord?: {
      id: string;
      username: string;
      discriminator?: string;
    };
    worldanvil?: {
      id: string;
      username: string;
    };
  };
  admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}