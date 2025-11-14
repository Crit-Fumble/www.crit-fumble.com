/**
 * Discord Guild Service
 * Handles Discord guild member information using bot token
 * This allows us to check user roles without requiring additional OAuth scopes
 */

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
  permissions: string;
}

export interface DiscordGuildMember {
  user?: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
  };
  nick?: string;
  roles: string[];
  joined_at: string;
  premium_since?: string;
  permissions?: string;
}

export interface DiscordGuildMemberWithRoles {
  member: DiscordGuildMember;
  roleDetails: DiscordRole[];
  isAdmin: boolean;
  isModerator: boolean;
}

export class DiscordGuildService {
  private readonly botToken: string;
  private readonly guildId: string;
  private readonly baseUrl = 'https://discord.com/api/v10';

  constructor(botToken: string, guildId: string) {
    this.botToken = botToken;
    this.guildId = guildId;
  }

  /**
   * Get guild member information including roles
   * Uses bot token to fetch data - doesn't require user OAuth permissions
   * @param userId Discord user ID
   * @returns Guild member with role details, or null if not a member
   */
  async getGuildMember(userId: string): Promise<DiscordGuildMemberWithRoles | null> {
    try {
      // Get member info
      const memberResponse = await fetch(
        `${this.baseUrl}/guilds/${this.guildId}/members/${userId}`,
        {
          headers: {
            'Authorization': `Bot ${this.botToken}`,
          },
        }
      );

      if (!memberResponse.ok) {
        if (memberResponse.status === 404) {
          return null; // User is not a member of the guild
        }
        throw new Error(`Failed to get guild member: ${memberResponse.status}`);
      }

      const member = await memberResponse.json() as DiscordGuildMember;

      // Get guild roles to resolve role details
      const rolesResponse = await fetch(
        `${this.baseUrl}/guilds/${this.guildId}/roles`,
        {
          headers: {
            'Authorization': `Bot ${this.botToken}`,
          },
        }
      );

      if (!rolesResponse.ok) {
        throw new Error(`Failed to get guild roles: ${rolesResponse.status}`);
      }

      const allRoles = await rolesResponse.json() as DiscordRole[];

      // Filter to only the roles this user has
      const userRoleDetails = allRoles.filter(role => member.roles.includes(role.id));

      // Check for admin/moderator status based on permissions
      const isAdmin = this.hasAdminPermissions(userRoleDetails);
      const isModerator = this.hasModeratorPermissions(userRoleDetails);

      return {
        member,
        roleDetails: userRoleDetails,
        isAdmin,
        isModerator,
      };

    } catch (error) {
      console.error('Error fetching guild member:', error);
      return null;
    }
  }

  /**
   * Check if user has admin permissions
   * @param roles User's roles
   * @returns True if user has admin permissions
   */
  private hasAdminPermissions(roles: DiscordRole[]): boolean {
    return roles.some(role => {
      const permissions = BigInt(role.permissions);
      const ADMINISTRATOR = BigInt(0x8);
      const MANAGE_GUILD = BigInt(0x20);
      return (permissions & ADMINISTRATOR) === ADMINISTRATOR || 
             (permissions & MANAGE_GUILD) === MANAGE_GUILD;
    });
  }

  /**
   * Check if user has moderator permissions
   * @param roles User's roles
   * @returns True if user has moderator permissions
   */
  private hasModeratorPermissions(roles: DiscordRole[]): boolean {
    return roles.some(role => {
      const permissions = BigInt(role.permissions);
      const MANAGE_MESSAGES = BigInt(0x2000);
      const MODERATE_MEMBERS = BigInt(0x10000000000);
      const KICK_MEMBERS = BigInt(0x2);
      const BAN_MEMBERS = BigInt(0x4);
      
      return (permissions & MANAGE_MESSAGES) === MANAGE_MESSAGES ||
             (permissions & MODERATE_MEMBERS) === MODERATE_MEMBERS ||
             (permissions & KICK_MEMBERS) === KICK_MEMBERS ||
             (permissions & BAN_MEMBERS) === BAN_MEMBERS;
    });
  }

  /**
   * Check if user is a member of the guild
   * @param userId Discord user ID
   * @returns True if user is a guild member
   */
  async isGuildMember(userId: string): Promise<boolean> {
    const member = await this.getGuildMember(userId);
    return member !== null;
  }

  /**
   * Get all roles for the guild (for reference)
   * @returns Array of all guild roles
   */
  async getGuildRoles(): Promise<DiscordRole[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/guilds/${this.guildId}/roles`,
        {
          headers: {
            'Authorization': `Bot ${this.botToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get guild roles: ${response.status}`);
      }

      return await response.json() as DiscordRole[];
    } catch (error) {
      console.error('Error fetching guild roles:', error);
      return [];
    }
  }
}