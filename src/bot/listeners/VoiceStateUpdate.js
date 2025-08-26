import { Events } from 'discord.js';

export default function(client, logger) {
  client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    try {
      // User joined a voice channel
      if (!oldState.channelId && newState.channelId) {
        logger.debug(`User ${newState.member.user.tag} joined voice channel ${newState.channel.name}`);
        // Add your custom logic here for when a user joins a voice channel
      }
      
      // User left a voice channel
      if (oldState.channelId && !newState.channelId) {
        logger.debug(`User ${oldState.member.user.tag} left voice channel ${oldState.channel.name}`);
        // Add your custom logic here for when a user leaves a voice channel
      }
      
      // User moved to a different voice channel
      if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
        logger.debug(`User ${newState.member.user.tag} moved from ${oldState.channel.name} to ${newState.channel.name}`);
        // Add your custom logic here for when a user moves between voice channels
      }
    } catch (error) {
      logger.error(`Error handling voice state update: ${error}`);
    }
  });
}
