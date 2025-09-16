/**
 * RpgSystemService Unit Tests
 * Comprehensive tests for RPG system management service
 */

import { RpgSystemService } from '../../server/services/RpgSystemService';
import { PrismaClient, RpgSystem, Prisma } from '@prisma/client';
import { Client } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

// Mock Prisma Client
const mockPrismaClient = {
  rpgSystem: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as PrismaClient;

// Mock Discord Client
const mockDiscordClient = {
  guilds: {
    fetch: jest.fn(),
  },
} as unknown as Client;

// Mock WorldAnvil Client
const mockWorldAnvilClient = {
  systems: {
    get: jest.fn(),
  },
} as unknown as WorldAnvilApiClient;

// Mock OpenAI Client
const mockOpenAIClient = {
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
} as unknown as OpenAI;

describe('RpgSystemService', () => {
  let rpgSystemService: RpgSystemService;

  beforeEach(() => {
    jest.clearAllMocks();
    rpgSystemService = new RpgSystemService(
      mockPrismaClient,
      mockDiscordClient,
      mockWorldAnvilClient,
      mockOpenAIClient
    );
  });

  describe('Constructor', () => {
    it('should initialize with all required dependencies', () => {
      expect(rpgSystemService).toBeInstanceOf(RpgSystemService);
    });
  });

  describe('getAll', () => {
    it('should return all RPG systems', async () => {
      const mockSystems: RpgSystem[] = [
        {
          id: 'system-1',
          worldanvil_system_id: null,
          discord_guild_id: null,
          discord_post_id: null,
          discord_chat_id: null,
          discord_thread_id: null,
          discord_forum_id: null,
          discord_voice_id: null,
          discord_role_id: null,
          title: 'D&D 5e',
          slug: 'dnd-5e',
          description: 'Fifth edition D&D',
          data: { version: '5.0', publisher: 'Wizards of the Coast', tags: ['fantasy', 'dungeons'] },
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'system-2',
          worldanvil_system_id: null,
          discord_guild_id: null,
          discord_post_id: null,
          discord_chat_id: null,
          discord_thread_id: null,
          discord_forum_id: null,
          discord_voice_id: null,
          discord_role_id: null,
          title: 'Pathfinder 2e',
          slug: 'pathfinder-2e',
          description: 'Second edition Pathfinder',
          data: { version: '2.0', publisher: 'Paizo', tags: ['fantasy', 'complex'] },
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (mockPrismaClient.rpgSystem.findMany as jest.Mock).mockResolvedValue(mockSystems);

      const result = await rpgSystemService.getAll();

      expect(result).toEqual(mockSystems);
      expect(mockPrismaClient.rpgSystem.findMany).toHaveBeenCalledWith();
    });
  });

  describe('getById', () => {
    it('should return RPG system by ID', async () => {
      const mockSystem: RpgSystem = {
        id: 'system-1',
        worldanvil_system_id: null,
        discord_guild_id: null,
        discord_post_id: null,
        discord_chat_id: null,
        discord_thread_id: null,
        discord_forum_id: null,
        discord_voice_id: null,
        discord_role_id: null,
        title: 'D&D 5e',
        slug: 'dnd-5e',
        description: 'Fifth edition D&D',
        data: { version: '5.0', publisher: 'Wizards of the Coast', tags: ['fantasy', 'dungeons'] },
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPrismaClient.rpgSystem.findUnique as jest.Mock).mockResolvedValue(mockSystem);

      const result = await rpgSystemService.getById('system-1');

      expect(result).toEqual(mockSystem);
      expect(mockPrismaClient.rpgSystem.findUnique).toHaveBeenCalledWith({
        where: { id: 'system-1' },
      });
    });

    it('should return null if system not found', async () => {
      (mockPrismaClient.rpgSystem.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await rpgSystemService.getById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getByWorldAnvilId', () => {
    it('should return RPG system by WorldAnvil ID', async () => {
      const mockSystem: RpgSystem = {
        id: 'system-1',
        worldanvil_system_id: 'wa-123',
        discord_guild_id: null,
        discord_post_id: null,
        discord_chat_id: null,
        discord_thread_id: null,
        discord_forum_id: null,
        discord_voice_id: null,
        discord_role_id: null,
        title: 'D&D 5e',
        slug: 'dnd-5e',
        description: 'Fifth edition D&D',
        data: { version: '5.0', publisher: 'Wizards of the Coast', tags: ['fantasy', 'dungeons'] },
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPrismaClient.rpgSystem.findUnique as jest.Mock).mockResolvedValue(mockSystem);

      const result = await rpgSystemService.getByWorldAnvilId('wa-123');

      expect(result).toEqual(mockSystem);
      expect(mockPrismaClient.rpgSystem.findUnique).toHaveBeenCalledWith({
        where: { worldanvil_system_id: 'wa-123' },
      });
    });
  });

  describe('search', () => {
    it('should search systems by title and description', async () => {
      const mockSystems: RpgSystem[] = [
        {
          id: 'system-1',
          worldanvil_system_id: null,
          discord_guild_id: null,
          discord_post_id: null,
          discord_chat_id: null,
          discord_thread_id: null,
          discord_forum_id: null,
          discord_voice_id: null,
          discord_role_id: null,
          title: 'D&D 5e',
          slug: 'dnd-5e',
          description: 'Fifth edition D&D',
          data: {},
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (mockPrismaClient.rpgSystem.findMany as jest.Mock).mockResolvedValue(mockSystems);

      const result = await rpgSystemService.search('D&D');

      expect(result).toEqual(mockSystems);
      expect(mockPrismaClient.rpgSystem.findMany).toHaveBeenCalledWith({
        where: {
          title: { contains: 'D&D', mode: 'insensitive' }
        },
      });
    });
  });

  describe('create', () => {
    it('should create a new RPG system', async () => {
      const systemInput: Prisma.RpgSystemCreateInput = {
        title: 'New System',
        slug: 'new-system',
        description: 'A new RPG system',
        is_active: true,
        data: {},
      };

      const mockCreatedSystem: RpgSystem = {
        id: 'system-new',
        worldanvil_system_id: null,
        discord_guild_id: null,
        discord_post_id: null,
        discord_chat_id: null,
        discord_thread_id: null,
        discord_forum_id: null,
        discord_voice_id: null,
        discord_role_id: null,
        title: 'New System',
        slug: 'new-system',
        description: 'A new RPG system',
        is_active: true,
        data: {},
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPrismaClient.rpgSystem.create as jest.Mock).mockResolvedValue(mockCreatedSystem);

      const result = await rpgSystemService.create(systemInput);

      expect(result).toEqual(mockCreatedSystem);
      expect(mockPrismaClient.rpgSystem.create).toHaveBeenCalledWith({
        data: systemInput,
      });
    });
  });

  describe('update', () => {
    it('should update an existing RPG system', async () => {
      const systemUpdate: Prisma.RpgSystemUpdateInput = {
        title: 'Updated System',
        description: 'An updated RPG system',
      };

      const mockUpdatedSystem: RpgSystem = {
        id: 'system-1',
        worldanvil_system_id: null,
        discord_guild_id: null,
        discord_post_id: null,
        discord_chat_id: null,
        discord_thread_id: null,
        discord_forum_id: null,
        discord_voice_id: null,
        discord_role_id: null,
        title: 'Updated System',
        slug: 'system-1',
        description: 'An updated RPG system',
        data: {},
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPrismaClient.rpgSystem.update as jest.Mock).mockResolvedValue(mockUpdatedSystem);

      const result = await rpgSystemService.update('system-1', systemUpdate);

      expect(result).toEqual(mockUpdatedSystem);
      expect(mockPrismaClient.rpgSystem.update).toHaveBeenCalledWith({
        where: { id: 'system-1' },
        data: systemUpdate,
      });
    });
  });

  describe('delete', () => {
    it('should delete an RPG system', async () => {
      const mockDeletedSystem: RpgSystem = {
        id: 'system-1',
        worldanvil_system_id: null,
        discord_guild_id: null,
        discord_post_id: null,
        discord_chat_id: null,
        discord_thread_id: null,
        discord_forum_id: null,
        discord_voice_id: null,
        discord_role_id: null,
        title: 'D&D 5e',
        slug: 'dnd-5e',
        description: 'Fifth edition D&D',
        data: {},
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPrismaClient.rpgSystem.delete as jest.Mock).mockResolvedValue(mockDeletedSystem);

      const result = await rpgSystemService.delete('system-1');

      expect(result).toEqual(mockDeletedSystem);
      expect(mockPrismaClient.rpgSystem.delete).toHaveBeenCalledWith({
        where: { id: 'system-1' },
      });
    });
  });
});