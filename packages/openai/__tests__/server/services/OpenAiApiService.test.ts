import { OpenAiApiService } from '../../../server/services/OpenAiApiService';
import * as configs from '../../../server/configs';

jest.mock('../../../server/configs', () => ({
  getOpenAiConfig: jest.fn(),
}));

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: { create: jest.fn() }
    },
    completions: { create: jest.fn() },
    embeddings: { create: jest.fn() },
    images: { generate: jest.fn() }
  }));
});

describe('OpenAiApiService', () => {
  // Mock configuration matching OpenAiConfig interface
  const mockConfig = {
    apiKey: 'test-api-key',
    organization: 'test-org',
    defaultChatModel: 'gpt-4',
    defaultEmbeddingModel: 'text-embedding-3-small',
    defaultTemperature: 0.7,
    defaultMaxTokens: 1000,
    defaultImageSize: '1024x1024'
  };

  // Reset the singleton instance before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the config function
    jest.mocked(configs.getOpenAiConfig).mockReturnValue(mockConfig);
    
    // Reset the singleton instance by setting the instance property to undefined
    // @ts-ignore - accessing private static property for testing
    OpenAiApiService.instance = undefined;
  });

  describe('getInstance', () => {
    it('should create and return a singleton instance', () => {
      const instance1 = OpenAiApiService.getInstance();
      const instance2 = OpenAiApiService.getInstance();
      
      expect(instance1).toBeDefined();
      expect(instance2).toBe(instance1); // Should be the same instance
      // Config is called once in constructor and once in getApiClient when using OpenAiApiClient
      expect(configs.getOpenAiConfig).toHaveBeenCalled();
    });
  });

  describe('getClient', () => {
    it('should return the OpenAI client', () => {
      const apiService = OpenAiApiService.getInstance();
      const client = apiService.getClient();
      
      expect(client).toBeDefined();
    });
  });
});
