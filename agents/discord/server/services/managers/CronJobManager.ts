import * as cron from 'node-cron';
import { DiscordBotServer } from '../../DiscordBotServer';

export class CronJobManager {
  private client: DiscordBotServer;
  private jobs: cron.ScheduledTask[] = [];

  constructor(client: DiscordBotServer) {
    this.client = client;
  }

  async loadCronJobs(): Promise<void> {
    // TODO: Implement dynamic cron job loading when needed
    // For now, cron jobs are handled by HandleScheduledEvents service
    console.info('📅 Cron job manager initialized (using HandleScheduledEvents for scheduling)');
  }

  addJob(schedule: string, task: () => void | Promise<void>): void {
    const job = cron.schedule(schedule, task, { scheduled: false });
    this.jobs.push(job);
  }

  startAll(): void {
    for (const job of this.jobs) {
      job.start();
    }
    console.info(`📅 Started ${this.jobs.length} cron jobs`);
  }

  stopAll(): void {
    for (const job of this.jobs) {
      job.stop();
    }
    console.info(`📅 Stopped ${this.jobs.length} cron jobs`);
  }
}