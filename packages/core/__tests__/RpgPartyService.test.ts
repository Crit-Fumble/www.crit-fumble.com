import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { RpgPartyService } from '../server/services/RpgPartyService';
import { PrismaClient, Prisma } from '@prisma/client';
import { Client as DiscordClient } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

// Mock Prisma Client
const mockPrismaClient = {
  rpgParty: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  rpgSheet: {
    findMany: jest.fn(),
  },
} as unknown as jest.Mocked<PrismaClient>;

// Mock Discord Client
const mockDiscordClient = {} as DiscordClient;

// Mock WorldAnvil Client
const mockWorldAnvilClient = {} as WorldAnvilApiClient;

// Mock OpenAI Client
const mockOpenAI = {} as OpenAI;

describe('RpgPartyService', () => {
  let service: RpgPartyService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RpgPartyService(
      mockPrismaClient,
      mockDiscordClient,
      mockWorldAnvilClient,
      mockOpenAI
    );
  });

  describe('getAll', () => {
    it('should return all RPG parties', async () => {
      const expectedParties = [
        { id: 'party1', title: 'The Heroes', rpg_campaign_id: 'campaign1' },
        { id: 'party2', title: 'The Adventurers', rpg_campaign_id: 'campaign2' },
      ];

      mockPrismaClient.rpgParty.findMany.mockResolvedValue(expectedParties);

      const result = await service.getAll();

      expect(mockPrismaClient.rpgParty.findMany).toHaveBeenCalledWith();
      expect(result).toEqual(expectedParties);
    });

    it('should handle empty result', async () => {
      mockPrismaClient.rpgParty.findMany.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a party by ID', async () => {
      const partyId = 'party123';
      const expectedParty = {
        id: partyId,
        title: 'The Heroes',
        description: 'A heroic party',
        rpg_campaign_id: 'campaign1',
      };

      mockPrismaClient.rpgParty.findUnique.mockResolvedValue(expectedParty);

      const result = await service.getById(partyId);

      expect(mockPrismaClient.rpgParty.findUnique).toHaveBeenCalledWith({
        where: { id: partyId },
      });
      expect(result).toEqual(expectedParty);
    });

    it('should return null for non-existent party', async () => {
      mockPrismaClient.rpgParty.findUnique.mockResolvedValue(null);

      const result = await service.getById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getByWorldAnvilId', () => {
    it('should return a party by WorldAnvil ID', async () => {
      const worldAnvilId = 'wa123';
      const expectedParty = {
        id: 'party123',
        title: 'The Heroes',
        worldanvil_party_id: worldAnvilId,
      };

      mockPrismaClient.rpgParty.findUnique.mockResolvedValue(expectedParty);

      const result = await service.getByWorldAnvilId(worldAnvilId);

      expect(mockPrismaClient.rpgParty.findUnique).toHaveBeenCalledWith({
        where: { worldanvil_party_id: worldAnvilId },
      });
      expect(result).toEqual(expectedParty);
    });
  });

  describe('getByDiscordRoleId', () => {
    it('should return a party by Discord role ID', async () => {
      const discordRoleId = 'role123';
      const expectedParty = {
        id: 'party123',
        title: 'The Heroes',
        discord_role_id: discordRoleId,
      };

      mockPrismaClient.rpgParty.findUnique.mockResolvedValue(expectedParty);

      const result = await service.getByDiscordRoleId(discordRoleId);

      expect(mockPrismaClient.rpgParty.findUnique).toHaveBeenCalledWith({
        where: { discord_role_id: discordRoleId },
      });
      expect(result).toEqual(expectedParty);
    });
  });

  describe('getByCampaignId', () => {
    it('should return parties for a campaign', async () => {
      const campaignId = 'campaign123';
      const expectedParties = [
        { id: 'party1', title: 'Party A', rpg_campaign_id: campaignId },
        { id: 'party2', title: 'Party B', rpg_campaign_id: campaignId },
      ];

      mockPrismaClient.rpgParty.findMany.mockResolvedValue(expectedParties);

      const result = await service.getByCampaignId(campaignId);

      expect(mockPrismaClient.rpgParty.findMany).toHaveBeenCalledWith({
        where: { rpg_campaign_id: campaignId },
      });
      expect(result).toEqual(expectedParties);
    });
  });

  describe('getBySessionId', () => {
    it('should return a party for a session', async () => {
      const sessionId = 'session123';
      const expectedParty = {
        id: 'party123',
        title: 'The Heroes',
        rpg_campaign_id: 'campaign1',
      };

      mockPrismaClient.rpgParty.findFirst.mockResolvedValue(expectedParty);

      const result = await service.getBySessionId(sessionId);

      expect(mockPrismaClient.rpgParty.findFirst).toHaveBeenCalledWith({
        where: { rpg_sessions: { some: { id: sessionId } } },
      });
      expect(result).toEqual(expectedParty);
    });
  });

  describe('search', () => {
    it('should search parties by title', async () => {
      const query = 'heroes';
      const expectedParties = [
        { id: 'party1', title: 'The Heroes' },
        { id: 'party2', title: 'Heroes United' },
      ];

      mockPrismaClient.rpgParty.findMany.mockResolvedValue(expectedParties);

      const result = await service.search(query);

      expect(mockPrismaClient.rpgParty.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
      expect(result).toEqual(expectedParties);
    });

    it('should search parties by description', async () => {
      const query = 'adventure';
      const expectedParties = [
        { id: 'party1', description: 'An adventure party' },
      ];

      mockPrismaClient.rpgParty.findMany.mockResolvedValue(expectedParties);

      const result = await service.search(query);

      expect(result).toEqual(expectedParties);
    });
  });

  describe('create', () => {
    it('should create a new party', async () => {
      const partyData: Prisma.RpgPartyCreateInput = {
        title: 'New Party',
        description: 'A new adventuring party',
        rpg_campaign: { connect: { id: 'campaign123' } },
      };

      const expectedParty = {
        id: 'party123',
        title: 'New Party',
        description: 'A new adventuring party',
        rpg_campaign_id: 'campaign123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.rpgParty.create.mockResolvedValue(expectedParty);

      const result = await service.create(partyData);

      expect(mockPrismaClient.rpgParty.create).toHaveBeenCalledWith({
        data: partyData,
      });
      expect(result).toEqual(expectedParty);
    });

    it('should handle creation errors', async () => {
      const partyData: Prisma.RpgPartyCreateInput = {
        title: 'New Party',
        rpg_campaign: { connect: { id: 'invalid' } },
      };

      mockPrismaClient.rpgParty.create.mockRejectedValue(new Error('Campaign not found'));

      await expect(service.create(partyData)).rejects.toThrow('Campaign not found');
    });
  });

  describe('update', () => {
    it('should update an existing party', async () => {
      const partyId = 'party123';
      const updateData: Prisma.RpgPartyUpdateInput = {
        title: 'Updated Party Name',
        description: 'Updated description',
      };

      const expectedParty = {
        id: partyId,
        title: 'Updated Party Name',
        description: 'Updated description',
        updatedAt: new Date(),
      };

      mockPrismaClient.rpgParty.update.mockResolvedValue(expectedParty);

      const result = await service.update(partyId, updateData);

      expect(mockPrismaClient.rpgParty.update).toHaveBeenCalledWith({
        where: { id: partyId },
        data: updateData,
      });
      expect(result).toEqual(expectedParty);
    });

    it('should handle update errors for non-existent party', async () => {
      const updateData: Prisma.RpgPartyUpdateInput = {
        title: 'Updated Title',
      };

      mockPrismaClient.rpgParty.update.mockRejectedValue(new Error('Party not found'));

      await expect(service.update('nonexistent', updateData)).rejects.toThrow('Party not found');
    });
  });

  describe('delete', () => {
    it('should delete a party', async () => {
      const partyId = 'party123';
      const deletedParty = { id: partyId, title: 'Deleted Party' };

      mockPrismaClient.rpgParty.delete.mockResolvedValue(deletedParty);

      const result = await service.delete(partyId);

      expect(mockPrismaClient.rpgParty.delete).toHaveBeenCalledWith({
        where: { id: partyId },
      });
      expect(result).toEqual(deletedParty);
    });

    it('should handle deletion errors for non-existent party', async () => {
      mockPrismaClient.rpgParty.delete.mockRejectedValue(new Error('Party not found'));

      await expect(service.delete('nonexistent')).rejects.toThrow('Party not found');
    });
  });

  describe('getPartyMembers', () => {
    it('should return party members (character sheets)', async () => {
      const partyId = 'party123';
      const expectedMembers = [
        { id: 'sheet1', character_name: 'Aragorn', rpg_party_id: partyId },
        { id: 'sheet2', character_name: 'Legolas', rpg_party_id: partyId },
      ];

      mockPrismaClient.rpgSheet.findMany.mockResolvedValue(expectedMembers);

      const result = await service.getPartyMembers(partyId);

      expect(mockPrismaClient.rpgSheet.findMany).toHaveBeenCalledWith({
        where: { rpg_party_id: partyId },
      });
      expect(result).toEqual(expectedMembers);
    });

    it('should return empty array for party with no members', async () => {
      mockPrismaClient.rpgSheet.findMany.mockResolvedValue([]);

      const result = await service.getPartyMembers('party123');

      expect(result).toEqual([]);
    });
  });

  describe('setupDiscordRole', () => {
    it('should throw error for non-existent party', async () => {
      const partyId = 'nonexistent';
      const guildId = 'guild123';

      mockPrismaClient.rpgParty.findUnique.mockResolvedValue(null);

      await expect(service.setupDiscordRole(partyId, guildId)).rejects.toThrow('Party not found');
    });

    it('should set up Discord role for existing party', async () => {
      const partyId = 'party123';
      const guildId = 'guild123';
      const existingParty = { id: partyId, title: 'Test Party' };

      mockPrismaClient.rpgParty.findUnique.mockResolvedValue(existingParty);

      await expect(service.setupDiscordRole(partyId, guildId)).resolves.not.toThrow();
    });
  });

  describe('syncWithWorldAnvil', () => {
    it('should sync party with WorldAnvil', async () => {
      const partyId = 'party123';
      const worldAnvilPartyId = 'wa123';

      const updatedParty = {
        id: partyId,
        title: 'Synced Party',
        worldanvil_party_id: worldAnvilPartyId,
      };

      mockPrismaClient.rpgParty.update.mockResolvedValue(updatedParty);

      const result = await service.syncWithWorldAnvil(partyId, worldAnvilPartyId);

      expect(mockPrismaClient.rpgParty.update).toHaveBeenCalledWith({
        where: { id: partyId },
        data: {
          worldanvil_party_id: worldAnvilPartyId,
        },
      });
      expect(result).toEqual(updatedParty);
    });
  });

  describe('generateAIContent', () => {
    it('should generate AI content for existing party', async () => {
      const partyId = 'party123';
      const existingParty = { id: partyId, title: 'Test Party' };

      mockPrismaClient.rpgParty.findUnique.mockResolvedValue(existingParty);

      const result = await service.generateAIContent(partyId, 'dynamics');

      expect(result).toBe('AI-generated dynamics for Test Party (not implemented yet)');
    });

    it('should throw error for non-existent party', async () => {
      mockPrismaClient.rpgParty.findUnique.mockResolvedValue(null);

      await expect(service.generateAIContent('nonexistent', 'backstory')).rejects.toThrow('Party not found');
    });

    it('should generate different content types', async () => {
      const partyId = 'party123';
      const existingParty = { id: partyId, title: 'Test Party' };

      mockPrismaClient.rpgParty.findUnique.mockResolvedValue(existingParty);

      const dynamicsResult = await service.generateAIContent(partyId, 'dynamics');
      const backstoryResult = await service.generateAIContent(partyId, 'backstory');
      const goalsResult = await service.generateAIContent(partyId, 'goals');

      expect(dynamicsResult).toBe('AI-generated dynamics for Test Party (not implemented yet)');
      expect(backstoryResult).toBe('AI-generated backstory for Test Party (not implemented yet)');
      expect(goalsResult).toBe('AI-generated goals for Test Party (not implemented yet)');
    });
  });

  describe('error handling', () => {
    it('should handle database connection errors', async () => {
      mockPrismaClient.rpgParty.findMany.mockRejectedValue(new Error('Connection failed'));

      await expect(service.getAll()).rejects.toThrow('Connection failed');
    });

    it('should handle invalid data errors', async () => {
      const invalidPartyData = {} as Prisma.RpgPartyCreateInput;
      mockPrismaClient.rpgParty.create.mockRejectedValue(new Error('Validation failed'));

      await expect(service.create(invalidPartyData)).rejects.toThrow('Validation failed');
    });

    it('should handle foreign key constraint errors', async () => {
      const partyData: Prisma.RpgPartyCreateInput = {
        title: 'New Party',
        rpg_campaign: { connect: { id: 'invalid-campaign' } },
      };

      mockPrismaClient.rpgParty.create.mockRejectedValue(new Error('Foreign key constraint failed'));

      await expect(service.create(partyData)).rejects.toThrow('Foreign key constraint failed');
    });
  });
});