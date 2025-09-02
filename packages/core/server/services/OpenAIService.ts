import OpenAI from 'openai';
import { IOpenAIService } from '../../models/openai/IOpenAIService';
import { ConfigRegistry } from '../config/registry';
import { ApiKeyService } from './ApiKeyService';
import { ApiProvider } from '../../models/auth/ApiKey';

/**
 * Core implementation of OpenAI service integration
 */
export class OpenAIService implements IOpenAIService {
  private defaultClient: OpenAI;
  private apiKeyService: ApiKeyService;
  private initialized = false;

  /**
   * Create a new OpenAI service
   */
  constructor() {
    // Get API credentials from the registry
    const registry = ConfigRegistry.getInstance();
    const apiKey = registry.get<string>('OPENAI_API_KEY', '');
    const orgId = registry.get<string>('OPENAI_ORGANIZATION', undefined);
    
    // Initialize the default OpenAI client with app credentials
    this.defaultClient = new OpenAI({
      apiKey,
      organization: orgId
    });
    
    // Initialize the API key service
    this.apiKeyService = new ApiKeyService();
  }

  /**
   * Initialize the OpenAI service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    // Validate API key exists
    const apiKey = ConfigRegistry.getInstance().get<string>('OPENAI_API_KEY', '');
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    this.initialized = true;
  }

  /**
   * Get the OpenAI client
   * @param userId Optional user ID to get client with user's API credentials
   * @returns OpenAI client instance
   */
  async getClient(userId?: string): Promise<OpenAI> {
    // If no userId is provided, return the default client
    if (!userId) {
      return this.defaultClient;
    }
    
    try {
      // Try to get user's OpenAI API key
      const apiKeys = await this.apiKeyService.getForUser(userId, ApiProvider.OPENAI);
      if (apiKeys.length === 0) {
        console.log(`No OpenAI API key found for user ${userId}, using default client`);
        return this.defaultClient;
      }
      
      // Use the first valid API key (normally users will have just one)
      const apiKey = apiKeys[0];
      
      // Create a client with the user's API key
      return new OpenAI({
        apiKey: apiKey.key,
        organization: apiKey.token // Token field is used for organization ID if provided
      });
    } catch (error) {
      console.error('Error getting OpenAI client for user:', error);
      return this.defaultClient;
    }
  }

  /**
   * Create a chat completion
   */
  async createChatCompletion(
    messages: Array<any>,
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
      functions?: Array<any>;
      function_call?: string | { name: string };
      userId?: string;
    } = {}
  ): Promise<any> {
    try {
      const client = await this.getClient(options.userId);
      const model = options.model || 'gpt-4o';
      
      const completion = await client.chat.completions.create({
        model,
        messages,
        temperature: options.temperature,
        max_tokens: options.max_tokens,
        top_p: options.top_p,
        functions: options.functions,
        // Handle function_call based on its type
        ...(options.function_call && typeof options.function_call === 'string' && ['auto', 'none'].includes(options.function_call) ? 
          { function_call: options.function_call as 'auto' | 'none' } : 
          typeof options.function_call === 'object' ? 
            { function_call: options.function_call } : 
            {})
      });
      
      return completion;
    } catch (error) {
      console.error('OpenAI chat completion error:', error);
      throw error;
    }
  }

  /**
   * Create an embedding
   */
  async createEmbedding(
    input: string | string[],
    options: {
      model?: string;
      userId?: string;
    } = {}
  ): Promise<any> {
    try {
      const client = await this.getClient(options.userId);
      const model = options.model || 'text-embedding-3-large';
      
      const response = await client.embeddings.create({
        model,
        input
      });
      
      return response;
    } catch (error) {
      console.error('OpenAI embedding error:', error);
      throw error;
    }
  }

  /**
   * Create an image
   */
  async createImage(
    prompt: string,
    options: {
      size?: string;
      n?: number;
      response_format?: string;
      userId?: string;
    } = {}
  ): Promise<any> {
    try {
      const client = await this.getClient(options.userId);
      const response = await client.images.generate({
        prompt,
        n: options.n || 1,
        // Use type-safe values for size and response_format
        size: (options.size as "1024x1024" | "1792x1024" | "1024x1792" | undefined) || '1024x1024',
        response_format: (options.response_format as "url" | "b64_json" | undefined) || 'url'
      });
      
      return response;
    } catch (error) {
      console.error('OpenAI image generation error:', error);
      throw error;
    }
  }

  /**
   * Create a transcription
   */
  async createTranscription(
    audioFile: Buffer,
    options: {
      model?: string;
      language?: string;
      prompt?: string;
      response_format?: string;
      userId?: string;
    } = {}
  ): Promise<any> {
    try {
      const model = options.model || 'whisper-1';
      
      const client = await this.getClient(options.userId);
      const response = await client.audio.transcriptions.create({
        file: new File([audioFile], 'audio.mp3'),
        model,
        language: options.language,
        prompt: options.prompt,
        response_format: (options.response_format as "json" | "text" | "srt" | "verbose_json" | "vtt" | undefined) || 'json'
      });
      
      return response;
    } catch (error) {
      console.error('OpenAI transcription error:', error);
      throw error;
    }
  }
}
