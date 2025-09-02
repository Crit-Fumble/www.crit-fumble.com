import { getOpenAiConfig, setOpenAiConfig, resetOpenAiConfigForTests, REQUIRED_OPENAI_CONFIG_KEYS } from '../../../server/configs';

describe('OpenAI Config', () => {
  // Reset config to default before each test
  beforeEach(() => {
    resetOpenAiConfigForTests();
  });

  describe('getOpenAiConfig', () => {
    it('should return default configuration initially', () => {
      // Spy on console.warn to check for missing API key warning
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

      expect(consoleWarnSpy).toHaveBeenCalledWith('Missing required OpenAI config keys: apiKey');
      consoleWarnSpy.mockRestore();
    });

    it('should use configuration values set via setOpenAiConfig', () => {
      // Set custom configuration
      setOpenAiConfig({
        apiKey: 'test-api-key',
        defaultChatModel: 'gpt-3.5-turbo',
        defaultEmbeddingModel: 'text-embedding-ada-002',
        defaultTemperature: 0.5,
        defaultMaxTokens: 2000,
        defaultImageSize: '512x512',
        organization: 'test-org',
      });

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

    it('should allow partial configuration updates', () => {
      // First set a complete config
      setOpenAiConfig({
        apiKey: 'test-api-key',
        defaultChatModel: 'gpt-3.5-turbo',
        defaultTemperature: 0.7,
      });

      // Then update just one property
      setOpenAiConfig({
        defaultTemperature: 0.9,
      });

      const config = getOpenAiConfig();
      expect(config.apiKey).toBe('test-api-key');
      expect(config.defaultChatModel).toBe('gpt-3.5-turbo');
      expect(config.defaultTemperature).toBe(0.9);
    });

    it('should expose the required config keys', () => {
      expect(REQUIRED_OPENAI_CONFIG_KEYS).toContain('apiKey');
    });
  });
});
