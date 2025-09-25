/**
 * RpgWorldService Unit Tests
 * Comprehensive tests for RPG world management service
 */

import { RpgWorldService } from '@crit-fumble/core/server/services/RpgWorldService';
import { PrismaClient, RpgWorld, RpgWorldSystem } from '@prisma/client';
import { Client } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import { CreateRpgWorldInput, UpdateRpgWorldInput } from '@crit-fumble/core/models';
import OpenAI from 'openai';

// Mock Prisma Client
const mockPrismaClient = {
  rpgWorld: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  rpgWorldSystem: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn(),
} as unknown as PrismaClient;

// Mock Discord Client
const mockDiscordClient = {
  guilds: {
    fetch: jest.fn(),
  },
} as unknown as Client;

// Mock WorldAnvil Client
const mockWorldAnvilClient = {
  worlds: {
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

describe('RpgWorldService', () => {
  let rpgWorldService: RpgWorldService;

  beforeEach(() => {
    jest.clearAllMocks();
    rpgWorldService = new RpgWorldService(
      mockPrismaClient,
      mockDiscordClient,
      mockWorldAnvilClient,
      mockOpenAIClient
    );
  });

  describe('Constructor', () => {
    it('should initialize with all required dependencies', () => {
      expect(rpgWorldService).toBeInstanceOf(RpgWorldService);
    });
  });

  describe('getAll', () => {
    it('should return all RPG worlds', async () => {
      const mockWorlds: RpgWorld[] = [
        {
          id: 'world-1',
          worldanvil_world_id: null,
          discord_post_id: null,
          discord_chat_id: null,
          discord_thread_id: null,
          discord_forum_id: null,
          discord_voice_id: null,
          discord_role_id: null,
          gm_ids: ['gm-1', 'gm-2'],
          title: 'Test World',
          slug: 'test-world',
          summary: 'A test RPG world',
          description: 'A detailed description of the test world',
          is_active: true,
          data: { setting: 'fantasy' },
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'world-2',
          worldanvil_world_id: 'wa-world-123',
          discord_post_id: null,
          discord_chat_id: null,
          discord_thread_id: null,
          discord_forum_id: null,
          discord_voice_id: null,
          discord_role_id: null,
          gm_ids: ['gm-3'],
          title: 'Another World',
          slug: 'another-world',
          summary: 'Another test RPG world',
          description: 'Another detailed description',
          is_active: true,
          data: { setting: 'sci-fi' },
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (mockPrismaClient.rpgWorld.findMany as jest.Mock).mockResolvedValue(mockWorlds);

      const result = await rpgWorldService.getAll();

      expect(result).toEqual(mockWorlds);
      expect(mockPrismaClient.rpgWorld.findMany).toHaveBeenCalledWith({
        orderBy: { title: 'asc' },
      });
    });
  });

  describe('getById', () => {
    it('should return RPG world by ID', async () => {
      const mockWorld: RpgWorld = {
        id: 'world-1',
        worldanvil_world_id: null,
        discord_post_id: null,
        discord_chat_id: null,
        discord_thread_id: null,
        discord_forum_id: null,
        discord_voice_id: null,
        discord_role_id: null,
        gm_ids: ['gm-1'],
        title: 'Test World',
        slug: 'test-world',
        summary: 'A test RPG world',
        description: 'A detailed description',
        is_active: true,
        data: { setting: 'fantasy' },
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPrismaClient.rpgWorld.findUnique as jest.Mock).mockResolvedValue(mockWorld);

      const result = await rpgWorldService.getById('world-1');

      expect(result).toEqual(mockWorld);
      expect(mockPrismaClient.rpgWorld.findUnique).toHaveBeenCalledWith({
        where: { id: 'world-1' },
      });
    });

    it('should return null if world not found', async () => {
      (mockPrismaClient.rpgWorld.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await rpgWorldService.getById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new RPG world', async () => {
      const worldInput: CreateRpgWorldInput = {
        title: 'Test World',
        slug: 'test-world',
        summary: 'A test world for RPG adventures',
        description: 'This is a detailed description of the test world',
        gm_ids: ['gm-123', 'gm-456'],
        is_active: true,
        data: { theme: 'fantasy' },
      };

      const mockCreatedWorld: RpgWorld = {
        id: 'world-new',
        worldanvil_world_id: null,
        discord_post_id: null,
        discord_chat_id: null,
        discord_thread_id: null,
        discord_forum_id: null,
        discord_voice_id: null,
        discord_role_id: null,
        title: worldInput.title,
        slug: worldInput.slug || null,
        summary: worldInput.summary || null,
        description: worldInput.description || null,
        gm_ids: worldInput.gm_ids as string[],
        is_active: worldInput.is_active as boolean,
        data: worldInput.data as any,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPrismaClient.rpgWorld.create as jest.Mock).mockResolvedValue(mockCreatedWorld);

      const result = await rpgWorldService.create(worldInput);

      expect(result).toEqual(mockCreatedWorld);
      expect(mockPrismaClient.rpgWorld.create).toHaveBeenCalledWith({
        data: worldInput,
      });
    });
  });

  describe('update', () => {
    it('should update an existing RPG world', async () => {
      const worldUpdate: UpdateRpgWorldInput = {
        title: 'Updated World',
        description: 'An updated world description',
      };

      const mockUpdatedWorld: RpgWorld = {
        id: 'world-1',
        worldanvil_world_id: null,
        discord_post_id: null,
        discord_chat_id: null,
        discord_thread_id: null,
        discord_forum_id: null,
        discord_voice_id: null,
        discord_role_id: null,
        title: 'Updated World',
        slug: 'world-1',
        summary: 'A test world',
        description: 'An updated world description',
        gm_ids: ['gm-1'],
        is_active: true,
        data: {},
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPrismaClient.rpgWorld.update as jest.Mock).mockResolvedValue(mockUpdatedWorld);

      const result = await rpgWorldService.update('world-1', worldUpdate);

      expect(result).toEqual(mockUpdatedWorld);
      expect(mockPrismaClient.rpgWorld.update).toHaveBeenCalledWith({
        where: { id: 'world-1' },
        data: worldUpdate,
      });
    });
  });

  describe('delete', () => {
    it('should delete an RPG world', async () => {
      const mockDeletedWorld: RpgWorld = {
        id: 'world-1',
        worldanvil_world_id: null,
        discord_post_id: null,
        discord_chat_id: null,
        discord_thread_id: null,
        discord_forum_id: null,
        discord_voice_id: null,
        discord_role_id: null,
        title: 'Test World',
        slug: 'test-world',
        summary: 'A test world',
        description: 'A test description',
        gm_ids: ['gm-1'],
        is_active: true,
        data: {},
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPrismaClient.rpgWorld.delete as jest.Mock).mockResolvedValue(mockDeletedWorld);

      const result = await rpgWorldService.delete('world-1');

      expect(result).toEqual(mockDeletedWorld);
      expect(mockPrismaClient.rpgWorld.delete).toHaveBeenCalledWith({
        where: { id: 'world-1' },
      });
    });
  });

  describe('addSystemToWorld', () => {
    it('should add a system to a world', async () => {
      const mockWorldSystem: RpgWorldSystem = {
        id: 'ws-1',
        world_id: 'world-1',
        system_id: 'system-1',
        is_primary: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPrismaClient.rpgWorldSystem.upsert as jest.Mock).mockResolvedValue(mockWorldSystem);

      const result = await rpgWorldService.addSystemToWorld('world-1', 'system-1', true);

      expect(result).toEqual(mockWorldSystem);
      expect(mockPrismaClient.rpgWorldSystem.upsert).toHaveBeenCalledWith({
        where: {
          world_id_system_id: {
            world_id: 'world-1',
            system_id: 'system-1',
          },
        },
        update: {
          is_primary: true,
        },
        create: {
          world_id: 'world-1',
          system_id: 'system-1',
          is_primary: true,
        },
      });
    });
  });

  describe('removeSystemFromWorld', () => {
    it('should remove a system from a world', async () => {
      (mockPrismaClient.rpgWorldSystem.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

      const result = await rpgWorldService.removeSystemFromWorld('world-1', 'system-1');

      expect(result).toEqual({ count: 1 });
      expect(mockPrismaClient.rpgWorldSystem.deleteMany).toHaveBeenCalledWith({
        where: {
          world_id: 'world-1',
          system_id: 'system-1',
        },
      });
    });
  });

  describe('getWorldSystems', () => {
    it('should get all systems for a world', async () => {
      const mockWorldSystems: RpgWorldSystem[] = [
        {
          id: 'ws-1',
          world_id: 'world-1',
          system_id: 'system-1',
          is_primary: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'ws-2',
          world_id: 'world-1',
          system_id: 'system-2',
          is_primary: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (mockPrismaClient.rpgWorldSystem.findMany as jest.Mock).mockResolvedValue(mockWorldSystems);

      const result = await rpgWorldService.getWorldSystems('world-1');

      expect(result).toEqual(mockWorldSystems);
      expect(mockPrismaClient.rpgWorldSystem.findMany).toHaveBeenCalledWith({
        where: { world_id: 'world-1' },
        include: { system: true },
      });
    });
  });

  describe('setPrimarySystem', () => {
    it('should set a system as primary for a world', async () => {
      const mockTransaction = jest.fn((callback) => callback(mockPrismaClient));
      (mockPrismaClient.$transaction as jest.Mock) = mockTransaction;

      const mockUpdatedWorldSystem: RpgWorldSystem = {
        id: 'ws-1',
        world_id: 'world-1',
        system_id: 'system-1',
        is_primary: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPrismaClient.rpgWorldSystem.update as jest.Mock).mockResolvedValue(mockUpdatedWorldSystem);

      const result = await rpgWorldService.setPrimarySystem('world-1', 'system-1');

      expect(result).toEqual(mockUpdatedWorldSystem);
      expect(mockPrismaClient.$transaction).toHaveBeenCalled();
    });
  });
});