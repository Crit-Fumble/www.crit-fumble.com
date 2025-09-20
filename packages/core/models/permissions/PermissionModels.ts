/**
 * Permission Models for Crit-Fumble
 * 
 * CRITICAL DISTINCTION:
 * - WEB ADMIN: Site-wide administrative access (you + ~3 trusted users)
 * - DISCORD SERVER ADMIN: Can manage bot operations on Discord servers they own/admin
 * 
 * These are COMPLETELY SEPARATE permission domains that never overlap.
 */

/**
 * WEB ADMIN PERMISSIONS
 * These control site-wide administrative access and should be granted
 * only to trusted individuals (manually set in database).
 */
export enum WebAdminPermission {
  /** Basic user account access */
  USER = 'user',
  /** Can manage campaigns they own */
  CAMPAIGN_OWNER = 'campaign_owner',
  /** Can moderate content and users */
  MODERATOR = 'moderator',
  /** FULL SITE ADMINISTRATION - Only for trusted web admins */
  WEB_ADMIN = 'web_admin'
}

/**
 * DISCORD SERVER PERMISSIONS
 * These only apply to Discord bot operations within specific Discord servers.
 * Users can be "Discord admins" on servers they own/manage without any
 * site-wide administrative privileges.
 */
export enum DiscordServerPermission {
  /** Can use basic Discord bot commands */
  DISCORD_USER = 'discord_user',
  /** Can manage Discord events in campaigns they participate in */
  DISCORD_CAMPAIGN_MEMBER = 'discord_campaign_member',
  /** Can manage Discord bot settings for servers they admin */
  DISCORD_SERVER_ADMIN = 'discord_server_admin'
}

/**
 * WEB ADMIN CONTEXT
 * Used for site-wide operations - completely separate from Discord
 */
export interface WebAdminContext {
  /** Site user ID */
  userId: string;
  /** Web permission level */
  webPermission: WebAdminPermission;
  /** Whether user is web admin (from database admin flag) */
  isWebAdmin: boolean;
}

/**
 * DISCORD SERVER CONTEXT
 * Used only for Discord bot operations within specific servers
 */
export interface DiscordServerContext {
  /** Discord user ID */
  discordUserId: string;
  /** Discord guild/server ID */
  guildId: string;
  /** User's permissions in this specific Discord server */
  guildPermissions: string[];
  /** Whether user is admin in this Discord server */
  isGuildAdmin: boolean;
  /** Whether user owns this Discord server */
  isGuildOwner: boolean;
}

/**
 * Permission validation result
 */
export interface PermissionResult {
  /** Whether the operation is allowed */
  allowed: boolean;
  /** Reason for denial (if not allowed) */
  reason?: string;
  /** The permission level that granted access */
  grantedBy?: WebAdminPermission | DiscordServerPermission;
}

/**
 * Operations that require Discord server permissions only
 * These operations are scoped to specific Discord servers
 */
export enum DiscordServerOperation {
  USE_BASIC_COMMANDS = 'discord:use_basic_commands',
  CREATE_CAMPAIGN_EVENT = 'discord:create_campaign_event',
  MANAGE_CAMPAIGN_EVENTS = 'discord:manage_campaign_events',
  CONFIGURE_BOT_SETTINGS = 'discord:configure_bot_settings'
}

/**
 * Operations that require web admin permissions only
 * These operations affect the entire site/application
 */
export enum WebAdminOperation {
  VIEW_OWN_PROFILE = 'web:view_own_profile',
  EDIT_OWN_PROFILE = 'web:edit_own_profile',
  CREATE_CAMPAIGN = 'web:create_campaign',
  MANAGE_OWN_CAMPAIGN = 'web:manage_own_campaign',
  MODERATE_CONTENT = 'web:moderate_content',
  MANAGE_USERS = 'web:manage_users',
  WEB_ADMINISTRATION = 'web:administration'
}

/**
 * Permission requirements for operations
 * CLEAR SEPARATION: Discord operations vs Web admin operations
 */
export const PERMISSION_REQUIREMENTS = {
  // Discord server operations - require Discord server permissions only
  [DiscordServerOperation.USE_BASIC_COMMANDS]: [DiscordServerPermission.DISCORD_USER],
  [DiscordServerOperation.CREATE_CAMPAIGN_EVENT]: [DiscordServerPermission.DISCORD_CAMPAIGN_MEMBER],
  [DiscordServerOperation.MANAGE_CAMPAIGN_EVENTS]: [DiscordServerPermission.DISCORD_CAMPAIGN_MEMBER],
  [DiscordServerOperation.CONFIGURE_BOT_SETTINGS]: [DiscordServerPermission.DISCORD_SERVER_ADMIN],
  
  // Web admin operations - require web admin permissions only
  [WebAdminOperation.VIEW_OWN_PROFILE]: [WebAdminPermission.USER],
  [WebAdminOperation.EDIT_OWN_PROFILE]: [WebAdminPermission.USER],
  [WebAdminOperation.CREATE_CAMPAIGN]: [WebAdminPermission.USER],
  [WebAdminOperation.MANAGE_OWN_CAMPAIGN]: [WebAdminPermission.CAMPAIGN_OWNER],
  [WebAdminOperation.MODERATE_CONTENT]: [WebAdminPermission.MODERATOR],
  [WebAdminOperation.MANAGE_USERS]: [WebAdminPermission.MODERATOR],
  [WebAdminOperation.WEB_ADMINISTRATION]: [WebAdminPermission.WEB_ADMIN]
} as const;