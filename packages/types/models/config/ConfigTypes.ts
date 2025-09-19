/**
 * Configuration types - extracted from @crit-fumble/core
 * Pure TypeScript interfaces with no dependencies
 */

export type Environment = 'development' | 'test' | 'production' | 'preview';

export interface EnvironmentConfig {
  NODE_ENV: string;
  DEBUG?: string;
  LOG_LEVEL?: string;
  WORKSPACE_ROOT?: string;
}

export interface DatabaseConfig {
  url?: string;
  directUrl?: string;
  shadowDatabaseUrl?: string;
}

export interface AuthConfig {
  secret: string;
  providers: {
    discord?: {
      clientId: string;
      clientSecret: string;
    };
    worldanvil?: {
      clientId: string;
      clientSecret: string;
    };
  };
}

export interface ApiConfig {
  enabled: boolean;
  baseUrl: string;
  key?: string;
  port: number;
  timeout: number;
}

export interface CronConfig {
  enabled: boolean;
  timezone: string;
  eventCheckInterval: string;
}