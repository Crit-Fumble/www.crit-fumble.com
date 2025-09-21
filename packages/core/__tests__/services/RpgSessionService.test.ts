import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { RpgSessionService } from '../../server/services/RpgSessionService';
import { PrismaClient, Prisma } from '@prisma/client';
import { Client as DiscordClient } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

// Mock Prisma Client
const mockPrismaClient = {
  rpgSession: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as jest.Mocked<PrismaClient>;

// Mock Discord Client
const mockDiscordClient = {} as DiscordClient;

// Mock WorldAnvil Client
const mockWorldAnvilClient = {} as WorldAnvilApiClient;

// Mock OpenAI Client
const mockOpenAI = {} as OpenAI;

describe('RpgSessionService', () => {
  let service: RpgSessionService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RpgSessionService(
      mockPrismaClient,
      mockDiscordClient,
      mockWorldAnvilClient,
      mockOpenAI
    );
  });

  describe('getAll', () => {
    it('should return all RPG sessions', async () => {
      const expectedSessions = [
        { 
          id: 'session1', 
          title: 'The Beginning', 
          rpg_party_id: 'party1',
          worldanvil_id: null,
          data: {},
          description: null,
          created_at: new Date(),
          updated_at: new Date(),
          discord_event_id: null
        },
        { 
          id: 'session2', 
          title: 'The Journey Continues', 
          rpg_party_id: 'party1',
          worldanvil_id: null,
          data: {},
          description: null,
          created_at: new Date(),
          updated_at: new Date(),
          discord_event_id: null
        },
      ];

      mockPrismaClient.rpgSession.findMany.mockResolvedValue(expectedSessions);

      const result = await service.getAll();

      expect(mockPrismaClient.rpgSession.findMany).toHaveBeenCalledWith();
      expect(result).toEqual(expectedSessions);
    });

    it('should handle empty result', async () => {
      mockPrismaClient.rpgSession.findMany.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a session by ID', async () => {
      const sessionId = 'session123';
      const expectedSession = {
        id: sessionId,
        title: 'The Epic Quest',
        description: 'An amazing adventure',
        rpg_party_id: 'party1',
      };

      mockPrismaClient.rpgSession.findUnique.mockResolvedValue(expectedSession);

      const result = await service.getById(sessionId);

      expect(mockPrismaClient.rpgSession.findUnique).toHaveBeenCalledWith({
        where: { id: sessionId },
      });
      expect(result).toEqual(expectedSession);
    });

    it('should return null for non-existent session', async () => {
      mockPrismaClient.rpgSession.findUnique.mockResolvedValue(null);

      const result = await service.getById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getByWorldAnvilId', () => {
    it('should return a session by WorldAnvil ID', async () => {
      const worldAnvilId = 'wa123';
      const expectedSession = {
        id: 'session123',
        title: 'The Epic Quest',
        worldanvil_id: worldAnvilId,
      };

      mockPrismaClient.rpgSession.findFirst.mockResolvedValue(expectedSession);

      const result = await service.getByWorldAnvilId(worldAnvilId);

      expect(mockPrismaClient.rpgSession.findFirst).toHaveBeenCalledWith({
        where: { worldanvil_id: worldAnvilId },
      });
      expect(result).toEqual(expectedSession);
    });
  });

  describe('getByDiscordEventId', () => {
    it('should return a session by Discord event ID', async () => {
      const discordEventId = 'event123';
      const expectedSession = {
        id: 'session123',
        title: 'The Epic Quest',
        discord_event_id: discordEventId,
      };

      mockPrismaClient.rpgSession.findFirst.mockResolvedValue(expectedSession);

      const result = await service.getByDiscordEventId(discordEventId);

      expect(mockPrismaClient.rpgSession.findFirst).toHaveBeenCalledWith({
        where: { discord_event_id: discordEventId },
      });
      expect(result).toEqual(expectedSession);
    });
  });

  describe('getByPartyId', () => {
    it('should return sessions for a party', async () => {
      const partyId = 'party123';
      const expectedSessions = [
        { id: 'session1', title: 'Session 1', rpg_party_id: partyId },
        { id: 'session2', title: 'Session 2', rpg_party_id: partyId },
      ];

      mockPrismaClient.rpgSession.findMany.mockResolvedValue(expectedSessions);

      const result = await service.getByPartyId(partyId);

      expect(mockPrismaClient.rpgSession.findMany).toHaveBeenCalledWith({
        where: { rpg_party_id: partyId },
      });
      expect(result).toEqual(expectedSessions);
    });
  });

  describe('search', () => {
    it('should search sessions by title', async () => {
      const query = 'epic';
      const expectedSessions = [
        { id: 'session1', title: 'The Epic Quest' },
        { id: 'session2', title: 'Epic Battle' },
      ];

      mockPrismaClient.rpgSession.findMany.mockResolvedValue(expectedSessions);

      const result = await service.search(query);

      expect(mockPrismaClient.rpgSession.findMany).toHaveBeenCalledWith({
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
      expect(result).toEqual(expectedSessions);
    });

    it('should search sessions by description', async () => {
      const query = 'adventure';
      const expectedSessions = [
        { id: 'session1', description: 'An amazing adventure' },
      ];

      mockPrismaClient.rpgSession.findMany.mockResolvedValue(expectedSessions);

      const result = await service.search(query);

      expect(result).toEqual(expectedSessions);
    });
  });

  describe('getUpcomingSessions', () => {
    it('should return upcoming sessions ordered by creation date', async () => {
      const expectedSessions = [
        { id: 'session1', title: 'Recent Session', created_at: new Date() },
        { id: 'session2', title: 'Older Session', created_at: new Date(Date.now() - 86400000) },
      ];

      mockPrismaClient.rpgSession.findMany.mockResolvedValue(expectedSessions);

      const result = await service.getUpcomingSessions();

      expect(mockPrismaClient.rpgSession.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: {
          created_at: 'desc',
        },
      });
      expect(result).toEqual(expectedSessions);
    });
  });

  describe('create', () => {
    it('should create a new session', async () => {
      const sessionData: Prisma.RpgSessionCreateInput = {
        title: 'New Session',
        description: 'A new adventure begins',
        rpg_party: { connect: { id: 'party123' } },
      };

      const expectedSession = {
        id: 'session123',
        title: 'New Session',
        description: 'A new adventure begins',
        rpg_party_id: 'party123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.rpgSession.create.mockResolvedValue(expectedSession);

      const result = await service.create(sessionData);

      expect(mockPrismaClient.rpgSession.create).toHaveBeenCalledWith({
        data: sessionData,
      });
      expect(result).toEqual(expectedSession);
    });

    it('should handle creation errors', async () => {
      const sessionData: Prisma.RpgSessionCreateInput = {
        title: 'New Session',
        rpg_party: { connect: { id: 'invalid' } },
      };

      mockPrismaClient.rpgSession.create.mockRejectedValue(new Error('Party not found'));

      await expect(service.create(sessionData)).rejects.toThrow('Party not found');
    });
  });

  describe('update', () => {
    it('should update an existing session', async () => {
      const sessionId = 'session123';
      const updateData: Prisma.RpgSessionUpdateInput = {
        title: 'Updated Session Title',
        description: 'Updated description',
      };

      const expectedSession = {
        id: sessionId,
        title: 'Updated Session Title',
        description: 'Updated description',
        updatedAt: new Date(),
      };

      mockPrismaClient.rpgSession.update.mockResolvedValue(expectedSession);

      const result = await service.update(sessionId, updateData);

      expect(mockPrismaClient.rpgSession.update).toHaveBeenCalledWith({
        where: { id: sessionId },
        data: updateData,
      });
      expect(result).toEqual(expectedSession);
    });

    it('should handle update errors for non-existent session', async () => {
      const updateData: Prisma.RpgSessionUpdateInput = {
        title: 'Updated Title',
      };

      mockPrismaClient.rpgSession.update.mockRejectedValue(new Error('Session not found'));

      await expect(service.update('nonexistent', updateData)).rejects.toThrow('Session not found');
    });
  });

  describe('delete', () => {
    it('should delete a session', async () => {
      const sessionId = 'session123';
      const deletedSession = { id: sessionId, title: 'Deleted Session' };

      mockPrismaClient.rpgSession.delete.mockResolvedValue(deletedSession);

      const result = await service.delete(sessionId);

      expect(mockPrismaClient.rpgSession.delete).toHaveBeenCalledWith({
        where: { id: sessionId },
      });
      expect(result).toEqual(deletedSession);
    });

    it('should handle deletion errors for non-existent session', async () => {
      mockPrismaClient.rpgSession.delete.mockRejectedValue(new Error('Session not found'));

      await expect(service.delete('nonexistent')).rejects.toThrow('Session not found');
    });
  });

  describe('getPartyForSession', () => {
    it('should return party associated with session', async () => {
      const sessionId = 'session123';
      const expectedParty = { id: 'party123', title: 'The Heroes' };
      const sessionWithParty = {
        id: sessionId,
        title: 'Test Session',
        rpg_party: expectedParty,
      };

      mockPrismaClient.rpgSession.findUnique.mockResolvedValue(sessionWithParty);

      const result = await service.getPartyForSession(sessionId);

      expect(mockPrismaClient.rpgSession.findUnique).toHaveBeenCalledWith({
        where: { id: sessionId },
        include: { rpg_party: true },
      });
      expect(result).toEqual(expectedParty);
    });

    it('should return null for session without party', async () => {
      const sessionId = 'session123';
      const sessionWithoutParty = {
        id: sessionId,
        title: 'Test Session',
        rpg_party: null,
      };

      mockPrismaClient.rpgSession.findUnique.mockResolvedValue(sessionWithoutParty);

      const result = await service.getPartyForSession(sessionId);

      expect(result).toBeNull();
    });

    it('should return null for non-existent session', async () => {
      mockPrismaClient.rpgSession.findUnique.mockResolvedValue(null);

      const result = await service.getPartyForSession('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('setupDiscordEvent', () => {
    it('should throw error for non-existent session', async () => {
      const sessionId = 'nonexistent';
      const guildId = 'guild123';
      const scheduledTime = new Date();

      mockPrismaClient.rpgSession.findUnique.mockResolvedValue(null);

      await expect(service.setupDiscordEvent(sessionId, guildId, scheduledTime)).rejects.toThrow('Session not found');
    });

    it('should set up Discord event for existing session', async () => {
      const sessionId = 'session123';
      const guildId = 'guild123';
      const scheduledTime = new Date();
      const existingSession = { id: sessionId, title: 'Test Session' };

      mockPrismaClient.rpgSession.findUnique.mockResolvedValue(existingSession);

      await expect(service.setupDiscordEvent(sessionId, guildId, scheduledTime)).resolves.not.toThrow();
    });
  });

  describe('syncWithWorldAnvil', () => {
    it('should sync session with WorldAnvil', async () => {
      const sessionId = 'session123';
      const worldAnvilId = 'wa123';

      const updatedSession = {
        id: sessionId,
        title: 'Synced Session',
        worldanvil_id: worldAnvilId,
      };

      mockPrismaClient.rpgSession.update.mockResolvedValue(updatedSession);

      const result = await service.syncWithWorldAnvil(sessionId, worldAnvilId);

      expect(mockPrismaClient.rpgSession.update).toHaveBeenCalledWith({
        where: { id: sessionId },
        data: {
          worldanvil_id: worldAnvilId,
        },
      });
      expect(result).toEqual(updatedSession);
    });
  });

  describe('generateAIContent', () => {
    it('should generate AI content for existing session', async () => {
      const sessionId = 'session123';
      const existingSession = { id: sessionId, title: 'Test Session' };

      mockPrismaClient.rpgSession.findUnique.mockResolvedValue(existingSession);

      const result = await service.generateAIContent(sessionId, 'plot');

      expect(result).toBe('AI-generated plot for Test Session (not implemented yet)');
    });

    it('should throw error for non-existent session', async () => {
      mockPrismaClient.rpgSession.findUnique.mockResolvedValue(null);

      await expect(service.generateAIContent('nonexistent', 'npcs')).rejects.toThrow('Session not found');
    });

    it('should generate different content types', async () => {
      const sessionId = 'session123';
      const existingSession = { id: sessionId, title: 'Test Session' };

      mockPrismaClient.rpgSession.findUnique.mockResolvedValue(existingSession);

      const plotResult = await service.generateAIContent(sessionId, 'plot');
      const npcsResult = await service.generateAIContent(sessionId, 'npcs');
      const encountersResult = await service.generateAIContent(sessionId, 'encounters');

      expect(plotResult).toBe('AI-generated plot for Test Session (not implemented yet)');
      expect(npcsResult).toBe('AI-generated npcs for Test Session (not implemented yet)');
      expect(encountersResult).toBe('AI-generated encounters for Test Session (not implemented yet)');
    });
  });

  describe('error handling', () => {
    it('should handle database connection errors', async () => {
      mockPrismaClient.rpgSession.findMany.mockRejectedValue(new Error('Connection failed'));

      await expect(service.getAll()).rejects.toThrow('Connection failed');
    });

    it('should handle invalid data errors', async () => {
      const invalidSessionData = {} as Prisma.RpgSessionCreateInput;
      mockPrismaClient.rpgSession.create.mockRejectedValue(new Error('Validation failed'));

      await expect(service.create(invalidSessionData)).rejects.toThrow('Validation failed');
    });

    it('should handle foreign key constraint errors', async () => {
      const sessionData: Prisma.RpgSessionCreateInput = {
        title: 'New Session',
        rpg_party: { connect: { id: 'invalid-party' } },
      };

      mockPrismaClient.rpgSession.create.mockRejectedValue(new Error('Foreign key constraint failed'));

      await expect(service.create(sessionData)).rejects.toThrow('Foreign key constraint failed');
    });
  });
});