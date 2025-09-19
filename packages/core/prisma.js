import { PrismaClient } from '@prisma/client';
import { isDevelopment, isProduction } from './models/configs/EnvironmentConfig';
var globalForPrisma = global;
// Initialize the custom clients object
if (!globalForPrisma.customClients) {
    globalForPrisma.customClients = {};
}
/**
 * For migrations and database operations, we load the database URL from environment
 * but this is not exported as part of the package
 */
function getDatabaseUrl() {
    // This is only used for CLI operations like migrations
    // Not exported as part of the package
    if (process.env.POSTGRES_PRISMA_URL) {
        return process.env.POSTGRES_PRISMA_URL;
    }
    throw new Error('Database URL not configured. Set POSTGRES_PRISMA_URL environment variable');
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
export var prisma = globalForPrisma.prisma;
/**
 * Get a Prisma client instance
 *
 * @param options Optional configuration for the Prisma client
 * @returns A PrismaClient instance
 */
export function getPrismaClient(options) {
    var databaseUrl = options === null || options === void 0 ? void 0 : options.databaseUrl;
    // If a specific database URL is provided, create a custom client for it
    if (databaseUrl) {
        var clientKey = "prisma-".concat(databaseUrl);
        if (!globalForPrisma.customClients[clientKey]) {
            globalForPrisma.customClients[clientKey] = new PrismaClient({
                datasources: {
                    db: {
                        url: databaseUrl
                    }
                },
                log: (options === null || options === void 0 ? void 0 : options.log) || (isDevelopment() ? ['error', 'warn'] : ['error'])
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
//# sourceMappingURL=prisma.js.map