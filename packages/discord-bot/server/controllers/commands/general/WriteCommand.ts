import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { ChatInputCommand } from '../../structures/Command';
import { DiscordBotServer } from '../../../DiscordBotServer';

export class WriteCommand extends ChatInputCommand {
  constructor(client: DiscordBotServer) {
    super(client, {
      name: 'write',
      description: 'Writes some text in response to a prompt using AI',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'prompt',
          description: 'The prompt to respond to',
          required: true,
        },
      ],
    });
  }

  async execute({ interaction }: { interaction: ChatInputCommandInteraction; client: DiscordBotServer }): Promise<void> {
    const prompt = interaction.options.getString('prompt', true);
    
    await interaction.deferReply();

    // Check if OpenAI is available
    if (!this.client.openai) {
      await interaction.editReply({
        content: 'AI text generation is not available. Please contact an administrator.',
      });
      return;
    }

    try {
      // TODO: Update to use GPT-5 when available for better text generation
      const response = await this.client.openai.chat.completions.create({
        messages: [{
          role: 'user',
          content: prompt,
        }],
        model: 'gpt-3.5-turbo', // TODO: Upgrade to 'gpt-5' when released
        user: interaction.user.id,
        max_tokens: 400,
        temperature: 0.7,
      });

      const generatedText = response.choices[0]?.message?.content;

      if (!generatedText) {
        await interaction.editReply({
          content: 'I couldn\'t generate a response to that prompt. Please try again.',
        });
        return;
      }

      await interaction.editReply({
        content: generatedText,
      });
    } catch (error) {
      console.error('Error in WriteCommand:', error);
      await interaction.editReply({
        content: 'Sorry, I encountered an error while trying to generate text. Please try again later.',
      });
    }
  }
}