/**
 * Base SSO Provider Interface
 * Defines the contract for SSO authentication providers
 */

import { SsoProvider, SsoUserProfile, TokenResponse, AuthUrlParams, TokenExchangeParams } from './SsoModels';

/**
 * Base interface for SSO providers
 */
export interface ISsoProvider {
  readonly provider: SsoProvider;
  
  /**
   * Generate authorization URL for OAuth flow
   */
  getAuthorizationUrl(params: AuthUrlParams): string;
  
  /**
   * Exchange authorization code for access token
   */
  exchangeCodeForToken(params: TokenExchangeParams): Promise<TokenResponse>;
  
  /**
   * Get user profile using access token
   */
  getUserProfile(accessToken: string): Promise<SsoUserProfile>;
  
  /**
   * Refresh access token if supported
   */
  refreshToken?(refreshToken: string): Promise<TokenResponse>;
  
  /**
   * Revoke access token
   */
  revokeToken?(accessToken: string): Promise<boolean>;
}

/**
 * Base SSO provider implementation with common functionality
 */
export abstract class BaseSsoProvider implements ISsoProvider {
  abstract readonly provider: SsoProvider;
  
  constructor(
    protected readonly clientId: string,
    protected readonly clientSecret: string,
    protected readonly redirectUri: string,
    protected readonly scopes: string[]
  ) {}
  
  abstract getAuthorizationUrl(params: AuthUrlParams): string;
  abstract exchangeCodeForToken(params: TokenExchangeParams): Promise<TokenResponse>;
  abstract getUserProfile(accessToken: string): Promise<SsoUserProfile>;
  
  /**
   * Generate a secure random state parameter
   */
  protected generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}