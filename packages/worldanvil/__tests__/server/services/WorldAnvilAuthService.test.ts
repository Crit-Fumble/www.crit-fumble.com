/**
 * Tests for WorldAnvilAuthService
 */

import { WorldAnvilAuthService, AuthorizationResult } from '../../../server/services/WorldAnvilAuthService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import { WorldAnvilIdentity, WorldAnvilIdentityResponse } from '../../../models/WorldAnvilIdentity';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilAuthService', () => {
  // Mock data for tests
  const mockAuthResponse: AuthorizationResult = {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_in: 3600,
    token_type: 'bearer'
  };

  const mockIdentityResponse: WorldAnvilIdentityResponse = {
    id: 'identity-123',
    username: 'testuser',
    userhash: 'abc123',
    success: true,
    display_name: 'Test User',
    subscription_type: 'premium',
    is_author: true,
    avatar_url: 'https://worldanvil.com/avatar.jpg'
  };

  const mockIdentity: WorldAnvilIdentity = {
    id: 'identity-123',
    username: 'testuser',
    userhash: 'abc123',
    success: true,
    displayName: 'Test User',
    subscriptionType: 'premium',
    isAuthor: true,
    avatarUrl: 'https://worldanvil.com/avatar.jpg'
  };

  // Mock client and config
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilAuthService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock client
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      setApiKey: jest.fn(),
      setAccessToken: jest.fn(),
      getCurrentUser: jest.fn(),
      getMyWorlds: jest.fn(),
      getWorldById: jest.fn(),
      handleApiError: jest.fn()
    } as unknown as jest.Mocked<WorldAnvilApiClient>;
    
    // Create instance of service under test with mock client
    service = new WorldAnvilAuthService(mockApiClient);
  });

  describe('constructor', () => {
    it('should initialize with the provided API client', () => {
      // When created with a client, it should use that client
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
      const newService = new WorldAnvilAuthService();
      expect(newService).toBeDefined();
    });
  });

  describe('authenticate', () => {
    it('should authenticate a user and return tokens with identity', async () => {
      // Setup
      const code = 'auth-code';
      const clientId = 'client-id';
      const clientSecret = 'client-secret';
      const redirectUri = 'https://example.com/callback';
      
      mockApiClient.post.mockResolvedValue(mockAuthResponse);
      mockApiClient.get.mockResolvedValue(mockIdentityResponse);

      // Execute
      const result = await service.authenticate(code, clientId, clientSecret, redirectUri);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/oauth/token', {
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
      });
      expect(mockApiClient.setAccessToken).toHaveBeenCalledWith(mockAuthResponse.access_token);
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
      
      // Should return both token and identity
      expect(result).toEqual({
        ...mockAuthResponse,
        identity: mockIdentity
      });
    });

    it('should handle errors in identity fetch and return just the token info', async () => {
      // Setup
      const code = 'auth-code';
      const clientId = 'client-id';
      const clientSecret = 'client-secret';
      const redirectUri = 'https://example.com/callback';
      
      mockApiClient.post.mockResolvedValue(mockAuthResponse);
      mockApiClient.get.mockRejectedValue(new Error('Identity fetch failed'));

      // Execute
      const result = await service.authenticate(code, clientId, clientSecret, redirectUri);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/oauth/token', {
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
      });
      expect(mockApiClient.setAccessToken).toHaveBeenCalledWith(mockAuthResponse.access_token);
      
      // Should return just token info without identity
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh the access token and return updated tokens with identity', async () => {
      // Setup
      const refreshToken = 'old-refresh-token';
      const clientId = 'client-id';
      const clientSecret = 'client-secret';
      
      mockApiClient.post.mockResolvedValue(mockAuthResponse);
      mockApiClient.get.mockResolvedValue(mockIdentityResponse);

      // Execute
      const result = await service.refreshToken(refreshToken, clientId, clientSecret);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret
      });
      expect(mockApiClient.setAccessToken).toHaveBeenCalledWith(mockAuthResponse.access_token);
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
      
      // Should return both token and identity
      expect(result).toEqual({
        ...mockAuthResponse,
        identity: mockIdentity
      });
    });

    it('should handle errors in identity fetch during token refresh', async () => {
      // Setup
      const refreshToken = 'old-refresh-token';
      const clientId = 'client-id';
      const clientSecret = 'client-secret';
      
      mockApiClient.post.mockResolvedValue(mockAuthResponse);
      mockApiClient.get.mockRejectedValue(new Error('Identity fetch failed'));

      // Execute
      const result = await service.refreshToken(refreshToken, clientId, clientSecret);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret
      });
      
      // Should return just token info without identity
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('setAccessToken', () => {
    it('should set the access token on the API client', () => {
      // Setup
      const token = 'new-access-token';

      // Execute
      service.setAccessToken(token);

      // Verify
      expect(mockApiClient.setAccessToken).toHaveBeenCalledWith(token);
    });
  });

  describe('isTokenValid', () => {
    it('should return true when token is valid', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockIdentityResponse);

      // Execute
      const result = await service.isTokenValid();

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
      expect(result).toBe(true);
    });

    it('should return false when token is invalid', async () => {
      // Setup
      mockApiClient.get.mockRejectedValue(new Error('Invalid token'));

      // Execute
      const result = await service.isTokenValid();

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
      expect(result).toBe(false);
    });
  });

  describe('getCurrentIdentity', () => {
    it('should get current user identity with a valid token', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockIdentityResponse);

      // Execute
      const result = await service.getCurrentIdentity();

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
      expect(result).toEqual(mockIdentity);
    });

    it('should throw an error if token is invalid', async () => {
      // Setup
      const error = new Error('Invalid token');
      mockApiClient.get.mockRejectedValue(error);

      // Execute & Verify
      await expect(service.getCurrentIdentity()).rejects.toThrow(error);
    });
  });

  // Testing the private method indirectly through getCurrentIdentity
  describe('mapIdentityResponse', () => {
    it('should correctly map API response to the internal model', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockIdentityResponse);

      // Execute
      const result = await service.getCurrentIdentity();

      // Verify the mapping is correct
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
  });
});
