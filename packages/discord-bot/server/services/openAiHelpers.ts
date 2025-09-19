import { Message, ChatInputCommandInteraction } from 'discord.js';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Rough token counting - approximates 1 token per 4 characters
 * For production use, consider using tiktoken or similar
 */
export function countTokens(messages: ChatMessage[]): number {
  return messages.reduce((total, message) => {
    if (!message?.content) return total;
    // Rough approximation: 1 token ≈ 4 characters
    return total + Math.ceil(message.content.length / 4);
  }, 0);
}

export function trimMessages(messages: ChatMessage[]): ChatMessage[] {
  const newMessages = [...messages];
  const maxTokens = 3500; // Leave room for response tokens
  
  while (countTokens(newMessages) > maxTokens && newMessages.length > 1) {
    newMessages.shift(); // Remove oldest message
  }

  return newMessages;
}

export function formatMessages(messages: Message[], botId: string): ChatMessage[] {
  return messages
    .filter(msg => msg?.content && msg.content.trim().length > 0)
    .map(msg => ({
      role: msg.author.id === botId ? 'assistant' : 'user',
      content: msg.content.trim(),
    }));
}

export async function getChannelMessages(
  interaction: ChatInputCommandInteraction,
  limit: number = 32
): Promise<ChatMessage[]> {
  if (!interaction.channel) {
    return [];
  }

  try {
    const rawMessages = await interaction.channel.messages.fetch({ limit });
    const messagesArray = Array.from(rawMessages.values()).reverse();
    const botId = interaction.client.user?.id || '';
    
    const formatted = formatMessages(messagesArray, botId);
    return trimMessages(formatted);
  } catch (error) {
    console.error('Error fetching channel messages:', error);
    return [];
  }
}