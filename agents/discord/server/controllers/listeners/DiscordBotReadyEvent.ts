import { ReadyEvent } from '../structures/Event';
import { DiscordBotServer } from '../../DiscordBotServer';
import { HandleScheduledEvents } from '../../services/HandleScheduledEvents';

export class DiscordBotReadyEvent extends ReadyEvent {
  async execute(client: DiscordBotServer): Promise<void> {
    console.info(`🤖 Bot logged in as ${client.user?.tag}`);
    console.info(`📊 Connected to ${client.guilds.cache.size} guilds`);
    console.info(`👥 Serving ${client.users.cache.size} users`);

    // Set up error handlers
    client.on('error', (error) => {
      console.error('Discord client error:', error);
    });

    process.on('unhandledRejection', (error) => {
      console.error('Unhandled promise rejection:', error);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught exception:', error);
    });

    // Start scheduled event monitoring if enabled
    if (client.config.cron.enabled) {
      HandleScheduledEvents.startMonitoring(client);
    }

    console.info('✅ Bot is ready and operational!');
  }
}