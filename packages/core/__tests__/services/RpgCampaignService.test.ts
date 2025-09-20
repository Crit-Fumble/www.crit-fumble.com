/**
 * RpgCampaignService Unit Tests
 * Comprehensive tests for RPG campaign management service
 */

import { RpgCampaignService } from '../../server/services/RpgCampaignService';
import { PrismaClient, RpgCampaign, Prisma } from '@prisma/client';
import { Client } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

// Mock Prisma Client
const mockPrismaClient = {
  rpgCampaign: {
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
  getCurrentUser: jest.fn(),
  getMyWorlds: jest.fn(),
  getWorldById: jest.fn(),
} as unknown as WorldAnvilApiClient;

// Helper function to create complete mock RpgCampaign objects
function createMockRpgCampaign(overrides: Partial<any> = {}): any {
  return {
    id: 'campaign-id',
    worldanvil_campaign_id: null,
    discord_post_id: null,
    discord_chat_id: null,
    discord_thread_id: null,
    discord_forum_id: null,
    discord_voice_id: null,
    discord_role_id: null,
    title: 'Default Campaign',
    slug: null,
    description: null,
    gm_ids: [],
    is_active: true,
    data: null,
    created_at: new Date(),
    updated_at: new Date(),
    rpg_system_id: null,
    rpg_world_id: null,
    ...overrides,
  };
}

// Mock OpenAI Client
const mockOpenAIClient = {
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
} as unknown as OpenAI;

describe('RpgCampaignService', () => {
  let rpgCampaignService: RpgCampaignService;

  beforeEach(() => {
    jest.clearAllMocks();
    rpgCampaignService = new RpgCampaignService(
      mockPrismaClient,
      mockDiscordClient,
      mockWorldAnvilClient,
      mockOpenAIClient
    );
  });

  describe('Constructor', () => {
    it('should initialize with all required dependencies', () => {
      expect(rpgCampaignService).toBeInstanceOf(RpgCampaignService);
    });
  });

  describe('getAll', () => {
    it('should return all RPG campaigns', async () => {
      const mockCampaigns = [
        createMockRpgCampaign({
          id: 'campaign-1',
          title: 'Lost Mines of Phandelver',
          description: 'Starter campaign for D&D 5e',
        }),
      ];

      (mockPrismaClient.rpgCampaign.findMany as jest.Mock).mockResolvedValue(mockCampaigns);

      const result = await rpgCampaignService.getAll();

      expect(result).toEqual(mockCampaigns);
      expect(mockPrismaClient.rpgCampaign.findMany).toHaveBeenCalledWith({
        orderBy: { title: 'asc' },
      });
    });
  });

  describe('getById', () => {
    it('should return campaign by ID', async () => {
      const mockCampaign: RpgCampaign = {
        id: 'campaign-1',
        title: 'Lost Mines of Phandelver',
        description: 'Starter campaign for D&D 5e',
        rpg_system_id: 'system-1',
        rpg_world_id: 'world-1',
        gm_ids: [ 'user-1',
        worldanvil_id: null,
        status: 'active',
        playerCount: 4,
        sessionCount: 12,
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.rpgCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);

      const result = await rpgCampaignService.getById('campaign-1');

      expect(result).toEqual(mockCampaign);
      expect(mockPrismaClient.rpgCampaign.findUnique).toHaveBeenCalledWith({
        where: { id: 'campaign-1' },
      });
    });

    it('should return null if campaign not found', async () => {
      (mockPrismaClient.rpgCampaign.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await rpgCampaignService.getById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getByWorldAnvilId', () => {
    it('should return campaign by WorldAnvil ID', async () => {
      const mockCampaign: RpgCampaign = {
        id: 'campaign-1',
        title: 'Lost Mines of Phandelver',
        description: 'Starter campaign for D&D 5e',
        rpg_system_id: 'system-1',
        rpg_world_id: 'world-1',
        gm_ids: [ 'user-1',
        worldanvil_id: 'wa-123',
        status: 'active',
        playerCount: 4,
        sessionCount: 12,
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.rpgCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);

      const result = await rpgCampaignService.getByWorldAnvilId('wa-123');

      expect(result).toEqual(mockCampaign);
      expect(mockPrismaClient.rpgCampaign.findUnique).toHaveBeenCalledWith({
        where: { worldanvil_id: 'wa-123' },
      });
    });
  });

  describe('getBySystemId', () => {
    it('should return campaigns by system ID', async () => {
      const mockCampaigns: RpgCampaign[] = [
        {
          id: 'campaign-1',
          title: 'Lost Mines of Phandelver',
          description: 'Starter campaign for D&D 5e',
          rpg_system_id: 'system-1',
          rpg_world_id: 'world-1',
          gm_ids: [ 'user-1',
          worldanvil_id: null,
          status: 'active',
          playerCount: 4,
          sessionCount: 12,
          config: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrismaClient.rpgCampaign.findMany as jest.Mock).mockResolvedValue(mockCampaigns);

      const result = await rpgCampaignService.getBySystemId('system-1');

      expect(result).toEqual(mockCampaigns);
      expect(mockPrismaClient.rpgCampaign.findMany).toHaveBeenCalledWith({
        where: { rpg_system_id: 'system-1' },
        orderBy: { title: 'asc' },
      });
    });
  });

  describe('getByWorldId', () => {
    it('should return campaigns by world ID', async () => {
      const mockCampaigns: RpgCampaign[] = [
        {
          id: 'campaign-1',
          title: 'Lost Mines of Phandelver',
          description: 'Starter campaign for D&D 5e',
          rpg_system_id: 'system-1',
          rpg_world_id: 'world-1',
          gm_ids: [ 'user-1',
          worldanvil_id: null,
          status: 'active',
          playerCount: 4,
          sessionCount: 12,
          config: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrismaClient.rpgCampaign.findMany as jest.Mock).mockResolvedValue(mockCampaigns);

      const result = await rpgCampaignService.getByWorldId('world-1');

      expect(result).toEqual(mockCampaigns);
      expect(mockPrismaClient.rpgCampaign.findMany).toHaveBeenCalledWith({
        where: { rpg_world_id: 'world-1' },
        orderBy: { title: 'asc' },
      });
    });
  });

  describe('getByGmId', () => {
    it('should return campaigns by GM ID', async () => {
      const mockCampaigns: RpgCampaign[] = [
        {
          id: 'campaign-1',
          title: 'Lost Mines of Phandelver',
          description: 'Starter campaign for D&D 5e',
          rpg_system_id: 'system-1',
          rpg_world_id: 'world-1',
          gm_ids: [ 'user-1',
          worldanvil_id: null,
          status: 'active',
          playerCount: 4,
          sessionCount: 12,
          config: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrismaClient.rpgCampaign.findMany as jest.Mock).mockResolvedValue(mockCampaigns);

      const result = await rpgCampaignService.getByGmId('user-1');

      expect(result).toEqual(mockCampaigns);
      expect(mockPrismaClient.rpgCampaign.findMany).toHaveBeenCalledWith({
        where: { gm_ids: [ 'user-1' },
        orderBy: { title: 'asc' },
        include: {
          system: true,
          world: true,
          gm: true,
        },
      });
    });
  });

  describe('search', () => {
    it('should search campaigns by query', async () => {
      const mockCampaigns: RpgCampaign[] = [
        {
          id: 'campaign-1',
          title: 'Lost Mines of Phandelver',
          description: 'Starter campaign for D&D 5e',
          rpg_system_id: 'system-1',
          rpg_world_id: 'world-1',
          gm_ids: [ 'user-1',
          worldanvil_id: null,
          status: 'active',
          playerCount: 4,
          sessionCount: 12,
          config: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrismaClient.rpgCampaign.findMany as jest.Mock).mockResolvedValue(mockCampaigns);

      const result = await rpgCampaignService.search('Lost Mines');

      expect(result).toEqual(mockCampaigns);
      expect(mockPrismaClient.rpgCampaign.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'Lost Mines', mode: 'insensitive' } },
            { description: { contains: 'Lost Mines', mode: 'insensitive' } },
          ],
        },
        orderBy: { title: 'asc' },
      });
    });
  });

  describe('create', () => {
    it('should create new campaign', async () => {
      const createData: Prisma.RpgCampaignCreateInput = {
        title: 'New Campaign',
        description: 'A new RPG campaign',
        system: { connect: { id: 'system-1' } },
        world: { connect: { id: 'world-1' } },
        gm: { connect: { id: 'user-1' } },
        status: 'planning',
        playerCount: 0,
        sessionCount: 0,
        config: {},
      };

      const mockCreatedCampaign: RpgCampaign = {
        id: 'campaign-new',
        title: 'New Campaign',
        description: 'A new RPG campaign',
        rpg_system_id: 'system-1',
        rpg_world_id: 'world-1',
        gm_ids: [ 'user-1',
        worldanvil_id: null,
        status: 'planning',
        playerCount: 0,
        sessionCount: 0,
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.rpgCampaign.create as jest.Mock).mockResolvedValue(mockCreatedCampaign);

      const result = await rpgCampaignService.create(createData);

      expect(result).toEqual(mockCreatedCampaign);
      expect(mockPrismaClient.rpgCampaign.create).toHaveBeenCalledWith({
        data: createData,
      });
    });
  });

  describe('update', () => {
    it('should update existing campaign', async () => {
      const updateData: Prisma.RpgCampaignUpdateInput = {
        title: 'Updated Campaign',
        description: 'An updated RPG campaign',
        status: 'active',
      };

      const mockUpdatedCampaign: RpgCampaign = {
        id: 'campaign-1',
        title: 'Updated Campaign',
        description: 'An updated RPG campaign',
        rpg_system_id: 'system-1',
        rpg_world_id: 'world-1',
        gm_ids: [ 'user-1',
        worldanvil_id: null,
        status: 'active',
        playerCount: 4,
        sessionCount: 12,
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.rpgCampaign.update as jest.Mock).mockResolvedValue(mockUpdatedCampaign);

      const result = await rpgCampaignService.update('campaign-1', updateData);

      expect(result).toEqual(mockUpdatedCampaign);
      expect(mockPrismaClient.rpgCampaign.update).toHaveBeenCalledWith({
        where: { id: 'campaign-1' },
        data: updateData,
      });
    });
  });

  describe('delete', () => {
    it('should delete campaign', async () => {
      const mockDeletedCampaign: RpgCampaign = {
        id: 'campaign-1',
        title: 'Lost Mines of Phandelver',
        description: 'Starter campaign for D&D 5e',
        rpg_system_id: 'system-1',
        rpg_world_id: 'world-1',
        gm_ids: [ 'user-1',
        worldanvil_id: null,
        status: 'active',
        playerCount: 4,
        sessionCount: 12,
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.rpgCampaign.delete as jest.Mock).mockResolvedValue(mockDeletedCampaign);

      const result = await rpgCampaignService.delete('campaign-1');

      expect(result).toEqual(mockDeletedCampaign);
      expect(mockPrismaClient.rpgCampaign.delete).toHaveBeenCalledWith({
        where: { id: 'campaign-1' },
      });
    });
  });

  describe('setupDiscordIntegration', () => {
    it('should setup Discord integration for campaign', async () => {
      const mockGuild = {
        id: 'guild-123',
        title: 'Test Guild',
        channels: {
          create: jest.fn().mockResolvedValue({
            id: 'channel-123',
            title: 'campaign-channel',
          }),
        },
      };

      (mockDiscordClient.guilds.fetch as jest.Mock).mockResolvedValue(mockGuild);

      const mockCampaign: RpgCampaign = {
        id: 'campaign-1',
        title: 'Test Campaign',
        description: 'Test campaign',
        rpg_system_id: 'system-1',
        rpg_world_id: 'world-1',
        gm_ids: [ 'user-1',
        worldanvil_id: null,
        status: 'active',
        playerCount: 4,
        sessionCount: 12,
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.rpgCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);
      (mockPrismaClient.rpgCampaign.update as jest.Mock).mockResolvedValue({
        ...mockCampaign,
        config: { discord: { guildId: 'guild-123', channelId: 'channel-123' } },
      });

      await rpgCampaignService.setupDiscordIntegration('campaign-1', 'guild-123');

      expect(mockDiscordClient.guilds.fetch).toHaveBeenCalledWith('guild-123');
      expect(mockGuild.channels.create).toHaveBeenCalled();
    });

    it('should handle Discord integration errors', async () => {
      (mockDiscordClient.guilds.fetch as jest.Mock).mockRejectedValue(
        new Error('Guild not found')
      );

      await expect(
        rpgCampaignService.setupDiscordIntegration('campaign-1', 'invalid-guild')
      ).rejects.toThrow('Failed to setup Discord integration: Guild not found');
    });
  });

  describe('syncWithWorldAnvil', () => {
    it('should sync campaign with WorldAnvil', async () => {
      const mockWorldAnvilData = {
        id: 'wa-123',
        title: 'WorldAnvil Campaign',
        excerpt: 'Campaign from WorldAnvil',
      };


      const mockUpdatedCampaign: RpgCampaign = {
        id: 'campaign-1',
        title: 'WorldAnvil Campaign',
        description: 'Campaign from WorldAnvil',
        rpg_system_id: 'system-1',
        rpg_world_id: 'world-1',
        gm_ids: [ 'user-1',
        worldanvil_id: 'wa-123',
        status: 'active',
        playerCount: 4,
        sessionCount: 12,
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.rpgCampaign.update as jest.Mock).mockResolvedValue(mockUpdatedCampaign);

      const result = await rpgCampaignService.syncWithWorldAnvil('campaign-1', 'wa-123');

      expect(result).toEqual(mockUpdatedCampaign);
      expect(mockPrismaClient.rpgCampaign.update).toHaveBeenCalledWith({
        where: { id: 'campaign-1' },
        data: {
          title: 'WorldAnvil Campaign',
          description: 'Campaign from WorldAnvil',
          worldanvil_id: 'wa-123',
        },
      });
    });

    it('should handle WorldAnvil sync errors', async () => {
        new Error('Campaign not found in WorldAnvil')
      );

      await expect(
        rpgCampaignService.syncWithWorldAnvil('campaign-1', 'invalid-wa-id')
      ).rejects.toThrow('Failed to sync with WorldAnvil: Campaign not found in WorldAnvil');
    });
  });

  describe('generateAIContent', () => {
    it('should generate AI content for campaign', async () => {
      const mockCampaign: RpgCampaign = {
        id: 'campaign-1',
        title: 'Lost Mines of Phandelver',
        description: 'Starter campaign for D&D 5e',
        rpg_system_id: 'system-1',
        rpg_world_id: 'world-1',
        gm_ids: [ 'user-1',
        worldanvil_id: null,
        status: 'active',
        playerCount: 4,
        sessionCount: 12,
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.rpgCampaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);

      const mockAIResponse = {
        choices: [
          {
            message: {
              content: 'Generated plot hooks for Lost Mines of Phandelver campaign.',
            },
          },
        ],
      };

      (mockOpenAIClient.chat.completions.create as jest.Mock).mockResolvedValue(mockAIResponse);

      const result = await rpgCampaignService.generateAIContent('campaign-1', 'hooks');

      expect(result).toBe('Generated plot hooks for Lost Mines of Phandelver campaign.');
      expect(mockOpenAIClient.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a creative RPG campaign designer who creates engaging content.',
          },
          {
            role: 'user',
            content: expect.stringContaining('Generate hooks for the campaign: Lost Mines of Phandelver'),
          },
        ],
        max_tokens: 1500,
        temperature: 0.8,
      });
    });

    it('should throw error if campaign not found for AI content generation', async () => {
      (mockPrismaClient.rpgCampaign.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        rpgCampaignService.generateAIContent('non-existent', 'plot')
      ).rejects.toThrow('Campaign not found');
    });
  });
});