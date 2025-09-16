import { Prisma, RpgSystem, PrismaClient } from '@prisma/client';
import { Client } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

/**
 * Service for managing RPG Systems with integrations across Discord, WorldAnvil, and OpenAI
 */
export class RpgSystemService {
  /**
   * Creates a new RPG System service with all necessary client dependencies
   * @param prisma Prisma client instance
   * @param discordClient Discord.js client instance
   * @param worldAnvilClient WorldAnvil API client instance
   * @param openAiClient OpenAI client instance
   */
  constructor(
    private prisma: PrismaClient,
    private discordClient: Client,
    private worldAnvilClient: WorldAnvilApiClient,
    private openAiClient: OpenAI
  ) {}

  /**
   * Get all RPG systems
   */
  async getAll(): Promise<RpgSystem[]> {
    return this.prisma.rpgSystem.findMany();
  }

  /**
   * Get a specific RPG system by ID
   * @param id RPG system ID
   */
  async getById(id: string): Promise<RpgSystem | null> {
    return this.prisma.rpgSystem.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG system by WorldAnvil ID
   * @param worldAnvilId WorldAnvil system ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgSystem | null> {
    return this.prisma.rpgSystem.findUnique({
      where: { worldanvil_system_id: worldAnvilId }
    });
  }

  /**
   * Search for RPG systems by title
   * @param query Search query
   */
  async search(query: string): Promise<RpgSystem[]> {
    return this.prisma.rpgSystem.findMany({
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
    return this.prisma.rpgSystem.create({
      data
    });
  }

  /**
   * Update an existing RPG system
   * @param id RPG system ID
   * @param data Updated RPG system data
   */
  async update(id: string, data: Prisma.RpgSystemUpdateInput): Promise<RpgSystem> {
    return this.prisma.rpgSystem.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG system
   * @param id RPG system ID
   */
  async delete(id: string): Promise<RpgSystem> {
    return this.prisma.rpgSystem.delete({
      where: { id }
    });
  }

  /**
   * Set up Discord integration for an RPG system
   * @param systemId RPG system ID
   * @param guildId Discord guild ID
   */
  async setupDiscordIntegration(systemId: string, guildId: string): Promise<void> {
    // Update the system with Discord guild ID
    await this.update(systemId, { discord_guild_id: guildId });

    // TODO: Use Discord client to register commands
    // const system = await this.getById(systemId);
    // if (system) {
    //   await this.discordClient.registerGuildCommands(guildId, [
    //     // Basic RPG commands based on the system
    //   ]);
    // }
  }

  /**
   * Sync RPG system data with WorldAnvil
   * @param systemId RPG system ID
   * @param worldAnvilSystemId WorldAnvil system ID
   */
  async syncWithWorldAnvil(systemId: string, worldAnvilSystemId: string): Promise<RpgSystem> {
    // TODO: Use WorldAnvil client to fetch system data
    // const worldAnvilData = await this.worldAnvilClient.getRpgSystem(worldAnvilSystemId);
    
    // Update local system with WorldAnvil data
    return this.update(systemId, {
      worldanvil_system_id: worldAnvilSystemId,
      // Map WorldAnvil data to our schema
      // title: worldAnvilData.title,
      // description: worldAnvilData.description,
      // data: worldAnvilData
    });
  }

  /**
   * Generate AI-powered content for an RPG system
   * @param systemId RPG system ID
   * @param contentType Type of content to generate
   */
  async generateAIContent(systemId: string, contentType: 'description' | 'rules' | 'lore'): Promise<string> {
    const system = await this.getById(systemId);
    if (!system) {
      throw new Error('RPG system not found');
    }

    // TODO: Use OpenAI client to generate content
    // const prompt = `Generate ${contentType} for RPG system: ${system.title}`;
    // const response = await this.openAiClient.generateText(prompt);
    // return response.text;

    return `AI-generated ${contentType} for ${system.title} (not implemented yet)`;
  }

  /**
   * Validate that a WorldAnvil system exists
   * @param worldAnvilSystemId WorldAnvil system ID
   */
  async validateWorldAnvilSystem(worldAnvilSystemId: string): Promise<boolean> {
    try {
      // TODO: Use WorldAnvil client to check if system exists
      // await this.worldAnvilClient.getRpgSystem(worldAnvilSystemId);
      return true;
    } catch (error) {
      return false;
    }
  }
}