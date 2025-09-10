import { Prisma, RpgSystem } from '@prisma/client';
import { DatabaseClient } from '../clients/DatabaseClient';

/**
 * Service for managing RPG Systems in the database
 */
export class RpgSystemService {
  /**
   * Creates a new RPG System service
   * @param database Database client instance
   */
  constructor(private database: DatabaseClient) {}

  /**
   * Get all RPG systems
   */
  async getAll(): Promise<RpgSystem[]> {
    return this.database.client.rpgSystem.findMany();
  }

  /**
   * Get a specific RPG system by ID
   * @param id RPG system ID
   */
  async getById(id: string): Promise<RpgSystem | null> {
    return this.database.client.rpgSystem.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG system by WorldAnvil ID
   * @param worldAnvilId WorldAnvil system ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgSystem | null> {
    return this.database.client.rpgSystem.findUnique({
      where: { worldanvil_system_id: worldAnvilId }
    });
  }

  /**
   * Search for RPG systems by title
   * @param query Search query
   */
  async search(query: string): Promise<RpgSystem[]> {
    return this.database.client.rpgSystem.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive'
        }
      }
    });
  }

  /**
   * Create a new RPG system
   * @param data RPG system data
   */
  async create(data: Prisma.RpgSystemCreateInput): Promise<RpgSystem> {
    return this.database.client.rpgSystem.create({
      data
    });
  }

  /**
   * Update an existing RPG system
   * @param id RPG system ID
   * @param data Updated RPG system data
   */
  async update(id: string, data: Prisma.RpgSystemUpdateInput): Promise<RpgSystem> {
    return this.database.client.rpgSystem.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG system
   * @param id RPG system ID
   */
  async delete(id: string): Promise<RpgSystem> {
    return this.database.client.rpgSystem.delete({
      where: { id }
    });
  }
}