/**
 * OpenAI client configuration
 */

export interface OpenAIConfig {
  /**
   * OpenAI API key
   */
  apiKey: string;
  
  /**
   * OpenAI organization ID (optional)
   */
  organization?: string;
}

/**
 * Get OpenAI configuration from environment
 */
export function getOpenAIConfig(): OpenAIConfig {
  return {
    apiKey: process.env.OPENAI_API_KEY || '',
    organization: process.env.OPENAI_ORGANIZATION
  };
}