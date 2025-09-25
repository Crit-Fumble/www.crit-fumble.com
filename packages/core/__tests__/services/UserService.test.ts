/**
 * UserService Unit Tests
 * Comprehensive tests for user management service
 */

import { UserService } from '../../server/services/UserService';
import { PrismaClient, User } from '@prisma/client';
import { Client } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

// Mock Prisma Client
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
} as unknown as PrismaClient;

// Mock Discord Client
const mockDiscordClient = {
  users: {
    fetch: jest.fn(),
  },
  guilds: {
    fetch: jest.fn(),
  },
} as unknown as Client;

// Mock WorldAnvil Client
const mockWorldAnvilClient = {
  getUser: jest.fn(),
  getWorlds: jest.fn(),
  getCampaigns: jest.fn(),
} as unknown as WorldAnvilApiClient;

// Mock OpenAI Client
const mockOpenAIClient = {
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
} as unknown as OpenAI;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mock implementations
    (mockPrismaClient.user.findUnique as jest.Mock).mockReset();
    (mockPrismaClient.user.findFirst as jest.Mock).mockReset();
    (mockPrismaClient.user.create as jest.Mock).mockReset();
    (mockPrismaClient.user.update as jest.Mock).mockReset();
    
    userService = new UserService(
      mockPrismaClient,
      mockDiscordClient,
      mockWorldAnvilClient,
      mockOpenAIClient
    );
  });

  describe('Constructor', () => {
    it('should initialize with all client dependencies', () => {
      expect(userService).toBeInstanceOf(UserService);
    });
  });

  describe('getUserById', () => {
    const mockUser: User = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: null,
      image: 'https://example.com/avatar.png',
      discord_id: 'discord-123',
      worldanvil_id: 'wa-123',
      slug: 'test-user',
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: null,
    };

    it('should get user by database ID', async () => {
      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById('user-123');

      expect(result).toEqual(mockUser);
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' }
      });
    });

    it('should get user by Discord ID when not found by database ID', async () => {
      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrismaClient.user.findFirst as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);

      const result = await userService.getUserById('discord-123');

      expect(result).toEqual(mockUser);
      expect(mockPrismaClient.user.findFirst).toHaveBeenCalledWith({
        where: { discord_id: 'discord-123' }
      });
    });

    it('should get user by WorldAnvil ID when not found by other IDs', async () => {
      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrismaClient.user.findFirst as jest.Mock)
        .mockResolvedValueOnce(null) // First call for discord_id
        .mockResolvedValueOnce(mockUser); // Second call for worldanvil_id

      const result = await userService.getUserById('wa-123');

      expect(result).toEqual(mockUser);
      expect(mockPrismaClient.user.findFirst).toHaveBeenCalledWith({
        where: { worldanvil_id: 'wa-123' }
      });
    });

    it('should return null when user not found', async () => {
      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrismaClient.user.findFirst as jest.Mock)
        .mockResolvedValueOnce(null) // First call for discord_id
        .mockResolvedValueOnce(null); // Second call for worldanvil_id

      const result = await userService.getUserById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should get user by email', async () => {
      const mockUser: User = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: null,
        image: null,
        discord_id: null,
        worldanvil_id: null,
        slug: 'test-user',
        admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: null,
      };

      // Clear any previous mock calls and set up fresh mock
      (mockPrismaClient.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaClient.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'New User',
        email: 'new@example.com',
        discord_id: 'discord-456',
        slug: 'new-user',
      };

      const createdUser: User = {
        id: 'user-456',
        name: userData.name,
        email: userData.email,
        emailVerified: null,
        image: null,
        discord_id: userData.discord_id,
        worldanvil_id: null,
        slug: userData.slug,
        admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: null,
      };

      (mockPrismaClient.user.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await userService.createUser(userData);

      expect(result).toEqual(createdUser);
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: userData
      });
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      const updatedUser: User = {
        id: 'user-123',
        name: updateData.name,
        email: updateData.email,
        emailVerified: null,
        image: null,
        discord_id: 'discord-123',
        worldanvil_id: null,
        slug: 'updated-user',
        admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: null,
      };

      (mockPrismaClient.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await userService.updateUser('user-123', updateData);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: updateData
      });
    });
  });

  describe('validateDiscordId', () => {
    it('should return true for valid Discord ID', async () => {
      const result = await userService.validateDiscordId('discord-123');
      expect(result).toBe(true);
    });
  });

  describe('validateWorldAnvilId', () => {
    it('should return true for valid WorldAnvil ID', async () => {
      const result = await userService.validateWorldAnvilId('wa-123');
      expect(result).toBe(true);
    });
  });

  describe('generateAIContent', () => {
    it('should throw not implemented error', async () => {
      // Mock getUserById to return a user so we don't get 'User not found' error
      const mockUser = { id: 'user-123', name: 'Test User' };
      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      
      await expect(
        userService.generateAIContent('user-123', 'bio')
      ).rejects.toThrow('Not implemented - use OpenAI SDK directly');
    });
  });

  describe('analyzeUserActivity', () => {
    it('should throw not implemented error', async () => {
      await expect(
        userService.analyzeUserActivity('user-123')
      ).rejects.toThrow('Not implemented - use OpenAI SDK directly');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      (mockPrismaClient.user.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      await expect(userService.getUserById('user-123')).rejects.toThrow(
        'Database connection failed'
      );
    });
  });
});