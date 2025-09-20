/**
 * Permission Service for Crit-Fumble
 * 
 * This service validates permissions while maintaining ABSOLUTE separation
 * between Discord server permissions and web admin permissions.
 * 
 * SECURITY PRINCIPLE: 
 * - WEB ADMINS: Control the entire website (you + ~3 trusted users)
 * - DISCORD SERVER ADMINS: Control bot operations on their Discord servers only
 * 
 * These permission domains are COMPLETELY ISOLATED from each other.
 */

import { 
  WebAdminPermission, 
  DiscordServerPermission, 
  DiscordServerContext, 
  WebAdminContext,
  PermissionResult,
  DiscordServerOperation,
  WebAdminOperation,
  PERMISSION_REQUIREMENTS
} from '../../models/permissions/PermissionModels';

export class PermissionService {
  
  /**
   * Validate Discord server permissions
   * This method ONLY checks Discord server permissions for bot operations
   * and should NEVER be used to grant web admin access
   * 
   * @param context Discord server permission context
   * @param operation The Discord server operation being attempted
   * @returns Permission validation result
   */
  validateDiscordServerPermission(
    context: DiscordServerContext, 
    operation: DiscordServerOperation
  ): PermissionResult {
    const requiredPermissions = PERMISSION_REQUIREMENTS[operation];
    
    if (!requiredPermissions) {
      return { allowed: false, reason: 'Unknown Discord operation' };
    }

    // Check Discord server permissions based on operation
    for (const permission of requiredPermissions) {
      switch (permission) {
        case DiscordServerPermission.DISCORD_USER:
          // Basic Discord user - anyone in the server can use basic commands
          return { allowed: true, grantedBy: permission };
          
        case DiscordServerPermission.DISCORD_CAMPAIGN_MEMBER:
          // Can manage campaign events - check if user has manage events permission
          if (this.hasDiscordServerPermission(context, 'MANAGE_EVENTS') || 
              this.hasDiscordServerPermission(context, 'ADMINISTRATOR')) {
            return { allowed: true, grantedBy: permission };
          }
          break;
          
        case DiscordServerPermission.DISCORD_SERVER_ADMIN:
          // Discord server admin - check administrator permission in THIS server
          if (context.isGuildOwner || context.isGuildAdmin || 
              this.hasDiscordServerPermission(context, 'ADMINISTRATOR')) {
            return { allowed: true, grantedBy: permission };
          }
          break;
      }
    }

    return { 
      allowed: false, 
      reason: `Insufficient Discord server permissions for ${operation} in server ${context.guildId}` 
    };
  }

  /**
   * Validate web admin permissions
   * This method checks web admin permissions and is completely separate from Discord
   * 
   * @param context Web admin permission context
   * @param operation The web admin operation being attempted
   * @returns Permission validation result
   */
  validateWebAdminPermission(
    context: WebAdminContext, 
    operation: WebAdminOperation
  ): PermissionResult {
    const requiredPermissions = PERMISSION_REQUIREMENTS[operation];
    
    if (!requiredPermissions) {
      return { allowed: false, reason: 'Unknown web operation' };
    }

    // Check web admin permissions based on operation
    for (const permission of requiredPermissions) {
      if (this.hasWebAdminPermission(context, permission)) {
        return { allowed: true, grantedBy: permission };
      }
    }

    return { 
      allowed: false, 
      reason: `Insufficient web admin permissions for ${operation}` 
    };
  }

  /**
   * Check if user has specific Discord server permission
   * @param context Discord server context
   * @param permission Discord permission string
   */
  private hasDiscordServerPermission(context: DiscordServerContext, permission: string): boolean {
    return context.guildPermissions.includes(permission);
  }

  /**
   * Check if user has web admin permission level
   * @param context Web admin context
   * @param requiredPermission Required permission level
   */
  private hasWebAdminPermission(context: WebAdminContext, requiredPermission: WebAdminPermission): boolean {
    const permissionHierarchy = {
      [WebAdminPermission.USER]: 1,
      [WebAdminPermission.CAMPAIGN_OWNER]: 2,
      [WebAdminPermission.MODERATOR]: 3,
      [WebAdminPermission.WEB_ADMIN]: 4
    };

    const userLevel = permissionHierarchy[context.webPermission];
    const requiredLevel = permissionHierarchy[requiredPermission];

    return userLevel >= requiredLevel;
  }

  /**
   * SECURITY GUARD: Ensure Discord context never grants web admin access
   * This method exists as an explicit security boundary
   * 
   * @param discordContext Discord server permission context
   * @returns Always false - Discord permissions never grant web admin access
   */
  canDiscordServerContextGrantWebAdmin(discordContext: DiscordServerContext): false {
    // SECURITY: Discord server permissions can NEVER grant web admin access
    // This method intentionally always returns false as a security guard
    
    // Log potential security violation attempt
    console.warn(`SECURITY VIOLATION ATTEMPT: Trying to use Discord server permissions for web admin access`, {
      discordUserId: discordContext.discordUserId,
      guildId: discordContext.guildId,
      isGuildAdmin: discordContext.isGuildAdmin,
      timestamp: new Date().toISOString(),
      violationType: 'discord_to_web_escalation'
    });
    
    return false;
  }

  /**
   * Generate safe permission context for Discord server operations
   * This ensures Discord operations can only access Discord-scoped permissions
   * 
   * @param discordUserId Discord user ID
   * @param guildId Discord guild ID
   * @param guildPermissions User's Discord permissions in this server
   * @param isGuildAdmin Whether user is Discord guild admin in this server
   * @param isGuildOwner Whether user is Discord guild owner
   */
  createDiscordServerContext(
    discordUserId: string,
    guildId: string,
    guildPermissions: string[],
    isGuildAdmin: boolean = false,
    isGuildOwner: boolean = false
  ): DiscordServerContext {
    return {
      discordUserId,
      guildId,
      guildPermissions,
      isGuildAdmin,
      isGuildOwner
    };
  }

  /**
   * Generate safe permission context for web admin operations
   * This ensures web operations use proper web admin permission levels
   * 
   * @param userId Site user ID
   * @param isWebAdmin Whether user is web admin (from database admin flag)
   */
  createWebAdminContext(userId: string, isWebAdmin: boolean): WebAdminContext {
    return {
      userId,
      webPermission: isWebAdmin ? WebAdminPermission.WEB_ADMIN : WebAdminPermission.USER,
      isWebAdmin
    };
  }
}