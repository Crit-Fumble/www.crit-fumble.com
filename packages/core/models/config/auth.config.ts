/**
 * Auth configuration
 */

export interface AuthConfig {
  jwtSecret: string;
  tokenExpiration: string;
}

export const defaultAuthConfig: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-do-not-use-in-production',
  tokenExpiration: process.env.JWT_EXPIRATION || '7d'
};

export function getAuthConfig(): AuthConfig {
  return {
    jwtSecret: process.env.JWT_SECRET || defaultAuthConfig.jwtSecret,
    tokenExpiration: process.env.JWT_EXPIRATION || defaultAuthConfig.tokenExpiration
  };
}