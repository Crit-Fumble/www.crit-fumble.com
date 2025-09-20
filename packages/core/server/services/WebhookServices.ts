/**
 * Lightweight services for Discord webhook interactions
 * These provide simplified interfaces without heavy Discord.js client dependencies
 */

import { PrismaClient } from '@prisma/client';

/**
 * Lightweight campaign service for Discord interactions
 * Provides essential campaign operations without full service dependencies
 */
export class WebhookCampaignService {
  constructor(private prisma: PrismaClient) {}

  async create(data: any) {
    return this.prisma.rpgCampaign.create({ data });
  }

  async getByGmId(gmId: string) {
    return this.prisma.rpgCampaign.findMany({
      where: {
        gm_ids: {
          has: gmId
        }
      }
    });
  }

  async getById(id: string) {
    return this.prisma.rpgCampaign.findUnique({
      where: { id }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.rpgCampaign.update({
      where: { id },
      data
    });
  }
}

/**
 * Lightweight sheet service for Discord interactions
 * Provides essential sheet operations without full service dependencies
 */
export class WebhookSheetService {
  constructor(private prisma: PrismaClient) {}

  async createSheet(input: any) {
    const data = {
      title: input.title,
      summary: input.summary,
      data: input.data ? JSON.stringify(input.data) : undefined,
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true
    };
    return this.prisma.rpgSheet.create({ data });
  }

  async getAll() {
    return this.prisma.rpgSheet.findMany();
  }

  async getById(id: string) {
    return this.prisma.rpgSheet.findUnique({
      where: { id }
    });
  }

  async getByUserId(userId: string) {
    const sheets = await this.getAll();
    return sheets.filter(sheet => {
      try {
        const data = sheet.data ? JSON.parse(sheet.data as string) : {};
        return data.user_id === userId;
      } catch {
        return false;
      }
    });
  }

  async update(id: string, input: any) {
    const updateData: any = {
      updated_at: new Date()
    };
    
    if (input.title) updateData.title = input.title;
    if (input.summary) updateData.summary = input.summary;
    if (input.data) updateData.data = JSON.stringify(input.data);
    if (input.is_active !== undefined) updateData.is_active = input.is_active;

    return this.prisma.rpgSheet.update({
      where: { id },
      data: updateData
    });
  }
}

/**
 * Lightweight user service for Discord interactions
 * Provides essential user operations without full service dependencies
 */
export class WebhookUserService {
  constructor(private prisma: PrismaClient) {}

  async getUserById(userId: string) {
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

    return user;
  }

  async getUserByDiscordId(discordId: string) {
    return this.prisma.user.findFirst({
      where: { discord_id: discordId }
    });
  }

  async createUser(data: any) {
    return this.prisma.user.create({ data });
  }

  async updateUser(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  async linkDiscordAccount(userId: string, discordData: any) {
    return this.updateUser(userId, {
      discord_id: discordData.id,
      data: {
        discord: discordData
      }
    });
  }
}