import { Prisma, RpgCharacter } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { Client } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

/**
 * Service for managing RPG Characters in the database
 */
export class RpgCharacterService {
  /**
   * Creates a new RPG Character service
   * @param database Database client instance
   * @param discord Discord client instance for character discussions and notifications
   * @param worldanvil WorldAnvil client instance for character sheet synchronization
   * @param openai OpenAI client instance for AI-powered character features
   */
  constructor(
    private prisma: PrismaClient,
    private readonly discord: Client,
    private readonly worldanvil: WorldAnvilApiClient,
    private readonly openai: OpenAI
  ) {}

  /**
   * Get all RPG characters
   */
  async getAll(): Promise<RpgCharacter[]> {
    return this.prisma.rpgCharacter.findMany();
  }

  /**
   * Get a specific RPG character by ID
   * @param id RPG character ID
   */
  async getById(id: string): Promise<RpgCharacter | null> {
    return this.prisma.rpgCharacter.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG character by WorldAnvil ID
   * @param worldAnvilId WorldAnvil character ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgCharacter | null> {
    return this.prisma.rpgCharacter.findFirst({
      where: { worldanvil_character_id: worldAnvilId }
    });
  }

  /**
   * Get RPG character by Discord post ID
   * @param discordId Discord post ID for the character
   */
  async getByDiscordPostId(discordId: string): Promise<RpgCharacter | null> {
    return this.prisma.rpgCharacter.findUnique({
      where: { discord_post_id: discordId }
    });
  }

  /**
   * Get RPG character by Discord thread ID
   * @param discordId Discord thread ID for the character
   */
  async getByDiscordThreadId(discordId: string): Promise<RpgCharacter | null> {
    return this.prisma.rpgCharacter.findUnique({
      where: { discord_thread_id: discordId }
    });
  }

  /**
   * Get characters owned by a specific user
   * @param userId User ID
   */
  async getByUserId(userId: string): Promise<RpgCharacter[]> {
    return this.prisma.rpgCharacter.findMany({
      where: { user_id: userId }
    });
  }

  /**
   * Search for RPG characters by name or title
   * @param query Search query
   */
  async search(query: string): Promise<RpgCharacter[]> {
    return this.prisma.rpgCharacter.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            title: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      }
    });
  }

  /**
   * Create a new RPG character
   * @param data RPG character data
   */
  async create(data: Prisma.RpgCharacterCreateInput): Promise<RpgCharacter> {
    return this.prisma.rpgCharacter.create({
      data
    });
  }

  /**
   * Update an existing RPG character
   * @param id RPG character ID
   * @param data Updated RPG character data
   */
  async update(id: string, data: Prisma.RpgCharacterUpdateInput): Promise<RpgCharacter> {
    return this.prisma.rpgCharacter.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG character
   * @param id RPG character ID
   */
  async delete(id: string): Promise<RpgCharacter> {
    return this.prisma.rpgCharacter.delete({
      where: { id }
    });
  }

  /**
   * Get character sheets for a character
   * @param characterId Character ID
   */
  async getCharacterSheets(characterId: string) {
    return this.prisma.rpgSheet.findMany({
      where: { rpg_character_id: characterId }
    });
  }

  /**
   * Check if user owns character
   * @param userId User ID (can be discord ID or database ID)
   * @param characterId Character ID
   * @returns Boolean indicating ownership
   */
  async verifyCharacterOwnership(userId: string, characterId: string): Promise<boolean> {
    // First try direct match
    const character = await this.prisma.rpgCharacter.findUnique({
      where: { id: characterId },
      select: { user_id: true }
    });

    if (!character) return false;
    
    // Direct match on user_id
    if (character.user_id === userId) return true;
    
    // Look up user by discord ID in case that's what we were given
    const user = await this.prisma.user.findFirst({
      where: { discord_id: userId },
      select: { id: true }
    });
    
    // Check if the found user's ID matches the character's user_id
    return user ? character.user_id === user.id : false;
  }

  /**
   * Generate an AI-powered character backstory
   * @param characterId Character ID
   * @param prompt Optional prompt to guide the backstory generation
   * @returns Generated backstory text
   */
  async generateBackstory(characterId: string, prompt?: string): Promise<string> {
    const character = await this.getById(characterId);
    if (!character) throw new Error('Character not found');

    const basePrompt = `Generate a compelling backstory for a D&D character named ${character.name}`;
    const fullPrompt = prompt ? `${basePrompt}. ${prompt}` : basePrompt;

    // TODO: Update to use OpenAI SDK directly
    // return this.openai.chat.completions.create(...)
    throw new Error("Not implemented - use OpenAI SDK directly");
  }

  /**
   * Analyze character personality and suggest role-playing tips
   * @param characterId Character ID
   * @returns Personality analysis and role-playing suggestions
   */
  async analyzePersonality(characterId: string): Promise<string> {
    const character = await this.getById(characterId);
    if (!character) throw new Error('Character not found');

    const prompt = `Analyze the personality of this D&D character and provide role-playing tips:
Name: ${character.name}
Description: ${character.description || 'No description provided'}
Provide insights on personality traits, motivations, and how to effectively role-play this character.`;

    // TODO: Update to use OpenAI SDK directly
    // return this.openai.chat.completions.create(...)
    throw new Error("Not implemented - use OpenAI SDK directly");
  }

  /**
   * Suggest character development progression based on current state
   * @param characterId Character ID
   * @returns Character development suggestions
   */
  async suggestCharacterDevelopment(characterId: string): Promise<string> {
    const character = await this.getById(characterId);
    if (!character) throw new Error('Character not found');

    const prompt = `Suggest character development progression for this D&D character:
Name: ${character.name}
Current Description: ${character.description || 'No description provided'}
Provide suggestions for character growth, potential story arcs, and development opportunities.`;

    // TODO: Update to use OpenAI SDK directly
    // return this.openai.chat.completions.create(...)
    throw new Error("Not implemented - use OpenAI SDK directly");
  }

  /**
   * Synchronize character data with WorldAnvil
   * @param characterId Character ID
   * @returns Success status
   */
  async syncWithWorldAnvil(characterId: string): Promise<boolean> {
    const character = await this.getById(characterId);
    if (!character || !character.worldanvil_character_id) return false;

    // TODO: Implement WorldAnvil character API methods
    // WorldAnvil stores characters differently and we need to implement:
    // - this.worldanvil.getCharacter(characterId) method
    // - Character data mapping between WorldAnvil and our schema
    try {
      console.log('TODO: Implement WorldAnvil character sync for character:', characterId);
      return false; // Stubbed out for now
    } catch (error) {
      console.error('Failed to sync character with WorldAnvil:', error);
      return false;
    }
  }

  /**
   * Send character update notification to Discord
   * @param characterId Character ID
   * @param message Update message
   * @returns Success status
   */
  async notifyCharacterUpdate(characterId: string, message: string): Promise<boolean> {
    const character = await this.getById(characterId);
    if (!character || !character.discord_thread_id) return false;

    try {
      // TODO: Update to use Discord.js SDK directly
      // await channel.send(...)
      throw new Error("Not implemented - use Discord.js SDK directly");
      // return true;
    } catch (error) {
      console.error('Failed to send Discord notification:', error);
      return false;
    }
  }

  /**
   * Generate character portrait description for AI image generation
   * @param characterId Character ID
   * @returns Portrait description suitable for AI image generation
   */
  async generatePortraitDescription(characterId: string): Promise<string> {
    const character = await this.getById(characterId);
    if (!character) throw new Error('Character not found');

    const prompt = `Create a detailed portrait description for AI image generation of this D&D character:
Name: ${character.name}
Description: ${character.description || 'Fantasy character'}
Generate a vivid, detailed description suitable for creating character art, including physical appearance, clothing, and setting.`;

    // TODO: Update to use OpenAI SDK directly
    // return this.openai.chat.completions.create(...)
    throw new Error("Not implemented - use OpenAI SDK directly");
  }
}
