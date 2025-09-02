/**
 * Tests for World Anvil configuration module
 */

import { getWorldAnvilConfig, setWorldAnvilConfig, resetWorldAnvilConfigForTests } from '../../../server/configs/config';

describe('World Anvil Config', () => {
  beforeEach(() => {
    // Reset any configuration that might have been set by other tests
    resetWorldAnvilConfigForTests();
  });

  describe('getWorldAnvilConfig', () => {
    it('should return the default configuration initially', () => {
      expect(() => getWorldAnvilConfig()).toThrow('World Anvil configuration not properly set');
    });

    it('should return the configuration after it has been set', () => {
      // Set configuration first
      setWorldAnvilConfig({
        apiUrl: 'https://test-api.worldanvil.com',
        apiKey: 'test-api-key'
      });
      
      const config = getWorldAnvilConfig();
      
      expect(config).toEqual({
        apiUrl: 'https://test-api.worldanvil.com',
        apiKey: 'test-api-key',
        accessToken: undefined
      });
    });

    it('should work with an optional access token', () => {
      setWorldAnvilConfig({
        apiUrl: 'https://test-api.worldanvil.com',
        apiKey: 'test-api-key',
        accessToken: 'test-access-token'
      });
      
      const config = getWorldAnvilConfig();
      
      expect(config).toEqual({
        apiUrl: 'https://test-api.worldanvil.com',
        apiKey: 'test-api-key',
        accessToken: 'test-access-token'
      });
    });

    it('should throw an error if configuration is incomplete', () => {
      // Set incomplete configuration
      setWorldAnvilConfig({
        apiUrl: 'https://test-api.worldanvil.com'
      });
      
      expect(() => getWorldAnvilConfig()).toThrow('World Anvil configuration not properly set');

      // Try another incomplete configuration
      setWorldAnvilConfig({
        apiKey: 'test-api-key'
      });
      
      expect(() => getWorldAnvilConfig()).toThrow('World Anvil configuration not properly set');
    });
  });

  describe('setWorldAnvilConfig', () => {
    it('should set and persist the configuration', () => {
      const testConfig = {
        apiUrl: 'https://custom-api.worldanvil.com',
        apiKey: 'custom-api-key',
        accessToken: 'custom-access-token'
      };
      
      setWorldAnvilConfig(testConfig);
      const config = getWorldAnvilConfig();
      
      expect(config).toEqual(testConfig);
    });
    
    it('should override existing values', () => {
      // Set initial config
      setWorldAnvilConfig({
        apiUrl: 'https://initial.worldanvil.com',
        apiKey: 'initial-key',
        accessToken: 'initial-token'
      });
      
      // Override with new values
      const testConfig = {
        apiUrl: 'https://override.worldanvil.com',
        apiKey: 'override-api-key',
      };
      
      setWorldAnvilConfig(testConfig);
      const config = getWorldAnvilConfig();
      
      // The new config should have overridden previous values but kept default for accessToken
      expect(config).toEqual({
        apiUrl: 'https://override.worldanvil.com',
        apiKey: 'override-api-key',
        accessToken: undefined
      });
    });
    
    it('should set all provided configuration values', () => {
      // Set full config
      setWorldAnvilConfig({
        apiUrl: 'https://full-config.worldanvil.com',
        apiKey: 'full-config-key',
        accessToken: 'full-config-token'
      });
      
      const config = getWorldAnvilConfig();
      
      expect(config).toEqual({
        apiUrl: 'https://full-config.worldanvil.com',
        apiKey: 'full-config-key',
        accessToken: 'full-config-token'
      });
    });
  });
  
  describe('resetWorldAnvilConfigForTests', () => {
    it('should reset the configuration to default values', () => {
      // Set some configuration
      setWorldAnvilConfig({
        apiUrl: 'https://test-reset.worldanvil.com',
        apiKey: 'test-reset-key'
      });
      
      // Verify it was set
      expect(getWorldAnvilConfig().apiUrl).toBe('https://test-reset.worldanvil.com');
      
      // Reset the configuration
      resetWorldAnvilConfigForTests();
      
      // Should throw error after reset as defaults don't have valid required fields
      expect(() => getWorldAnvilConfig()).toThrow('World Anvil configuration not properly set');
    });
  });
});
