import { prisma } from '../../data';

// Using the centralized Prisma client from @cfg/data

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
