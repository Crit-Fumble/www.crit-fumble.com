/**
 * OpenAI Configuration Models
 */

export interface OpenAiConfig {
  /**
   * OpenAI API key
   */
  apiKey: string;
  
  /**
   * Default model to use for chat completions
   * @default 'gpt-4'
   */
  defaultChatModel: string;
  
  /**
   * Default model to use for embeddings
   * @default 'text-embedding-3-small'
   */
  defaultEmbeddingModel: string;
  
  /**
   * Default temperature for chat completions
   * @default 0.7
   */
  defaultTemperature: number;
  
  /**
   * Default maximum tokens for chat completions
   * @default 1000
   */
  defaultMaxTokens: number;
  
  /**
   * Default image generation size
   * @default '1024x1024'
   */
  defaultImageSize: string;
  
  /**
   * Organization ID (optional)
   */
  organization?: string;
}
