import { OpenAiImageGenerationRequest, OpenAiImageGenerationResponse } from '../../models/OpenAiResponses';
import { getOpenAiConfig } from '../configs';
import { OpenAiApiService } from './OpenAiApiService';
import { OpenAiApiClient } from '../clients/OpenAiApiClient';

/**
 * OpenAI Image Service
 * Service for interacting with OpenAI's image generation endpoints
 */
export class OpenAiImageService {
  private apiClient: OpenAiApiClient;
  private config = getOpenAiConfig();

  constructor() {
    const apiService = OpenAiApiService.getInstance();
    this.apiClient = apiService.getApiClient();
  }

  /**
   * Generate an image using DALL-E
   * @param request Image generation request
   * @returns Image generation response
   */
  public async generateImage(request: Partial<OpenAiImageGenerationRequest>): Promise<OpenAiImageGenerationResponse> {
    const imageRequest: OpenAiImageGenerationRequest = {
      prompt: request.prompt || '',
      n: request.n || 1,
      size: request.size || this.config.defaultImageSize,
      response_format: request.response_format || 'url',
    };
    
    // Use the apiClient's generateImage method
    return await this.apiClient.generateImage(imageRequest);
  }

  /**
   * Generate an image from a text prompt
   * @param prompt Text prompt for image generation
   * @param size Optional size of the image
   * @returns URL of the generated image
   */
  public async generateImageFromPrompt(prompt: string, size?: string): Promise<string> {
    const response = await this.generateImage({
      prompt,
      size: size || this.config.defaultImageSize,
      n: 1,
      response_format: 'url'
    });
    
    return response.data[0]?.url || '';
  }
}