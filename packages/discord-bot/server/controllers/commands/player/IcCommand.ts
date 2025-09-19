import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { ChatInputCommand } from '../../structures/Command';
import { DiscordBotServer } from '../../../DiscordBotServer';

export class IcCommand extends ChatInputCommand {
  constructor(client: DiscordBotServer) {
    super(client, {
      name: 'ic',
      description: 'Speak, act, or move as your character (requires character system)',
      options: [
        {
          name: 'say',
          description: 'Say something in character',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'message',
              description: 'What your character says',
              required: true,
            },
          ],
        },
        {
          name: 'action',
          description: 'Perform an action as your character',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'description',
              description: 'Describe the action',
              required: true,
            },
          ],
        },
        {
          name: 'move',
          description: 'Move your character',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'direction',
              description: 'Direction to move',
              required: true,
            },
          ],
        },
      ],
    });
  }

  async execute({ interaction }: { interaction: ChatInputCommandInteraction; client: DiscordBotServer }): Promise<void> {
    // TODO: Implement in-character functionality - requires character system, webhooks, and potentially canvas for maps
    
    const subcommand = interaction.options.getSubcommand();
    
    await interaction.reply({
      content: `🎭 In-character command "${subcommand}" received. IC functionality is not yet implemented. Requires character system, webhook management, and potentially canvas/mapping systems.`,
      ephemeral: true,
    });

    console.info(`🎭 IC command "${subcommand}" executed by ${interaction.user.tag} (not implemented)`);
  }
}