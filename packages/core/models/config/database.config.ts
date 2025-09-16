/**
 * Database configuration for PostgreSQL/Prisma
 */

export interface DatabaseConfig {
  /**
   * Main database connection URL
   */
  url: string;
}

/**
 * Get database configuration from environment
 */
export function getDatabaseConfig(): DatabaseConfig {
  return {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL_PRISMA || ''
  };
}