/**
 * OpenAI Controller
 * Controller for OpenAI API endpoints
 */

import { OpenAiApiService } from '../services/OpenAiApiService';
import { OpenAiFunctionService } from '../services/OpenAiFunctionService';
import { OpenAiImageService } from '../services/OpenAiImageService';
import { OpenAiTextService } from '../services/OpenAiTextService';
import { OpenAiMessage, OpenAiFunctionDefinition, OpenAiChatCompletionRequest, OpenAiImageGenerationRequest } from '../../models/OpenAiResponses';

export class OpenAiController {
  private apiService: OpenAiApiService;
  private functionService: OpenAiFunctionService;
  private imageService: OpenAiImageService;
  private textService: OpenAiTextService;

  constructor() {
    // Initialize services using their singleton patterns
    this.apiService = OpenAiApiService.getInstance();
    this.functionService = new OpenAiFunctionService();
    this.imageService = new OpenAiImageService();
    this.textService = new OpenAiTextService();
  }

  /**
   * Send a message to OpenAI and get a response
   * @param message User message
   * @param systemPrompt Optional system prompt
   * @param model Optional model to use
   * @returns Response text from the assistant
   */
  async sendMessage(message: string, systemPrompt?: string, model?: string): Promise<string> {
    return this.textService.sendMessage(message, systemPrompt, model);
  }

  /**
   * Generate an image using OpenAI DALL-E
   * @param prompt Text prompt for image generation
   * @param size Optional size of the image
   * @returns URL of the generated image
   */
  async generateImage(prompt: string, size?: string): Promise<string> {
    return this.imageService.generateImageFromPrompt(prompt, size);
  }

  /**
   * Generate image with more options
   * @param request Image generation request
   * @returns Image generation response
   */
  async generateImageAdvanced(request: Partial<OpenAiImageGenerationRequest>) {
    return this.imageService.generateImage(request);
  }

  /**
   * Create a chat completion
   * @param request Chat completion request
   * @returns Chat completion response
   */
  async createChatCompletion(request: Partial<OpenAiChatCompletionRequest>) {
    return this.textService.createChatCompletion(request);
  }

  /**
   * Create a text completion (legacy endpoint)
   * @param prompt Text prompt
   * @param maxTokens Maximum tokens to generate
   * @param temperature Temperature for sampling
   * @returns Completion response
   */
  async createCompletion(prompt: string, maxTokens?: number, temperature?: number) {
    return this.textService.createCompletion({
      prompt,
      max_tokens: maxTokens,
      temperature
    });
  }

  /**
   * Call an AI function
   * @param messages Chat messages
   * @param functions List of function definitions
   * @param forceFunctionCall Optional function name to force call
   * @returns The chat completion response
   */
  async callFunction(
    messages: OpenAiChatCompletionRequest['messages'], 
    functions: OpenAiFunctionDefinition[],
    forceFunctionCall?: string
  ) {
    return this.functionService.callFunction(messages, functions, forceFunctionCall);
  }

  /**
   * Execute a function call and add the result to the conversation
   * @param messages Chat messages
   * @param functionMap Map of function names to handler functions
   * @param functions List of function definitions
   * @returns Updated messages array with function result
   */
  async executeFunctionCall(
    messages: OpenAiChatCompletionRequest['messages'],
    functionMap: Record<string, (args: any) => Promise<any>>,
    functions: OpenAiFunctionDefinition[]
  ) {
    return this.functionService.executeFunctionCall(messages, functionMap, functions);
  }
}