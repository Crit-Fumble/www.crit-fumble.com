import { Events } from 'discord.js';

export default function(client, logger) {
  client.on(Events.ClientReady, () => {
    logger.info(`Ready! Logged in as ${client.user.tag}`);
    logger.info(`Bot is in ${client.guilds.cache.size} servers`);
    
    // Set bot activity
    client.user.setActivity('/help for commands', { type: 'PLAYING' });
  });
}
