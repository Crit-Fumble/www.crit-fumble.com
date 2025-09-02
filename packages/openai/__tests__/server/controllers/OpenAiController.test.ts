import { OpenAiController } from '../../../server/controllers/OpenAiController';
import { OpenAiApiService } from '../../../server/services/OpenAiApiService';
import { OpenAiFunctionService } from '../../../server/services/OpenAiFunctionService';
import { OpenAiImageService } from '../../../server/services/OpenAiImageService';
import { OpenAiTextService } from '../../../server/services/OpenAiTextService';
import { OpenAiMessage, OpenAiFunctionDefinition } from '../../../models/OpenAiResponses';

// Mock the service modules
jest.mock('../../../server/services/OpenAiApiService');
jest.mock('../../../server/services/OpenAiFunctionService');
jest.mock('../../../server/services/OpenAiImageService');
jest.mock('../../../server/services/OpenAiTextService');

describe('OpenAiController', () => {
  // Mock service instances
  const mockTextService = {
    sendMessage: jest.fn(),
    createChatCompletion: jest.fn(),
    createCompletion: jest.fn()
  };
  
  const mockImageService = {
    generateImageFromPrompt: jest.fn(),
    generateImage: jest.fn()
  };
  
  const mockFunctionService = {
    callFunction: jest.fn(),
    executeFunctionCall: jest.fn()
  };
  
  const mockApiService = {
    getClient: jest.fn(),
    getApiClient: jest.fn()
  };
  
  // Sample test data
  const mockChatCompletion = {
    id: 'chatcmpl-123',
    object: 'chat.completion',
    created: 1677858242,
    model: 'gpt-4',
    usage: { prompt_tokens: 20, completion_tokens: 30, total_tokens: 50 },
    choices: [
      {
        message: {
          role: 'assistant' as const,
          content: 'This is a test response'
        },
        index: 0,
        finish_reason: 'stop'
      }
    ]
  };
  
  const mockImageResponse = {
    created: 1677858242,
    data: [
      {
        url: 'https://example.com/image1.png',
        revised_prompt: 'A detailed fantasy landscape'
      }
    ]
  };
  
  const mockMessages = [
    { role: 'user' as const, content: 'Hello' },
    { role: 'assistant' as const, content: 'I need to call a function', function_call: { name: 'testFunction', arguments: '{}' } },
    { role: 'function' as const, name: 'testFunction', content: '{"result": "success"}' }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up our mock returns
    mockTextService.sendMessage.mockResolvedValue('This is a test response');
    mockTextService.createChatCompletion.mockResolvedValue(mockChatCompletion);
    mockTextService.createCompletion.mockResolvedValue({ choices: [{ text: 'This is a test completion' }] });
    
    mockImageService.generateImageFromPrompt.mockResolvedValue('https://example.com/image1.png');
    mockImageService.generateImage.mockResolvedValue(mockImageResponse);
    
    mockFunctionService.callFunction.mockResolvedValue(mockChatCompletion);
    mockFunctionService.executeFunctionCall.mockResolvedValue(mockMessages);
    
    // Set up our constructor mocks
    (OpenAiApiService.getInstance as jest.Mock).mockReturnValue(mockApiService);
    (OpenAiFunctionService as jest.MockedClass<typeof OpenAiFunctionService>).mockImplementation(() => mockFunctionService as any);
    (OpenAiImageService as jest.MockedClass<typeof OpenAiImageService>).mockImplementation(() => mockImageService as any);
    (OpenAiTextService as jest.MockedClass<typeof OpenAiTextService>).mockImplementation(() => mockTextService as any);
  });
  
  describe('constructor', () => {
    it('should initialize with all services', () => {
      const controller = new OpenAiController();
      
      expect(OpenAiApiService.getInstance).toHaveBeenCalled();
      expect(OpenAiFunctionService).toHaveBeenCalledTimes(1);
      expect(OpenAiImageService).toHaveBeenCalledTimes(1);
      expect(OpenAiTextService).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('sendMessage', () => {
    it('should send a message and return the response', async () => {
      const controller = new OpenAiController();
      const message = 'Hello, world!';
      const systemPrompt = 'You are a helpful assistant.';
      const model = 'gpt-4';
      
      const response = await controller.sendMessage(message, systemPrompt, model);
      
      expect(mockTextService.sendMessage).toHaveBeenCalledWith(message, systemPrompt, model);
      expect(response).toBe('This is a test response');
    });
  });
  
  describe('generateImage', () => {
    it('should generate an image from prompt', async () => {
      const controller = new OpenAiController();
      const prompt = 'A fantasy landscape';
      const size = '512x512';
      
      const response = await controller.generateImage(prompt, size);
      
      expect(mockImageService.generateImageFromPrompt).toHaveBeenCalledWith(prompt, size);
      expect(response).toBe('https://example.com/image1.png');
    });
  });
  
  describe('generateImageAdvanced', () => {
    it('should generate an image with advanced options', async () => {
      const controller = new OpenAiController();
      const request = {
        prompt: 'A cyberpunk city',
        size: '512x512',
        n: 2
      };
      
      const response = await controller.generateImageAdvanced(request);
      
      expect(mockImageService.generateImage).toHaveBeenCalledWith(request);
      expect(response).toEqual(mockImageResponse);
    });
  });
  
  describe('createChatCompletion', () => {
    it('should create a chat completion', async () => {
      const controller = new OpenAiController();
      const request = {
        messages: [{ role: 'user' as const, content: 'Hello' }],
        model: 'gpt-4',
        temperature: 0.7
      };
      
      const response = await controller.createChatCompletion(request);
      
      expect(mockTextService.createChatCompletion).toHaveBeenCalledWith(request);
      expect(response).toEqual(mockChatCompletion);
    });
  });
  
  describe('createCompletion', () => {
    it('should create a text completion', async () => {
      const controller = new OpenAiController();
      const prompt = 'Once upon a time';
      const maxTokens = 500;
      const temperature = 0.8;
      
      await controller.createCompletion(prompt, maxTokens, temperature);
      
      expect(mockTextService.createCompletion).toHaveBeenCalledWith({
        prompt,
        max_tokens: maxTokens,
        temperature
      });
    });
  });
  
  describe('callFunction', () => {
    it('should call a function with messages and function definitions', async () => {
      const controller = new OpenAiController();
      const messages: OpenAiMessage[] = [{ role: 'user', content: 'Hello' }];
      const functions: OpenAiFunctionDefinition[] = [
        {
          name: 'testFunction',
          description: 'A test function',
          parameters: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      ];
      const forceFunctionCall = 'testFunction';
      
      const response = await controller.callFunction(messages, functions, forceFunctionCall);
      
      expect(mockFunctionService.callFunction).toHaveBeenCalledWith(messages, functions, forceFunctionCall);
      expect(response).toEqual(mockChatCompletion);
    });
  });
  
  describe('executeFunctionCall', () => {
    it('should execute a function call and update messages', async () => {
      const controller = new OpenAiController();
      const messages: OpenAiMessage[] = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'I need to call a function', function_call: { name: 'testFunction', arguments: '{}' } }
      ];
      const functionMap = {
        testFunction: jest.fn().mockResolvedValue({ result: 'success' })
      };
      const functions: OpenAiFunctionDefinition[] = [
        {
          name: 'testFunction',
          description: 'A test function',
          parameters: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      ];
      
      const updatedMessages = await controller.executeFunctionCall(messages, functionMap, functions);
      
      expect(mockFunctionService.executeFunctionCall).toHaveBeenCalledWith(messages, functionMap, functions);
      expect(updatedMessages).toEqual(mockMessages);
    });
  });
});
