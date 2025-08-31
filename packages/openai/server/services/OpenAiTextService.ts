import { OpenAiChatCompletionRequest, OpenAiChatCompletionResponse, OpenAiCompletionRequest, OpenAiCompletionResponse, OpenAiMessage } from '../../models/OpenAiResponses';
import { getOpenAiConfig } from '../configs';
import { OpenAiApiService } from './OpenAiApiService';

/**
 * OpenAI Text Service
 * Service for interacting with OpenAI's text-based endpoints
 */
export class OpenAiTextService {
  private apiService: OpenAiApiService;
  private config = getOpenAiConfig();

  constructor() {
    this.apiService = OpenAiApiService.getInstance();
  }

  /**
   * Send a chat completion request to OpenAI
   * @param request Chat completion request
   * @returns Chat completion response
   */
  public async createChatCompletion(request: Partial<OpenAiChatCompletionRequest>): Promise<OpenAiChatCompletionResponse> {
    const client = this.apiService.getClient();
    
    const completionRequest: OpenAiChatCompletionRequest = {
      model: request.model || this.config.defaultChatModel,
      messages: request.messages || [],
      temperature: request.temperature ?? this.config.defaultTemperature,
      max_tokens: request.max_tokens ?? this.config.defaultMaxTokens,
      ...(request.functions && { functions: request.functions }),
      ...(request.function_call && { function_call: request.function_call }),
    };
    
    const response = await client.chat.completions.create(completionRequest as any);
    return response as any as OpenAiChatCompletionResponse;
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
    const client = this.apiService.getClient();
    
    const completionRequest: OpenAiCompletionRequest = {
      model: request.model || 'text-davinci-003', // Legacy model
      prompt: request.prompt || '',
      max_tokens: request.max_tokens ?? this.config.defaultMaxTokens,
      temperature: request.temperature ?? this.config.defaultTemperature,
    };
    
    const response = await client.completions.create(completionRequest as any);
    return response as any as OpenAiCompletionResponse;
  }
}