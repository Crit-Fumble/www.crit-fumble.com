/**
 * Site Admin Protection Middleware
 * 
 * This module provides security safeguards to ensure that Discord permissions
 * can never be used to gain site-wide administrative access.
 * 
 * SECURITY PRINCIPLE: Complete isolation between Discord and site permissions
 */

import { 
  WebAdminContext, 
  DiscordServerContext,
  WebAdminOperation 
} from '../../models/permissions/PermissionModels';
import { PermissionService } from './PermissionService';

export class SiteAdminProtection {
  private permissionService: PermissionService;

  constructor() {
    this.permissionService = new PermissionService();
  }

  /**
   * SECURITY GUARD: Validate web admin operations
   * This method ensures only properly authenticated web admins can perform 
   * site-wide administrative actions
   * 
   * @param userId Site user ID
   * @param operation Web admin operation being attempted
   * @param userAdminStatus Admin status from database (NOT Discord)
   * @returns Validation result
   */
  validateWebAdminOperation(
    userId: string,
    operation: WebAdminOperation,
    userAdminStatus: boolean
  ): { allowed: boolean; reason?: string; securityNote?: string } {
    
    // Create web admin permission context (no Discord data involved)
    const webContext = this.permissionService.createWebAdminContext(userId, userAdminStatus);
    
    // Validate using web admin permissions only
    const result = this.permissionService.validateWebAdminPermission(webContext, operation);
    
    if (!result.allowed) {
      return {
        allowed: false,
        reason: result.reason,
        securityNote: 'Web admin operations require explicit web admin privileges'
      };
    }

    // Additional security check for sensitive operations
    if (operation === WebAdminOperation.WEB_ADMINISTRATION) {
      if (!userAdminStatus) {
        return {
          allowed: false,
          reason: 'Web administration requires explicit web admin flag in database',
          securityNote: 'This operation cannot be granted through Discord permissions'
        };
      }
    }

    return { allowed: true };
  }

  /**
   * SECURITY GUARD: Explicitly prevent Discord context from granting web admin access
   * This method exists as a security boundary and always returns false
   * 
   * @param discordContext Discord server permission context
   * @param webOperation Web admin operation being attempted
   * @returns Always false - Discord permissions never grant web admin access
   */
  canDiscordPermissionsGrantWebAccess(
    discordContext: DiscordServerContext, 
    webOperation: WebAdminOperation
  ): false {
    // Log potential security violation attempt
    console.warn(`SECURITY: Attempt to use Discord permissions for web operation`, {
      discordUserId: discordContext.discordUserId,
      guildId: discordContext.guildId,
      webOperation,
      isGuildAdmin: discordContext.isGuildAdmin,
      timestamp: new Date().toISOString()
    });

    // SECURITY: Discord permissions can NEVER grant web admin access
    return false;
  }

  /**
   * SECURITY AUDIT: Log admin permission usage
   * This method logs all admin permission checks for security auditing
   */
  auditAdminPermissionUsage(
    userId: string,
    operation: string,
    granted: boolean,
    source: 'site' | 'discord',
    metadata?: any
  ): void {
    const auditLog = {
      timestamp: new Date().toISOString(),
      userId,
      operation,
      granted,
      permissionSource: source,
      metadata: {
        ...metadata,
        securityNote: source === 'discord' 
          ? 'Discord permissions should never grant site admin access'
          : 'Site permissions validated through database admin flag'
      }
    };

    console.log(`SECURITY AUDIT: Admin permission check`, auditLog);
    
    // In production, this should be sent to a security logging service
    // await securityLogger.log(auditLog);
  }

  /**
   * Get security boundaries documentation
   * Returns the current security model for permission isolation
   */
  getSecurityBoundaries(): {
    discord: string[];
    site: string[];
    isolation: string[];
  } {
    return {
      discord: [
        'Discord permissions only apply to Discord bot operations',
        'Discord admin status grants Discord server management only',
        'Discord permissions cannot access site database or user data',
        'Discord operations are limited to Discord API interactions'
      ],
      site: [
        'Site admin requires explicit database admin flag',
        'Site permissions control access to application features',
        'Site admin can manage users, campaigns, and site configuration',
        'Site permissions are independent of Discord server roles'
      ],
      isolation: [
        'Complete separation between Discord and site permission systems',
        'No automatic promotion from Discord admin to site admin',
        'All admin operations require explicit permission validation',
        'Security auditing logs all admin permission attempts'
      ]
    };
  }
}