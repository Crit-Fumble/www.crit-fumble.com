/**
 * PermissionService Unit Tests
 * 
 * Tests for the new WebAdmin vs DiscordServer permission separation
 * with comprehensive coverage of all permission validation scenarios.
 */

import { jest } from '@jest/globals';
import { PermissionService } from '@crit-fumble/core/server/services/PermissionService';
import {
  WebAdminPermission,
  DiscordServerPermission,
  DiscordServerOperation,
  WebAdminOperation,
  WebAdminContext,
  DiscordServerContext,
} from '@crit-fumble/core/models/permissions/PermissionModels';

describe('PermissionService', () => {
  let permissionService: PermissionService;

  beforeEach(() => {
    permissionService = new PermissionService();
    jest.clearAllMocks();
  });

  describe('validateDiscordServerPermission', () => {
    const mockDiscordContext: DiscordServerContext = {
      discordUserId: 'discord-user-123',
      guildId: 'guild-456',
      guildPermissions: ['MANAGE_EVENTS', 'ADMINISTRATOR'],
      isGuildAdmin: true,
      isGuildOwner: false,
    };

    it('should allow basic Discord commands for any Discord user', () => {
      // Arrange
      const basicUserContext: DiscordServerContext = {
        ...mockDiscordContext,
        guildPermissions: [],
        isGuildAdmin: false,
      };

      // Act
      const result = permissionService.validateDiscordServerPermission(
        basicUserContext,
        DiscordServerOperation.USE_BASIC_COMMANDS
      );

      // Assert
      expect(result.allowed).toBe(true);
      expect(result.grantedBy).toBe(DiscordServerPermission.DISCORD_USER);
    });

    it('should allow campaign event creation for users with MANAGE_EVENTS permission', () => {
      // Arrange
      const campaignManagerContext: DiscordServerContext = {
        ...mockDiscordContext,
        guildPermissions: ['MANAGE_EVENTS'],
        isGuildAdmin: false,
      };

      // Act
      const result = permissionService.validateDiscordServerPermission(
        campaignManagerContext,
        DiscordServerOperation.CREATE_CAMPAIGN_EVENT
      );

      // Assert
      expect(result.allowed).toBe(true);
      expect(result.grantedBy).toBe(DiscordServerPermission.DISCORD_CAMPAIGN_MEMBER);
    });

    it('should allow campaign event creation for server administrators', () => {
      // Act
      const result = permissionService.validateDiscordServerPermission(
        mockDiscordContext,
        DiscordServerOperation.CREATE_CAMPAIGN_EVENT
      );

      // Assert
      expect(result.allowed).toBe(true);
      expect(result.grantedBy).toBe(DiscordServerPermission.DISCORD_CAMPAIGN_MEMBER);
    });

    it('should allow server administration for guild administrators', () => {
      // Act
      const result = permissionService.validateDiscordServerPermission(
        mockDiscordContext,
        DiscordServerOperation.MANAGE_SERVER_SETTINGS
      );

      // Assert
      expect(result.allowed).toBe(true);
      expect(result.grantedBy).toBe(DiscordServerPermission.DISCORD_SERVER_ADMIN);
    });

    it('should allow server administration for guild owners', () => {
      // Arrange
      const ownerContext: DiscordServerContext = {
        ...mockDiscordContext,
        isGuildOwner: true,
        isGuildAdmin: false,
        guildPermissions: [],
      };

      // Act
      const result = permissionService.validateDiscordServerPermission(
        ownerContext,
        DiscordServerOperation.CONFIGURE_BOT_SETTINGS
      );

      // Assert
      expect(result.allowed).toBe(true);
      expect(result.grantedBy).toBe(DiscordServerPermission.DISCORD_SERVER_ADMIN);
    });

    it('should deny operations for insufficient permissions', () => {
      // Arrange
      const basicUserContext: DiscordServerContext = {
        ...mockDiscordContext,
        guildPermissions: [],
        isGuildAdmin: false,
        isGuildOwner: false,
      };

      // Act
      const result = permissionService.validateDiscordServerPermission(
        basicUserContext,
        DiscordServerOperation.CONFIGURE_BOT_SETTINGS
      );

      // Assert
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Insufficient Discord server permissions');
      expect(result.reason).toContain('guild-456');
    });

    it('should handle unknown operations', () => {
      // Act
      const result = permissionService.validateDiscordServerPermission(
        mockDiscordContext,
        'UNKNOWN_OPERATION' as DiscordServerOperation
      );

      // Assert
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Unknown Discord operation');
    });
  });

  describe('validateWebAdminPermission', () => {
    const mockWebAdminContext: WebAdminContext = {
      userId: 'user-123',
      webPermission: WebAdminPermission.WEB_ADMIN,
      isWebAdmin: true,
    };

    it('should allow web administration for web admins', () => {
      // Act
      const result = permissionService.validateWebAdminPermission(
        mockWebAdminContext,
        WebAdminOperation.WEB_ADMINISTRATION
      );

      // Assert
      expect(result.allowed).toBe(true);
      expect(result.grantedBy).toBe(WebAdminPermission.WEB_ADMIN);
    });

    it('should allow user management for web admins', () => {
      // Act
      const result = permissionService.validateWebAdminPermission(
        mockWebAdminContext,
        WebAdminOperation.MANAGE_USERS
      );

      // Assert
      expect(result.allowed).toBe(true);
      expect(result.grantedBy).toBe(WebAdminPermission.WEB_ADMIN);
    });

    it('should allow campaign management for moderators', () => {
      // Arrange
      const moderatorContext: WebAdminContext = {
        ...mockWebAdminContext,
        webPermission: WebAdminPermission.MODERATOR,
        isWebAdmin: false,
      };

      // Act
      const result = permissionService.validateWebAdminPermission(
        moderatorContext,
        WebAdminOperation.MODERATE_CONTENT
      );

      // Assert
      expect(result.allowed).toBe(true);
      expect(result.grantedBy).toBe(WebAdminPermission.MODERATOR);
    });

    it('should allow basic user operations for regular users', () => {
      // Arrange
      const userContext: WebAdminContext = {
        ...mockWebAdminContext,
        webPermission: WebAdminPermission.USER,
        isWebAdmin: false,
      };

      // Act
      const result = permissionService.validateWebAdminPermission(
        userContext,
        WebAdminOperation.EDIT_OWN_PROFILE
      );

      // Assert
      expect(result.allowed).toBe(true);
      expect(result.grantedBy).toBe(WebAdminPermission.USER);
    });

    it('should deny web admin operations for regular users', () => {
      // Arrange
      const userContext: WebAdminContext = {
        ...mockWebAdminContext,
        webPermission: WebAdminPermission.USER,
        isWebAdmin: false,
      };

      // Act
      const result = permissionService.validateWebAdminPermission(
        userContext,
        WebAdminOperation.WEB_ADMINISTRATION
      );

      // Assert
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Insufficient web admin permissions');
    });

    it('should handle unknown operations', () => {
      // Act
      const result = permissionService.validateWebAdminPermission(
        mockWebAdminContext,
        'UNKNOWN_OPERATION' as WebAdminOperation
      );

      // Assert
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Unknown web operation');
    });
  });

  describe('canDiscordServerContextGrantWebAdmin', () => {
    it('should always return false and log security violation', () => {
      // Arrange
      const discordContext: DiscordServerContext = {
        discordUserId: 'discord-user-123',
        guildId: 'guild-456',
        guildPermissions: ['ADMINISTRATOR'],
        isGuildAdmin: true,
        isGuildOwner: true,
      };

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      // Act
      const result = permissionService.canDiscordServerContextGrantWebAdmin(discordContext);

      // Assert
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('SECURITY VIOLATION ATTEMPT'),
        expect.objectContaining({
          discordUserId: 'discord-user-123',
          guildId: 'guild-456',
          isGuildAdmin: true,
          violationType: 'discord_to_web_escalation',
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('createDiscordServerContext', () => {
    it('should create valid Discord server context', () => {
      // Act
      const context = permissionService.createDiscordServerContext(
        'discord-user-123',
        'guild-456',
        ['ADMINISTRATOR', 'MANAGE_EVENTS'],
        true,
        false
      );

      // Assert
      expect(context).toEqual({
        discordUserId: 'discord-user-123',
        guildId: 'guild-456',
        guildPermissions: ['ADMINISTRATOR', 'MANAGE_EVENTS'],
        isGuildAdmin: true,
        isGuildOwner: false,
      });
    });

    it('should create context with default admin/owner values', () => {
      // Act
      const context = permissionService.createDiscordServerContext(
        'discord-user-123',
        'guild-456',
        ['MANAGE_EVENTS']
      );

      // Assert
      expect(context).toEqual({
        discordUserId: 'discord-user-123',
        guildId: 'guild-456',
        guildPermissions: ['MANAGE_EVENTS'],
        isGuildAdmin: false,
        isGuildOwner: false,
      });
    });
  });

  describe('createWebAdminContext', () => {
    it('should create web admin context for admin user', () => {
      // Act
      const context = permissionService.createWebAdminContext('user-123', true);

      // Assert
      expect(context).toEqual({
        userId: 'user-123',
        webPermission: WebAdminPermission.WEB_ADMIN,
        isWebAdmin: true,
      });
    });

    it('should create regular user context for non-admin user', () => {
      // Act
      const context = permissionService.createWebAdminContext('user-123', false);

      // Assert
      expect(context).toEqual({
        userId: 'user-123',
        webPermission: WebAdminPermission.USER,
        isWebAdmin: false,
      });
    });
  });

  describe('Permission Hierarchy', () => {
    it('should respect web admin permission hierarchy', () => {
      // Test that higher permissions can perform lower-level operations
      const testCases = [
        {
          permission: WebAdminPermission.WEB_ADMIN,
          operation: WebAdminOperation.MANAGE_OWN_PROFILE,
          expected: true,
        },
        {
          permission: WebAdminPermission.MODERATOR,
          operation: WebAdminOperation.MANAGE_OWN_PROFILE,
          expected: true,
        },
        {
          permission: WebAdminPermission.CAMPAIGN_OWNER,
          operation: WebAdminOperation.MANAGE_OWN_PROFILE,
          expected: true,
        },
        {
          permission: WebAdminPermission.USER,
          operation: WebAdminOperation.MODERATE_CONTENT,
          expected: false,
        },
      ];

      testCases.forEach(({ permission, operation, expected }) => {
        const context: WebAdminContext = {
          userId: 'test-user',
          webPermission: permission,
          isWebAdmin: permission === WebAdminPermission.WEB_ADMIN,
        };

        const result = permissionService.validateWebAdminPermission(context, operation);
        expect(result.allowed).toBe(expected);
      });
    });
  });
});