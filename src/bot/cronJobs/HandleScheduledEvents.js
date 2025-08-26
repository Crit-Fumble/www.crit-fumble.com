import { EmbedBuilder } from 'discord.js';
import { apiManager } from '../Launcher.js';

export default {
  name: 'HandleScheduledEvents',
  schedule: '*/30 * * * *', // Run every 30 minutes
  
  async execute(client, logger) {
    try {
      logger.info('Checking for scheduled events');
      
      // Check if API is available
      const apiAvailable = await apiManager.isApiAvailable();
      if (!apiAvailable) {
        logger.warn('API is not available, skipping scheduled events check');
        return;
      }
      
      // Get upcoming events from the API
      const upcomingEvents = await apiManager.get('/events/upcoming');
      
      if (!upcomingEvents || upcomingEvents.length === 0) {
        logger.debug('No upcoming events found');
        return;
      }
      
      logger.info(`Found ${upcomingEvents.length} upcoming events`);
      
      // Process each event
      for (const event of upcomingEvents) {
        // Skip events that have already been processed
        if (event.notificationSent) {
          continue;
        }
        
        // Check if event is starting soon (within the next 30 minutes)
        const eventTime = new Date(event.startTime);
        const now = new Date();
        const minutesUntilEvent = Math.floor((eventTime - now) / 60000);
        
        if (minutesUntilEvent <= 30 && minutesUntilEvent >= 0) {
          logger.info(`Event ${event.name} is starting soon, sending notification`);
          
          // Find the channel to send the notification
          const channel = client.channels.cache.get(event.channelId);
          if (!channel) {
            logger.warn(`Channel ${event.channelId} not found for event ${event.name}`);
            continue;
          }
          
          // Create an embed for the event notification
          const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Event Reminder: ${event.name}`)
            .setDescription(event.description || 'No description provided')
            .addFields(
              { name: 'Start Time', value: eventTime.toLocaleString(), inline: true },
              { name: 'Campaign', value: event.campaignName || 'N/A', inline: true }
            )
            .setTimestamp();
          
          // Add location if available
          if (event.location) {
            embed.addFields({ name: 'Location', value: event.location, inline: true });
          }
          
          // Send the notification
          await channel.send({ 
            content: `@everyone Event starting soon: ${event.name}`,
            embeds: [embed]
          });
          
          // Mark event as notified in the database
          await apiManager.put(`/events/${event.id}`, { notificationSent: true });
        }
      }
    } catch (error) {
      logger.error(`Error handling scheduled events: ${error.message}`);
    }
  }
};
