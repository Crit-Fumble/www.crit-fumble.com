import { Prisma, RpgParty } from '@prisma/client';
import { DatabaseClient } from '../clients/DatabaseClient';

/**
 * Service for managing RPG Parties in the database
 */
export class RpgPartyService {
  /**
   * Creates a new RPG Party service
   * @param database Database client instance
   */
  constructor(private database: DatabaseClient) {}

  /**
   * Get all RPG parties
   */
  async getAll(): Promise<RpgParty[]> {
    return this.database.client.rpgParty.findMany();
  }

  /**
   * Get a specific RPG party by ID
   * @param id RPG party ID
   */
  async getById(id: string): Promise<RpgParty | null> {
    return this.database.client.rpgParty.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG party by WorldAnvil ID
   * @param worldAnvilId WorldAnvil party ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgParty | null> {
    return this.database.client.rpgParty.findUnique({
      where: { worldanvil_party_id: worldAnvilId }
    });
  }

  /**
   * Get RPG party by Discord ID
   * @param discordId Discord role ID for the party
   */
  async getByDiscordRoleId(discordId: string): Promise<RpgParty | null> {
    return this.database.client.rpgParty.findUnique({
      where: { discord_role_id: discordId }
    });
  }

  /**
   * Get parties by campaign
   * @param campaignId Campaign ID
   */
  async getByCampaignId(campaignId: string): Promise<RpgParty[]> {
    return this.database.client.rpgParty.findMany({
      where: { rpg_campaign_id: campaignId }
    });
  }

  /**
   * Get party by session
   * @param sessionId Session ID
   */
  async getBySessionId(sessionId: string): Promise<RpgParty | null> {
    return this.database.client.rpgParty.findFirst({
      where: { rpg_sessions: { some: { id: sessionId } } }
    });
  }

  /**
   * Search for RPG parties by name or title
   * @param query Search query
   */
  async search(query: string): Promise<RpgParty[]> {
    return this.database.client.rpgParty.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      }
    });
  }

  /**
   * Create a new RPG party
   * @param data RPG party data
   */
  async create(data: Prisma.RpgPartyCreateInput): Promise<RpgParty> {
    return this.database.client.rpgParty.create({
      data
    });
  }

  /**
   * Update an existing RPG party
   * @param id RPG party ID
   * @param data Updated RPG party data
   */
  async update(id: string, data: Prisma.RpgPartyUpdateInput): Promise<RpgParty> {
    return this.database.client.rpgParty.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG party
   * @param id RPG party ID
   */
  async delete(id: string): Promise<RpgParty> {
    return this.database.client.rpgParty.delete({
      where: { id }
    });
  }

  /**
   * Get party members (character sheets)
   * @param partyId Party ID
   */
  async getPartyMembers(partyId: string) {
    return this.database.client.rpgSheet.findMany({
      where: { rpg_party_id: partyId }
    });
  }
}
