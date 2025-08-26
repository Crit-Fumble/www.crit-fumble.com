import { PrismaClient } from '@prisma/client';
import { postgres } from '../config/services';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit during hot reloading.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    datasources: {
      db: {
        url: postgres.url_prisma,
      },
    },
    // Log queries only in development and only if they're slow
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Wrapper for database operations to ensure proper connection handling
 * 
 * @param fn Function that performs database operations
 * @returns The result of the database operations
 */
export async function withDb<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error('Database operation error:', error);
    throw error;
  }
}

export default prisma;
