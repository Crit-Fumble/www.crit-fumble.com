import { OpenAiImageService } from '../../../server/services/OpenAiImageService';
import { OpenAiApiService } from '../../../server/services/OpenAiApiService';
import * as configs from '../../../server/configs';

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

describe('OpenAiImageService', () => {
  // Mock response data for image generation
  const mockImageResponse = {
    created: 1677858242,
    data: [
      {
        url: 'https://example.com/image1.png',
        revised_prompt: 'A detailed fantasy landscape'
      }
    ]
  };

  const mockClient = {
    images: {
      generate: jest.fn().mockResolvedValue(mockImageResponse)
    }
  };
  
  // Create a mock for the OpenAiApiClient that will be returned by getApiClient()
  const mockApiClient = {
    generateImage: jest.fn().mockResolvedValue(mockImageResponse)
  };

  const mockApiService = {
    getApiClient: jest.fn().mockReturnValue(mockApiClient)
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the client mocks for each test
    mockClient.images.generate.mockResolvedValue(mockImageResponse);
    mockApiClient.generateImage.mockResolvedValue(mockImageResponse);
    
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

  describe('generateImage', () => {
    it('should generate an image with default parameters', async () => {
      const imageService = new OpenAiImageService();
      const prompt = 'A fantasy landscape with mountains and a castle';
      
      const response = await imageService.generateImage({ prompt });
      
      expect(mockApiService.getApiClient).toHaveBeenCalled();
      expect(mockApiClient.generateImage).toHaveBeenCalledWith(expect.objectContaining({
        prompt: prompt,
        size: '1024x1024',
        n: 1,
        response_format: 'url'
      }));
      expect(response).toEqual(mockImageResponse);
    });

    it('should generate an image with custom parameters', async () => {
      const imageService = new OpenAiImageService();
      const prompt = 'A cyberpunk city at night';
      
      await imageService.generateImage({
        prompt,
        size: '512x512',
        n: 2,
        response_format: 'b64_json'
      });
      
      expect(mockApiClient.generateImage).toHaveBeenCalledWith(expect.objectContaining({
        prompt,
        size: '512x512',
        n: 2,
        response_format: 'b64_json'
      }));
    });

    it('should handle errors during image generation', async () => {
      const imageService = new OpenAiImageService();
      mockApiClient.generateImage.mockRejectedValueOnce(new Error('API error'));
      
      try {
        await imageService.generateImage({ prompt: 'Failed prompt' });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('generateImageFromPrompt', () => {
    it('should generate an image from a text prompt', async () => {
      const imageService = new OpenAiImageService();
      const prompt = 'A beautiful sunset';
      
      const response = await imageService.generateImageFromPrompt(prompt);
      
      expect(mockApiClient.generateImage).toHaveBeenCalledWith(expect.objectContaining({
        prompt,
        size: '1024x1024',
        n: 1,
        response_format: 'url'
      }));
      expect(response).toEqual('https://example.com/image1.png');
    });
    
    it('should generate an image with custom size', async () => {
      const imageService = new OpenAiImageService();
      const prompt = 'A beautiful sunset';
      const size = '512x512';
      
      await imageService.generateImageFromPrompt(prompt, size);
      
      expect(mockApiClient.generateImage).toHaveBeenCalledWith(expect.objectContaining({
        prompt,
        size,
        n: 1
      }));
    });
  });
});
