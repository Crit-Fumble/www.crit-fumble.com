/**
 * Prisma client singleton for the core package
 */
import { PrismaClient } from '@prisma/client';
import { isProduction } from '../config/EnvironmentConfig';

// Create a singleton instance of the PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Export a single instance of Prisma
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// In development environments, attach prisma to the global object to prevent multiple instances
if (!isProduction()) {
  globalForPrisma.prisma = prisma;
}
