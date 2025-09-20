/**
 * SiteAdminProtection Unit Tests
 * 
 * Tests for the web admin protection service with the new naming
 * and comprehensive security boundary validation.
 */

import { jest } from '@jest/globals';
import { SiteAdminProtection } from '../../../packages/core/server/services/SiteAdminProtection';
import { PermissionService } from '../../../packages/core/server/services/PermissionService';
import {
  WebAdminOperation,
  WebAdminContext,
  DiscordServerContext,
  WebAdminPermission,
  PermissionResult,
} from '../../../packages/core/models/permissions/PermissionModels';

// Mock PermissionService
const mockPermissionService = {
  validateWebAdminPermission: jest.fn(),
  createWebAdminContext: jest.fn(),
  canDiscordServerContextGrantWebAdmin: jest.fn().mockReturnValue(false),
} as unknown as PermissionService;

jest.mock('@crit-fumble/core/server/services/PermissionService', () => ({
  PermissionService: jest.fn(() => mockPermissionService),
}));

describe('SiteAdminProtection', () => {
  let siteAdminProtection: SiteAdminProtection;

  beforeEach(() => {
    siteAdminProtection = new SiteAdminProtection();
    jest.clearAllMocks();
  });

  describe('validateWebAdminOperation', () => {
    const mockWebAdminContext: WebAdminContext = {
      userId: 'user-123',
      webPermission: WebAdminPermission.WEB_ADMIN,
      isWebAdmin: true,
    };

    beforeEach(() => {
      (mockPermissionService.createWebAdminContext as jest.Mock).mockReturnValue(mockWebAdminContext);
    });

    it('should allow operation when user has sufficient permissions', () => {
      // Arrange
      const mockResult: PermissionResult = {
        allowed: true,
        grantedBy: WebAdminPermission.WEB_ADMIN,
      };
      (mockPermissionService.validateWebAdminPermission as jest.Mock).mockReturnValue(mockResult);

      // Act
      const result = siteAdminProtection.validateWebAdminOperation(
        'user-123',
        WebAdminOperation.MANAGE_USERS,
        true
      );

      // Assert
      expect(result.allowed).toBe(true);
      expect(mockPermissionService.createWebAdminContext).toHaveBeenCalledWith('user-123', true);
      expect(mockPermissionService.validateWebAdminPermission).toHaveBeenCalledWith(
        mockWebAdminContext,
        WebAdminOperation.MANAGE_USERS
      );
    });

    it('should deny operation when user has insufficient permissions', () => {
      // Arrange
      const mockResult: PermissionResult = {
        allowed: false,
        reason: 'Insufficient web admin permissions for MANAGE_USERS',
      };
      (mockPermissionService.validateWebAdminPermission as jest.Mock).mockReturnValue(mockResult);

      // Act
      const result = siteAdminProtection.validateWebAdminOperation(
        'user-123',
        WebAdminOperation.MANAGE_USERS,
        false
      );

      // Assert
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Insufficient web admin permissions for MANAGE_USERS');
      expect(result.securityNote).toBe('Web admin operations require explicit web admin privileges');
    });

    it('should perform additional check for WEB_ADMINISTRATION operation', () => {
      // Arrange
      const mockResult: PermissionResult = {
        allowed: true,
        grantedBy: WebAdminPermission.WEB_ADMIN,
      };
      (mockPermissionService.validateWebAdminPermission as jest.Mock).mockReturnValue(mockResult);

      // Act
      const result = siteAdminProtection.validateWebAdminOperation(
        'user-123',
        WebAdminOperation.WEB_ADMINISTRATION,
        true
      );

      // Assert
      expect(result.allowed).toBe(true);
    });

    it('should deny WEB_ADMINISTRATION when user admin status is false', () => {
      // Arrange
      const mockResult: PermissionResult = {
        allowed: true,
        grantedBy: WebAdminPermission.WEB_ADMIN,
      };
      (mockPermissionService.validateWebAdminPermission as jest.Mock).mockReturnValue(mockResult);

      // Act
      const result = siteAdminProtection.validateWebAdminOperation(
        'user-123',
        WebAdminOperation.WEB_ADMINISTRATION,
        false // userAdminStatus is false
      );

      // Assert
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Web administration requires explicit web admin flag in database');
      expect(result.securityNote).toBe('This operation cannot be granted through Discord permissions');
    });

    it('should create web admin context with user admin status', () => {
      // Arrange
      const mockResult: PermissionResult = {
        allowed: true,
        grantedBy: WebAdminPermission.WEB_ADMIN,
      };
      (mockPermissionService.validateWebAdminPermission as jest.Mock).mockReturnValue(mockResult);

      // Act
      siteAdminProtection.validateWebAdminOperation(
        'user-456',
        WebAdminOperation.MODERATE_CONTENT,
        false
      );

      // Assert
      expect(mockPermissionService.createWebAdminContext).toHaveBeenCalledWith('user-456', false);
    });
  });

  describe('canDiscordPermissionsGrantWebAccess', () => {
    const mockDiscordContext: DiscordServerContext = {
      discordUserId: 'discord-user-123',
      guildId: 'guild-456',
      guildPermissions: ['ADMINISTRATOR'],
      isGuildAdmin: true,
      isGuildOwner: true,
    };

    it('should always return false and log security violation', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Act
      const result = siteAdminProtection.canDiscordPermissionsGrantWebAccess(
        mockDiscordContext,
        WebAdminOperation.WEB_ADMINISTRATION
      );

      // Assert
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('SECURITY: Attempt to use Discord permissions for web operation'),
        expect.objectContaining({
          discordUserId: 'discord-user-123',
          guildId: 'guild-456',
          webOperation: WebAdminOperation.WEB_ADMINISTRATION,
          isGuildAdmin: true,
        })
      );

      consoleSpy.mockRestore();
    });

    it('should return false even for guild owners', () => {
      // Arrange
      const ownerContext: DiscordServerContext = {
        ...mockDiscordContext,
        isGuildOwner: true,
        isGuildAdmin: false,
      };

      // Act
      const result = siteAdminProtection.canDiscordPermissionsGrantWebAccess(
        ownerContext,
        WebAdminOperation.MANAGE_USERS
      );

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for any web admin operation', () => {
      // Test multiple operations
      const operations = [
        WebAdminOperation.WEB_ADMINISTRATION,
        WebAdminOperation.MANAGE_USERS,
        WebAdminOperation.MODERATE_CONTENT,
        WebAdminOperation.MANAGE_OWN_PROFILE,
      ];

      operations.forEach(operation => {
        const result = siteAdminProtection.canDiscordPermissionsGrantWebAccess(
          mockDiscordContext,
          operation
        );
        expect(result).toBe(false);
      });
    });
  });

  describe('auditAdminPermissionUsage', () => {
    it('should log admin permission check with correct metadata', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      siteAdminProtection.auditAdminPermissionUsage(
        'user-123',
        'MANAGE_USERS',
        true,
        'site',
        { additionalInfo: 'test' }
      );

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        'SECURITY AUDIT: Admin permission check',
        expect.objectContaining({
          userId: 'user-123',
          operation: 'MANAGE_USERS',
          granted: true,
          permissionSource: 'site',
          metadata: expect.objectContaining({
            additionalInfo: 'test',
            securityNote: 'Site permissions validated through database admin flag',
          }),
        })
      );

      consoleSpy.mockRestore();
    });

    it('should log Discord permission attempt with security warning', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      siteAdminProtection.auditAdminPermissionUsage(
        'user-123',
        'MANAGE_USERS',
        false,
        'discord'
      );

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        'SECURITY AUDIT: Admin permission check',
        expect.objectContaining({
          userId: 'user-123',
          operation: 'MANAGE_USERS',
          granted: false,
          permissionSource: 'discord',
          metadata: expect.objectContaining({
            securityNote: 'Discord permissions should never grant site admin access',
          }),
        })
      );

      consoleSpy.mockRestore();
    });

    it('should include timestamp in audit log', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const beforeTime = new Date().toISOString();

      // Act
      siteAdminProtection.auditAdminPermissionUsage(
        'user-123',
        'MANAGE_USERS',
        true,
        'site'
      );

      const afterTime = new Date().toISOString();

      // Assert
      const logCall = consoleSpy.mock.calls[0];
      const logData = logCall[1];
      expect(logData.timestamp).toBeDefined();
      expect(logData.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(logData.timestamp).toBeLessThanOrEqual(afterTime);

      consoleSpy.mockRestore();
    });
  });

  describe('getSecurityBoundaries', () => {
    it('should return comprehensive security documentation', () => {
      // Act
      const boundaries = siteAdminProtection.getSecurityBoundaries();

      // Assert
      expect(boundaries).toHaveProperty('discord');
      expect(boundaries).toHaveProperty('site');
      expect(boundaries).toHaveProperty('isolation');

      expect(boundaries.discord).toBeInstanceOf(Array);
      expect(boundaries.site).toBeInstanceOf(Array);
      expect(boundaries.isolation).toBeInstanceOf(Array);

      // Check specific content
      expect(boundaries.discord).toContain(
        'Discord permissions only apply to Discord bot operations'
      );
      expect(boundaries.site).toContain(
        'Site admin requires explicit database admin flag'
      );
      expect(boundaries.isolation).toContain(
        'Complete separation between Discord and site permission systems'
      );
    });

    it('should provide security boundaries that reflect current architecture', () => {
      // Act
      const boundaries = siteAdminProtection.getSecurityBoundaries();

      // Assert - Test key security principles
      expect(boundaries.discord.some(rule => 
        rule.includes('Discord permissions cannot access site database')
      )).toBe(true);

      expect(boundaries.site.some(rule => 
        rule.includes('Site permissions are independent of Discord server roles')
      )).toBe(true);

      expect(boundaries.isolation.some(rule => 
        rule.includes('No automatic promotion from Discord admin to site admin')
      )).toBe(true);
    });
  });

  describe('Integration with PermissionService', () => {
    it('should call PermissionService methods with correct parameters', () => {
      // Arrange
      const mockResult: PermissionResult = {
        allowed: true,
        grantedBy: WebAdminPermission.WEB_ADMIN,
      };
      (mockPermissionService.validateWebAdminPermission as jest.Mock).mockReturnValue(mockResult);

      // Act
      siteAdminProtection.validateWebAdminOperation(
        'user-123',
        WebAdminOperation.MANAGE_USERS,
        true
      );

      // Assert
      expect(mockPermissionService.createWebAdminContext).toHaveBeenCalledWith('user-123', true);
      expect(mockPermissionService.validateWebAdminPermission).toHaveBeenCalledWith(
        expect.any(Object),
        WebAdminOperation.MANAGE_USERS
      );
    });

    it('should handle PermissionService errors gracefully', () => {
      // Arrange
      (mockPermissionService.validateWebAdminPermission as jest.Mock).mockImplementation(() => {
        throw new Error('Permission service error');
      });

      // Act & Assert
      expect(() => {
        siteAdminProtection.validateWebAdminOperation(
          'user-123',
          WebAdminOperation.MANAGE_USERS,
          true
        );
      }).toThrow('Permission service error');
    });
  });
});