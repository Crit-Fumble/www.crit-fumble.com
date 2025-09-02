import { OpenAiTextService } from '../../../server/services/OpenAiTextService';
import { OpenAiApiService } from '../../../server/services/OpenAiApiService';
import * as configs from '../../../server/configs';
import { OpenAiMessage } from '../../../models/OpenAiResponses';

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

// Mock the OpenAI API service
jest.mock('../../../server/services/OpenAiApiService');

describe('OpenAiTextService', () => {
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
    model: 'gpt-3.5-turbo-instruct',
    choices: [
      {
        text: 'This is a test completion',
        index: 0,
        finish_reason: 'stop'
      }
    ],
    usage: { prompt_tokens: 15, completion_tokens: 25, total_tokens: 40 }
  };

  const mockClient = {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue(mockChatCompletion)
      }
    },
    completions: {
      create: jest.fn().mockResolvedValue(mockCompletion)
    }
  };

  // We need to mock our wrapper client instance, not just the raw OpenAI client
  const mockApiClient = {
    createChatCompletion: jest.fn().mockResolvedValue(mockChatCompletion),
    createCompletion: jest.fn().mockResolvedValue(mockCompletion),
    sendMessage: jest.fn().mockResolvedValue('This is a test response')
  };

  const mockApiService = {
    getApiClient: jest.fn().mockReturnValue(mockApiClient)
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the mocks for each test
    mockApiClient.createChatCompletion.mockResolvedValue(mockChatCompletion);
    mockApiClient.createCompletion.mockResolvedValue(mockCompletion);
    
    // Reset the mock implementation
    (OpenAiApiService.getInstance as jest.Mock).mockReturnValue(mockApiService);
    
    // Explicitly mock the getApiClient() method to always return our mockApiClient
    mockApiService.getApiClient.mockReturnValue(mockApiClient);
    
    // Setup the config mock for each test
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

  describe('createChatCompletion', () => {
    it('should create a chat completion with default parameters', async () => {
      const textService = new OpenAiTextService();
      const messages: OpenAiMessage[] = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, world!' }
      ];
      
      const response = await textService.createChatCompletion({ messages });
      
      expect(mockApiService.getApiClient).toHaveBeenCalled();
      expect(mockApiClient.createChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gpt-4',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      }));
      expect(response).toEqual(mockChatCompletion);
    });

    it('should create a chat completion with custom parameters', async () => {
      const textService = new OpenAiTextService();
      const messages: OpenAiMessage[] = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, world!' }
      ];
      
      await textService.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.9,
        max_tokens: 500
      });
      
      expect(mockApiClient.createChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.9,
        max_tokens: 500
      }));
    });
  });

  describe('sendMessage', () => {
    it('should send a message and return the response', async () => {
      const textService = new OpenAiTextService();
      const message = 'Hello, world!';
      const systemPrompt = 'You are a helpful assistant.';
      
      const response = await textService.sendMessage(message, systemPrompt);
      
      expect(mockApiClient.createChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      }));
      expect(response).toEqual('This is a test response');
    });

    it('should send a message without system prompt', async () => {
      const textService = new OpenAiTextService();
      const message = 'Hello, world!';
      
      await textService.sendMessage(message);
      
      expect(mockApiClient.createChatCompletion).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: message }
        ]
      }));
    });
  });

  describe('createCompletion', () => {
    it('should create a text completion with default parameters', async () => {
      const textService = new OpenAiTextService();
      const prompt = 'Once upon a time';
      
      const response = await textService.createCompletion({ prompt });
      
      expect(mockApiService.getApiClient).toHaveBeenCalled();
      expect(mockApiClient.createCompletion).toHaveBeenCalledWith(expect.objectContaining({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 1000
      }));
      expect(response).toEqual(mockCompletion);
    });

    it('should create a text completion with custom parameters', async () => {
      const textService = new OpenAiTextService();
      const prompt = 'Once upon a time';
      
      await textService.createCompletion({
        model: 'davinci-002',
        prompt,
        temperature: 0.5,
        max_tokens: 300
      });
      
      expect(mockApiClient.createCompletion).toHaveBeenCalledWith(expect.objectContaining({
        model: 'davinci-002',
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 300
      }));
    });
  });
});
