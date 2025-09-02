import { OpenAiFunctionService } from '../../../server/services/OpenAiFunctionService';
import { OpenAiApiService } from '../../../server/services/OpenAiApiService';
import { OpenAiApiClient } from '../../../server/clients/OpenAiApiClient';
import * as configs from '../../../server/configs';
import { OpenAiChatCompletionRequest, OpenAiFunctionDefinition, OpenAiMessage } from '../../../models/OpenAiResponses';

// Mock the configs module
jest.mock('../../../server/configs', () => ({
  getOpenAiConfig: jest.fn().mockReturnValue({
    apiKey: 'test-api-key',
    organization: 'test-org',
    defaultChatModel: 'gpt-4',
    defaultEmbeddingModel: 'text-embedding-3-small',
    defaultTemperature: 0.7,
    defaultMaxTokens: 1000,
    defaultImageSize: '1024x1024'
  })
}));

// Mock OpenAiApiService
jest.mock('../../../server/services/OpenAiApiService');

// Mock OpenAiApiClient
jest.mock('../../../server/clients/OpenAiApiClient');

describe('OpenAiFunctionService', () => {
  // Mock function definitions
  const mockFunctionDefinitions = [
    {
      name: 'get_weather',
      description: 'Get the current weather in a given location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA'
          }
        },
        required: ['location']
      }
    }
  ];
  
  // Mock response for function calls
  const mockFunctionCallResponse = {
    id: 'chatcmpl-789',
    object: 'chat.completion',
    created: 1677858242,
    model: 'gpt-4',
    usage: { prompt_tokens: 25, completion_tokens: 35, total_tokens: 60 },
    choices: [
      {
        message: {
          role: 'assistant',
          content: null,
          function_call: {
            name: 'get_weather',
            arguments: '{"location":"San Francisco, CA"}'
          }
        },
        index: 0,
        finish_reason: 'function_call'
      }
    ]
  };

  // Mock response for tool calls
  const mockToolCallResponse = {
    id: 'chatcmpl-789',
    object: 'chat.completion',
    created: 1677858242,
    model: 'gpt-4',
    usage: { prompt_tokens: 25, completion_tokens: 35, total_tokens: 60 },
    choices: [
      {
        message: {
          role: 'assistant',
          content: null,
          tool_calls: [
            {
              id: 'tool-call-123',
              type: 'function',
              function: {
                name: 'get_weather',
                arguments: '{"location":"San Francisco, CA"}'
              }
            }
          ]
        },
        index: 0,
        finish_reason: 'tool_calls'
      }
    ]
  };

  const mockApiClient = {
    createChatCompletion: jest.fn().mockResolvedValue(mockFunctionCallResponse)
  };

  // Mock console methods to suppress warnings/errors in tests
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console methods
    console.error = jest.fn();
    console.warn = jest.fn();
    
    // Setup OpenAiApiService mock
    (OpenAiApiService.getInstance as jest.Mock).mockReturnValue({
      getApiClient: jest.fn().mockReturnValue(mockApiClient)
    });
    
    // Make sure the mocked config is properly returned
    const mockedConfig = {
      apiKey: 'test-api-key',
      organization: 'test-org',
      defaultChatModel: 'gpt-4',
      defaultEmbeddingModel: 'text-embedding-3-small',
      defaultTemperature: 0.7,
      defaultMaxTokens: 1000,
      defaultImageSize: '1024x1024'
    };
    (require('../../../server/configs').getOpenAiConfig as jest.Mock).mockReturnValue(mockedConfig);
  });
  
  afterEach(() => {
    // Restore original console methods
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });

  describe('callFunction', () => {
    beforeEach(() => {
      // Reset the mock to its initial state for each test
      mockApiClient.createChatCompletion = jest.fn().mockResolvedValue(mockFunctionCallResponse);
    });
    
    it('should call OpenAI with function definitions', async () => {
      const functionService = new OpenAiFunctionService();
      const messages: OpenAiChatCompletionRequest['messages'] = [
        { role: 'system', content: 'You are a helpful weather assistant.' },
        { role: 'user', content: 'What is the weather like in San Francisco?' }
      ];
      
      await functionService.callFunction(messages, mockFunctionDefinitions);
      
      expect(mockApiClient.createChatCompletion).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages,
        functions: mockFunctionDefinitions
      });
    });

    it('should force a specific function call when specified', async () => {
      const functionService = new OpenAiFunctionService();
      const messages: OpenAiChatCompletionRequest['messages'] = [
        { role: 'user', content: 'What is the weather like in San Francisco?' }
      ];
      const forceFunctionCall = 'get_weather';
      
      await functionService.callFunction(messages, mockFunctionDefinitions, forceFunctionCall);
      
      expect(mockApiClient.createChatCompletion).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages,
        functions: mockFunctionDefinitions,
        function_call: { name: 'get_weather' }
      });
    });

    it('should return the chat completion response', async () => {
      const functionService = new OpenAiFunctionService();
      const messages: OpenAiChatCompletionRequest['messages'] = [
        { role: 'user', content: 'What is the weather like in San Francisco?' }
      ];
      
      const response = await functionService.callFunction(messages, mockFunctionDefinitions);
      
      expect(response).toEqual(mockFunctionCallResponse);
    });
  });

  describe('executeFunctionCall', () => {
    beforeEach(() => {
      // Reset mock for each test in this describe block
      mockApiClient.createChatCompletion = jest.fn().mockResolvedValue(mockFunctionCallResponse);
    });
    
    it('should execute a function and add the result to messages', async () => {
      const functionService = new OpenAiFunctionService();
      const messages: OpenAiMessage[] = [
        { role: 'user', content: 'What is the weather like in San Francisco?' }
      ];
      
      // Mock function map
      const mockFunctionMap = {
        get_weather: jest.fn().mockResolvedValue({ temperature: 72, condition: 'sunny' })
      };
      
      const updatedMessages = await functionService.executeFunctionCall(
        messages,
        mockFunctionMap,
        mockFunctionDefinitions
      );
      
      // Check if the function was called with correct arguments
      expect(mockFunctionMap.get_weather).toHaveBeenCalledWith({ location: 'San Francisco, CA' });
      
      // Check if messages were updated correctly
      expect(updatedMessages).toEqual([
        { role: 'user', content: 'What is the weather like in San Francisco?' },
        {
          role: 'assistant',
          content: null,
          function_call: {
            name: 'get_weather',
            arguments: '{"location":"San Francisco, CA"}'
          }
        },
        {
          role: 'function',
          name: 'get_weather',
          content: JSON.stringify({ temperature: 72, condition: 'sunny' })
        }
      ]);
    });

    it('should handle errors when executing a function', async () => {
      const functionService = new OpenAiFunctionService();
      const messages: OpenAiMessage[] = [
        { role: 'user', content: 'What is the weather like in San Francisco?' }
      ];
      
      // Mock function map with failing function
      const mockFunctionMap = {
        get_weather: jest.fn().mockRejectedValue(new Error('API unavailable'))
      };
      
      const updatedMessages = await functionService.executeFunctionCall(
        messages,
        mockFunctionMap,
        mockFunctionDefinitions
      );
      
      // Check if error was added to messages
      expect(updatedMessages[2].role).toBe('function');
      expect(updatedMessages[2].name).toBe('get_weather');
      expect(JSON.parse(updatedMessages[2].content)).toHaveProperty('error');
    });

    it('should handle missing functions in the function map', async () => {
      const functionService = new OpenAiFunctionService();
      const messages: OpenAiMessage[] = [
        { role: 'user', content: 'What is the weather like in San Francisco?' }
      ];
      
      // Empty function map
      const mockFunctionMap = {};
      
      const updatedMessages = await functionService.executeFunctionCall(
        messages,
        mockFunctionMap,
        mockFunctionDefinitions
      );
      
      // Check if error was added to messages
      expect(updatedMessages[2].role).toBe('function');
      expect(updatedMessages[2].name).toBe('get_weather');
      expect(JSON.parse(updatedMessages[2].content)).toHaveProperty('error');
      expect(JSON.parse(updatedMessages[2].content).error).toContain('not implemented');
    });

    it('should handle responses without function calls', async () => {
      const functionService = new OpenAiFunctionService();
      const messages: OpenAiMessage[] = [
        { role: 'user', content: 'Hello there!' }
      ];
      
      // Mock a response without a function call
      mockApiClient.createChatCompletion.mockResolvedValueOnce({
        id: 'chatcmpl-abc',
        object: 'chat.completion',
        created: 1677858242,
        model: 'gpt-4',
        usage: { prompt_tokens: 10, completion_tokens: 15, total_tokens: 25 },
        choices: [{
          message: { role: 'assistant', content: 'Hi there! How can I help you?' },
          index: 0,
          finish_reason: 'stop'
        }]
      });
      
      const updatedMessages = await functionService.executeFunctionCall(
        messages,
        {},
        mockFunctionDefinitions
      );
      
      // Check if assistant message was added without function call
      expect(updatedMessages).toEqual([
        { role: 'user', content: 'Hello there!' },
        { role: 'assistant', content: 'Hi there! How can I help you?' }
      ]);
    });
  });
});
