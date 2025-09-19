import { CommandInteraction, Webhook } from 'discord.js';

export const DEFAULT_TOKEN = 'https://www.worldanvil.com/uploads/images/0698a091e4f1360c364f76c24046d69f.png';

interface Character {
  id: string;
  name: string;
  token?: {
    attachment?: string;
  };
}

interface Database {
  getCharacter(params: { userId: string; channelId: string }): Promise<Character | null>;
}

export const makeCharacterWebhook = async (
  interaction: CommandInteraction, 
  database: Database
): Promise<Webhook | null> => {
  const isThread = interaction.channel?.isThread();
  const channelId = isThread 
    ? interaction.channel?.parent?.id 
    : interaction.channel?.id;

  if (!channelId) {
    return null;
  }

  const character = await database.getCharacter({ 
    userId: interaction.user.id, 
    channelId 
  });

  if (character?.id && interaction.guild) {
    try {
      const webhook = await interaction.guild.channels.createWebhook({
        name: character.name,
        avatar: character.token?.attachment ?? DEFAULT_TOKEN,
        channel: interaction.channelId,
        reason: 'Character Command',
      });

      return webhook;
    } catch (error) {
      console.error('Failed to create character webhook:', error);
      return null;
    }
  }

  return null;
};