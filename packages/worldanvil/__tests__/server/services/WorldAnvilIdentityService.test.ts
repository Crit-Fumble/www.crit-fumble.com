/**
 * Tests for WorldAnvilIdentityService
 */

import { WorldAnvilIdentityService } from '../../../server/services/WorldAnvilIdentityService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import { WorldAnvilIdentity, WorldAnvilIdentityResponse } from '../../../models/WorldAnvilIdentity';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilIdentityService', () => {
  // Mock data
  const mockIdentityResponse: WorldAnvilIdentityResponse = {
    id: 'user-123',
    username: 'testuser',
    userhash: 'abc123',
    success: true,
    display_name: 'Test User',
    subscription_type: 'premium',
    is_author: false,
    avatar_url: 'https://example.com/avatar.jpg'
  };

  const mockIdentity: WorldAnvilIdentity = {
    id: 'user-123',
    username: 'testuser',
    userhash: 'abc123',
    success: true,
    displayName: 'Test User',
    subscriptionType: 'premium',
    isAuthor: false,
    avatarUrl: 'https://example.com/avatar.jpg'
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilIdentityService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock client
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      setApiKey: jest.fn(),
      setAccessToken: jest.fn()
    } as unknown as jest.Mocked<WorldAnvilApiClient>;

    // Create instance of service under test
    service = new WorldAnvilIdentityService(mockApiClient);
  });

  describe('constructor', () => {
    it('should initialize with the provided API client', () => {
      expect(service).toBeDefined();
    });
    
    it('should create a new client if none provided', () => {
      // Mock config values
      const mockConfig = {
        apiUrl: 'https://test.worldanvil.com',
        apiKey: 'test-key',
        accessToken: 'test-token'
      };
      
      // Setup the mock to return our config
      (configModule.getWorldAnvilConfig as jest.Mock).mockReturnValue(mockConfig);
      
      // Create service without providing a client
      const newService = new WorldAnvilIdentityService();
      expect(newService).toBeDefined();
      
      // Verify the WorldAnvilApiClient constructor was called with correct config
      expect(WorldAnvilApiClient).toHaveBeenCalledWith({
        apiUrl: mockConfig.apiUrl,
        apiKey: mockConfig.apiKey,
        accessToken: mockConfig.accessToken
      });
    });
  });

  describe('getCurrentIdentity', () => {
    it('should retrieve and map the current user identity', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockIdentityResponse);
      
      // Execute
      const result = await service.getCurrentIdentity();
      
      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
      expect(result).toEqual(mockIdentity);
    });
    
    it('should throw an error if the API request fails', async () => {
      // Setup
      const errorMessage = 'Invalid or expired token';
      mockApiClient.get.mockRejectedValue(new Error(errorMessage));
      
      // Execute and verify
      await expect(service.getCurrentIdentity()).rejects.toThrow(errorMessage);
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
    });
  });

  describe('verifyAccessToken', () => {
    it('should return true if the access token is valid', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockIdentityResponse);
      
      // Execute
      const result = await service.verifyAccessToken();
      
      // Verify
      expect(result).toBe(true);
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
    });
    
    it('should return false if the access token is invalid', async () => {
      // Setup
      mockApiClient.get.mockRejectedValue(new Error('Invalid token'));
      
      // Execute
      const result = await service.verifyAccessToken();
      
      // Verify
      expect(result).toBe(false);
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
    });
  });
  
  describe('setAccessToken', () => {
    it('should set the access token on the API client', () => {
      // Setup
      const testToken = 'new-access-token-123';
      
      // Execute
      service.setAccessToken(testToken);
      
      // Verify
      expect(mockApiClient.setAccessToken).toHaveBeenCalledWith(testToken);
    });
  });

  describe('mapIdentityResponse', () => {
    it('should correctly map identity response to internal model', async () => {
      // Setup - using getCurrentIdentity to test the private mapIdentityResponse method
      mockApiClient.get.mockResolvedValue(mockIdentityResponse);
      
      // Execute
      const result = await service.getCurrentIdentity();
      
      // Verify mapping
      expect(result).toEqual({
        id: mockIdentityResponse.id,
        username: mockIdentityResponse.username,
        userhash: mockIdentityResponse.userhash,
        success: mockIdentityResponse.success,
        displayName: mockIdentityResponse.display_name,
        subscriptionType: mockIdentityResponse.subscription_type,
        isAuthor: mockIdentityResponse.is_author,
        avatarUrl: mockIdentityResponse.avatar_url
      });
    });
    
    it('should handle minimal identity response data', async () => {
      // Setup - minimal response with only required fields
      const minimalResponse = {
        id: 'user-456',
        username: 'minimaluser',
        userhash: 'def456',
        success: true
      };
      mockApiClient.get.mockResolvedValue(minimalResponse);
      
      // Execute
      const result = await service.getCurrentIdentity();
      
      // Verify mapping handles missing optional fields
      expect(result).toEqual({
        id: minimalResponse.id,
        username: minimalResponse.username,
        userhash: minimalResponse.userhash,
        success: minimalResponse.success,
        displayName: undefined,
        subscriptionType: undefined,
        isAuthor: undefined,
        avatarUrl: undefined
      });
    });
  });
});
