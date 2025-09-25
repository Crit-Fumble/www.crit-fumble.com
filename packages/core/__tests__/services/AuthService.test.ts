/**
 * AuthService Unit Tests
 * Comprehensive tests for SSO authentication service
 */

import { AuthService } from '../../server/services/AuthService';
import { AuthConfig } from '../../models/config/auth.config';
import { SsoProvider, ISsoProvider, SsoUserProfile, SsoAuthResult } from '../../models/auth';
import { PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Mock Prisma Client
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
  },
} as unknown as PrismaClient;

// Mock Discord SSO Provider
const mockDiscordProvider: ISsoProvider = {
  provider: SsoProvider.DISCORD,
  getAuthorizationUrl: jest.fn().mockReturnValue('https://discord.com/api/oauth2/authorize?test'),
  exchangeCodeForToken: jest.fn(),
  getUserProfile: jest.fn(),
  refreshToken: jest.fn(),
  revokeToken: jest.fn(),
};

// Mock Auth Config
const mockAuthConfig: AuthConfig = {
  jwtSecret: 'test-secret-key-for-jwt-tokens',
  tokenExpiration: '24h',
  sso: {
    discord: {
      clientId: 'test-discord-client-id',
      clientSecret: 'test-discord-client-secret',
      redirectUri: 'http://localhost:3000/auth/discord/callback',
      scopes: ['identify', 'email'],
      guildId: 'test-guild-id',
    },
  },
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(mockPrismaClient, mockAuthConfig);
  });

  describe('Constructor', () => {
    it('should initialize with Prisma client and auth config', () => {
      expect(authService).toBeInstanceOf(AuthService);
    });

    it('should have Discord provider available', () => {
      const providers = authService.getAvailableProviders();
      expect(providers).toContain(SsoProvider.DISCORD);
    });
  });

  describe('Provider Management', () => {
    it('should add external providers', () => {
      const mockProvider: ISsoProvider = {
        provider: SsoProvider.WORLDANVIL,
        getAuthorizationUrl: jest.fn(),
        exchangeCodeForToken: jest.fn(),
        getUserProfile: jest.fn(),
        refreshToken: jest.fn(),
        revokeToken: jest.fn(),
      };

      authService.addProvider(SsoProvider.WORLDANVIL, mockProvider);
      const providers = authService.getAvailableProviders();
      expect(providers).toContain(SsoProvider.WORLDANVIL);
    });

    it('should remove providers', () => {
      const result = authService.removeProvider(SsoProvider.DISCORD);
      expect(result).toBe(true);
      
      const providers = authService.getAvailableProviders();
      expect(providers).not.toContain(SsoProvider.DISCORD);
    });

    it('should return false when removing non-existent provider', () => {
      const result = authService.removeProvider(SsoProvider.WORLDANVIL);
      expect(result).toBe(false);
    });
  });

  describe('Authorization URL Generation', () => {
    it('should generate SSO authorization URL', () => {
      const url = authService.getSsoAuthorizationUrl(SsoProvider.DISCORD, 'test-state');
      expect(url).toContain('https://discord.com/api/oauth2/authorize');
    });

    it('should throw error for unavailable provider', () => {
      expect(() => {
        authService.getSsoAuthorizationUrl(SsoProvider.WORLDANVIL);
      }).toThrow('SSO provider WORLDANVIL not available');
    });
  });

  describe('SSO Callback Handling', () => {
    beforeEach(() => {
      authService.addProvider(SsoProvider.DISCORD, mockDiscordProvider);
    });

    it('should handle successful SSO callback for new user', async () => {
      const mockUserProfile: SsoUserProfile = {
        provider: SsoProvider.DISCORD,
        id: 'discord-123',
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
        avatar: 'https://example.com/avatar.png',
      };

      (mockDiscordProvider.exchangeCodeForToken as jest.Mock).mockResolvedValue({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        expires_in: 3600,
      });

      (mockDiscordProvider.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);

      (mockPrismaClient.user.findFirst as jest.Mock).mockResolvedValue(null);

      const mockUser: User = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: null,
        image: 'https://example.com/avatar.png',
        discord_id: 'discord-123',
        worldanvil_id: null,
        slug: 'test-user',
        admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: null,
      };

      (mockPrismaClient.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.handleSsoCallback(
        SsoProvider.DISCORD,
        'auth-code',
        'test-state'
      );

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(mockPrismaClient.user.create).toHaveBeenCalled();
    });

    it('should handle successful SSO callback for existing user', async () => {
      const mockUserProfile: SsoUserProfile = {
        provider: SsoProvider.DISCORD,
        id: 'discord-123',
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
        avatar: 'https://example.com/avatar.png',
      };

      (mockDiscordProvider.exchangeCodeForToken as jest.Mock).mockResolvedValue({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        expires_in: 3600,
      });

      (mockDiscordProvider.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);

      const result = await authService.handleSsoCallback(
        SsoProvider.DISCORD,
        'auth-code',
        'test-state'
      );

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
    });

    it('should handle SSO callback errors', async () => {
      (mockDiscordProvider.exchangeCodeForToken as jest.Mock).mockRejectedValue(
        new Error('Token exchange failed')
      );

      const result = await authService.handleSsoCallback(
        SsoProvider.DISCORD,
        'invalid-code',
        'test-state'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Token exchange failed');
    });
  });

  describe('Token Verification', () => {
    it('should verify valid JWT token', async () => {
      const mockUser: User = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: null,
        image: null,
        discord_id: 'discord-123',
        worldanvil_id: null,
        slug: 'test-user',
        admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: null,
      };

      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const token = jwt.sign(
        { userId: 'user-123', providers: { discord: 'discord-123' } },
        mockAuthConfig.jwtSecret,
        { expiresIn: '24h' }
      );

      const result = await authService.verifyToken(token);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.id).toBe('user-123');
    });

    it('should reject invalid JWT token', async () => {
      const result = await authService.verifyToken('invalid-token');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid or expired token');
    });

    it('should reject token for non-existent user', async () => {
      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      const token = jwt.sign(
        { userId: 'non-existent-user', providers: { discord: 'discord-123' } },
        mockAuthConfig.jwtSecret,
        { expiresIn: '24h' }
      );

      const result = await authService.verifyToken(token);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });
  });

  describe('User Link Status', () => {
    it('should return user link status', async () => {
      const mockUser: User = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: null,
        image: null,
        discord_id: 'discord-123',
        worldanvil_id: null,
        slug: 'test-user',
        admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: null,
      };

      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.getUserLinkStatus('user-123');

      expect(result.success).toBe(true);
      expect(result.linkedProviders).toContain(SsoProvider.DISCORD);
      expect(result.linkedProviders).not.toContain(SsoProvider.WORLDANVIL);
    });

    it('should handle non-existent user', async () => {
      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await authService.getUserLinkStatus('non-existent-user');

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });
  });

  describe('Legacy Discord Methods', () => {
    it('should generate Discord authorization URL', () => {
      const url = authService.getAuthorizationUrl('http://localhost:3000/callback', 'test-state');
      expect(url).toContain('discord.com/api/oauth2/authorize');
      expect(url).toContain('client_id=test-discord-client-id');
      expect(url).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback');
      expect(url).toContain('state=test-state');
    });

    it('should handle Discord callback', async () => {
      authService.addProvider(SsoProvider.DISCORD, mockDiscordProvider);

      (mockDiscordProvider.exchangeCodeForToken as jest.Mock).mockResolvedValue({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        expires_in: 3600,
      });

      (mockDiscordProvider.getUserProfile as jest.Mock).mockResolvedValue({
        provider: SsoProvider.DISCORD,
        id: 'discord-123',
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
        avatar: 'https://example.com/avatar.png',
      });

      (mockPrismaClient.user.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrismaClient.user.create as jest.Mock).mockResolvedValue({
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: null,
        image: 'https://example.com/avatar.png',
        discord_id: 'discord-123',
        worldanvil_id: null,
        slug: 'test-user',
        admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: null,
      });

      const result = await authService.handleCallback('auth-code', 'redirect-uri');

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
    });
  });
});