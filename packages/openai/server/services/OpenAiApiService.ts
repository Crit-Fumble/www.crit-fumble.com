import { OpenAiApiClient, IOpenAIClient } from '../clients/OpenAiApiClient';
import { getOpenAiConfig } from '../configs';

/**
 * OpenAI API Service
 * Base service for interacting with the OpenAI API
 */
export class OpenAiApiService {
  private static instance: OpenAiApiService;
  private apiClient: OpenAiApiClient;

  private constructor() {
    const config = getOpenAiConfig();
    this.apiClient = new OpenAiApiClient({
      apiKey: config.apiKey,
      organization: config.organization,
      defaultChatModel: config.defaultChatModel,
      defaultTemperature: config.defaultTemperature,
      defaultMaxTokens: config.defaultMaxTokens,
      defaultImageSize: config.defaultImageSize
    });
  }

  /**
   * Get a singleton instance of the OpenAI API service
   */
  public static getInstance(): OpenAiApiService {
    if (!OpenAiApiService.instance) {
      OpenAiApiService.instance = new OpenAiApiService();
    }
    return OpenAiApiService.instance;
  }

  /**
   * Get the OpenAI client instance
   */
  public getClient(): IOpenAIClient {
    return this.apiClient.getRawClient();
  }
  
  /**
   * Get the OpenAI API client instance
   */
  public getApiClient(): OpenAiApiClient {
    return this.apiClient;
  }
}