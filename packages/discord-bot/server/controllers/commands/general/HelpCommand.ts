import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ChatInputCommand } from '../../structures/Command';
import { DiscordBotServer } from '../../../DiscordBotServer';

export class HelpCommand extends ChatInputCommand {
  constructor(client: DiscordBotServer) {
    super(client, {
      name: 'help',
      description: 'A summary of commands.',
    });
  }

  async execute({ interaction }: { interaction: ChatInputCommandInteraction; client: DiscordBotServer }): Promise<void> {
    const botName = this.client.config.bot.name;
    
    const embed = new EmbedBuilder()
      .setColor(0x7289da)
      .setTitle('Commands')
      .setDescription(`A list of ${botName} commands.`)
      .addFields([
        {
          name: `@${botName}`,
          value: `@ mention ${botName} and it will reply`,
        },
        {
          name: '/write',
          value: 'Writes some text in response to a prompt',
        },
        {
          name: '/imagine',
          value: 'Creates an image from a text prompt',
        },
        {
          name: '/audio',
          value: 'Generates audio from text',
        },
        {
          name: '/roll',
          value: 'Roll dice with various notations (e.g., 1d20, 3d6+2)',
        },
        {
          name: '/character',
          value: 'Manage your RPG characters',
        },
        {
          name: '/help',
          value: 'Shows this help message',
        }
      ])
      .setFooter({ 
        text: `${botName} v${this.client.config.bot.version}`,
        iconURL: this.client.user?.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({ 
      embeds: [embed],
      ephemeral: true 
    });
  }
}