/**
 * Authentication configuration
 */

import { SsoConfig } from '../auth/SsoModels';

export interface AuthConfig {
  /**
   * JWT secret key for token signing
   */
  jwtSecret: string;
  
  /**
   * JWT token expiration time
   */
  tokenExpiration: string;
  
  /**
   * SSO provider configurations
   */
  sso: SsoConfig;
}