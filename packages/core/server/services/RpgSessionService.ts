import { Prisma, RpgSession } from '@prisma/client';
import { DatabaseClient } from '../clients/DatabaseClient';

/**
 * Service for managing RPG Sessions in the database
 */
export class RpgSessionService {
  /**
   * Creates a new RPG Session service
   * @param database Database client instance
   */
  constructor(private database: DatabaseClient) {}

  /**
   * Get all RPG sessions
   */
  async getAll(): Promise<RpgSession[]> {
    return this.database.client.rpgSession.findMany();
  }

  /**
   * Get a specific RPG session by ID
   * @param id RPG session ID
   */
  async getById(id: string): Promise<RpgSession | null> {
    return this.database.client.rpgSession.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG session by WorldAnvil ID
   * @param worldAnvilId WorldAnvil session ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgSession | null> {
    return this.database.client.rpgSession.findFirst({
      where: { worldanvil_id: worldAnvilId }
    });
  }

  /**
   * Get RPG session by Discord event ID
   * @param discordId Discord event ID for the session
   */
  async getByDiscordEventId(discordId: string): Promise<RpgSession | null> {
    return this.database.client.rpgSession.findFirst({
      where: { discord_event_id: discordId }
    });
  }

  /**
   * Get sessions by party
   * @param partyId Party ID
   */
  async getByPartyId(partyId: string): Promise<RpgSession[]> {
    return this.database.client.rpgSession.findMany({
      where: { rpg_party_id: partyId }
    });
  }

  /**
   * Search for RPG sessions by title
   * @param query Search query
   */
  async search(query: string): Promise<RpgSession[]> {
    return this.database.client.rpgSession.findMany({
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
   * Get upcoming sessions (sessions with a date in the future)
   */
  async getUpcomingSessions(): Promise<RpgSession[]> {
    const now = new Date();
    
    // We would need a session_date field for this to work properly
    // This is a placeholder implementation assuming we eventually add that field
    return this.database.client.rpgSession.findMany({
      where: {
        // Assuming we add a session_date field in the future
        // session_date: {
        //   gt: now
        // }
      },
      orderBy: {
        created_at: 'desc' // For now, just return recent sessions
      }
    });
  }

  /**
   * Create a new RPG session
   * @param data RPG session data
   */
  async create(data: Prisma.RpgSessionCreateInput): Promise<RpgSession> {
    return this.database.client.rpgSession.create({
      data
    });
  }

  /**
   * Update an existing RPG session
   * @param id RPG session ID
   * @param data Updated RPG session data
   */
  async update(id: string, data: Prisma.RpgSessionUpdateInput): Promise<RpgSession> {
    return this.database.client.rpgSession.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG session
   * @param id RPG session ID
   */
  async delete(id: string): Promise<RpgSession> {
    return this.database.client.rpgSession.delete({
      where: { id }
    });
  }

  /**
   * Get party associated with a session
   * @param sessionId Session ID
   */
  async getPartyForSession(sessionId: string) {
    const session = await this.database.client.rpgSession.findUnique({
      where: { id: sessionId },
      include: { rpg_party: true }
    });
    
    return session?.rpg_party || null;
  }
}
