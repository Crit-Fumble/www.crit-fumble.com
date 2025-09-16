import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { Client } from 'discord.js';
import { WorldAnvilApiClient, WorldAnvilWorld } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';
import { RpgWorld, CreateRpgWorldInput, UpdateRpgWorldInput } from '../../models';

/**
 * Service for managing RPG Worlds with integrations across Discord, WorldAnvil, and OpenAI
 */
export class RpgWorldService {
  /**
   * Creates a new RPG World service with all necessary client dependencies
   * @param database Database client instance
   * @param discordClient Discord API client instance
   * @param worldAnvilClient World Anvil API client instance
   * @param openAiClient OpenAI API client instance
   */
  constructor(
    private prisma: PrismaClient,
    private readonly discordClient: Client,
    private readonly worldAnvilClient: WorldAnvilApiClient,
    private readonly openAiClient: OpenAI
  ) {}

  /**
   * Get all RPG worlds
   */
  async getAll(): Promise<RpgWorld[]> {
    return this.prisma.rpgWorld.findMany();
  }

  /**
   * Get a specific RPG world by ID
   * @param id RPG world ID
   */
  async getById(id: string): Promise<RpgWorld | null> {
    return this.prisma.rpgWorld.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG world by WorldAnvil ID
   * @param worldAnvilId WorldAnvil world ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgWorld | null> {
    return this.prisma.rpgWorld.findUnique({
      where: { worldanvil_world_id: worldAnvilId }
    });
  }

  /**
   * Get worlds by RPG system
   * @param systemId RPG system ID
   */
  async getBySystemId(systemId: string): Promise<RpgWorld[]> {
    return this.prisma.rpgWorld.findMany({
      where: { rpg_system_id: systemId }
    });
  }

  /**
   * Search for RPG worlds by title
   * @param query Search query
   */
  async search(query: string): Promise<RpgWorld[]> {
    return this.prisma.rpgWorld.findMany({
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
    return this.prisma.rpgWorld.create({
      data
    });
  }

  /**
   * Update an existing RPG world
   * @param id RPG world ID
   * @param data Updated RPG world data
   */
  async update(id: string, data: Prisma.RpgWorldUpdateInput): Promise<RpgWorld> {
    return this.prisma.rpgWorld.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG world
   * @param id RPG world ID
   */
  async delete(id: string): Promise<RpgWorld> {
    return this.prisma.rpgWorld.delete({
      where: { id }
    });
  }

  /**
   * Setup Discord integration for a world
   * @param worldId World ID
   * @param guildId Discord guild ID
   */
  async setupDiscordIntegration(worldId: string, guildId: string): Promise<void> {
    const world = await this.getById(worldId);
    if (!world) {
      throw new Error('World not found');
    }

    // TODO: Use Discord client to setup world channels/categories
    // const discordCategory = await this.discordClient.createCategory(guildId, {
    //   name: `🌍 ${world.title}`,
    //   position: 1
    // });
    // 
    // const discordChannel = await this.discordClient.createTextChannel(guildId, {
    //   name: `${world.title}-lore`,
    //   parent: discordCategory.id
    // });
    // 
    // await this.update(worldId, { 
    //   discord_chat_id: discordChannel.id,
    //   discord_forum_id: discordCategory.id 
    // });
  }

  /**
   * Sync world with WorldAnvil
   * @param worldId World ID
   * @param worldAnvilWorldId WorldAnvil world ID
   */
  async syncWithWorldAnvil(worldId: string, worldAnvilWorldId: string): Promise<RpgWorld> {
    // TODO: Use WorldAnvil client to fetch world data
    // const worldAnvilData = await this.worldAnvilClient.getWorld(worldAnvilWorldId);
    
    // Update world with WorldAnvil data
    return this.update(worldId, {
      worldanvil_world_id: worldAnvilWorldId,
      // Map WorldAnvil data to our schema
      // title: worldAnvilData.title,
      // description: worldAnvilData.description,
      // data: worldAnvilData
    });
  }

  /**
   * Generate AI-powered world content
   * @param worldId World ID
   * @param contentType Type of content to generate
   */
  async generateAIContent(worldId: string, contentType: 'lore' | 'locations' | 'cultures' | 'history'): Promise<string> {
    const world = await this.getById(worldId);
    if (!world) {
      throw new Error('World not found');
    }

    // TODO: Use OpenAI client to generate content
    // const prompt = `Generate ${contentType} for RPG world: ${world.title}`;
    // const response = await this.openAiClient.generateText(prompt);
    // return response.text;

    return `AI-generated ${contentType} for ${world.title} (not implemented yet)`;
  }

  /**
   * Generate AI-powered world map descriptions
   * @param worldId World ID
   * @param regionType Type of region to describe
   */
  async generateRegionDescription(worldId: string, regionType: 'continent' | 'kingdom' | 'city' | 'wilderness'): Promise<string> {
    const world = await this.getById(worldId);
    if (!world) {
      throw new Error('World not found');
    }

    // TODO: Use OpenAI client to generate region descriptions
    // const prompt = `Generate a detailed description of a ${regionType} in the world: ${world.title}`;
    // const response = await this.openAiClient.generateText(prompt);
    // return response.text;

    return `AI-generated ${regionType} description for ${world.title} (not implemented yet)`;
  }
}
