import { Client, GuildScheduledEventStatus } from 'discord.js';
import * as cron from 'node-cron';

const MINUTE = 1000 * 60;

/**
 * Handles scheduled Discord events (like gaming sessions)
 * Provides notifications and integration with campaign management
 */
export class HandleScheduledEvents {
  private static cronJob: cron.ScheduledTask | null = null;

  /**
   * Start monitoring scheduled events every 5 minutes
   */
  public static startMonitoring(client: Client): void {
    console.info('🔄 Starting scheduled event monitoring...');
    
    // Run every 5 minutes
    this.cronJob = cron.schedule('*/5 * * * *', () => {
      this.checkScheduledEvents(client);
    });
    
    // Run immediately on startup
    this.checkScheduledEvents(client);
  }

  /**
   * Stop monitoring scheduled events
   */
  public static stopMonitoring(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.info('⏹️ Stopped scheduled event monitoring');
    }
  }

  /**
   * Check all guilds for scheduled events that need attention
   */
  private static async checkScheduledEvents(client: Client): Promise<void> {
    try {
      console.info('🔄 Checking scheduled events...');
      
      // Get all guilds the bot is in
      const guilds = client.guilds.cache;
      
      // Skip if bot is not in any guilds
      if (guilds.size === 0) {
        console.info('ℹ️ Bot is not in any guilds, skipping event check');
        return;
      }
      
      console.info(`📊 Checking events across ${guilds.size} guild(s)`);
      
      const guildArray = Array.from(guilds.values());
      
      for (const guild of guildArray) {
        try {
          // Fetch scheduled events for this guild
          const events = await guild.scheduledEvents.fetch();
          
          // Skip if no events in this guild
          if (events.size === 0) {
            console.info(`ℹ️ No scheduled events in guild: ${guild.name}`);
            continue;
          }
          
          console.info(`📅 Found ${events.size} event(s) in guild: ${guild.name}`);
          
          const eventArray = Array.from(events.values());
          
          for (const event of eventArray) {
            // Check if event is starting soon (within next 5 minutes)
            if (event.status === GuildScheduledEventStatus.Scheduled) {
              const timeUntilStart = event.scheduledStartTimestamp! - Date.now();
              
              if (timeUntilStart > 0 && timeUntilStart <= 5 * MINUTE) {
                console.info(`⏰ Event \"${event.name}\" starting soon in guild ${guild.name}`);
                // TODO: Send notifications, update campaign status, etc.
              }
            }
            
            // Check if event just ended
            if (event.status === GuildScheduledEventStatus.Completed) {
              console.info(`✅ Event \"${event.name}\" has completed`);
              // TODO: Archive session data, update campaign progress, etc.
            }
          }
        } catch (error) {
          console.error(`❌ Error checking events for guild ${guild.name}:`, error);
        }
      }
      
      console.info('✅ Scheduled event check completed');
    } catch (error) {
      console.error('❌ Error in scheduled event handler:', error);
    }
  }
}
