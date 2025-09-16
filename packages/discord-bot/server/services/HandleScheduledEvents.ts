import { GuildScheduledEvent, Client } from 'discord.js';
import * as cron from 'node-cron';

const MINUTE = 1000 * 60;

export class HandleScheduledEvents {
  private schedule: string;
  private task: cron.ScheduledTask | null;

  constructor() {
    this.schedule = '* * * * *'; // Every minute
    this.task = null;
  }

  /**
   * Start the scheduled event handler
   */
  start(client?: Client): void {
    this.task = cron.schedule(this.schedule, () => {
      if (client) {
        this.execute(client);
      }
    });
  }

  /**
   * Stop the scheduled event handler
   */
  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
    }
  }

  /**
   * Execute scheduled event checks
   */
  async execute(client: Client): Promise<void> {
    try {
      console.log('🔄 Checking scheduled events...');
      
      // Get all guilds the bot is in
      const guilds = client.guilds.cache;
      
      for (const [guildId, guild] of guilds) {
        try {
          // Fetch scheduled events for this guild
          const events = await guild.scheduledEvents.fetch();
          
          for (const [eventId, event] of events) {
            // Check if event is starting soon (within next 5 minutes)
            if (event.status === 'Scheduled') {
              const timeUntilStart = event.scheduledStartTimestamp! - Date.now();
              
              if (timeUntilStart > 0 && timeUntilStart <= 5 * MINUTE) {
                console.log(`⏰ Event "${event.name}" starting soon in guild ${guild.name}`);
                // TODO: Send notifications, update campaign status, etc.
              }
            }
            
            // Check if event just ended
            if (event.status === 'Completed') {
              console.log(`✅ Event "${event.name}" completed in guild ${guild.name}`);
              // TODO: Archive session data, update campaign progress, etc.
            }
          }
        } catch (error) {
          console.error(`❌ Error checking events for guild ${guild.name}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ Error in scheduled event handler:', error);
    }
  }
}