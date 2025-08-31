import winston from 'winston';
import { inspect } from 'node:util';

interface LoggerInfo {
  timestamp?: string;
  level?: string;
  message: any;
  tags?: string[];
  [key: string]: any;
}

interface LoggerOptions {
  handleExceptions?: boolean;
  handleRejections?: boolean;
  exitOnError?: boolean;
  level?: string;
}

interface ClientWithShard {
  shard?: {
    ids: number[];
  };
}

const { createLogger, format } = winston;
const { transports } = winston;

/**
 * Configure a Winston logger with console and file transports
 * @param logger The Winston logger to configure
 * @param shardId The Discord shard ID or 'Manager' for the main process
 */
function loadWinstonLogger(logger: winston.Logger, shardId: number | string = 'Manager'): void {
  logger
    .add(
      new transports.Console({
        level: 'silly',
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.printf((info: LoggerInfo) => {
            const tags = info.tags ? info.tags.map((t: string) => `\x1B[36m${t}\x1B[39m`).join(', ') : '';
            const shardPrefix = ` --- [\x1B[36mShard ${shardId}\x1B[39m, ${tags}]:`;
            return `${info.timestamp} ${shardPrefix} ${info.message instanceof Error ? inspect(info.message, { depth: 0 }) : info.message}`;
          }),
        ),
      }),
    )
    .add(
      new transports.File({
        level: 'debug',
        filename: typeof shardId === 'number' ? `shard${shardId}.log` : 'manager.log',
        dirname: './logs',
        format: format.combine(
          format.timestamp(),
          format.uncolorize(),
          format.printf((info: LoggerInfo) => {
            const tags = info.tags ? info.tags.map((t: string) => `${t}`).join(', ') : '';
            return `${info.timestamp} --- [Shard ${shardId}, ${tags}]: ${info.message instanceof Error ? inspect(info.message, { depth: 0 }) : info.message}`;
          }),
        ),
      }),
    );
}

/**
 * Create a new Winston logger configured for application usage
 * @param options Logger configuration options
 * @param client Optional client with shard information
 * @returns Configured Winston logger instance
 */
function createWinstonLogger(options?: LoggerOptions, client?: ClientWithShard): winston.Logger {
  const logger = createLogger({
    handleExceptions: options?.handleExceptions ?? true,
    handleRejections: options?.handleRejections ?? true,
    exitOnError: false,
    level: options?.level ?? 'info',
  });
  loadWinstonLogger(logger, client?.shard?.ids[0] ?? 'Manager');

  return logger;
}

export { createWinstonLogger, loadWinstonLogger };
