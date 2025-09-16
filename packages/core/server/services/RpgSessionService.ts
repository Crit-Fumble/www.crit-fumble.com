import { Prisma, RpgSession } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { Client } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

/**
 * Service for managing RPG Sessions with integrations across Discord, WorldAnvil, and OpenAI
 */
export class RpgSessionService {
  /**
   * Creates a new RPG Session service with all necessary client dependencies
   * @param database Database client instance
   * @param discordClient Discord API client instance
   * @param worldAnvilClient WorldAnvil API client instance
   * @param openAiClient OpenAI API client instance
   */
  constructor(
    private prisma: PrismaClient,
    private readonly discordClient: Client,
    private readonly worldAnvilClient: WorldAnvilApiClient,
    private readonly openAiClient: OpenAI
  ) {}

  /**
   * Get all RPG sessions
   */
  async getAll(): Promise<RpgSession[]> {
    return this.prisma.rpgSession.findMany();
  }

  /**
   * Get a specific RPG session by ID
   * @param id RPG session ID
   */
  async getById(id: string): Promise<RpgSession | null> {
    return this.prisma.rpgSession.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG session by WorldAnvil ID
   * @param worldAnvilId WorldAnvil session ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgSession | null> {
    return this.prisma.rpgSession.findFirst({
      where: { worldanvil_id: worldAnvilId }
    });
  }

  /**
   * Get RPG session by Discord event ID
   * @param discordId Discord event ID for the session
   */
  async getByDiscordEventId(discordId: string): Promise<RpgSession | null> {
    return this.prisma.rpgSession.findFirst({
      where: { discord_event_id: discordId }
    });
  }

  /**
   * Get sessions by party
   * @param partyId Party ID
   */
  async getByPartyId(partyId: string): Promise<RpgSession[]> {
    return this.prisma.rpgSession.findMany({
      where: { rpg_party_id: partyId }
    });
  }

  /**
   * Search for RPG sessions by title
   * @param query Search query
   */
  async search(query: string): Promise<RpgSession[]> {
    return this.prisma.rpgSession.findMany({
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
    return this.prisma.rpgSession.findMany({
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
    return this.prisma.rpgSession.create({
      data
    });
  }

  /**
   * Update an existing RPG session
   * @param id RPG session ID
   * @param data Updated RPG session data
   */
  async update(id: string, data: Prisma.RpgSessionUpdateInput): Promise<RpgSession> {
    return this.prisma.rpgSession.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG session
   * @param id RPG session ID
   */
  async delete(id: string): Promise<RpgSession> {
    return this.prisma.rpgSession.delete({
      where: { id }
    });
  }

  /**
   * Get party associated with a session
   * @param sessionId Session ID
   */
  async getPartyForSession(sessionId: string) {
    const session = await this.prisma.rpgSession.findUnique({
      where: { id: sessionId },
      include: { rpg_party: true }
    });
    
    return session?.rpg_party || null;
  }

  /**
   * Setup Discord event for a session
   * @param sessionId Session ID
   * @param guildId Discord guild ID
   * @param scheduledTime When the session is scheduled
   */
  async setupDiscordEvent(sessionId: string, guildId: string, scheduledTime: Date): Promise<void> {
    const session = await this.getById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // TODO: Use Discord client to create scheduled event
    // const discordEvent = await this.discordClient.createScheduledEvent(guildId, {
    //   name: session.title,
    //   description: session.description,
    //   scheduled_start_time: scheduledTime
    // });
    // await this.update(sessionId, { discord_event_id: discordEvent.id });
  }

  /**
   * Sync session with WorldAnvil
   * @param sessionId Session ID
   * @param worldAnvilId WorldAnvil session ID
   */
  async syncWithWorldAnvil(sessionId: string, worldAnvilId: string): Promise<RpgSession> {
    // TODO: Use WorldAnvil client to fetch session data
    // const worldAnvilData = await this.worldAnvilClient.getSession(worldAnvilId);
    
    // Update session with WorldAnvil data
    return this.update(sessionId, {
      worldanvil_id: worldAnvilId,
      // Map WorldAnvil data to our schema
      // title: worldAnvilData.title,
      // description: worldAnvilData.description
    });
  }

  /**
   * Generate AI-powered session content
   * @param sessionId Session ID
   * @param contentType Type of content to generate
   */
  async generateAIContent(sessionId: string, contentType: 'plot' | 'npcs' | 'encounters'): Promise<string> {
    const session = await this.getById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // TODO: Use OpenAI client to generate content
    // const prompt = `Generate ${contentType} for RPG session: ${session.title}`;
    // const response = await this.openAiClient.generateText(prompt);
    // return response.text;

    return `AI-generated ${contentType} for ${session.title} (not implemented yet)`;
  }
}
