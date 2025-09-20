/**
 * User Management Service
 * 
 * Provides administrative functions for managing user accounts.
 * This service is intended for admin use only and provides full CRUD
 * operations on user accounts.
 */

import { PrismaClient, User } from '@prisma/client';

export interface UserCreateInput {
  id?: string;
  discord_id?: string;
  worldanvil_id?: string;
  name?: string;
  slug?: string;
  email?: string;
  admin?: boolean;
  data?: any;
}

export interface UserUpdateInput {
  discord_id?: string;
  worldanvil_id?: string;
  name?: string;
  slug?: string;
  email?: string;
  admin?: boolean;
  data?: any;
}

export interface UserFilter {
  search?: string;
  admin?: boolean;
  hasDiscord?: boolean;
  hasWorldAnvil?: boolean;
  limit?: number;
  offset?: number;
}

export interface UserListResult {
  users: User[];
  total: number;
  hasMore: boolean;
}

export class UserManagementService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  /**
   * Get a paginated list of users with filtering
   */
  async listUsers(filter: UserFilter = {}): Promise<UserListResult> {
    const {
      search,
      admin,
      hasDiscord,
      hasWorldAnvil,
      limit = 50,
      offset = 0
    } = filter;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { id: { contains: search } },
        { discord_id: { contains: search } },
        { worldanvil_id: { contains: search } }
      ];
    }

    if (admin !== undefined) {
      where.admin = admin;
    }

    if (hasDiscord !== undefined) {
      if (hasDiscord) {
        where.discord_id = { not: null };
      } else {
        where.discord_id = null;
      }
    }

    if (hasWorldAnvil !== undefined) {
      if (hasWorldAnvil) {
        where.worldanvil_id = { not: null };
      } else {
        where.worldanvil_id = null;
      }
    }

    // Get total count and users
    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      })
    ]);

    return {
      users,
      total,
      hasMore: offset + limit < total
    };
  }

  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id }
    });
  }

  /**
   * Create a new user
   */
  async createUser(input: UserCreateInput): Promise<User> {
    const userData: any = {
      name: input.name,
      slug: input.slug,
      email: input.email,
      discord_id: input.discord_id,
      worldanvil_id: input.worldanvil_id,
      admin: input.admin || false,
      data: input.data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // If ID is provided, use it, otherwise let Prisma generate one
    if (input.id) {
      userData.id = input.id;
    }

    return await this.prisma.user.create({
      data: userData
    });
  }

  /**
   * Update a user
   */
  async updateUser(id: string, input: UserUpdateInput): Promise<User> {
    const updateData: any = {
      ...input,
      updatedAt: new Date()
    };

    return await this.prisma.user.update({
      where: { id },
      data: updateData
    });
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { id }
    });
  }

  /**
   * Get user suggestions for autocomplete
   */
  async getUserSuggestions(query: string, limit: number = 10): Promise<Array<{
    id: string;
    label: string;
    value: string;
  }>> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
          { id: { contains: query } }
        ]
      },
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        slug: true
      }
    });

    return users.map(user => ({
      id: user.id,
      label: `${user.name || 'Unnamed'} (${user.email || user.slug || user.id})`,
      value: user.id
    }));
  }

  /**
   * Check if email is already in use
   */
  async isEmailTaken(email: string, excludeUserId?: string): Promise<boolean> {
    const where: any = { email };
    
    if (excludeUserId) {
      where.id = { not: excludeUserId };
    }

    const user = await this.prisma.user.findFirst({ where });
    return !!user;
  }

  /**
   * Check if slug is already in use
   */
  async isSlugTaken(slug: string, excludeUserId?: string): Promise<boolean> {
    const where: any = { slug };
    
    if (excludeUserId) {
      where.id = { not: excludeUserId };
    }

    const user = await this.prisma.user.findFirst({ where });
    return !!user;
  }

  /**
   * Get admin users
   */
  async getAdminUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: { admin: true },
      orderBy: { createdAt: 'asc' }
    });
  }

  /**
   * Bulk update users
   */
  async bulkUpdateUsers(updates: Array<{ id: string; data: UserUpdateInput }>): Promise<number> {
    let updated = 0;

    for (const update of updates) {
      try {
        await this.updateUser(update.id, update.data);
        updated++;
      } catch (error) {
        console.error(`Failed to update user ${update.id}:`, error);
      }
    }

    return updated;
  }
}