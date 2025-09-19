import { PrismaClient } from '@prisma/client';
interface PrismaOptions {
    databaseUrl?: string;
    log?: Array<'query' | 'info' | 'warn' | 'error'>;
}
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
/**
 * Get a Prisma client instance
 *
 * @param options Optional configuration for the Prisma client
 * @returns A PrismaClient instance
 */
export declare function getPrismaClient(options?: PrismaOptions): PrismaClient;
export {};
//# sourceMappingURL=prisma.d.ts.map