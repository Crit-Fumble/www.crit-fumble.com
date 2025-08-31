import OpenAI from 'openai';
import { getOpenAiConfig } from '../configs';

/**
 * OpenAI API Service
 * Base service for interacting with the OpenAI API
 */
export class OpenAiApiService {
  private static instance: OpenAiApiService;
  private client: OpenAI;

  private constructor() {
    const config = getOpenAiConfig();
    this.client = new OpenAI({
      apiKey: config.apiKey,
      organization: config.organization,
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
  public getClient(): OpenAI {
    return this.client;
  }
}