import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { RpgCharacterService } from '../server/services/RpgCharacterService';
import { PrismaClient, Prisma } from '@prisma/client';
import { Client as DiscordClient } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

// Mock Prisma Client
const mockPrismaClient = {
  rpgCharacter: {
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
  user: {
    findFirst: jest.fn(),
  },
} as unknown as jest.Mocked<PrismaClient>;

// Mock Discord Client
const mockDiscordClient = {} as DiscordClient;

// Mock WorldAnvil Client
const mockWorldAnvilClient = {} as WorldAnvilApiClient;

// Mock OpenAI Client
const mockOpenAI = {} as OpenAI;

describe('RpgCharacterService', () => {
  let service: RpgCharacterService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RpgCharacterService(
      mockPrismaClient,
      mockDiscordClient,
      mockWorldAnvilClient,
      mockOpenAI
    );
  });

  describe('getAll', () => {
    it('should return all RPG characters', async () => {
      const expectedCharacters = [
        { id: 'char1', name: 'Aragorn', title: 'Ranger' },
        { id: 'char2', name: 'Legolas', title: 'Elf Prince' },
      ];

      mockPrismaClient.rpgCharacter.findMany.mockResolvedValue(expectedCharacters);

      const result = await service.getAll();

      expect(mockPrismaClient.rpgCharacter.findMany).toHaveBeenCalledWith();
      expect(result).toEqual(expectedCharacters);
    });

    it('should handle empty result', async () => {
      mockPrismaClient.rpgCharacter.findMany.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a character by ID', async () => {
      const characterId = 'char123';
      const expectedCharacter = {
        id: characterId,
        name: 'Aragorn',
        title: 'Ranger',
        description: 'A skilled ranger',
        user_id: 'user123',
      };

      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(expectedCharacter);

      const result = await service.getById(characterId);

      expect(mockPrismaClient.rpgCharacter.findUnique).toHaveBeenCalledWith({
        where: { id: characterId },
      });
      expect(result).toEqual(expectedCharacter);
    });

    it('should return null for non-existent character', async () => {
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);

      const result = await service.getById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getByWorldAnvilId', () => {
    it('should return a character by WorldAnvil ID', async () => {
      const worldAnvilId = 'wa123';
      const expectedCharacter = {
        id: 'char123',
        name: 'Aragorn',
        worldanvil_character_id: worldAnvilId,
      };

      mockPrismaClient.rpgCharacter.findFirst.mockResolvedValue(expectedCharacter);

      const result = await service.getByWorldAnvilId(worldAnvilId);

      expect(mockPrismaClient.rpgCharacter.findFirst).toHaveBeenCalledWith({
        where: { worldanvil_character_id: worldAnvilId },
      });
      expect(result).toEqual(expectedCharacter);
    });
  });

  describe('getByDiscordPostId', () => {
    it('should return a character by Discord post ID', async () => {
      const discordPostId = 'post123';
      const expectedCharacter = {
        id: 'char123',
        name: 'Aragorn',
        discord_post_id: discordPostId,
      };

      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(expectedCharacter);

      const result = await service.getByDiscordPostId(discordPostId);

      expect(mockPrismaClient.rpgCharacter.findUnique).toHaveBeenCalledWith({
        where: { discord_post_id: discordPostId },
      });
      expect(result).toEqual(expectedCharacter);
    });
  });

  describe('getByDiscordThreadId', () => {
    it('should return a character by Discord thread ID', async () => {
      const discordThreadId = 'thread123';
      const expectedCharacter = {
        id: 'char123',
        name: 'Aragorn',
        discord_thread_id: discordThreadId,
      };

      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(expectedCharacter);

      const result = await service.getByDiscordThreadId(discordThreadId);

      expect(mockPrismaClient.rpgCharacter.findUnique).toHaveBeenCalledWith({
        where: { discord_thread_id: discordThreadId },
      });
      expect(result).toEqual(expectedCharacter);
    });
  });

  describe('getByUserId', () => {
    it('should return characters owned by a user', async () => {
      const userId = 'user123';
      const expectedCharacters = [
        { id: 'char1', name: 'Aragorn', user_id: userId },
        { id: 'char2', name: 'Legolas', user_id: userId },
      ];

      mockPrismaClient.rpgCharacter.findMany.mockResolvedValue(expectedCharacters);

      const result = await service.getByUserId(userId);

      expect(mockPrismaClient.rpgCharacter.findMany).toHaveBeenCalledWith({
        where: { user_id: userId },
      });
      expect(result).toEqual(expectedCharacters);
    });
  });

  describe('search', () => {
    it('should search characters by name', async () => {
      const query = 'aragorn';
      const expectedCharacters = [
        { id: 'char1', name: 'Aragorn', title: 'Ranger' },
      ];

      mockPrismaClient.rpgCharacter.findMany.mockResolvedValue(expectedCharacters);

      const result = await service.search(query);

      expect(mockPrismaClient.rpgCharacter.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
      expect(result).toEqual(expectedCharacters);
    });

    it('should search characters by title', async () => {
      const query = 'ranger';
      const expectedCharacters = [
        { id: 'char1', name: 'Aragorn', title: 'Ranger' },
        { id: 'char2', name: 'Strider', title: 'Dunedain Ranger' },
      ];

      mockPrismaClient.rpgCharacter.findMany.mockResolvedValue(expectedCharacters);

      const result = await service.search(query);

      expect(result).toEqual(expectedCharacters);
    });
  });

  describe('create', () => {
    it('should create a new character', async () => {
      const characterData: Prisma.RpgCharacterCreateInput = {
        name: 'Aragorn',
        title: 'Ranger',
        description: 'A skilled ranger from the North',
        user: { connect: { id: 'user123' } },
      };

      const expectedCharacter = {
        id: 'char123',
        name: 'Aragorn',
        title: 'Ranger',
        description: 'A skilled ranger from the North',
        user_id: 'user123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.rpgCharacter.create.mockResolvedValue(expectedCharacter);

      const result = await service.create(characterData);

      expect(mockPrismaClient.rpgCharacter.create).toHaveBeenCalledWith({
        data: characterData,
      });
      expect(result).toEqual(expectedCharacter);
    });

    it('should handle creation errors', async () => {
      const characterData: Prisma.RpgCharacterCreateInput = {
        name: 'Aragorn',
        user: { connect: { id: 'invalid-user' } },
      };

      mockPrismaClient.rpgCharacter.create.mockRejectedValue(new Error('User not found'));

      await expect(service.create(characterData)).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('should update an existing character', async () => {
      const characterId = 'char123';
      const updateData: Prisma.RpgCharacterUpdateInput = {
        name: 'Strider',
        description: 'Updated description',
      };

      const expectedCharacter = {
        id: characterId,
        name: 'Strider',
        description: 'Updated description',
        updatedAt: new Date(),
      };

      mockPrismaClient.rpgCharacter.update.mockResolvedValue(expectedCharacter);

      const result = await service.update(characterId, updateData);

      expect(mockPrismaClient.rpgCharacter.update).toHaveBeenCalledWith({
        where: { id: characterId },
        data: updateData,
      });
      expect(result).toEqual(expectedCharacter);
    });

    it('should handle update errors for non-existent character', async () => {
      const updateData: Prisma.RpgCharacterUpdateInput = {
        name: 'Updated Name',
      };

      mockPrismaClient.rpgCharacter.update.mockRejectedValue(new Error('Character not found'));

      await expect(service.update('nonexistent', updateData)).rejects.toThrow('Character not found');
    });
  });

  describe('delete', () => {
    it('should delete a character', async () => {
      const characterId = 'char123';
      const deletedCharacter = { id: characterId, name: 'Deleted Character' };

      mockPrismaClient.rpgCharacter.delete.mockResolvedValue(deletedCharacter);

      const result = await service.delete(characterId);

      expect(mockPrismaClient.rpgCharacter.delete).toHaveBeenCalledWith({
        where: { id: characterId },
      });
      expect(result).toEqual(deletedCharacter);
    });

    it('should handle deletion errors for non-existent character', async () => {
      mockPrismaClient.rpgCharacter.delete.mockRejectedValue(new Error('Character not found'));

      await expect(service.delete('nonexistent')).rejects.toThrow('Character not found');
    });
  });

  describe('getCharacterSheets', () => {
    it('should return character sheets for a character', async () => {
      const characterId = 'char123';
      const expectedSheets = [
        { id: 'sheet1', rpg_character_id: characterId, character_name: 'Aragorn Level 1' },
        { id: 'sheet2', rpg_character_id: characterId, character_name: 'Aragorn Level 5' },
      ];

      mockPrismaClient.rpgSheet.findMany.mockResolvedValue(expectedSheets);

      const result = await service.getCharacterSheets(characterId);

      expect(mockPrismaClient.rpgSheet.findMany).toHaveBeenCalledWith({
        where: { rpg_character_id: characterId },
      });
      expect(result).toEqual(expectedSheets);
    });

    it('should return empty array for character with no sheets', async () => {
      mockPrismaClient.rpgSheet.findMany.mockResolvedValue([]);

      const result = await service.getCharacterSheets('char123');

      expect(result).toEqual([]);
    });
  });

  describe('verifyCharacterOwnership', () => {
    it('should return true for direct user ID match', async () => {
      const userId = 'user123';
      const characterId = 'char123';

      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue({
        id: characterId,
        user_id: userId,
      });

      const result = await service.verifyCharacterOwnership(userId, characterId);

      expect(result).toBe(true);
      expect(mockPrismaClient.rpgCharacter.findUnique).toHaveBeenCalledWith({
        where: { id: characterId },
        select: { user_id: true },
      });
    });

    it('should return true for Discord ID match', async () => {
      const discordId = 'discord123';
      const userId = 'user123';
      const characterId = 'char123';

      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue({
        id: characterId,
        user_id: userId,
      });

      mockPrismaClient.user.findFirst.mockResolvedValue({
        id: userId,
        discord_id: discordId,
      });

      const result = await service.verifyCharacterOwnership(discordId, characterId);

      expect(result).toBe(true);
      expect(mockPrismaClient.user.findFirst).toHaveBeenCalledWith({
        where: { discord_id: discordId },
        select: { id: true },
      });
    });

    it('should return false for non-existent character', async () => {
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);

      const result = await service.verifyCharacterOwnership('user123', 'nonexistent');

      expect(result).toBe(false);
    });

    it('should return false for ownership mismatch', async () => {
      const userId = 'user123';
      const characterId = 'char123';

      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue({
        id: characterId,
        user_id: 'different-user',
      });

      mockPrismaClient.user.findFirst.mockResolvedValue(null);

      const result = await service.verifyCharacterOwnership(userId, characterId);

      expect(result).toBe(false);
    });
  });

  describe('generateBackstory', () => {
    it('should throw error for non-existent character', async () => {
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);

      await expect(service.generateBackstory('nonexistent')).rejects.toThrow('Character not found');
    });

    it('should throw not implemented error for existing character', async () => {
      const character = { id: 'char123', name: 'Aragorn' };
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);

      await expect(service.generateBackstory('char123')).rejects.toThrow('Not implemented - use OpenAI SDK directly');
    });
  });

  describe('analyzePersonality', () => {
    it('should throw error for non-existent character', async () => {
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);

      await expect(service.analyzePersonality('nonexistent')).rejects.toThrow('Character not found');
    });

    it('should throw not implemented error for existing character', async () => {
      const character = { id: 'char123', name: 'Aragorn', description: 'A noble ranger' };
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);

      await expect(service.analyzePersonality('char123')).rejects.toThrow('Not implemented - use OpenAI SDK directly');
    });
  });

  describe('suggestCharacterDevelopment', () => {
    it('should throw error for non-existent character', async () => {
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);

      await expect(service.suggestCharacterDevelopment('nonexistent')).rejects.toThrow('Character not found');
    });

    it('should throw not implemented error for existing character', async () => {
      const character = { id: 'char123', name: 'Aragorn', description: 'A noble ranger' };
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);

      await expect(service.suggestCharacterDevelopment('char123')).rejects.toThrow('Not implemented - use OpenAI SDK directly');
    });
  });

  describe('syncWithWorldAnvil', () => {
    it('should return false for non-existent character', async () => {
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);

      const result = await service.syncWithWorldAnvil('nonexistent');

      expect(result).toBe(false);
    });

    it('should return false for character without WorldAnvil ID', async () => {
      const character = { id: 'char123', name: 'Aragorn', worldanvil_character_id: null };
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);

      const result = await service.syncWithWorldAnvil('char123');

      expect(result).toBe(false);
    });

    it('should return false for character with WorldAnvil ID (stubbed)', async () => {
      const character = { id: 'char123', name: 'Aragorn', worldanvil_character_id: 'wa123' };
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);

      const result = await service.syncWithWorldAnvil('char123');

      expect(result).toBe(false); // Currently stubbed to return false
    });
  });

  describe('notifyCharacterUpdate', () => {
    it('should return false for non-existent character', async () => {
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);

      const result = await service.notifyCharacterUpdate('nonexistent', 'test message');

      expect(result).toBe(false);
    });

    it('should return false for character without Discord thread ID', async () => {
      const character = { id: 'char123', name: 'Aragorn', discord_thread_id: null };
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);

      const result = await service.notifyCharacterUpdate('char123', 'test message');

      expect(result).toBe(false);
    });

    it('should throw not implemented error for character with Discord thread ID', async () => {
      const character = { id: 'char123', name: 'Aragorn', discord_thread_id: 'thread123' };
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);

      await expect(service.notifyCharacterUpdate('char123', 'test message')).rejects.toThrow('Not implemented - use Discord.js SDK directly');
    });
  });

  describe('generatePortraitDescription', () => {
    it('should throw error for non-existent character', async () => {
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(null);

      await expect(service.generatePortraitDescription('nonexistent')).rejects.toThrow('Character not found');
    });

    it('should throw not implemented error for existing character', async () => {
      const character = { id: 'char123', name: 'Aragorn', description: 'A noble ranger' };
      mockPrismaClient.rpgCharacter.findUnique.mockResolvedValue(character);

      await expect(service.generatePortraitDescription('char123')).rejects.toThrow('Not implemented - use OpenAI SDK directly');
    });
  });

  describe('error handling', () => {
    it('should handle database connection errors', async () => {
      mockPrismaClient.rpgCharacter.findMany.mockRejectedValue(new Error('Connection failed'));

      await expect(service.getAll()).rejects.toThrow('Connection failed');
    });

    it('should handle invalid data errors', async () => {
      const invalidCharacterData = {} as Prisma.RpgCharacterCreateInput;
      mockPrismaClient.rpgCharacter.create.mockRejectedValue(new Error('Validation failed'));

      await expect(service.create(invalidCharacterData)).rejects.toThrow('Validation failed');
    });

    it('should handle foreign key constraint errors', async () => {
      const characterData: Prisma.RpgCharacterCreateInput = {
        name: 'Test Character',
        user: { connect: { id: 'invalid-user' } },
      };

      mockPrismaClient.rpgCharacter.create.mockRejectedValue(new Error('Foreign key constraint failed'));

      await expect(service.create(characterData)).rejects.toThrow('Foreign key constraint failed');
    });
  });
});