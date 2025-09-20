import { PrismaClient } from '@prisma/client';
import { isDevelopment, isProduction } from './models/config/EnvironmentConfig';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit during hot reloading.
// Learn more: https://pris.ly/d/help/next-js-best-practices

interface PrismaOptions {
  databaseUrl?: string;
  log?: Array<'query' | 'info' | 'warn' | 'error'>;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient; customClients: Record<string, PrismaClient> };

// Initialize the custom clients object
if (!globalForPrisma.customClients) {
  globalForPrisma.customClients = {};
}

/**
 * For migrations and database operations, we load the database URL from environment
 * but this is not exported as part of the package
 */
function getDatabaseUrl(): string {
  // This is only used for CLI operations like migrations
  // Not exported as part of the package
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Fallback to legacy Vercel Postgres environment variable
  if (process.env.POSTGRES_PRISMA_URL) {
    return process.env.POSTGRES_PRISMA_URL;
  }
  
  throw new Error('Database URL not configured. Set DATABASE_URL or POSTGRES_PRISMA_URL environment variable');
}

// Initialize the default client immediately
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: isDevelopment() 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
}

// Export the default Prisma instance immediately
export const prisma = globalForPrisma.prisma;

/**
 * Get a Prisma client instance
 * 
 * @param options Optional configuration for the Prisma client
 * @returns A PrismaClient instance
 */
export function getPrismaClient(options?: PrismaOptions): PrismaClient {
  const databaseUrl = options?.databaseUrl;
  
  // If a specific database URL is provided, create a custom client for it
  if (databaseUrl) {
    const clientKey = `prisma-${databaseUrl}`;
    
    if (!globalForPrisma.customClients[clientKey]) {
      globalForPrisma.customClients[clientKey] = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl
          }
        },
        log: options?.log || (isDevelopment() ? ['error', 'warn'] : ['error'])
      });
    }
    
    return globalForPrisma.customClients[clientKey];
  }
  
  // Otherwise use the default client that we already initialized
  return globalForPrisma.prisma;
}

// For development debugging - make sure global instance stays consistent
if (!isProduction()) {
  globalForPrisma.prisma = prisma;
}

