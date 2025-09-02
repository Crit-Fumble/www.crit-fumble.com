import OpenAI from 'openai';

/**
 * Core interface for OpenAI service integration
 */
export interface IOpenAIService {
  /**
   * Initialize the OpenAI service
   */
  initialize(): Promise<void>;

  /**
   * Get the OpenAI client
   * @param userId Optional user ID to get client with user's API credentials
   */
  getClient(userId?: string): Promise<OpenAI>;

  /**
   * Create a chat completion
   */
  createChatCompletion(
    messages: Array<any>,
    options?: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
      functions?: Array<any>;
      function_call?: string | { name: string };
    }
  ): Promise<any>;

  /**
   * Create an embedding
   */
  createEmbedding(
    input: string | string[],
    options?: {
      model?: string;
    }
  ): Promise<any>;

  /**
   * Create an image
   */
  createImage(
    prompt: string,
    options?: {
      size?: string;
      n?: number;
      response_format?: string;
    }
  ): Promise<any>;

  /**
   * Create a transcription
   */
  createTranscription(
    file: any,
    options?: {
      model?: string;
      language?: string;
      prompt?: string;
      response_format?: string;
    }
  ): Promise<any>;
}
