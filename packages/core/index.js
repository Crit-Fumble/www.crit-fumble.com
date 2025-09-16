/**
 * @crit-fumble/core main exports
 */

// Core database exports
export { prisma } from './prisma.ts';
// Re-export types from @prisma/client for convenience
export * as PrismaClient from '@prisma/client';

// Model exports
export * as Models from './models';

// Client-side exports (browser-safe)
export * as client from './client/index';

// Server-side exports (Node.js only)
export * as server from './server';

// Specialized package exports (only keeping WorldAnvil as it has no official SDK)
export * as worldanvil from '@crit-fumble/worldanvil';
