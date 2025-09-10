import { Prisma, RpgCharacter } from '@prisma/client';
import { DatabaseClient } from '../clients/DatabaseClient';

/**
 * Service for managing RPG Characters in the database
 */
export class RpgCharacterService {
  /**
   * Creates a new RPG Character service
   * @param database Database client instance
   */
  constructor(private database: DatabaseClient) {}

  /**
   * Get all RPG characters
   */
  async getAll(): Promise<RpgCharacter[]> {
    return this.database.client.rpgCharacter.findMany();
  }

  /**
   * Get a specific RPG character by ID
   * @param id RPG character ID
   */
  async getById(id: string): Promise<RpgCharacter | null> {
    return this.database.client.rpgCharacter.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG character by WorldAnvil ID
   * @param worldAnvilId WorldAnvil character ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgCharacter | null> {
    return this.database.client.rpgCharacter.findFirst({
      where: { worldanvil_character_id: worldAnvilId }
    });
  }

  /**
   * Get RPG character by Discord post ID
   * @param discordId Discord post ID for the character
   */
  async getByDiscordPostId(discordId: string): Promise<RpgCharacter | null> {
    return this.database.client.rpgCharacter.findUnique({
      where: { discord_post_id: discordId }
    });
  }

  /**
   * Get RPG character by Discord thread ID
   * @param discordId Discord thread ID for the character
   */
  async getByDiscordThreadId(discordId: string): Promise<RpgCharacter | null> {
    return this.database.client.rpgCharacter.findUnique({
      where: { discord_thread_id: discordId }
    });
  }

  /**
   * Get characters owned by a specific user
   * @param userId User ID
   */
  async getByUserId(userId: string): Promise<RpgCharacter[]> {
    return this.database.client.rpgCharacter.findMany({
      where: { user_id: userId }
    });
  }

  /**
   * Search for RPG characters by name or title
   * @param query Search query
   */
  async search(query: string): Promise<RpgCharacter[]> {
    return this.database.client.rpgCharacter.findMany({
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
    return this.database.client.rpgCharacter.create({
      data
    });
  }

  /**
   * Update an existing RPG character
   * @param id RPG character ID
   * @param data Updated RPG character data
   */
  async update(id: string, data: Prisma.RpgCharacterUpdateInput): Promise<RpgCharacter> {
    return this.database.client.rpgCharacter.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG character
   * @param id RPG character ID
   */
  async delete(id: string): Promise<RpgCharacter> {
    return this.database.client.rpgCharacter.delete({
      where: { id }
    });
  }

  /**
   * Get character sheets for a character
   * @param characterId Character ID
   */
  async getCharacterSheets(characterId: string) {
    return this.database.client.rpgSheet.findMany({
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
    const character = await this.database.client.rpgCharacter.findUnique({
      where: { id: characterId },
      select: { user_id: true }
    });

    if (!character) return false;
    
    // Direct match on user_id
    if (character.user_id === userId) return true;
    
    // Look up user by discord ID in case that's what we were given
    const user = await this.database.client.user.findFirst({
      where: { discord_id: userId },
      select: { id: true }
    });
    
    // Check if the found user's ID matches the character's user_id
    return user ? character.user_id === user.id : false;
  }
}
