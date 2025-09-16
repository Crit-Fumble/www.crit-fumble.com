import { Client } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';
import type { User, PrismaClient } from '@prisma/client';

/**
 * User service for managing users with Discord, WorldAnvil, and OpenAI integrations
 */
export class UserService {
  /**
   * Creates a new User service with all necessary client dependencies
   * @param prisma Prisma client instance
   * @param discordClient Discord.js client instance
   * @param worldAnvilClient WorldAnvil API client instance
   * @param openAiClient OpenAI client instance
   */
  constructor(
    private readonly prisma: PrismaClient,
    private readonly discordClient: Client,
    private readonly worldAnvilClient: WorldAnvilApiClient,
    private readonly openAiClient: OpenAI
  ) {}

  /**
   * Fetch user data by ID (which could be a database ID or a Discord ID or WorldAnvil ID)
   */
  async getUserById(userId: string): Promise<User | null> {
    // Try to get user directly by ID
    let user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    // If not found, try to find by Discord ID
    if (!user) {
      user = await this.prisma.user.findFirst({
        where: { discord_id: userId }
      });
    }

    // If still not found, try to find by WorldAnvil ID
    if (!user) {
      user = await this.prisma.user.findFirst({
        where: { worldanvil_id: userId }
      });
    }

    return user;
  }

  /**
   * Get user by email address
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  /**
   * Fetch user data by ID and include related character information
   */
  async getUserWithCharacters(userId: string): Promise<{
    user: User | null;
    characters: any[];
  }> {
    const user = await this.getUserById(userId);
    
    if (!user) {
      return { user: null, characters: [] };
    }

    // Get related characters for this user (using correct field name)
    const characters = await this.prisma.rpgCharacter.findMany({
      where: { user_id: user.id }
    });

    return { user, characters };
  }

  /**
   * Fetch complete user data including related entities
   */
  async getUserData(userId: string): Promise<{
    user: User | null;
    characters?: any[];
  }> {
    const user = await this.getUserById(userId);
    
    if (!user) {
      return {
        user: null,
      };
    }

    // Get the user's characters
    const characters = await this.prisma.rpgCharacter.findMany({
      where: { user_id: user.id }
    });

    return {
      user,
      characters
    };
  }

  /**
   * Create a new user
   */
  async createUser(data: any): Promise<User> {
    return this.prisma.user.create({
      data
    });
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, data: any): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  /**
   * Sync user data with Discord
   * @param userId User ID
   */
  async syncWithDiscord(userId: string): Promise<User | null> {
    const user = await this.getUserById(userId);
    if (!user || !user.discord_id) {
      return null;
    }

    // TODO: Use Discord client to fetch user data
    // const discordUser = await this.discordClient.getUser(user.discord_id);
    // Update user with Discord data
    // return this.updateUser(userId, {
    //   name: discordUser.username,
    //   image: discordUser.avatar_url,
    //   // other Discord fields
    // });

    return user; // Placeholder until Discord integration is implemented
  }

  /**
   * Sync user data with WorldAnvil
   * @param userId User ID
   */
  async syncWithWorldAnvil(userId: string): Promise<User | null> {
    const user = await this.getUserById(userId);
    if (!user || !user.worldanvil_id) {
      return null;
    }

    // TODO: Use WorldAnvil client to fetch user data
    // const worldAnvilUser = await this.worldAnvilClient.getUser(user.worldanvil_id);
    // Update user with WorldAnvil data
    // return this.updateUser(userId, {
    //   name: worldAnvilUser.name,
    //   // other WorldAnvil fields
    // });

    return user; // Placeholder until WorldAnvil integration is implemented
  }

  /**
   * Validate Discord ID exists
   * @param discordId Discord user ID
   */
  async validateDiscordId(discordId: string): Promise<boolean> {
    try {
      // TODO: Use Discord client to validate user exists
      // await this.discordClient.getUser(discordId);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate WorldAnvil ID exists
   * @param worldAnvilId WorldAnvil user ID
   */
  async validateWorldAnvilId(worldAnvilId: string): Promise<boolean> {
    try {
      // TODO: Use WorldAnvil client to validate user exists
      // await this.worldAnvilClient.getUser(worldAnvilId);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate AI-powered user profile content
   * @param userId User ID
   * @param contentType Type of content to generate
   */
  async generateAIContent(userId: string, contentType: 'bio' | 'personality' | 'preferences'): Promise<string> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // TODO: Use OpenAI client to generate content
    // const prompt = `Generate ${contentType} for user: ${user.name || 'Anonymous User'}`;
    // const response = await this.openAiClient.generateText(prompt);
    // return response.text;

    return `AI-generated ${contentType} for ${user.name || 'user'} (not implemented yet)`;
  }

  /**
   * Analyze user activity patterns with AI
   * @param userId User ID
   */
  async analyzeUserActivity(userId: string): Promise<string> {
    const userData = await this.getUserData(userId);
    if (!userData.user) {
      throw new Error('User not found');
    }

    // TODO: Use OpenAI client to analyze user patterns
    // const prompt = `Analyze activity patterns for user with ${userData.characters?.length || 0} characters`;
    // const response = await this.openAiClient.generateText(prompt);
    // return response.text;

    return `AI analysis for user activity (not implemented yet)`;
  }
}
