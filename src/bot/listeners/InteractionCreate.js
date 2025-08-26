import { Events, InteractionType } from 'discord.js';

export default function(client, commandManager, logger) {
  client.on(Events.InteractionCreate, async interaction => {
    try {
      // Handle slash commands
      if (interaction.isChatInputCommand()) {
        await commandManager.handleCommand(interaction);
        return;
      }
      
      // Handle buttons
      if (interaction.isButton()) {
        logger.debug(`Button interaction: ${interaction.customId}`);
        // You can add button handling logic here or in a separate manager
        return;
      }
      
      // Handle select menus
      if (interaction.isStringSelectMenu() || interaction.isUserSelectMenu() || interaction.isRoleSelectMenu()) {
        logger.debug(`Select menu interaction: ${interaction.customId}`);
        // You can add select menu handling logic here
        return;
      }
      
      // Handle modals
      if (interaction.type === InteractionType.ModalSubmit) {
        logger.debug(`Modal submission: ${interaction.customId}`);
        // You can add modal handling logic here
        return;
      }
    } catch (error) {
      logger.error(`Error handling interaction: ${error}`);
    }
  });
}
