/**
 * RpgSheetService Unit Tests
 * Comprehensive tests for RPG sheet management service
 */

import { RpgSheetService } from '../../server/services/RpgSheetService';
import { PrismaClient, RpgSheet, Prisma } from '@prisma/client';
import { Client } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

// Mock Prisma Client
const mockPrismaClient = {
  rpgSheet: {
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
  sheets: {
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

describe('RpgSheetService', () => {
  let rpgSheetService: RpgSheetService;

  beforeEach(() => {
    jest.clearAllMocks();
    rpgSheetService = new RpgSheetService(
      mockPrismaClient,
      mockDiscordClient,
      mockWorldAnvilClient,
      mockOpenAIClient
    );
  });

  describe('Constructor', () => {
    it('should initialize with all required dependencies', () => {
      expect(rpgSheetService).toBeInstanceOf(RpgSheetService);
    });
  });

  describe('getAll', () => {
    it('should return all RPG sheets', async () => {
      const mockSheets: RpgSheet[] = [
        {
          id: 'sheet-1',
          worldanvil_block_id: null,
          discord_post_id: null,
          discord_thread_id: null,
          title: 'Character Sheet 1',
          slug: 'character-sheet-1',
          summary: 'A character sheet',
          description: 'A detailed character sheet',
          portrait_url: null,
          token_url: null,
          data: { name: 'Aragorn', level: 10 },
          is_active: true,
          admin_only: false,
          last_played: null,
          created_at: new Date(),
          updated_at: new Date(),
          rpg_character_id: 'char-1',
          rpg_system_id: 'system-1',
          rpg_party_id: null,
          rpg_campaign_id: null,
          rpg_world_id: null,
        },
        {
          id: 'sheet-2',
          worldanvil_block_id: null,
          discord_post_id: null,
          discord_thread_id: null,
          title: 'Character Sheet 2',
          slug: 'character-sheet-2',
          summary: 'Another character sheet',
          description: 'Another detailed character sheet',
          portrait_url: null,
          token_url: null,
          data: { name: 'Legolas', level: 8 },
          is_active: true,
          admin_only: false,
          last_played: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          rpg_character_id: 'char-2',
          rpg_system_id: 'system-1',
          rpg_party_id: 'party-1',
          rpg_campaign_id: 'campaign-1',
          rpg_world_id: 'world-1',
        },
      ];

      (mockPrismaClient.rpgSheet.findMany as jest.Mock).mockResolvedValue(mockSheets);

      const result = await rpgSheetService.getAll();

      expect(result).toEqual(mockSheets);
      expect(mockPrismaClient.rpgSheet.findMany).toHaveBeenCalledWith({
        orderBy: { title: 'asc' },
      });
    });
  });

  describe('getById', () => {
    it('should return RPG sheet by ID', async () => {
      const mockSheet: RpgSheet = {
        id: 'sheet-1',
        worldanvil_block_id: null,
        discord_post_id: null,
        discord_thread_id: null,
        title: 'Character Sheet',
        slug: 'character-sheet',
        summary: 'A character sheet',
        description: 'A detailed character sheet',
        portrait_url: null,
        token_url: null,
        data: { name: 'Aragorn', level: 10 },
        is_active: true,
        admin_only: false,
        last_played: null,
        created_at: new Date(),
        updated_at: new Date(),
        rpg_character_id: 'char-1',
        rpg_system_id: 'system-1',
        rpg_party_id: null,
        rpg_campaign_id: null,
        rpg_world_id: null,
      };

      (mockPrismaClient.rpgSheet.findUnique as jest.Mock).mockResolvedValue(mockSheet);

      const result = await rpgSheetService.getById('sheet-1');

      expect(result).toEqual(mockSheet);
      expect(mockPrismaClient.rpgSheet.findUnique).toHaveBeenCalledWith({
        where: { id: 'sheet-1' },
      });
    });

    it('should return null if sheet not found', async () => {
      (mockPrismaClient.rpgSheet.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await rpgSheetService.getById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getByCharacterId', () => {
    it('should return sheets by character ID', async () => {
      const mockSheets: RpgSheet[] = [
        {
          id: 'sheet-1',
          worldanvil_block_id: null,
          discord_post_id: null,
          discord_thread_id: null,
          title: 'Character Sheet',
          slug: 'character-sheet',
          summary: null,
          description: null,
          portrait_url: null,
          token_url: null,
          data: { name: 'Aragorn' },
          is_active: true,
          admin_only: false,
          last_played: null,
          created_at: new Date(),
          updated_at: new Date(),
          rpg_character_id: 'char-1',
          rpg_system_id: null,
          rpg_party_id: null,
          rpg_campaign_id: null,
          rpg_world_id: null,
        },
      ];

      (mockPrismaClient.rpgSheet.findMany as jest.Mock).mockResolvedValue(mockSheets);

      const result = await rpgSheetService.getByCharacterId('char-1');

      expect(result).toEqual(mockSheets);
      expect(mockPrismaClient.rpgSheet.findMany).toHaveBeenCalledWith({
        where: { rpg_character_id: 'char-1' },
        orderBy: { title: 'asc' },
      });
    });
  });

  describe('create', () => {
    it('should create a new RPG sheet', async () => {
      const sheetInput: Prisma.RpgSheetCreateInput = {
        title: 'New Sheet',
        slug: 'new-sheet',
        summary: 'A new sheet',
        data: { name: 'Test Character' },
        is_active: true,
      };

      const mockCreatedSheet: RpgSheet = {
        id: 'sheet-new',
        worldanvil_block_id: null,
        discord_post_id: null,
        discord_thread_id: null,
        title: 'New Sheet',
        slug: 'new-sheet',
        summary: 'A new sheet',
        description: null,
        portrait_url: null,
        token_url: null,
        data: { name: 'Test Character' },
        is_active: true,
        admin_only: false,
        last_played: null,
        created_at: new Date(),
        updated_at: new Date(),
        rpg_character_id: null,
        rpg_system_id: null,
        rpg_party_id: null,
        rpg_campaign_id: null,
        rpg_world_id: null,
      };

      (mockPrismaClient.rpgSheet.create as jest.Mock).mockResolvedValue(mockCreatedSheet);

      const result = await rpgSheetService.create(sheetInput);

      expect(result).toEqual(mockCreatedSheet);
      expect(mockPrismaClient.rpgSheet.create).toHaveBeenCalledWith({
        data: sheetInput,
      });
    });
  });

  describe('update', () => {
    it('should update an existing RPG sheet', async () => {
      const sheetUpdate: Prisma.RpgSheetUpdateInput = {
        title: 'Updated Sheet',
        summary: 'An updated sheet',
      };

      const mockUpdatedSheet: RpgSheet = {
        id: 'sheet-1',
        worldanvil_block_id: null,
        discord_post_id: null,
        discord_thread_id: null,
        title: 'Updated Sheet',
        slug: 'sheet-1',
        summary: 'An updated sheet',
        description: null,
        portrait_url: null,
        token_url: null,
        data: {},
        is_active: true,
        admin_only: false,
        last_played: null,
        created_at: new Date(),
        updated_at: new Date(),
        rpg_character_id: null,
        rpg_system_id: null,
        rpg_party_id: null,
        rpg_campaign_id: null,
        rpg_world_id: null,
      };

      (mockPrismaClient.rpgSheet.update as jest.Mock).mockResolvedValue(mockUpdatedSheet);

      const result = await rpgSheetService.update('sheet-1', sheetUpdate);

      expect(result).toEqual(mockUpdatedSheet);
      expect(mockPrismaClient.rpgSheet.update).toHaveBeenCalledWith({
        where: { id: 'sheet-1' },
        data: sheetUpdate,
      });
    });
  });

  describe('delete', () => {
    it('should delete an RPG sheet', async () => {
      const mockDeletedSheet: RpgSheet = {
        id: 'sheet-1',
        worldanvil_block_id: null,
        discord_post_id: null,
        discord_thread_id: null,
        title: 'Test Sheet',
        slug: 'test-sheet',
        summary: null,
        description: null,
        portrait_url: null,
        token_url: null,
        data: {},
        is_active: true,
        admin_only: false,
        last_played: null,
        created_at: new Date(),
        updated_at: new Date(),
        rpg_character_id: null,
        rpg_system_id: null,
        rpg_party_id: null,
        rpg_campaign_id: null,
        rpg_world_id: null,
      };

      (mockPrismaClient.rpgSheet.delete as jest.Mock).mockResolvedValue(mockDeletedSheet);

      const result = await rpgSheetService.delete('sheet-1');

      expect(result).toEqual(mockDeletedSheet);
      expect(mockPrismaClient.rpgSheet.delete).toHaveBeenCalledWith({
        where: { id: 'sheet-1' },
      });
    });
  });
});