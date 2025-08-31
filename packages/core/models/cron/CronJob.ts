/**
 * Base CronJob class for Discord bot scheduled tasks
 * All Discord bot cron jobs should extend this class
 */
export abstract class CronJob {
  /**
   * Cron schedule expression
   * Format: minute hour day-of-month month day-of-week
   * Example: '0 * * * *' (every hour at minute 0)
   */
  public schedule: string;

  constructor() {
    this.schedule = '* * * * *'; // Default to every minute
  }

  /**
   * Execute the cron job with the given client
   * This method must be implemented by all cron job classes
   */
  abstract execute(client: any): Promise<void> | void;
}
