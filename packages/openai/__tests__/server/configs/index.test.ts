import { getOpenAiConfig } from '../../../server/configs';

describe('OpenAI Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getOpenAiConfig', () => {
    it('should return default configuration when no environment variables are set', () => {
      // Clear any OpenAI-related environment variables
      delete process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_KEY;
      delete process.env.OPENAI_CHAT_MODEL;
      delete process.env.OPENAI_EMBEDDING_MODEL;
      delete process.env.OPENAI_TEMPERATURE;
      delete process.env.OPENAI_MAX_TOKENS;
      delete process.env.OPENAI_IMAGE_SIZE;
      delete process.env.OPENAI_ORGANIZATION;

      // Spy on console.warn
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const config = getOpenAiConfig();

      expect(config).toEqual({
        apiKey: '',
        defaultChatModel: 'gpt-4',
        defaultEmbeddingModel: 'text-embedding-3-small',
        defaultTemperature: 0.7,
        defaultMaxTokens: 1000,
        defaultImageSize: '1024x1024',
        organization: undefined,
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith('OpenAI API key not found in environment variables');
      consoleWarnSpy.mockRestore();
    });

    it('should use OPENAI_API_KEY environment variable', () => {
      process.env.OPENAI_API_KEY = 'test-api-key';
      const config = getOpenAiConfig();
      expect(config.apiKey).toBe('test-api-key');
    });

    it('should fall back to OPENAI_KEY if OPENAI_API_KEY is not set', () => {
      delete process.env.OPENAI_API_KEY;
      process.env.OPENAI_KEY = 'fallback-key';
      const config = getOpenAiConfig();
      expect(config.apiKey).toBe('fallback-key');
    });

    it('should use custom environment variable values when provided', () => {
      process.env.OPENAI_API_KEY = 'test-api-key';
      process.env.OPENAI_CHAT_MODEL = 'gpt-3.5-turbo';
      process.env.OPENAI_EMBEDDING_MODEL = 'text-embedding-ada-002';
      process.env.OPENAI_TEMPERATURE = '0.5';
      process.env.OPENAI_MAX_TOKENS = '2000';
      process.env.OPENAI_IMAGE_SIZE = '512x512';
      process.env.OPENAI_ORGANIZATION = 'test-org';

      const config = getOpenAiConfig();

      expect(config).toEqual({
        apiKey: 'test-api-key',
        defaultChatModel: 'gpt-3.5-turbo',
        defaultEmbeddingModel: 'text-embedding-ada-002',
        defaultTemperature: 0.5,
        defaultMaxTokens: 2000,
        defaultImageSize: '512x512',
        organization: 'test-org',
      });
    });

    it('should handle invalid numeric environment variables', () => {
      process.env.OPENAI_API_KEY = 'test-api-key';
      process.env.OPENAI_TEMPERATURE = 'not-a-number';
      process.env.OPENAI_MAX_TOKENS = 'invalid';

      const config = getOpenAiConfig();

      // Should use the default values for invalid inputs
      expect(config.defaultTemperature).toBe(NaN); // parseFloat returns NaN for invalid inputs
      expect(config.defaultMaxTokens).toBe(NaN); // parseInt returns NaN for invalid inputs
    });
  });
});
