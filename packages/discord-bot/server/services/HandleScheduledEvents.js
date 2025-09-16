import { GuildScheduledEventStatus } from 'discord.js';
import * as cron from 'node-cron';

const MINUTE = 1000 * 60;

export default class HandleScheduledEvents {
  constructor() {
    this.schedule = '* * * * *'; // Every minute
    this.task = null;
  }

  /**
   * Start the scheduled event handler
   */
  start(client) {
    this.task = cron.schedule(this.schedule, () => {
      this.execute(client);
    });
  }

  /**
   * Stop the scheduled event handler
   */
  stop() {
    if (this.task) {
      this.task.stop();
    }
  }

  async execute(client) {
    try {
      await this.startEvents(client);
      await this.endEvents(client);
    } catch (error) {
      client.logger?.error('Error handling scheduled events:', error);
    }
  }

  async startEvents(client) {
    const guilds = await client.guilds.cache;
    guilds?.forEach(async guild => {
      try {
        const allScheduledEvents = await guild?.scheduledEvents?.fetch();
        const startingScheduledEvents = allScheduledEvents
          ?.filter(ev => MINUTE > (new Date(ev.scheduledStartTimestamp).getTime() - Date.now()));
        startingScheduledEvents
          ?.forEach((ev) => ev.setStatus(GuildScheduledEventStatus.Active));
      } catch (error) {
        client.logger?.error(`Error starting events for guild ${guild.id}:`, error);
      }
    });
  }

  async endEvents(client) {
    const guilds = await client.guilds.cache;

    guilds?.forEach(async guild => {
      try {
        const allCurrentEvents = await guild?.scheduledEvents?.fetch();
        const activeEvents = allCurrentEvents
          ?.filter(ev => ev.status === GuildScheduledEventStatus.Active);
        const emptyActiveEvents = activeEvents
          ?.filter(ev => ev.voiceChannel?.members?.size === 0);
        emptyActiveEvents
          ?.forEach((ev) => ev.setStatus(GuildScheduledEventStatus.Completed));
      } catch (error) {
        client.logger?.error(`Error ending events for guild ${guild.id}:`, error);
      }
    });
  }
}
