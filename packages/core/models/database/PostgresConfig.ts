/**
 * PostgreSQL database configuration interface
 */
export interface PostgresConfig {
  /**
   * Database connection URL
   */
  url: string;
  
  /**
   * Connection URL without SSL (for local development)
   */
  url_no_ssl: string;
  
  /**
   * Non-pooling connection URL
   */
  url_non_pooling: string;
  
  /**
   * URL to use with Prisma ORM
   */
  url_prisma: string;
  
  /**
   * Database port
   * @default 5432
   */
  port: number;
  
  /**
   * Database host address
   */
  host: string;
  
  /**
   * Database username
   * @default 'default'
   */
  user: string;
  
  /**
   * Database password
   */
  password: string;
  
  /**
   * Database name
   */
  database: string;
}

/**
 * Default Postgres configuration values
 */
export const defaultPostgresConfig: PostgresConfig = {
  url: '',
  url_no_ssl: '',
  url_non_pooling: '',
  url_prisma: '',
  port: 5432,
  host: '',
  user: 'default',
  password: '',
  database: '',
};
