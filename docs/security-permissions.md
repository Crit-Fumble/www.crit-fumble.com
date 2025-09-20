# Permission System Security Architecture

## Overview

The Crit-Fumble application implements a **strict permission isolation system** that maintains complete separation between Discord server permissions and site-wide administrative access. This architecture prevents privilege escalation and ensures that Discord admin permissions cannot be used to gain unauthorized access to site administration features.

## Core Security Principle

**Discord admin permissions can NEVER grant site-wide administrative access.**

This principle is enforced through:
- Separate permission contexts for Discord and site operations
- Explicit permission validation for all administrative operations
- Security guards that prevent cross-context privilege escalation
- Comprehensive audit logging of all admin permission attempts

## Permission Contexts

### Discord Server Permission Context
```typescript
interface DiscordServerContext {
  discordUserId: string;      // Discord user ID
  guildId: string;            // Discord server/guild ID
  guildPermissions: string[]; // Discord permissions (e.g., "ADMINISTRATOR")
  isGuildAdmin: boolean;      // Admin in Discord server
  isGuildOwner: boolean;      // Owner of Discord server
}
```

**Scope**: Limited to Discord bot operations only
- Create/manage Discord events
- Use Discord slash commands
- Configure Discord bot settings for the server

### Web Admin Permission Context
```typescript
interface WebAdminContext {
  userId: string;               // Site user ID
  webPermission: WebAdminPermission; // Web permission level
  isWebAdmin: boolean;          // Web admin flag from database
}
```

**Scope**: Site-wide application features
- User account management
- Campaign creation and management
- Site administration and moderation
- Database access and configuration

## Permission Levels

### Discord Permissions (Discord Operations Only)
- `DISCORD_USER`: Basic Discord command usage
- `DISCORD_CAMPAIGN_MANAGER`: Manage Discord events for campaigns
- `DISCORD_SERVER_ADMIN`: Configure Discord bot settings

### Site Permissions (Site Operations Only)
- `USER`: Basic user account access
- `CAMPAIGN_OWNER`: Manage owned campaigns
- `MODERATOR`: Content and user moderation
- `SITE_ADMIN`: Full site administration

## Security Boundaries

### What Discord Admin CAN Do
✅ Manage Discord server settings
✅ Configure Discord bot for their server
✅ Create Discord events through bot commands
✅ Use Discord slash commands with elevated permissions

### What Discord Admin CANNOT Do
❌ Access site administration panel
❌ Modify user accounts or site data
❌ Grant site admin privileges to other users
❌ Access sensitive site configuration
❌ Bypass site permission checks

## Implementation Components

### 1. Permission Models (`PermissionModels.ts`)
Defines permission types, contexts, and operation requirements.

### 2. Permission Service (`PermissionService.ts`)
Validates permissions for Discord and site operations separately.

### 3. Site Admin Protection (`SiteAdminProtection.ts`)
Enforces site admin security boundaries and audit logging.

### 4. Discord Controller Updates
Implements permission validation for all Discord webhook operations.

## Security Safeguards

### 1. Explicit Permission Validation
Every administrative operation requires explicit permission validation:
```typescript
// Discord server operations
const discordPermission = permissionService.validateDiscordServerPermission(
  discordServerContext, 
  DiscordServerOperation.CREATE_CAMPAIGN_EVENT
);

// Web admin operations
const webPermission = siteAdminProtection.validateWebAdminOperation(
  userId, 
  WebAdminOperation.WEB_ADMINISTRATION, 
  userAdminStatus
);
```

### 2. Context Isolation
Permission contexts are completely separate and cannot be mixed:
```typescript
// SECURE: Separate contexts
createDiscordServerContext(discordUserId, guildId, permissions);
createWebAdminContext(userId, isWebAdmin);

// SECURITY GUARD: Explicit prevention
canDiscordServerContextGrantWebAdmin(): false // Always returns false
```

### 3. Database-Based Site Admin
Site admin status comes exclusively from the database `admin` field:
```sql
SELECT admin FROM User WHERE id = ?;
```

Discord permissions are never consulted for site admin decisions.

### 4. Security Audit Logging
All admin permission attempts are logged:
```typescript
auditAdminPermissionUsage(userId, operation, granted, source, metadata);
```

## Usage Examples

### Secure Discord Server Operation
```typescript
// In DiscordController
const permissionContext = this.createDiscordServerContext(interaction);
const permission = this.validateDiscordServerOperation(
  permissionContext, 
  DiscordServerOperation.CREATE_CAMPAIGN_EVENT
);

if (!permission.allowed) {
  return errorResponse(permission.reason);
}
```

### Secure Web Admin Operation
```typescript
// In web admin endpoint
const protection = new SiteAdminProtection();
const validation = protection.validateWebAdminOperation(
  userId,
  WebAdminOperation.WEB_ADMINISTRATION,
  user.admin // From database only
);

if (!validation.allowed) {
  return forbidden(validation.reason);
}
```

## Migration Notes

This security architecture was implemented to address the critical security concern that Discord admin permissions could potentially be misused to gain site-wide administrative access. The system now enforces complete isolation between these permission domains.

### Key Changes
1. Added explicit permission validation to Discord webhook handlers
2. Created separate permission contexts for Discord and site operations
3. Implemented security guards to prevent privilege escalation
4. Added comprehensive audit logging for security monitoring

## Security Review Checklist

When reviewing permission-related code:

- [ ] Are Discord and site permissions kept completely separate?
- [ ] Is site admin status only checked against the database `admin` field?
- [ ] Are Discord admin permissions never used for site-wide decisions?
- [ ] Is permission validation explicit for all administrative operations?
- [ ] Are security boundaries clearly documented and enforced?
- [ ] Is audit logging in place for all admin permission checks?

## Future Considerations

1. **Rate Limiting**: Add rate limiting to admin operations
2. **Multi-Factor Authentication**: Require MFA for sensitive site admin operations
3. **Role-Based Access**: Expand site permissions to include more granular roles
4. **Security Monitoring**: Implement real-time security monitoring and alerting
5. **Permission Expiry**: Consider time-limited permissions for enhanced security