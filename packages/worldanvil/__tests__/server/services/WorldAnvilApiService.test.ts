/**
 * Tests for WorldAnvilApiService
 */

import { WorldAnvilApiService } from '../../../server/services/WorldAnvilApiService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import * as configModule from '../../../server/configs';

// Mock the WorldAnvilApiClient and config module
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilApiService', () => {
  // Mock values for tests
  const mockConfig = {
    apiUrl: 'https://test-api.worldanvil.com',
    apiKey: 'test-api-key',
    accessToken: 'test-access-token'
  };

  // Mock response data
  const mockResponseData = { id: '123', name: 'Test Data' };

  // Create mock client
  const MockClient = WorldAnvilApiClient as jest.MockedClass<typeof WorldAnvilApiClient>;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock the API client's methods
    const mockGet = jest.fn().mockResolvedValue(mockResponseData);
    const mockPost = jest.fn().mockResolvedValue(mockResponseData);
    const mockPut = jest.fn().mockResolvedValue(mockResponseData);
    const mockDelete = jest.fn().mockResolvedValue(mockResponseData);
    const mockSetApiKey = jest.fn();
    const mockSetAccessToken = jest.fn();
    
    // Setup the mocked instance that will be returned by constructor
    MockClient.prototype.get = mockGet;
    MockClient.prototype.post = mockPost;
    MockClient.prototype.put = mockPut;
    MockClient.prototype.delete = mockDelete;
    MockClient.prototype.setApiKey = mockSetApiKey;
    MockClient.prototype.setAccessToken = mockSetAccessToken;

    // Mock getWorldAnvilConfig to return test values
    jest.spyOn(configModule, 'getWorldAnvilConfig').mockReturnValue(mockConfig);
  });
  
  describe('constructor', () => {
    it('should initialize with config from environment', () => {
      const service = new WorldAnvilApiService();
      
      // Verify getWorldAnvilConfig was called
      expect(configModule.getWorldAnvilConfig).toHaveBeenCalledTimes(1);
      
      // Verify client was initialized with config values
      expect(MockClient).toHaveBeenCalledWith({
        apiUrl: mockConfig.apiUrl,
        apiKey: mockConfig.apiKey,
        accessToken: mockConfig.accessToken
      });
    });
  });

  describe('getClient', () => {
    it('should return the API client instance', () => {
      const service = new WorldAnvilApiService();
      const client = service.getClient();

      // The client should be our mocked instance
      expect(client).toBeInstanceOf(WorldAnvilApiClient);
    });
  });

  describe('authentication methods', () => {
    let service: WorldAnvilApiService;
    
    beforeEach(() => {
      service = new WorldAnvilApiService();
    });
    
    it('should set API key on the client', () => {
      const newApiKey = 'new-api-key';
      service.setApiKey(newApiKey);

      // Get the mock client instance from the most recent constructor call
      const mockInstance = MockClient.mock.instances[0];
      expect(mockInstance.setApiKey).toHaveBeenCalledWith(newApiKey);
    });
    
    it('should set access token on the client', () => {
      const newAccessToken = 'new-access-token';
      service.setAccessToken(newAccessToken);

      // Get the mock client instance from the most recent constructor call
      const mockInstance = MockClient.mock.instances[0];
      expect(mockInstance.setAccessToken).toHaveBeenCalledWith(newAccessToken);
    });
  });

  describe('HTTP methods', () => {
    let service: WorldAnvilApiService;
    
    beforeEach(() => {
      service = new WorldAnvilApiService();
    });
    
    it('should forward GET requests to the client', async () => {
      const result = await service.get('/test-endpoint');
      
      // Get the mock client instance from the most recent constructor call
      const mockInstance = MockClient.mock.instances[0];
      expect(mockInstance.get).toHaveBeenCalledWith('/test-endpoint');
      expect(result).toEqual(mockResponseData);
    });
    
    it('should forward POST requests to the client', async () => {
      const payload = { name: 'Test' };
      const result = await service.post('/test-endpoint', payload);
      
      // Get the mock client instance from the most recent constructor call
      const mockInstance = MockClient.mock.instances[0];
      expect(mockInstance.post).toHaveBeenCalledWith('/test-endpoint', payload);
      expect(result).toEqual(mockResponseData);
    });
    
    it('should forward PUT requests to the client', async () => {
      const payload = { name: 'Updated Test' };
      const result = await service.put('/test-endpoint', payload);
      
      // Get the mock client instance from the most recent constructor call
      const mockInstance = MockClient.mock.instances[0];
      expect(mockInstance.put).toHaveBeenCalledWith('/test-endpoint', payload);
      expect(result).toEqual(mockResponseData);
    });
    
    it('should forward DELETE requests to the client', async () => {
      const result = await service.delete('/test-endpoint');
      
      // Get the mock client instance from the most recent constructor call
      const mockInstance = MockClient.mock.instances[0];
      expect(mockInstance.delete).toHaveBeenCalledWith('/test-endpoint');
      expect(result).toEqual(mockResponseData);
    });
  });
});
