import { Prisma, RpgCampaign } from '@prisma/client';
import { DatabaseClient } from '../clients/DatabaseClient';

/**
 * Service for managing RPG Campaigns in the database
 */
export class RpgCampaignService {
  /**
   * Creates a new RPG Campaign service
   * @param database Database client instance
   */
  constructor(private database: DatabaseClient) {}

  /**
   * Get all RPG campaigns
   */
  async getAll(): Promise<RpgCampaign[]> {
    return this.database.client.rpgCampaign.findMany();
  }

  /**
   * Get a specific RPG campaign by ID
   * @param id RPG campaign ID
   */
  async getById(id: string): Promise<RpgCampaign | null> {
    return this.database.client.rpgCampaign.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG campaign by WorldAnvil ID
   * @param worldAnvilId WorldAnvil campaign ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgCampaign | null> {
    return this.database.client.rpgCampaign.findUnique({
      where: { worldanvil_campaign_id: worldAnvilId }
    });
  }

  /**
   * Get campaigns by RPG system
   * @param systemId RPG system ID
   */
  async getBySystemId(systemId: string): Promise<RpgCampaign[]> {
    return this.database.client.rpgCampaign.findMany({
      where: { rpg_system_id: systemId }
    });
  }

  /**
   * Get campaigns by RPG world
   * @param worldId RPG world ID
   */
  async getByWorldId(worldId: string): Promise<RpgCampaign[]> {
    return this.database.client.rpgCampaign.findMany({
      where: { rpg_world_id: worldId }
    });
  }

  /**
   * Get campaigns by GM
   * @param gmId GM user ID
   */
  async getByGmId(gmId: string): Promise<RpgCampaign[]> {
    return this.database.client.rpgCampaign.findMany({
      where: {
        gm_ids: {
          has: gmId
        }
      }
    });
  }

  /**
   * Search for RPG campaigns by title
   * @param query Search query
   */
  async search(query: string): Promise<RpgCampaign[]> {
    return this.database.client.rpgCampaign.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive'
        }
      }
    });
  }

  /**
   * Create a new RPG campaign
   * @param data RPG campaign data
   */
  async create(data: Prisma.RpgCampaignCreateInput): Promise<RpgCampaign> {
    return this.database.client.rpgCampaign.create({
      data
    });
  }

  /**
   * Update an existing RPG campaign
   * @param id RPG campaign ID
   * @param data Updated RPG campaign data
   */
  async update(id: string, data: Prisma.RpgCampaignUpdateInput): Promise<RpgCampaign> {
    return this.database.client.rpgCampaign.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG campaign
   * @param id RPG campaign ID
   */
  async delete(id: string): Promise<RpgCampaign> {
    return this.database.client.rpgCampaign.delete({
      where: { id }
    });
  }
}
