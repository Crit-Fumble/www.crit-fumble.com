import { jest } from '@jest/globals';
import fs from 'fs';

// Mock the fs module
jest.mock('fs');

describe('Bot Configuration Module', () => {
  // Save the original process.env
  const originalEnv = process.env;
  
  beforeEach(() => {
    // Clear the module cache to ensure clean tests
    jest.resetModules();
    
    // Reset process.env before each test
    process.env = { ...originalEnv };
    
    // Mock fs.existsSync implementation
    fs.existsSync.mockImplementation(path => {
      if (path.includes('.env.bot')) {
        return true;
      }
      return false;
    });
  });
  
  afterAll(() => {
    // Restore process.env
    process.env = originalEnv;
  });
  
  test('should load configuration with default values', async () => {
    // Set some test environment variables
    process.env.DISCORD_PERSISTENT_BOT_TOKEN = 'test-token';
    process.env.DISCORD_PERSISTENT_BOT_APP_ID = 'test-app-id';
    process.env.BOT_NAME = 'TestBot';
    
    // Import the config module with updated path
    const config = (await import('../../src/bot/config.js')).default;
    
    // Verify the configuration values
    expect(config.discord.token).toBe('test-token');
    expect(config.discord.appId).toBe('test-app-id');
    expect(config.bot.name).toBe('TestBot');
    expect(config.api.enabled).toBe(false); // Default value
  });
  
  test('should validate required configuration', async () => {
    // Import the config module and validation function with updated path
    const { validateConfig } = await import('../../src/bot/config.js');
    
    // Missing required values should throw an error
    process.env.DISCORD_PERSISTENT_BOT_TOKEN = '';
    process.env.DISCORD_PERSISTENT_BOT_APP_ID = '';
    
    expect(() => validateConfig()).toThrow(/Missing required environment variables/);
    
    // With required values, should not throw
    process.env.DISCORD_PERSISTENT_BOT_TOKEN = 'test-token';
    process.env.DISCORD_PERSISTENT_BOT_APP_ID = 'test-app-id';
    
    expect(() => validateConfig()).not.toThrow();
  });
  
  test('should set environment flags correctly', async () => {
    // Test development environment
    process.env.NODE_ENV = 'development';
    let config = (await import('../../src/bot/config.js')).default;
    
    expect(config.environment).toBe('development');
    expect(config.isDevelopment).toBe(true);
    expect(config.isProduction).toBe(false);
    
    // Test production environment
    jest.resetModules();
    process.env.NODE_ENV = 'production';
    config = (await import('../../src/bot/config.js')).default;
    
    expect(config.environment).toBe('production');
    expect(config.isDevelopment).toBe(false);
    expect(config.isProduction).toBe(true);
  });
  
  test('should set API configuration correctly', async () => {
    // Test API enabled
    process.env.BOT_API_ENABLED = 'true';
    process.env.BOT_API_PORT = '4000';
    process.env.BOT_API_KEY = 'test-api-key';
    
    const config = (await import('../../src/bot/config.js')).default;
    
    expect(config.api.enabled).toBe(true);
    expect(config.api.port).toBe(4000);
    expect(config.api.key).toBe('test-api-key');
  });
});
