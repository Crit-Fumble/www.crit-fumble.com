import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows a list of available commands'),
    
  async execute(interaction) {
    const { commands } = interaction.client;
    const { commandManager } = await import('../../Launcher.js');
    
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('FumbleBot Commands')
      .setDescription('Here are all the available commands:')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setTimestamp()
      .setFooter({ text: 'Crit Fumble Bot', iconURL: interaction.client.user.displayAvatarURL() });
    
    // Group commands by category (folder)
    const commandsByCategory = {};
    
    for (const [name, command] of commandManager.commands) {
      // Determine the category from the file path
      const category = command.data?.category || 'General';
      
      if (!commandsByCategory[category]) {
        commandsByCategory[category] = [];
      }
      
      commandsByCategory[category].push(`**/${name}** - ${command.data.description}`);
    }
    
    // Add each category to the embed
    for (const [category, commandList] of Object.entries(commandsByCategory)) {
      embed.addFields({ name: category, value: commandList.join('\n') });
    }
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
