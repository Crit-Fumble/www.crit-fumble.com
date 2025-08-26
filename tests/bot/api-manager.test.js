import { jest } from '@jest/globals';
import fetch from 'node-fetch';
import ApiManager from '../../src/bot/managers/ApiManager.js';

// Mock dependencies
jest.mock('node-fetch');
jest.mock('../../src/bot/config.js', () => ({
  __esModule: true,
  default: {
    api: {
      url: 'http://test-api.com',
      key: 'test-api-key'
    }
  }
}));

describe('ApiManager', () => {
  let apiManager;
  let mockLogger;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup a mock response
    const mockResponse = {
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockImplementation(header => {
          if (header === 'content-type') return 'application/json';
          return null;
        })
      },
      json: jest.fn().mockResolvedValue({ data: 'test data' }),
      text: jest.fn().mockResolvedValue('text response')
    };
    
    // Configure fetch mock
    fetch.mockResolvedValue(mockResponse);
    
    // Create a mock logger
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };
    
    // Create an instance of ApiManager with the mock logger
    apiManager = new ApiManager(mockLogger);
  });
  
  describe('constructor', () => {
    test('should initialize with correct values from config', () => {
      expect(apiManager.baseUrl).toBe('http://test-api.com/api');
      expect(apiManager.apiKey).toBe('test-api-key');
      expect(apiManager.logger).toBe(mockLogger);
    });
  });
  
  describe('callApi', () => {
    test('should make a GET request with correct headers', async () => {
      await apiManager.callApi('/test-endpoint');
      
      expect(fetch).toHaveBeenCalledWith('http://test-api.com/api/test-endpoint', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key'
        }
      });
    });
    
    test('should make a POST request with data', async () => {
      const testData = { test: 'data' };
      await apiManager.callApi('/test-endpoint', 'POST', testData);
      
      expect(fetch).toHaveBeenCalledWith('http://test-api.com/api/test-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key'
        },
        body: JSON.stringify(testData)
      });
    });
    
    test('should return JSON when content-type is application/json', async () => {
      const result = await apiManager.callApi('/test-endpoint');
      
      expect(result).toEqual({ data: 'test data' });
    });
    
    test('should handle API errors', async () => {
      // Mock a failed response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue('Not found')
      });
      
      await expect(apiManager.callApi('/not-found')).rejects.toThrow('API Error (404)');
      expect(mockLogger.error).toHaveBeenCalled();
    });
    
    test('should handle network errors', async () => {
      // Mock a network error
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(apiManager.callApi('/test-endpoint')).rejects.toThrow('Network error');
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
  
  describe('convenience methods', () => {
    test('get should call callApi with GET method', async () => {
      const spy = jest.spyOn(apiManager, 'callApi');
      await apiManager.get('/test');
      
      expect(spy).toHaveBeenCalledWith('/test', 'GET');
    });
    
    test('post should call callApi with POST method and data', async () => {
      const spy = jest.spyOn(apiManager, 'callApi');
      const data = { test: 'data' };
      await apiManager.post('/test', data);
      
      expect(spy).toHaveBeenCalledWith('/test', 'POST', data);
    });
    
    test('put should call callApi with PUT method and data', async () => {
      const spy = jest.spyOn(apiManager, 'callApi');
      const data = { test: 'data' };
      await apiManager.put('/test', data);
      
      expect(spy).toHaveBeenCalledWith('/test', 'PUT', data);
    });
    
    test('delete should call callApi with DELETE method', async () => {
      const spy = jest.spyOn(apiManager, 'callApi');
      await apiManager.delete('/test');
      
      expect(spy).toHaveBeenCalledWith('/test', 'DELETE');
    });
  });
  
  describe('business methods', () => {
    test('isApiAvailable should return true when health check succeeds', async () => {
      const spy = jest.spyOn(apiManager, 'get');
      spy.mockResolvedValueOnce({ status: 'ok' });
      
      const result = await apiManager.isApiAvailable();
      
      expect(result).toBe(true);
      expect(spy).toHaveBeenCalledWith('/health');
    });
    
    test('isApiAvailable should return false when health check fails', async () => {
      const spy = jest.spyOn(apiManager, 'get');
      spy.mockRejectedValueOnce(new Error('API unavailable'));
      
      const result = await apiManager.isApiAvailable();
      
      expect(result).toBe(false);
      expect(mockLogger.warn).toHaveBeenCalled();
    });
    
    test('getCampaign should call API with correct endpoint', async () => {
      const spy = jest.spyOn(apiManager, 'get');
      await apiManager.getCampaign('campaign-123');
      
      expect(spy).toHaveBeenCalledWith('/campaign/campaign-123');
    });
    
    test('getCampaignEvents should call API with correct endpoint', async () => {
      const spy = jest.spyOn(apiManager, 'get');
      await apiManager.getCampaignEvents('campaign-123');
      
      expect(spy).toHaveBeenCalledWith('/campaign/campaign-123/events');
    });
    
    test('notifyDiscordEvent should send event data to API', async () => {
      const spy = jest.spyOn(apiManager, 'post');
      jest.useFakeTimers().setSystemTime(new Date('2025-08-26T00:00:00Z'));
      
      await apiManager.notifyDiscordEvent('voice_channel_joined', { userId: '123' });
      
      expect(spy).toHaveBeenCalledWith('/discord/events', {
        type: 'voice_channel_joined',
        data: { userId: '123' },
        timestamp: '2025-08-26T00:00:00.000Z'
      });
      
      jest.useRealTimers();
    });
    
    test('updateUserPresence should update user status in API', async () => {
      const spy = jest.spyOn(apiManager, 'put');
      jest.useFakeTimers().setSystemTime(new Date('2025-08-26T00:00:00Z'));
      
      await apiManager.updateUserPresence('user-123', 'online', { type: 'PLAYING', name: 'Dungeons & Dragons' });
      
      expect(spy).toHaveBeenCalledWith('/users/user-123/presence', {
        status: 'online',
        activity: { type: 'PLAYING', name: 'Dungeons & Dragons' },
        lastSeen: '2025-08-26T00:00:00.000Z'
      });
      
      jest.useRealTimers();
    });
  });
});
