import { Prisma, RpgParty } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { Client } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

/**
 * Service for managing RPG Parties with integrations across Discord, WorldAnvil, and OpenAI
 */
export class RpgPartyService {
  /**
   * Creates a new RPG Party service with all necessary client dependencies
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
   * Get all RPG parties
   */
  async getAll(): Promise<RpgParty[]> {
    return this.prisma.rpgParty.findMany();
  }

  /**
   * Get a specific RPG party by ID
   * @param id RPG party ID
   */
  async getById(id: string): Promise<RpgParty | null> {
    return this.prisma.rpgParty.findUnique({
      where: { id }
    });
  }

  /**
   * Get RPG party by WorldAnvil ID
   * @param worldAnvilId WorldAnvil party ID
   */
  async getByWorldAnvilId(worldAnvilId: string): Promise<RpgParty | null> {
    return this.prisma.rpgParty.findUnique({
      where: { worldanvil_party_id: worldAnvilId }
    });
  }

  /**
   * Get RPG party by Discord ID
   * @param discordId Discord role ID for the party
   */
  async getByDiscordRoleId(discordId: string): Promise<RpgParty | null> {
    return this.prisma.rpgParty.findUnique({
      where: { discord_role_id: discordId }
    });
  }

  /**
   * Get parties by campaign
   * @param campaignId Campaign ID
   */
  async getByCampaignId(campaignId: string): Promise<RpgParty[]> {
    return this.prisma.rpgParty.findMany({
      where: { rpg_campaign_id: campaignId }
    });
  }

  /**
   * Get party by session
   * @param sessionId Session ID
   */
  async getBySessionId(sessionId: string): Promise<RpgParty | null> {
    return this.prisma.rpgParty.findFirst({
      where: { rpg_sessions: { some: { id: sessionId } } }
    });
  }

  /**
   * Search for RPG parties by name or title
   * @param query Search query
   */
  async search(query: string): Promise<RpgParty[]> {
    return this.prisma.rpgParty.findMany({
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
    return this.prisma.rpgParty.create({
      data
    });
  }

  /**
   * Update an existing RPG party
   * @param id RPG party ID
   * @param data Updated RPG party data
   */
  async update(id: string, data: Prisma.RpgPartyUpdateInput): Promise<RpgParty> {
    return this.prisma.rpgParty.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an RPG party
   * @param id RPG party ID
   */
  async delete(id: string): Promise<RpgParty> {
    return this.prisma.rpgParty.delete({
      where: { id }
    });
  }

  /**
   * Get party members (character sheets)
   * @param partyId Party ID
   */
  async getPartyMembers(partyId: string) {
    return this.prisma.rpgSheet.findMany({
      where: { rpg_party_id: partyId }
    });
  }

  /**
   * Setup Discord role for a party
   * @param partyId Party ID
   * @param guildId Discord guild ID
   */
  async setupDiscordRole(partyId: string, guildId: string): Promise<void> {
    const party = await this.getById(partyId);
    if (!party) {
      throw new Error('Party not found');
    }

    // TODO: Use Discord client to create role for party
    // const discordRole = await this.discordClient.createRole(guildId, {
    //   name: party.title,
    //   color: 0x00ff00, // Green color
    //   mentionable: true
    // });
    // await this.update(partyId, { discord_role_id: discordRole.id });
  }

  /**
   * Sync party with WorldAnvil
   * @param partyId Party ID
   * @param worldAnvilPartyId WorldAnvil party ID
   */
  async syncWithWorldAnvil(partyId: string, worldAnvilPartyId: string): Promise<RpgParty> {
    // TODO: Use WorldAnvil client to fetch party data
    // const worldAnvilData = await this.worldAnvilClient.getParty(worldAnvilPartyId);
    
    // Update party with WorldAnvil data
    return this.update(partyId, {
      worldanvil_party_id: worldAnvilPartyId,
      // Map WorldAnvil data to our schema
      // title: worldAnvilData.title,
      // description: worldAnvilData.description
    });
  }

  /**
   * Generate AI-powered party content
   * @param partyId Party ID
   * @param contentType Type of content to generate
   */
  async generateAIContent(partyId: string, contentType: 'dynamics' | 'backstory' | 'goals'): Promise<string> {
    const party = await this.getById(partyId);
    if (!party) {
      throw new Error('Party not found');
    }

    // TODO: Use OpenAI client to generate content
    // const prompt = `Generate ${contentType} for RPG party: ${party.title}`;
    // const response = await this.openAiClient.generateText(prompt);
    // return response.text;

    return `AI-generated ${contentType} for ${party.title} (not implemented yet)`;
  }
}
