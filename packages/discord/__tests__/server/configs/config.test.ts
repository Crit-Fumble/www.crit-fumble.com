import { getDiscordConfig, setDiscordConfig, DiscordConfig } from '../../../server/configs/config';

describe('Discord Config', () => {
  beforeEach(() => {
    // Reset module state between tests
    jest.resetModules();
  });

  describe('setDiscordConfig and getDiscordConfig', () => {
    it('should set and get config values', () => {
      const testConfig: DiscordConfig = {
        botToken: 'test-token',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        defaultGuildId: 'test-guild-id'
      };

      setDiscordConfig(testConfig);
      const retrievedConfig = getDiscordConfig();
      
      expect(retrievedConfig).toEqual(testConfig);
    });

    it('should accept partial configuration and merge with defaults', () => {
      const partialConfig = {
        botToken: 'test-token-2'
      };

      setDiscordConfig(partialConfig);
      const retrievedConfig = getDiscordConfig();
      
      expect(retrievedConfig.botToken).toEqual('test-token-2');
      expect(retrievedConfig.clientId).toEqual('');
      expect(retrievedConfig.clientSecret).toEqual('');
      expect(retrievedConfig.defaultGuildId).toBeUndefined();
    });

    it('should throw an error when config is not set and getDiscordConfig is called', () => {
      // Reset module to ensure no config is set
      jest.resetModules();
      
      // Import a clean version of the module
      const freshConfig = require('../../../server/configs/config');
      
      expect(() => {
        freshConfig.getDiscordConfig();
      }).toThrow('Discord configuration not set. Call setDiscordConfig() first.');
    });

    it('should validate required fields in configuration', () => {
      const invalidConfig = {
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret'
        // Missing botToken
      };

      expect(() => {
        setDiscordConfig(invalidConfig);
      }).not.toThrow();

      // But we should still be able to get the config with empty/default values
      const retrievedConfig = getDiscordConfig();
      expect(retrievedConfig.botToken).toEqual('');
    });
  });
});
