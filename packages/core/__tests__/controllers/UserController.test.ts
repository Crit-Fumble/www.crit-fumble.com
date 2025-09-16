/**
 * UserController Unit Tests
 * Comprehensive tests for user controller functionality
 */

import { UserController } from '../../server/controllers/UserController';
import { AuthService } from '../../server/services/AuthService';
import { UserService } from '../../server/services/UserService';

// Mock AuthService
const mockAuthService = {
  verifyToken: jest.fn(),
  handleCallback: jest.fn(),
  getSsoAuthorizationUrl: jest.fn(),
} as unknown as AuthService;

// Mock UserService
const mockUserService = {
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getUserByDiscordId: jest.fn(),
  linkDiscordAccount: jest.fn(),
} as unknown as UserService;

// Mock HTTP Request/Response interfaces
interface MockHttpRequest {
  query?: Record<string, string | string[]>;
  body?: any;
  headers?: Record<string, string | string[]>;
}

interface MockHttpResponse {
  status: jest.Mock;
  json: jest.Mock;
  send: jest.Mock;
}

const createMockResponse = (): MockHttpResponse => {
  const json = jest.fn();
  const send = jest.fn();
  const status = jest.fn().mockReturnValue({ json, send });
  
  return { status, json, send };
};

describe('UserController', () => {
  let userController: UserController;

  beforeEach(() => {
    jest.clearAllMocks();
    userController = new UserController(mockAuthService, mockUserService);
  });

  describe('Constructor', () => {
    it('should initialize with service dependencies', () => {
      expect(userController).toBeInstanceOf(UserController);
    });
  });

  describe('initialize', () => {
    it('should initialize without errors', async () => {
      await expect(userController.initialize()).resolves.not.toThrow();
    });
  });

  describe('handleDiscordAuth', () => {
    it('should handle successful Discord authentication', async () => {
      const req: MockHttpRequest = {
        query: {
          code: 'discord-auth-code',
          redirectUri: 'http://localhost:3000/callback',
        },
      };
      const res = createMockResponse();

      const mockAuthResult = {
        success: true,
        token: 'jwt-token',
      };

      const mockUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        providers: {
          discord: { id: 'discord-123', username: 'testuser' },
          worldanvil: undefined,
        },
        image: 'https://example.com/avatar.png',
      };

      (mockAuthService.handleCallback as jest.Mock).mockResolvedValue(mockAuthResult);
      (mockAuthService.verifyToken as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser,
      });

      await userController.handleDiscordAuth(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status().json).toHaveBeenCalledWith({
        success: true,
        token: 'jwt-token',
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          discordId: 'discord-123',
          worldAnvilId: undefined,
          image: 'https://example.com/avatar.png',
        },
      });
    });

    it('should handle missing Discord code', async () => {
      const req: MockHttpRequest = {
        query: {},
      };
      const res = createMockResponse();

      await userController.handleDiscordAuth(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.status().json).toHaveBeenCalledWith({
        error: 'Discord authorization code is required',
      });
    });

    it('should handle Discord authentication failure', async () => {
      const req: MockHttpRequest = {
        query: {
          code: 'invalid-code',
          redirectUri: 'http://localhost:3000/callback',
        },
      };
      const res = createMockResponse();

      const mockAuthResult = {
        success: false,
        error: 'Invalid authorization code',
      };

      (mockAuthService.handleCallback as jest.Mock).mockResolvedValue(mockAuthResult);

      await userController.handleDiscordAuth(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.status().json).toHaveBeenCalledWith({
        error: 'Invalid authorization code',
      });
    });

    it('should handle token verification failure', async () => {
      const req: MockHttpRequest = {
        query: {
          code: 'discord-auth-code',
          redirectUri: 'http://localhost:3000/callback',
        },
      };
      const res = createMockResponse();

      const mockAuthResult = {
        success: true,
        token: 'jwt-token',
      };

      (mockAuthService.handleCallback as jest.Mock).mockResolvedValue(mockAuthResult);
      (mockAuthService.verifyToken as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Invalid token',
      });

      await userController.handleDiscordAuth(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({
        error: 'Invalid token',
      });
    });
  });

  describe('handleWorldAnvilAuth', () => {
    it('should return not implemented error', async () => {
      const req: MockHttpRequest = {
        body: {
          token: 'wa-token',
          userId: 'user-123',
        },
      };
      const res = createMockResponse();

      const mockUser = {
        id: 'user-123',
        name: 'Test User',
      };

      (mockUserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await userController.handleWorldAnvilAuth(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.status().json).toHaveBeenCalledWith({
        error: 'World Anvil account linking not implemented yet',
      });
    });

    it('should handle missing token or user ID', async () => {
      const req: MockHttpRequest = {
        body: {
          token: 'wa-token',
          // Missing userId
        },
      };
      const res = createMockResponse();

      await userController.handleWorldAnvilAuth(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.status().json).toHaveBeenCalledWith({
        error: 'World Anvil token and user ID are required',
      });
    });

    it('should handle user not found', async () => {
      const req: MockHttpRequest = {
        body: {
          token: 'wa-token',
          userId: 'non-existent-user',
        },
      };
      const res = createMockResponse();

      (mockUserService.getUserById as jest.Mock).mockResolvedValue(null);

      await userController.handleWorldAnvilAuth(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({
        error: 'User not found',
      });
    });
  });

  describe('getUserIntegrationData', () => {
    it('should get user integration data with valid token', async () => {
      const req: MockHttpRequest = {
        query: { userId: 'user-123' },
        headers: { authorization: 'Bearer jwt-token' },
      };
      const res = createMockResponse();

      const mockUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.png',
        providers: {
          discord: { id: 'discord-123', username: 'testuser' },
          worldanvil: { id: 'wa-123', username: 'testuser-wa' },
        },
      };

      (mockAuthService.verifyToken as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser,
      });

      await userController.getUserIntegrationData(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status().json).toHaveBeenCalledWith({
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.png',
        discordId: 'discord-123',
        worldAnvilId: 'wa-123',
      });
    });

    it('should get user integration data without token', async () => {
      const req: MockHttpRequest = {
        query: { userId: 'user-123' },
        headers: {},
      };
      const res = createMockResponse();

      const mockUser = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.png',
        discord_id: 'discord-123',
        worldanvil_id: 'wa-123',
      };

      (mockUserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await userController.getUserIntegrationData(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status().json).toHaveBeenCalledWith({
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.png',
        discordId: 'discord-123',
        worldAnvilId: 'wa-123',
      });
    });

    it('should handle missing user ID', async () => {
      const req: MockHttpRequest = {
        query: {},
        headers: {},
      };
      const res = createMockResponse();

      await userController.getUserIntegrationData(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.status().json).toHaveBeenCalledWith({
        error: 'User ID is required',
      });
    });

    it('should handle invalid token', async () => {
      const req: MockHttpRequest = {
        query: { userId: 'user-123' },
        headers: { authorization: 'Bearer invalid-token' },
      };
      const res = createMockResponse();

      (mockAuthService.verifyToken as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Invalid token',
      });

      await userController.getUserIntegrationData(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.status().json).toHaveBeenCalledWith({
        error: 'Invalid token',
      });
    });

    it('should handle user not found', async () => {
      const req: MockHttpRequest = {
        query: { userId: 'non-existent-user' },
        headers: {},
      };
      const res = createMockResponse();

      (mockUserService.getUserById as jest.Mock).mockResolvedValue(null);

      await userController.getUserIntegrationData(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status().json).toHaveBeenCalledWith({
        error: 'User not found',
      });
    });

    it('should handle service errors', async () => {
      const req: MockHttpRequest = {
        query: { userId: 'user-123' },
        headers: {},
      };
      const res = createMockResponse();

      (mockUserService.getUserById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await userController.getUserIntegrationData(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledWith({
        error: 'Failed to fetch user data',
      });
    });
  });
});