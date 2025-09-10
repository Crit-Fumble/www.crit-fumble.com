/**
 * Discord Guild Service
 * Service for managing Discord server/guild settings and operations
 */

import { IDiscordClient } from '../../models/DiscordClientInterface';
import { DiscordApiClient } from '../clients/DiscordApiClient';
import { getDiscordConfig } from '../configs/config';

/**
 * Guild member structure
 */
export interface GuildMember {
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  nick?: string;
  roles: string[];
  joined_at: string;
  premium_since?: string;
  deaf: boolean;
  mute: boolean;
}

/**
 * Guild structure
 */
export interface Guild {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  owner_id: string;
  roles: any[];
  channels?: any[];
}

export class DiscordGuildService {
  private client: DiscordApiClient;
  private botToken: string;

  /**
   * Initialize Discord Guild Service
   * @param customClient Optional custom Discord client for testing
   */
  constructor(customClient?: IDiscordClient) {
    try {
      const config = getDiscordConfig();
      this.botToken = config.botToken;
    } catch (e) {
      this.botToken = '';
    }
    
    this.client = new DiscordApiClient({
      botToken: this.botToken
    }, customClient);
  }

  /**
   * Initialize the guild service
   */
  async initialize(): Promise<void> {
    await this.client.initialize();
  }

  /**
   * Get guild information by ID
   * @param guildId Discord guild ID
   */
  async getGuild(guildId: string): Promise<Guild | null> {
    try {
      if (!this.botToken) {
        throw new Error('Bot token not configured');
      }
      
      const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
        headers: {
          Authorization: `Bot ${this.botToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch guild: ${await response.text()}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching guild:', error);
      return null;
    }
  }

  /**
   * Get guild members
   * @param guildId Discord guild ID
   * @param limit Maximum number of members to retrieve (max: 1000)
   */
  async getGuildMembers(guildId: string, limit = 100): Promise<GuildMember[]> {
    try {
      if (!this.botToken) {
        throw new Error('Bot token not configured');
      }
      
      const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=${limit}`, {
        headers: {
          Authorization: `Bot ${this.botToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch guild members: ${await response.text()}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching guild members:', error);
      return [];
    }
  }

  /**
   * Get guild member by ID
   * @param guildId Discord guild ID
   * @param userId Discord user ID
   */
  async getGuildMember(guildId: string, userId: string): Promise<GuildMember | null> {
    try {
      if (!this.botToken) {
        throw new Error('Bot token not configured');
      }
      
      const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
        headers: {
          Authorization: `Bot ${this.botToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch guild member: ${await response.text()}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching guild member:', error);
      return null;
    }
  }

  /**
   * Update guild member settings
   * @param guildId Discord guild ID
   * @param userId User ID to update
   * @param data Update data
   */
  async updateGuildMember(guildId: string, userId: string, data: {
    nick?: string;
    roles?: string[];
    mute?: boolean;
    deaf?: boolean;
  }): Promise<boolean> {
    try {
      if (!this.botToken) {
        throw new Error('Bot token not configured');
      }
      
      const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bot ${this.botToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error updating guild member:', error);
      return false;
    }
  }

  /**
   * Add role to guild member
   * @param guildId Discord guild ID
   * @param userId User ID
   * @param roleId Role ID to add
   */
  async addGuildMemberRole(guildId: string, userId: string, roleId: string): Promise<boolean> {
    try {
      if (!this.botToken) {
        throw new Error('Bot token not configured');
      }
      
      const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${this.botToken}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error adding role to guild member:', error);
      return false;
    }
  }

  /**
   * Remove role from guild member
   * @param guildId Discord guild ID
   * @param userId User ID
   * @param roleId Role ID to remove
   */
  async removeGuildMemberRole(guildId: string, userId: string, roleId: string): Promise<boolean> {
    try {
      if (!this.botToken) {
        throw new Error('Bot token not configured');
      }
      
      const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bot ${this.botToken}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error removing role from guild member:', error);
      return false;
    }
  }

  /**
   * Get guild roles
   * @param guildId Discord guild ID
   */
  async getGuildRoles(guildId: string): Promise<any[]> {
    try {
      if (!this.botToken) {
        throw new Error('Bot token not configured');
      }
      
      const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
        headers: {
          Authorization: `Bot ${this.botToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch guild roles: ${await response.text()}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching guild roles:', error);
      return [];
    }
  }
}
