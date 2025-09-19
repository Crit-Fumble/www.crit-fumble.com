/**
 * SSO provider types - extracted from @crit-fumble/core
 * Pure TypeScript interfaces with no dependencies
 */

export interface SsoUser {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  avatar?: string;
  provider: string;
  providerUserId: string;
}

export interface SsoProvider {
  name: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  scopes?: string[];
  enabled: boolean;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  tokenType?: string;
  scope?: string;
}

export interface SsoAuthResult {
  user: SsoUser;
  token: AuthToken;
  isNewUser: boolean;
}