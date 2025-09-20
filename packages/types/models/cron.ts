/**
 * Cron job scheduling types
 * Re-exports node-cron types for shared use across API and agent
 */

import type { ScheduleOptions, ScheduledTask } from 'node-cron';

// Re-export node-cron types
export type { ScheduleOptions, ScheduledTask };

// Extended cron job types for our application
export interface CronJobConfig {
  /** Cron expression for scheduling */
  schedule: string;
  /** Human-readable description of the job */
  description: string;
  /** Whether the job is enabled */
  enabled: boolean;
  /** Timezone for the cron job */
  timezone?: string;
  /** Whether to start the job immediately */
  scheduled?: boolean;
}

export interface CronJobDefinition extends CronJobConfig {
  /** Unique identifier for the job */
  id: string;
  /** Function to execute when the cron job runs */
  task: () => void | Promise<void>;
}

export interface CronJobStatus {
  /** Job identifier */
  id: string;
  /** Whether the job is currently running */
  running: boolean;
  /** Last execution timestamp */
  lastRun?: Date;
  /** Next scheduled execution timestamp */
  nextRun?: Date;
  /** Error from last execution if any */
  lastError?: string;
}

// Common cron patterns for convenience
export const CRON_PATTERNS = {
  EVERY_MINUTE: '* * * * *',
  EVERY_5_MINUTES: '*/5 * * * *',
  EVERY_15_MINUTES: '*/15 * * * *',
  EVERY_30_MINUTES: '*/30 * * * *',
  EVERY_HOUR: '0 * * * *',
  EVERY_2_HOURS: '0 */2 * * *',
  EVERY_6_HOURS: '0 */6 * * *',
  EVERY_12_HOURS: '0 */12 * * *',
  DAILY_AT_MIDNIGHT: '0 0 * * *',
  DAILY_AT_NOON: '0 12 * * *',
  WEEKLY_SUNDAY_MIDNIGHT: '0 0 * * 0',
  MONTHLY_FIRST_DAY: '0 0 1 * *',
} as const;

export type CronPattern = typeof CRON_PATTERNS[keyof typeof CRON_PATTERNS];