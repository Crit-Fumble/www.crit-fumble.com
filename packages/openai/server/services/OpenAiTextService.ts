import { OpenAiChatCompletionRequest, OpenAiChatCompletionResponse, OpenAiCompletionRequest, OpenAiCompletionResponse, OpenAiMessage } from '../../models/OpenAiResponses';
import { getOpenAiConfig } from '../configs';
import { OpenAiApiService } from './OpenAiApiService';
import { OpenAiApiClient } from '../clients/OpenAiApiClient';

/**
 * OpenAI Text Service
 * Service for interacting with OpenAI's text-based endpoints
 */
export class OpenAiTextService {
  private apiClient: OpenAiApiClient;
  private config = getOpenAiConfig();

  constructor() {
    // Get the API client from the API service
    const apiService = OpenAiApiService.getInstance();
    this.apiClient = apiService.getApiClient();
  }

  /**
   * Send a chat completion request to OpenAI
   * @param request Chat completion request
   * @returns Chat completion response
   */
  public async createChatCompletion(request: Partial<OpenAiChatCompletionRequest>): Promise<OpenAiChatCompletionResponse> {
    // Use the apiClient directly
    
    const completionRequest: OpenAiChatCompletionRequest = {
      model: request.model || this.config.defaultChatModel,
      messages: request.messages || [],
      temperature: request.temperature ?? this.config.defaultTemperature,
      max_tokens: request.max_tokens ?? this.config.defaultMaxTokens,
      ...(request.functions && { functions: request.functions }),
      ...(request.function_call && { function_call: request.function_call }),
    };
    
    // Use the apiClient's createChatCompletion method
    return await this.apiClient.createChatCompletion(completionRequest);
  }

  /**
   * Send a simple message to the chat API and get a response
   * @param message User message
   * @param systemPrompt Optional system prompt
   * @param model Optional model to use
   * @returns Response text from the assistant
   */
  public async sendMessage(message: string, systemPrompt?: string, model?: string): Promise<string> {
    const messages: OpenAiMessage[] = [];
    
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    
    messages.push({
      role: 'user',
      content: message
    });
    
    const response = await this.createChatCompletion({
      model: model || this.config.defaultChatModel,
      messages
    });
    
    return response.choices[0]?.message.content || '';
  }

  /**
   * Create a text completion (legacy endpoint)
   * @param request Completion request
   * @returns Completion response
   */
  public async createCompletion(request: Partial<OpenAiCompletionRequest>): Promise<OpenAiCompletionResponse> {
    const completionRequest: OpenAiCompletionRequest = {
      model: request.model || 'text-davinci-003', // Legacy model
      prompt: request.prompt || '',
      max_tokens: request.max_tokens ?? this.config.defaultMaxTokens,
      temperature: request.temperature ?? this.config.defaultTemperature,
    };
    
    // Use the apiClient's createCompletion method
    return await this.apiClient.createCompletion(completionRequest);
  }
}