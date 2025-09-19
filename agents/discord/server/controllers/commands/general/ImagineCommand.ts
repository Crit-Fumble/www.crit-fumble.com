import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { ChatInputCommand } from '../../structures/Command';
import { DiscordBotServer } from '../../../DiscordBotServer';

export class ImagineCommand extends ChatInputCommand {
  constructor(client: DiscordBotServer) {
    super(client, {
      name: 'imagine',
      description: 'Generates an image in response to a prompt using AI',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'prompt',
          description: 'The prompt to generate an image for',
          required: true,
        },
        {
          name: 'size',
          description: 'Size of the generated image',
          type: ApplicationCommandOptionType.String,
          required: false,
          choices: [
            {
              name: '256x256',
              value: '256x256',
            },
            {
              name: '512x512',
              value: '512x512',
            },
            {
              name: '1024x1024',
              value: '1024x1024',
            },
          ],
        },
      ],
    });
  }

  async execute({ interaction }: { interaction: ChatInputCommandInteraction; client: DiscordBotServer }): Promise<void> {
    const prompt = interaction.options.getString('prompt', true);
    const size = interaction.options.getString('size') || '512x512';

    await interaction.deferReply();

    // Check if OpenAI is available
    if (!this.client.openai) {
      await interaction.editReply({
        content: 'AI image generation is not available. Please contact an administrator.',
      });
      return;
    }

    try {
      // TODO: Update to use DALL-E 4 and GPT-5 integration when available for better image generation
      const response = await this.client.openai.images.generate({
        prompt,
        size: size as '256x256' | '512x512' | '1024x1024', // TODO: Support newer sizes when DALL-E 4 is released
        n: 1,
        response_format: 'url',
        user: interaction.user.id,
      });

      const imageData = response.data?.[0];

      if (!imageData?.url) {
        await interaction.editReply({
          content: 'I couldn\'t generate an image for that prompt. Please try again.',
        });
        return;
      }

      await interaction.editReply({
        content: `[Link to Image](${imageData.url})`,
        embeds: [{
          title: 'Generated Image',
          description: prompt,
          image: {
            url: imageData.url,
          },
          color: 0x7289da,
        }],
      });
    } catch (error) {
      console.error('Error in ImagineCommand:', error);
      await interaction.editReply({
        content: 'Sorry, I encountered an error while trying to generate an image. Please try again later.',
      });
    }
  }
}