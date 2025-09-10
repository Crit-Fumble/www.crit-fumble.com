import { Prisma, RpgWorld } from '@prisma/client';
import { DatabaseClient } from '../clients/DatabaseClient';

/**
 * Service for managing RPG Worlds in the database
 */
export class RpgWorldService {
  /**
   * Creates a new RPG World service
   * @param database Database client instance
   */
  constructor(private database: DatabaseClient) {}

  /**
   * Get all RPG worlds
   */
  async getAll(): Promise<RpgWorld[]> {
    return this.database.client.rpgWorld.findMany();
  }

  /**
   * Get a specific RPG world by ID
   * @param id RPG world ID
   */
  async getById(id: string): Promise<RpgWorld | null> {
    return this.database.client.rpgWorld.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG world by WorldAnvil ID
   * @param worldAnvilId WorldAnvil world ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgWorld | null> {
    return this.database.client.rpgWorld.findUnique({
      where: { worldanvil_world_id: worldAnvilId }
    });
  }

  /**
   * Get worlds by RPG system
   * @param systemId RPG system ID
   */
  async getBySystemId(systemId: string): Promise<RpgWorld[]> {
    return this.database.client.rpgWorld.findMany({
      where: { rpg_system_id: systemId }
    });
  }

  /**
   * Search for RPG worlds by title
   * @param query Search query
   */
  async search(query: string): Promise<RpgWorld[]> {
    return this.database.client.rpgWorld.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive'
        }
      }
    });
  }

  /**
   * Create a new RPG world
   * @param data RPG world data
   */
  async create(data: Prisma.RpgWorldCreateInput): Promise<RpgWorld> {
    return this.database.client.rpgWorld.create({
      data
    });
  }

  /**
   * Update an existing RPG world
   * @param id RPG world ID
   * @param data Updated RPG world data
   */
  async update(id: string, data: Prisma.RpgWorldUpdateInput): Promise<RpgWorld> {
    return this.database.client.rpgWorld.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG world
   * @param id RPG world ID
   */
  async delete(id: string): Promise<RpgWorld> {
    return this.database.client.rpgWorld.delete({
      where: { id }
    });
  }
}
