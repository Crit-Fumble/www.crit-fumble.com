import { PrismaClient } from '@prisma/client';
import { DiscordBotServer } from '../DiscordBotServer';
import {
  UserService,
  RpgCharacterService,
  RpgWorldService,
  RpgCampaignService,
  RpgPartyService,
  RpgSessionService,
  RpgSheetService,
  RpgSystemService
} from '@crit-fumble/core/server/services';
import { Client as DiscordClient } from '@crit-fumble/core/server';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';

/**
 * Database service for Discord bot that wraps core package services
 * Uses PostgreSQL via Prisma instead of MongoDB
 */
export class DatabaseService {
  private readonly prisma: PrismaClient;
  private readonly discordClient: DiscordClient;
  private readonly worldAnvilClient?: WorldAnvilApiClient;
  private readonly openAIClient?: OpenAI;

  // Core package services
  public readonly users: UserService;
  public readonly characters: RpgCharacterService;
  public readonly worlds: RpgWorldService;
  public readonly campaigns: RpgCampaignService;
  public readonly parties: RpgPartyService;
  public readonly sessions: RpgSessionService;
  public readonly sheets: RpgSheetService;
  public readonly systems: RpgSystemService;

  constructor(bot: DiscordBotServer) {
    if (!bot.database) {
      throw new Error('Database client not available on bot instance');
    }

    this.prisma = bot.database;
    this.discordClient = bot;
    this.worldAnvilClient = bot.worldanvil;
    this.openAIClient = bot.openai;

    // Initialize core package services with proper dependency injection
    this.users = new UserService(
      this.prisma,
      this.discordClient,
      this.worldAnvilClient || {} as WorldAnvilApiClient,
      this.openAIClient || {} as OpenAI
    );
    this.characters = new RpgCharacterService(
      this.prisma,
      this.discordClient,
      this.worldAnvilClient || {} as WorldAnvilApiClient,
      this.openAIClient || {} as OpenAI
    );
    this.worlds = new RpgWorldService(
      this.prisma,
      this.discordClient,
      this.worldAnvilClient || {} as WorldAnvilApiClient,
      this.openAIClient || {} as OpenAI
    );
    this.campaigns = new RpgCampaignService(
      this.prisma,
      this.discordClient,
      this.worldAnvilClient || {} as WorldAnvilApiClient,
      this.openAIClient || {} as OpenAI
    );
    this.parties = new RpgPartyService(
      this.prisma,
      this.discordClient,
      this.worldAnvilClient || {} as WorldAnvilApiClient,
      this.openAIClient || {} as OpenAI
    );
    this.sessions = new RpgSessionService(
      this.prisma,
      this.discordClient,
      this.worldAnvilClient || {} as WorldAnvilApiClient,
      this.openAIClient || {} as OpenAI
    );
    this.sheets = new RpgSheetService(
      this.prisma,
      this.discordClient,
      this.worldAnvilClient || {} as WorldAnvilApiClient,
      this.openAIClient || {} as OpenAI
    );
    this.systems = new RpgSystemService(
      this.prisma,
      this.discordClient,
      this.worldAnvilClient || {} as WorldAnvilApiClient,
      this.openAIClient || {} as OpenAI
    );
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  /**
   * Get database health status
   */
  async getHealthStatus() {
    const isConnected = await this.testConnection();
    return {
      connected: isConnected,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate a UUID (replacement for old crypto.randomUUID usage)
   */
  generateId(): string {
    return crypto.randomUUID();
  }

  /**
   * Close database connections
   */
  async close(): Promise<void> {
    await this.prisma.$disconnect();
  }
}