/**
 * Tests for World Anvil configuration module
 */

import { getWorldAnvilConfig, WORLD_ANVIL_ENV_KEYS } from '../../../server/configs/config';

describe('World Anvil Config', () => {
  // Store original environment variables before modifying them
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset the environment variables before each test
    jest.resetModules();
    process.env = { ...originalEnv };

    // Set up default test environment variables
    process.env[WORLD_ANVIL_ENV_KEYS.API_URL] = 'https://test-api.worldanvil.com';
    process.env[WORLD_ANVIL_ENV_KEYS.API_KEY] = 'test-api-key';
    process.env[WORLD_ANVIL_ENV_KEYS.ACCESS_TOKEN] = 'test-access-token';
  });

  afterAll(() => {
    // Restore original environment variables after all tests
    process.env = originalEnv;
  });

  describe('getWorldAnvilConfig', () => {
    it('should retrieve configuration from environment variables', () => {
      const config = getWorldAnvilConfig();
      
      expect(config).toEqual({
        apiUrl: 'https://test-api.worldanvil.com',
        apiKey: 'test-api-key',
        accessToken: 'test-access-token'
      });
    });

    it('should work without the optional access token', () => {
      // Remove the access token from environment variables
      delete process.env[WORLD_ANVIL_ENV_KEYS.ACCESS_TOKEN];
      
      const config = getWorldAnvilConfig();
      
      expect(config).toEqual({
        apiUrl: 'https://test-api.worldanvil.com',
        apiKey: 'test-api-key',
        accessToken: undefined
      });
    });

    it('should throw an error if API URL is missing', () => {
      // Remove the API URL from environment variables
      delete process.env[WORLD_ANVIL_ENV_KEYS.API_URL];
      
      expect(() => getWorldAnvilConfig()).toThrow(
        `Missing required environment variable: ${WORLD_ANVIL_ENV_KEYS.API_URL}`
      );
    });

    it('should throw an error if API key is missing', () => {
      // Remove the API key from environment variables
      delete process.env[WORLD_ANVIL_ENV_KEYS.API_KEY];
      
      expect(() => getWorldAnvilConfig()).toThrow(
        `Missing required environment variable: ${WORLD_ANVIL_ENV_KEYS.API_KEY}`
      );
    });
  });
});
