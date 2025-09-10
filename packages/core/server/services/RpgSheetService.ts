import { Prisma, RpgSheet } from '@prisma/client';
import { DatabaseClient } from '../clients/DatabaseClient';

/**
 * Service for managing RPG Sheets in the database
 */
export class RpgSheetService {
  /**
   * Creates a new RPG Sheet service
   * @param database Database client instance
   */
  constructor(private database: DatabaseClient) {}

  /**
   * Get all RPG sheets
   */
  async getAll(): Promise<RpgSheet[]> {
    return this.database.client.rpgSheet.findMany();
  }

  /**
   * Get a specific RPG sheet by ID
   * @param id RPG sheet ID
   */
  async getById(id: string): Promise<RpgSheet | null> {
    return this.database.client.rpgSheet.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG sheet by WorldAnvil ID
   * @param worldAnvilId WorldAnvil sheet ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgSheet | null> {
    return this.database.client.rpgSheet.findUnique({
      where: { worldanvil_block_id: worldAnvilId }
    });
  }

  /**
   * Get RPG sheet by Discord post ID
   * @param discordId Discord post ID for the sheet
   */
  async getByDiscordPostId(discordId: string): Promise<RpgSheet | null> {
    return this.database.client.rpgSheet.findUnique({
      where: { discord_post_id: discordId }
    });
  }

  /**
   * Get RPG sheet by Discord thread ID
   * @param discordId Discord thread ID for the sheet
   */
  async getByDiscordThreadId(discordId: string): Promise<RpgSheet | null> {
    return this.database.client.rpgSheet.findUnique({
      where: { discord_thread_id: discordId }
    });
  }

  /**
   * Get sheets by character
   * @param characterId Character ID
   */
  async getByCharacterId(characterId: string): Promise<RpgSheet[]> {
    return this.database.client.rpgSheet.findMany({
      where: { rpg_character_id: characterId }
    });
  }

  /**
   * Get sheets by party
   * @param partyId Party ID
   */
  async getByPartyId(partyId: string): Promise<RpgSheet[]> {
    return this.database.client.rpgSheet.findMany({
      where: { rpg_party_id: partyId }
    });
  }

  /**
   * Get sheets by campaign
   * @param campaignId Campaign ID
   */
  async getByCampaignId(campaignId: string): Promise<RpgSheet[]> {
    return this.database.client.rpgSheet.findMany({
      where: { rpg_campaign_id: campaignId }
    });
  }

  /**
   * Get sheets by world
   * @param worldId World ID
   */
  async getByWorldId(worldId: string): Promise<RpgSheet[]> {
    return this.database.client.rpgSheet.findMany({
      where: { rpg_world_id: worldId }
    });
  }

  /**
   * Get sheets by system
   * @param systemId System ID
   */
  async getBySystemId(systemId: string): Promise<RpgSheet[]> {
    return this.database.client.rpgSheet.findMany({
      where: { rpg_system_id: systemId }
    });
  }

  /**
   * Search for RPG sheets by title
   * @param query Search query
   */
  async search(query: string): Promise<RpgSheet[]> {
    return this.database.client.rpgSheet.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            summary: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      }
    });
  }

  /**
   * Get active sheets
   */
  async getActiveSheets(): Promise<RpgSheet[]> {
    return this.database.client.rpgSheet.findMany({
      where: { is_active: true }
    });
  }

  /**
   * Create a new RPG sheet
   * @param data RPG sheet data
   */
  async create(data: Prisma.RpgSheetCreateInput): Promise<RpgSheet> {
    return this.database.client.rpgSheet.create({
      data
    });
  }

  /**
   * Update an existing RPG sheet
   * @param id RPG sheet ID
   * @param data Updated RPG sheet data
   */
  async update(id: string, data: Prisma.RpgSheetUpdateInput): Promise<RpgSheet> {
    return this.database.client.rpgSheet.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG sheet
   * @param id RPG sheet ID
   */
  async delete(id: string): Promise<RpgSheet> {
    return this.database.client.rpgSheet.delete({
      where: { id }
    });
  }

  /**
   * Check if user can access sheet through character ownership
   * @param userId User ID
   * @param sheetId Sheet ID
   */
  async verifySheetAccess(userId: string, sheetId: string): Promise<boolean> {
    // Get the sheet with its character relationship
    const sheet = await this.database.client.rpgSheet.findUnique({
      where: { id: sheetId },
      include: {
        rpg_character: {
          select: { user_id: true }
        }
      }
    });

    if (!sheet || !sheet.rpg_character) return false;
    
    // Check if user owns the character
    if (sheet.rpg_character.user_id === userId) return true;
    
    // Look up user by discord ID in case that's what we were given
    const user = await this.database.client.user.findFirst({
      where: { discord_id: userId },
      select: { id: true }
    });
    
    // Check if the found user's ID matches the character's user_id
    return user ? sheet.rpg_character.user_id === user.id : false;
  }
}
