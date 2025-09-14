import { PrismaClient } from '@prisma/client';
import { type Prisma } from '@prisma/client';

interface DatabaseClientConfig {
  /**
   * Database connection URL
   */
  url?: string;
  /**
   * Optional logging configuration
   */
  log?: Prisma.LogLevel[] | Prisma.LogDefinition[];
}

/**
 * DatabaseClient is a wrapper around PrismaClient that provides
 * configurable initialization and consistent access to database models.
 */
export class DatabaseClient {
  private readonly prisma: PrismaClient;

  constructor(config?: DatabaseClientConfig) {
    this.prisma = new PrismaClient({
      log: config?.log,
      datasources: config?.url ? {
        db: {
          url: config.url
        }
      } : undefined
    });
  }

  /**
   * Get the underlying PrismaClient instance.
   */
  public get client(): PrismaClient {
    return this.prisma;
  }

  /**
   * Connect to the database. Should be called at application startup.
   */
  public async connect(): Promise<void> {
    await this.prisma.$connect();
  }

  /**
   * Disconnect from the database. Should be called during application shutdown.
   */
  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Singleton instance with default configuration for easy importing
const defaultDatabaseClient = new DatabaseClient();
export default defaultDatabaseClient;