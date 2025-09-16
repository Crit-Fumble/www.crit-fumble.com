import { Prisma, RpgCampaign } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { Client } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

/**
 * Service for managing RPG Campaigns with integrations across Discord, WorldAnvil, and OpenAI
 */
export class RpgCampaignService {
  /**
   * Creates a new RPG Campaign service with all necessary client dependencies
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
   * Get all RPG campaigns
   */
  async getAll(): Promise<RpgCampaign[]> {
    return this.prisma.rpgCampaign.findMany();
  }

  /**
   * Get a specific RPG campaign by ID
   * @param id RPG campaign ID
   */
  async getById(id: string): Promise<RpgCampaign | null> {
    return this.prisma.rpgCampaign.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG campaign by WorldAnvil ID
   * @param worldAnvilId WorldAnvil campaign ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgCampaign | null> {
    return this.prisma.rpgCampaign.findFirst({
      where: { worldanvil_campaign_id: worldAnvilId }
    });
  }

  /**
   * Get campaigns by RPG system
   * @param systemId RPG system ID
   */
  async getBySystemId(systemId: string): Promise<RpgCampaign[]> {
    return this.prisma.rpgCampaign.findMany({
      where: { rpg_system_id: systemId }
    });
  }

  /**
   * Get campaigns by RPG world
   * @param worldId RPG world ID
   */
  async getByWorldId(worldId: string): Promise<RpgCampaign[]> {
    return this.prisma.rpgCampaign.findMany({
      where: { rpg_world_id: worldId }
    });
  }

  /**
   * Get campaigns by GM
   * @param gmId GM user ID
   */
  async getByGmId(gmId: string): Promise<RpgCampaign[]> {
    return this.prisma.rpgCampaign.findMany({
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
    return this.prisma.rpgCampaign.findMany({
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
    return this.prisma.rpgCampaign.create({
      data
    });
  }

  /**
   * Update an existing RPG campaign
   * @param id RPG campaign ID
   * @param data Updated RPG campaign data
   */
  async update(id: string, data: Prisma.RpgCampaignUpdateInput): Promise<RpgCampaign> {
    return this.prisma.rpgCampaign.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG campaign
   * @param id RPG campaign ID
   */
  async delete(id: string): Promise<RpgCampaign> {
    return this.prisma.rpgCampaign.delete({
      where: { id }
    });
  }

  /**
   * Setup Discord integration for a campaign
   * @param campaignId Campaign ID
   * @param guildId Discord guild ID
   */
  async setupDiscordIntegration(campaignId: string, guildId: string): Promise<void> {
    const campaign = await this.getById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // TODO: Use Discord client to setup campaign channels/roles
    // const discordCategory = await this.discordClient.createCategory(guildId, {
    //   name: campaign.title,
    //   position: 0
    // });
    // 
    // const discordChannel = await this.discordClient.createTextChannel(guildId, {
    //   name: `${campaign.title}-general`,
    //   parent: discordCategory.id
    // });
    // 
    // await this.update(campaignId, { 
    //   discord_chat_id: discordChannel.id,
    //   discord_forum_id: discordCategory.id 
    // });
  }

  /**
   * Sync campaign with WorldAnvil
   * @param campaignId Campaign ID
   * @param worldAnvilCampaignId WorldAnvil campaign ID
   */
  async syncWithWorldAnvil(campaignId: string, worldAnvilCampaignId: string): Promise<RpgCampaign> {
    // TODO: Use WorldAnvil client to fetch campaign data
    // const worldAnvilData = await this.worldAnvilClient.getCampaign(worldAnvilCampaignId);
    
    // Update campaign with WorldAnvil data
    return this.update(campaignId, {
      worldanvil_campaign_id: worldAnvilCampaignId,
      // Map WorldAnvil data to our schema
      // title: worldAnvilData.title,
      // description: worldAnvilData.description
    });
  }

  /**
   * Generate AI-powered campaign content
   * @param campaignId Campaign ID
   * @param contentType Type of content to generate
   */
  async generateAIContent(campaignId: string, contentType: 'plot' | 'npcs' | 'locations' | 'hooks'): Promise<string> {
    const campaign = await this.getById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // TODO: Use OpenAI client to generate content
    // const prompt = `Generate ${contentType} for RPG campaign: ${campaign.title}`;
    // const response = await this.openAiClient.generateText(prompt);
    // return response.text;

    return `AI-generated ${contentType} for ${campaign.title} (not implemented yet)`;
  }
}
