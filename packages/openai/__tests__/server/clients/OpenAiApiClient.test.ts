import OpenAI from 'openai';
import { OpenAiApiClient } from '../../../server/clients/OpenAiApiClient';
import * as configs from '../../../server/configs';
import { OpenAiMessage } from '../../../models/OpenAiResponses';

// Mock OpenAI
jest.mock('openai');
const MockOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>;

// Mock configs
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

describe('OpenAiApiClient', () => {
  // Mock response data for chat completion
  const mockChatCompletion = {
    id: 'chatcmpl-123',
    object: 'chat.completion',
    created: 1677858242,
    model: 'gpt-4',
    usage: { prompt_tokens: 20, completion_tokens: 30, total_tokens: 50 },
    choices: [
      {
        message: {
          role: 'assistant',
          content: 'This is a test response'
        },
        index: 0,
        finish_reason: 'stop'
      }
    ]
  };

  // Mock response data for text completion
  const mockCompletion = {
    id: 'cmpl-456',
    object: 'text_completion',
    created: 1677858242,
    model: 'text-davinci-003',
    choices: [
      {
        text: 'This is a test completion',
        index: 0,
        finish_reason: 'stop'
      }
    ],
    usage: { prompt_tokens: 15, completion_tokens: 25, total_tokens: 40 }
  };

  // Mock response data for image generation
  const mockImageResponse = {
    created: 1677858242,
    data: [
      {
        url: 'https://example.com/image.png'
      }
    ]
  };

  // Mock client methods
  const mockCreateChatCompletion = jest.fn().mockResolvedValue(mockChatCompletion);
  const mockCreateCompletion = jest.fn().mockResolvedValue(mockCompletion);
  const mockGenerateImage = jest.fn().mockResolvedValue(mockImageResponse);

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementations
    MockOpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreateChatCompletion
        }
      },
      completions: {
        create: mockCreateCompletion
      },
      images: {
        generate: mockGenerateImage
      }
    } as unknown as OpenAI));
  });

  describe('constructor', () => {
    it('should initialize with default config', () => {
      const client = new OpenAiApiClient();
      
      expect(MockOpenAI).toHaveBeenCalledWith({
        apiKey: 'test-api-key',
        organization: 'test-org'
      });
    });

    it('should initialize with custom config', () => {
      const client = new OpenAiApiClient({
        apiKey: 'custom-api-key',
        organization: 'custom-org'
      });
      
      expect(MockOpenAI).toHaveBeenCalledWith({
        apiKey: 'custom-api-key',
        organization: 'custom-org'
      });
    });
  });

  describe('setApiKey and setOrganization', () => {
    it('should update the API key and recreate the client', () => {
      const client = new OpenAiApiClient();
      client.setApiKey('new-api-key');
      
      // Check that OpenAI constructor was called twice (once in constructor, once in setApiKey)
      expect(MockOpenAI).toHaveBeenCalledTimes(2);
      expect(MockOpenAI).toHaveBeenLastCalledWith({
        apiKey: 'new-api-key',
        organization: 'test-org'
      });
    });

    it('should update the organization and recreate the client', () => {
      const client = new OpenAiApiClient();
      client.setOrganization('new-org');
      
      expect(MockOpenAI).toHaveBeenCalledTimes(2);
      expect(MockOpenAI).toHaveBeenLastCalledWith({
        apiKey: 'test-api-key',
        organization: 'new-org'
      });
    });
  });

  describe('createChatCompletion', () => {
    it('should create a chat completion with default parameters', async () => {
      const client = new OpenAiApiClient();
      const messages: OpenAiMessage[] = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, world!' }
      ];
      
      const response = await client.createChatCompletion({ messages });
      
      expect(mockCreateChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gpt-4',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      }));
      expect(response).toEqual(mockChatCompletion);
    });

    it('should create a chat completion with custom parameters', async () => {
      const client = new OpenAiApiClient();
      const messages: OpenAiMessage[] = [
        { role: 'user', content: 'Hello, world!' }
      ];
      
      await client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.9,
        max_tokens: 500
      });
      
      expect(mockCreateChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.9,
        max_tokens: 500
      }));
    });

    it('should handle errors', async () => {
      const client = new OpenAiApiClient();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('API Error');
      mockCreateChatCompletion.mockRejectedValueOnce(error);
      
      await expect(client.createChatCompletion({ messages: [] })).rejects.toThrow(error);
      expect(consoleSpy).toHaveBeenCalledWith('Error creating chat completion:', error);
      
      consoleSpy.mockRestore();
    });
  });

  describe('createCompletion', () => {
    it('should create a text completion with default parameters', async () => {
      const client = new OpenAiApiClient();
      const prompt = 'Once upon a time';
      
      const response = await client.createCompletion({ prompt });
      
      expect(mockCreateCompletion).toHaveBeenCalledWith(expect.objectContaining({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 1000
      }));
      expect(response).toEqual(mockCompletion);
    });

    it('should create a text completion with custom parameters', async () => {
      const client = new OpenAiApiClient();
      const prompt = 'Once upon a time';
      
      await client.createCompletion({
        model: 'davinci-002',
        prompt,
        temperature: 0.5,
        max_tokens: 300
      });
      
      expect(mockCreateCompletion).toHaveBeenCalledWith(expect.objectContaining({
        model: 'davinci-002',
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 300
      }));
    });
  });

  describe('generateImage', () => {
    it('should generate an image with default parameters', async () => {
      const client = new OpenAiApiClient();
      const prompt = 'A beautiful sunset';
      
      const response = await client.generateImage({ prompt });
      
      expect(mockGenerateImage).toHaveBeenCalledWith(expect.objectContaining({
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url'
      }));
      expect(response).toEqual(mockImageResponse);
    });

    it('should generate an image with custom parameters', async () => {
      const client = new OpenAiApiClient();
      const prompt = 'A beautiful sunset';
      
      await client.generateImage({
        prompt,
        n: 2,
        size: '512x512',
        response_format: 'b64_json'
      });
      
      expect(mockGenerateImage).toHaveBeenCalledWith(expect.objectContaining({
        prompt: prompt,
        n: 2,
        size: '512x512',
        response_format: 'b64_json'
      }));
    });
  });

  describe('sendMessage', () => {
    it('should send a message with system prompt', async () => {
      const client = new OpenAiApiClient();
      const message = 'Hello, world!';
      const systemPrompt = 'You are a helpful assistant.';
      
      const response = await client.sendMessage(message, systemPrompt);
      
      expect(mockCreateChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      }));
      expect(response).toBe('This is a test response');
    });

    it('should send a message without system prompt', async () => {
      const client = new OpenAiApiClient();
      const message = 'Hello, world!';
      
      await client.sendMessage(message);
      
      expect(mockCreateChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
        messages: [
          { role: 'user', content: message }
        ]
      }));
    });
  });

  describe('callFunction', () => {
    it('should call a function with given messages and functions', async () => {
      const client = new OpenAiApiClient();
      const messages: OpenAiMessage[] = [
        { role: 'user', content: 'What is the weather?' }
      ];
      const functions = [
        {
          name: 'getWeather',
          description: 'Get the current weather',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The location to get weather for'
              }
            },
            required: ['location']
          }
        }
      ];
      
      await client.callFunction(messages, functions);
      
      expect(mockCreateChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gpt-4',
        messages: messages,
        functions: functions
      }));
    });

    it('should force a function call if specified', async () => {
      const client = new OpenAiApiClient();
      const messages: OpenAiMessage[] = [
        { role: 'user', content: 'What is the weather?' }
      ];
      const functions = [
        {
          name: 'getWeather',
          description: 'Get the current weather',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The location to get weather for'
              }
            },
            required: ['location']
          }
        }
      ];
      
      await client.callFunction(messages, functions, 'getWeather');
      
      expect(mockCreateChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
        messages: messages,
        functions: functions,
        function_call: { name: 'getWeather' }
      }));
    });
  });

  describe('getRawClient', () => {
    it('should return the raw OpenAI client', () => {
      const client = new OpenAiApiClient();
      const rawClient = client.getRawClient();
      
      // Check that it's the same instance that was created by the OpenAI constructor
      expect(rawClient).toBeDefined();
    });
  });
});
