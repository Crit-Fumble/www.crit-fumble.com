/**
 * Logger utility for application-wide logging with environment-based filtering
 * Provides a consistent API for logging that automatically disables verbose logs in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isProduction = process.env.NODE_ENV === 'production';

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  /**
   * Log debug information - only appears in development
   */
  debug(...args: any[]): void {
    if (!isProduction) {
      console.debug(`[${this.context}]`, ...args);
    }
  }

  /**
   * Log general information - reduced in production
   */
  info(...args: any[]): void {
    if (!isProduction || this.isCriticalInfo(args)) {
      console.info(`[${this.context}]`, ...args);
    }
  }

  /**
   * Log warnings - shown in all environments
   */
  warn(...args: any[]): void {
    console.warn(`[${this.context}]`, ...args);
  }

  /**
   * Log errors - always shown in all environments
   */
  error(...args: any[]): void {
    console.error(`[${this.context}]`, ...args);
  }

  /**
   * Check if this is important info that should be logged in production
   */
  private isCriticalInfo(args: any[]): boolean {
    // Log authentication events, performance metrics, etc. in production
    const criticalKeywords = ['auth', 'login', 'performance', 'critical', 'error'];
    const message = args.join(' ').toLowerCase();
    return criticalKeywords.some(keyword => message.includes(keyword));
  }
}

/**
 * Create a logger instance for a specific module
 */
export default function createLogger(context: string): Logger {
  return new Logger(context);
}
