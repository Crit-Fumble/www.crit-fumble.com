import { OpenAiChatCompletionRequest, OpenAiChatCompletionResponse, OpenAiFunctionDefinition } from '../../models/OpenAiResponses';
import { getOpenAiConfig } from '../configs';
import { OpenAiApiService } from './OpenAiApiService';
import { OpenAiTextService } from './OpenAiTextService';

/**
 * OpenAI Function Service
 * Service for working with OpenAI function calling capabilities
 */
export class OpenAiFunctionService {
  private apiService: OpenAiApiService;
  private textService: OpenAiTextService;
  private config = getOpenAiConfig();

  constructor() {
    this.apiService = OpenAiApiService.getInstance();
    this.textService = new OpenAiTextService();
  }

  /**
   * Call a function using OpenAI's function calling capability
   * @param messages Chat messages
   * @param functions List of function definitions
   * @param forceFunctionCall Optional function name to force call
   * @returns The chat completion response
   */
  public async callFunction(
    messages: OpenAiChatCompletionRequest['messages'], 
    functions: OpenAiFunctionDefinition[],
    forceFunctionCall?: string
  ): Promise<OpenAiChatCompletionResponse> {
    const request: OpenAiChatCompletionRequest = {
      model: this.config.defaultChatModel,
      messages,
      functions,
      ...(forceFunctionCall && { function_call: { name: forceFunctionCall } }),
    };
    
    return await this.textService.createChatCompletion(request);
  }

  /**
   * Execute a function call and add the result to the conversation
   * @param messages Chat messages
   * @param functionMap Map of function names to handler functions
   * @param functions List of function definitions
   * @returns Updated messages array with function result
   */
  public async executeFunctionCall(
    messages: OpenAiChatCompletionRequest['messages'],
    functionMap: Record<string, (args: any) => Promise<any>>,
    functions: OpenAiFunctionDefinition[]
  ): Promise<OpenAiChatCompletionRequest['messages']> {
    // Call the AI to determine which function to call
    const response = await this.callFunction(messages, functions);
    
    // Extract the function call information
    const responseMessage = response.choices[0]?.message;
    
    if (responseMessage && responseMessage.function_call) {
      const functionName = responseMessage.function_call.name;
      let functionArgs = {};
      
      try {
        functionArgs = JSON.parse(responseMessage.function_call.arguments || '{}');
      } catch (error: any) {
        console.error('Failed to parse function arguments:', error);
      }
      
      // Add the assistant's message to the conversation
      const newMessages = [...messages, responseMessage];
      
      // Execute the function if it exists in the function map
      if (functionMap[functionName]) {
        try {
          const functionResult = await functionMap[functionName](functionArgs);
          
          // Add the function result to the conversation
          newMessages.push({
            role: 'function',
            name: functionName,
            content: JSON.stringify(functionResult),
          });
          
          return newMessages;
        } catch (error: any) {
          console.error(`Error executing function ${functionName}:`, error);
          
          // Add error message to the conversation
          newMessages.push({
            role: 'function',
            name: functionName,
            content: JSON.stringify({ error: `Error executing function: ${error.message || String(error)}` }),
          });
          
          return newMessages;
        }
      } else {
        console.warn(`Function ${functionName} was called but not found in function map`);
        
        // Add error message to the conversation
        newMessages.push({
          role: 'function',
          name: functionName,
          content: JSON.stringify({ error: `Function ${functionName} not implemented` }),
        });
        
        return newMessages;
      }
    }
    
    // If no function was called, just add the assistant's message
    if (responseMessage) {
      return [...messages, responseMessage];
    }
    
    return messages;
  }
}