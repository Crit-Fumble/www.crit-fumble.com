import { OpenAiConfig } from '../../models/OpenAiConfig';

/**
 * Get OpenAI configuration from environment variables
 * @returns OpenAI configuration
 */
export function getOpenAiConfig(): OpenAiConfig {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || '';
  
  if (!apiKey) {
    console.warn('OpenAI API key not found in environment variables');
  }
  
  return {
    apiKey,
    defaultChatModel: process.env.OPENAI_CHAT_MODEL || 'gpt-4',
    defaultEmbeddingModel: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    defaultTemperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    defaultMaxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000', 10),
    defaultImageSize: process.env.OPENAI_IMAGE_SIZE || '1024x1024',
    organization: process.env.OPENAI_ORGANIZATION,
  };
}