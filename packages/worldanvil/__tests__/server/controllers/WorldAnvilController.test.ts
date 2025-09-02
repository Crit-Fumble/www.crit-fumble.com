/**
 * Tests for WorldAnvilController
 */
import { jest } from '@jest/globals';
import { WorldAnvilController } from '../../../server/controllers/WorldAnvilController';
import { WorldAnvilAuthService, AuthorizationResult } from '../../../server/services/WorldAnvilAuthService';
import { WorldAnvilUserService } from '../../../server/services/WorldAnvilUserService';
import { WorldAnvilWorldService } from '../../../server/services/WorldAnvilWorldService';
import { WorldAnvilRpgSystemService } from '../../../server/services/WorldAnvilRpgSystemService';
import { WorldAnvilIdentityService } from '../../../server/services/WorldAnvilIdentityService';
import { WorldAnvilWorld } from '../../../models/WorldAnvilWorld';
import { WorldAnvilUser } from '../../../models/WorldAnvilUser';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';

// Mock the service dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/services/WorldAnvilAuthService');
jest.mock('../../../server/services/WorldAnvilUserService');
jest.mock('../../../server/services/WorldAnvilWorldService');
jest.mock('../../../server/services/WorldAnvilRpgSystemService');
jest.mock('../../../server/services/WorldAnvilIdentityService');

describe('WorldAnvilController', () => {
  let controller: WorldAnvilController;
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let mockAuthService: jest.Mocked<WorldAnvilAuthService>;
  let mockUserService: jest.Mocked<WorldAnvilUserService>;
  let mockWorldService: jest.Mocked<WorldAnvilWorldService>;
  let mockRpgSystemService: jest.Mocked<WorldAnvilRpgSystemService>;
  let mockIdentityService: jest.Mocked<WorldAnvilIdentityService>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create new controller instance before each test
    controller = new WorldAnvilController();
    
    // Get the mocked instances
    mockApiClient = WorldAnvilApiClient.prototype as jest.Mocked<WorldAnvilApiClient>;
    mockAuthService = WorldAnvilAuthService.prototype as jest.Mocked<WorldAnvilAuthService>;
    mockUserService = WorldAnvilUserService.prototype as jest.Mocked<WorldAnvilUserService>;
    mockWorldService = WorldAnvilWorldService.prototype as jest.Mocked<WorldAnvilWorldService>;
    mockRpgSystemService = WorldAnvilRpgSystemService.prototype as jest.Mocked<WorldAnvilRpgSystemService>;
    mockIdentityService = WorldAnvilIdentityService.prototype as jest.Mocked<WorldAnvilIdentityService>;
  });

  describe('authenticate', () => {
    it('should call authService.authenticate with correct parameters', async () => {
      // Arrange
      const code = 'test-auth-code';
      const clientId = 'test-client-id';
      const clientSecret = 'test-client-secret';
      const redirectUri = 'http://localhost:3000/callback';
      const expectedResult: AuthorizationResult = { 
        access_token: 'test-token', 
        refresh_token: 'test-refresh',
        expires_in: 3600,
        token_type: 'bearer'
      };
      
      mockAuthService.authenticate.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.authenticate(code, clientId, clientSecret, redirectUri);

      // Assert
      expect(mockAuthService.authenticate).toHaveBeenCalledWith(code, clientId, clientSecret, redirectUri);
      expect(result).toEqual(expectedResult);
    });
    
    it('should handle errors from authService.authenticate', async () => {
      // Arrange
      const code = 'invalid-code';
      const clientId = 'test-client-id';
      const clientSecret = 'test-client-secret';
      const redirectUri = 'http://localhost:3000/callback';
      const expectedError = new Error('Authentication failed');
      
      mockAuthService.authenticate.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(
        controller.authenticate(code, clientId, clientSecret, redirectUri)
      ).rejects.toThrow(expectedError);
      
      expect(mockAuthService.authenticate).toHaveBeenCalledWith(code, clientId, clientSecret, redirectUri);
    });
  });

  describe('getCurrentUser', () => {
    it('should call userService.getCurrentUser', async () => {
      // Arrange
      const expectedUser: WorldAnvilUser = { 
        id: 'user-1', 
        username: 'testuser',
        display_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        subscription_type: 'free'
      };
      mockUserService.getCurrentUser.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.getCurrentUser();

      // Assert
      expect(mockUserService.getCurrentUser).toHaveBeenCalled();
      expect(result).toEqual(expectedUser);
    });
    
    it('should handle errors from userService.getCurrentUser', async () => {
      // Arrange
      const expectedError = new Error('User not found');
      mockUserService.getCurrentUser.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(controller.getCurrentUser()).rejects.toThrow(expectedError);
      expect(mockUserService.getCurrentUser).toHaveBeenCalled();
    });
  });

  describe('getMyWorlds', () => {
    it('should call worldService.getMyWorlds', async () => {
      // Arrange
      const expectedResponse = {
        worlds: [
          { id: 'world-1', title: 'Test World 1', slug: 'test-world-1' },
          { id: 'world-2', title: 'Test World 2', slug: 'test-world-2' }
        ] as WorldAnvilWorld[],
        pagination: {
          total: 2,
          page: 1,
          pages: 1
        }
      };
      mockWorldService.getMyWorlds.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.getMyWorlds();

      // Assert
      expect(mockWorldService.getMyWorlds).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
    
    it('should handle errors from worldService.getMyWorlds', async () => {
      // Arrange
      const expectedError = new Error('Failed to fetch worlds');
      mockWorldService.getMyWorlds.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(controller.getMyWorlds()).rejects.toThrow(expectedError);
      expect(mockWorldService.getMyWorlds).toHaveBeenCalled();
    });
  });

  describe('getWorldById', () => {
    it('should call worldService.getWorldById with correct parameters', async () => {
      // Arrange
      const worldId = 'world-1';
      const expectedWorld: WorldAnvilWorld = { 
        id: worldId, 
        title: 'Test World 1',
        slug: 'test-world-1',
        description: 'A test world',
        visibility: 'public'
      };
      mockWorldService.getWorldById.mockResolvedValue(expectedWorld);

      // Act
      const result = await controller.getWorldById(worldId);

      // Assert
      expect(mockWorldService.getWorldById).toHaveBeenCalledWith(worldId);
      expect(result).toEqual(expectedWorld);
    });
    
    it('should handle errors from worldService.getWorldById', async () => {
      // Arrange
      const worldId = 'invalid-world';
      const expectedError = new Error('World not found');
      mockWorldService.getWorldById.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(controller.getWorldById(worldId)).rejects.toThrow(expectedError);
      expect(mockWorldService.getWorldById).toHaveBeenCalledWith(worldId);
    });
  });
});
