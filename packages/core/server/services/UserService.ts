import { User } from '@prisma/client';
import { DatabaseClient } from '../clients/DatabaseClient';

/**
 * User service for managing users
 */
export class UserService {
  /**
   * Creates a new User service
   * @param database Database client instance
   */
  constructor(private database: DatabaseClient) {}

  /**
   * Fetch user data by ID (which could be a database ID or a Discord ID or WorldAnvil ID)
   */
  async getUserById(userId: string): Promise<User | null> {
    // Try to get user directly by ID
    let user = await this.database.client.user.findUnique({
      where: { id: userId }
    });

    // If not found, try to find by Discord ID
    if (!user) {
      user = await this.database.client.user.findFirst({
        where: { discord_id: userId }
      });
    }

    // If still not found, try to find by WorldAnvil ID
    if (!user) {
      user = await this.database.client.user.findFirst({
        where: { worldanvil_id: userId }
      });
    }

    return user;
  }

  /**
   * Fetch user data by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.database.client.user.findUnique({
      where: { email }
    });
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
    const characters = await this.database.client.rpgCharacter.findMany({
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
    return this.database.client.user.create({
      data
    });
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, data: any): Promise<User> {
    return this.database.client.user.update({
      where: { id },
      data
    });
  }
}
