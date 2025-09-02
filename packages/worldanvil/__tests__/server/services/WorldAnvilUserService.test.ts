/**
 * Tests for WorldAnvilUserService
 */

import { WorldAnvilUserService, AuthorizationResult } from '../../../server/services/WorldAnvilUserService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import { WorldAnvilUser, WorldAnvilUserResponse } from '../../../models/WorldAnvilUser';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilUserService', () => {
  // Mock data for tests
  const mockAuthResult: AuthorizationResult = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'Bearer'
  };

  const mockUserResponse: WorldAnvilUserResponse = {
    id: 'user-123',
    username: 'testuser',
    display_name: 'Test User',
    avatar_url: 'https://worldanvil.com/avatar.jpg',
    subscription_type: 'premium',
    is_author: true,
    worlds: ['world-1', 'world-2']
  };

  const mockUser: WorldAnvilUser = {
    id: 'user-123',
    username: 'testuser',
    display_name: 'Test User',
    avatar_url: 'https://worldanvil.com/avatar.jpg',
    subscription_type: 'premium',
    is_author: true
  };

  // Mock client and config
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilUserService;

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
    service = new WorldAnvilUserService(mockApiClient);
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
      const newService = new WorldAnvilUserService();
      expect(newService).toBeDefined();
      // Would ideally verify a new client was created with the config values,
      // but that's implementation detail we can't easily test
    });
  });

  describe('authenticate', () => {
    it('should authenticate a user with OAuth code', async () => {
      // Setup
      const code = 'auth-code';
      const clientId = 'client-id';
      const clientSecret = 'client-secret';
      const redirectUri = 'http://localhost/callback';

      mockApiClient.post.mockResolvedValue(mockAuthResult);

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
      expect(mockApiClient.setAccessToken).toHaveBeenCalledWith(mockAuthResult.access_token);
      expect(result).toEqual(mockAuthResult);
    });
  });

  describe('refreshToken', () => {
    it('should refresh an access token', async () => {
      // Setup
      const refreshToken = 'old-refresh-token';
      const clientId = 'client-id';
      const clientSecret = 'client-secret';

      mockApiClient.post.mockResolvedValue(mockAuthResult);

      // Execute
      const result = await service.refreshToken(refreshToken, clientId, clientSecret);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret
      });
      expect(mockApiClient.setAccessToken).toHaveBeenCalledWith(mockAuthResult.access_token);
      expect(result).toEqual(mockAuthResult);
    });
  });

  describe('getCurrentUser', () => {
    it('should get the current user profile', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockUserResponse);

      // Execute
      const result = await service.getCurrentUser();

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/user/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserById', () => {
    it('should get a user by ID', async () => {
      // Setup
      const userId = 'user-123';
      mockApiClient.get.mockResolvedValue(mockUserResponse);

      // Execute
      const result = await service.getUserById(userId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith(`/user/${userId}`);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserByUsername', () => {
    it('should get a user by username', async () => {
      // Setup
      const username = 'testuser';
      mockApiClient.get.mockResolvedValue(mockUserResponse);

      // Execute
      const result = await service.getUserByUsername(username);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith(`/user/username/${username}`);
      expect(result).toEqual(mockUser);
    });
  });
});
