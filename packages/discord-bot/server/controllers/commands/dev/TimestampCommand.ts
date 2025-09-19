import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { ChatInputCommand } from '../../structures/Command';
import { DiscordBotServer } from '../../../DiscordBotServer';

export class TimestampCommand extends ChatInputCommand {
  constructor(client: DiscordBotServer) {
    super(client, {
      name: 'timestamp',
      description: 'Reads a date and returns a Discord timestamp',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'datetime',
          description: 'Date/time string (e.g., "2024-01-01 12:00" or "January 1, 2024")',
          required: false,
        },
      ],
    });
  }

  async execute({ interaction }: { interaction: ChatInputCommandInteraction; client: DiscordBotServer }): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const dateString = interaction.options.getString('datetime');
    
    let timestamp: number;
    
    if (dateString) {
      const parsedDate = Date.parse(dateString);
      
      if (isNaN(parsedDate)) {
        await interaction.reply({
          content: `\`${dateString}\` is not a valid date/time. Try formats like "2024-01-01 12:00" or "January 1, 2024".`,
          ephemeral: true,
        });
        return;
      }
      
      timestamp = Math.floor(parsedDate / 1000);
    } else {
      timestamp = now;
    }

    const tsTag = `<t:${timestamp}>`;
    const relativeTag = `<t:${timestamp}:R>`;

    await interaction.reply({
      content: `**Timestamp:** \`${tsTag}\` → ${tsTag}\n**Relative:** \`${relativeTag}\` → ${relativeTag}`,
      ephemeral: true,
    });
  }
}