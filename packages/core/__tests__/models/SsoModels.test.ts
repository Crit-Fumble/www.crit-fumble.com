/**
 * SsoModels Unit Tests
 * Tests for SSO authentication models and types
 */

import {
  SsoProvider,
  SsoProviderConfig,
  DiscordSsoConfig,
  WorldAnvilSsoConfig,
  SsoConfig,
  AuthUrlParams,
  TokenExchangeParams,
  TokenResponse,
  SsoUserProfile,
  SsoAuthResult,
} from '../../models/auth/SsoModels';

describe('SsoModels', () => {
  describe('SsoProvider Enum', () => {
    it('should have correct provider values', () => {
      expect(SsoProvider.DISCORD).toBe('discord');
      expect(SsoProvider.WORLDANVIL).toBe('worldanvil');
    });

    it('should have all expected providers', () => {
      const providers = Object.values(SsoProvider);
      expect(providers).toContain('discord');
      expect(providers).toContain('worldanvil');
      expect(providers).toHaveLength(2);
    });
  });

  describe('SsoProviderConfig Interface', () => {
    it('should validate basic provider configuration', () => {
      const config: SsoProviderConfig = {
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        redirectUri: 'http://localhost:3000/auth/callback',
        scopes: ['identify', 'email'],
      };

      expect(config.clientId).toBe('test-client-id');
      expect(config.clientSecret).toBe('test-client-secret');
      expect(config.redirectUri).toBe('http://localhost:3000/auth/callback');
      expect(config.scopes).toEqual(['identify', 'email']);
    });
  });

  describe('DiscordSsoConfig Interface', () => {
    it('should extend SsoProviderConfig with Discord-specific options', () => {
      const config: DiscordSsoConfig = {
        clientId: 'discord-client-id',
        clientSecret: 'discord-client-secret',
        redirectUri: 'http://localhost:3000/auth/discord/callback',
        scopes: ['identify', 'email', 'guilds'],
        guildId: 'test-guild-id',
      };

      expect(config.clientId).toBe('discord-client-id');
      expect(config.guildId).toBe('test-guild-id');
      expect(config.scopes).toContain('guilds');
    });

    it('should work without optional guildId', () => {
      const config: DiscordSsoConfig = {
        clientId: 'discord-client-id',
        clientSecret: 'discord-client-secret',
        redirectUri: 'http://localhost:3000/auth/discord/callback',
        scopes: ['identify', 'email'],
      };

      expect(config.guildId).toBeUndefined();
      expect(config.clientId).toBe('discord-client-id');
    });
  });

  describe('WorldAnvilSsoConfig Interface', () => {
    it('should extend SsoProviderConfig for WorldAnvil', () => {
      const config: WorldAnvilSsoConfig = {
        clientId: 'worldanvil-client-id',
        clientSecret: 'worldanvil-client-secret',
        redirectUri: 'http://localhost:3000/auth/worldanvil/callback',
        scopes: ['read:user', 'read:worlds'],
      };

      expect(config.clientId).toBe('worldanvil-client-id');
      expect(config.scopes).toEqual(['read:user', 'read:worlds']);
    });
  });

  describe('SsoConfig Interface', () => {
    it('should combine multiple provider configurations', () => {
      const config: SsoConfig = {
        discord: {
          clientId: 'discord-client-id',
          clientSecret: 'discord-client-secret',
          redirectUri: 'http://localhost:3000/auth/discord/callback',
          scopes: ['identify', 'email'],
          guildId: 'test-guild-id',
        },
        worldanvil: {
          clientId: 'worldanvil-client-id',
          clientSecret: 'worldanvil-client-secret',
          redirectUri: 'http://localhost:3000/auth/worldanvil/callback',
          scopes: ['read:user'],
        },
      };

      expect(config.discord?.clientId).toBe('discord-client-id');
      expect(config.worldanvil?.clientId).toBe('worldanvil-client-id');
      expect(config.discord?.guildId).toBe('test-guild-id');
    });

    it('should work with only one provider configured', () => {
      const discordOnlyConfig: SsoConfig = {
        discord: {
          clientId: 'discord-client-id',
          clientSecret: 'discord-client-secret',
          redirectUri: 'http://localhost:3000/auth/discord/callback',
          scopes: ['identify', 'email'],
        },
      };

      expect(discordOnlyConfig.discord).toBeDefined();
      expect(discordOnlyConfig.worldanvil).toBeUndefined();
    });
  });

  describe('AuthUrlParams Interface', () => {
    it('should validate authorization URL parameters', () => {
      const params: AuthUrlParams = {
        clientId: 'test-client-id',
        redirectUri: 'http://localhost:3000/auth/callback',
        scopes: ['identify', 'email'],
        state: 'random-state-string',
        responseType: 'code',
      };

      expect(params.clientId).toBe('test-client-id');
      expect(params.redirectUri).toBe('http://localhost:3000/auth/callback');
      expect(params.scopes).toEqual(['identify', 'email']);
      expect(params.state).toBe('random-state-string');
      expect(params.responseType).toBe('code');
    });

    it('should work with optional parameters', () => {
      const params: AuthUrlParams = {
        clientId: 'test-client-id',
        redirectUri: 'http://localhost:3000/auth/callback',
        scopes: ['identify'],
      };

      expect(params.state).toBeUndefined();
      expect(params.responseType).toBeUndefined();
    });
  });

  describe('TokenExchangeParams Interface', () => {
    it('should validate token exchange parameters', () => {
      const params: TokenExchangeParams = {
        code: 'authorization-code',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        redirectUri: 'http://localhost:3000/auth/callback',
        grantType: 'authorization_code',
      };

      expect(params.code).toBe('authorization-code');
      expect(params.clientId).toBe('test-client-id');
      expect(params.clientSecret).toBe('test-client-secret');
      expect(params.redirectUri).toBe('http://localhost:3000/auth/callback');
      expect(params.grantType).toBe('authorization_code');
    });

    it('should work without optional grantType', () => {
      const params: TokenExchangeParams = {
        code: 'authorization-code',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        redirectUri: 'http://localhost:3000/auth/callback',
      };

      expect(params.grantType).toBeUndefined();
    });
  });

  describe('TokenResponse Interface', () => {
    it('should validate OAuth2 token response', () => {
      const response: TokenResponse = {
        access_token: 'access-token-123',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'refresh-token-123',
        scope: 'identify email',
      };

      expect(response.access_token).toBe('access-token-123');
      expect(response.token_type).toBe('Bearer');
      expect(response.expires_in).toBe(3600);
      expect(response.refresh_token).toBe('refresh-token-123');
      expect(response.scope).toBe('identify email');
    });

    it('should work without optional refresh_token', () => {
      const response: TokenResponse = {
        access_token: 'access-token-123',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'identify',
      };

      expect(response.refresh_token).toBeUndefined();
      expect(response.access_token).toBe('access-token-123');
    });
  });

  describe('SsoUserProfile Interface', () => {
    it('should validate complete user profile', () => {
      const profile: SsoUserProfile = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
        avatar: 'https://example.com/avatar.png',
        provider: SsoProvider.DISCORD,
        providerData: {
          guilds: ['guild-1', 'guild-2'],
          verified: true,
        },
      };

      expect(profile.id).toBe('user-123');
      expect(profile.username).toBe('testuser');
      expect(profile.email).toBe('test@example.com');
      expect(profile.displayName).toBe('Test User');
      expect(profile.avatar).toBe('https://example.com/avatar.png');
      expect(profile.provider).toBe(SsoProvider.DISCORD);
      expect(profile.providerData?.guilds).toEqual(['guild-1', 'guild-2']);
    });

    it('should work with minimal required fields', () => {
      const profile: SsoUserProfile = {
        id: 'user-123',
        username: 'testuser',
        provider: SsoProvider.WORLDANVIL,
      };

      expect(profile.id).toBe('user-123');
      expect(profile.username).toBe('testuser');
      expect(profile.provider).toBe(SsoProvider.WORLDANVIL);
      expect(profile.email).toBeUndefined();
      expect(profile.displayName).toBeUndefined();
      expect(profile.avatar).toBeUndefined();
      expect(profile.providerData).toBeUndefined();
    });

    it('should support different providers', () => {
      const discordProfile: SsoUserProfile = {
        id: 'discord-123',
        username: 'discorduser',
        provider: SsoProvider.DISCORD,
      };

      const worldanvilProfile: SsoUserProfile = {
        id: 'wa-456',
        username: 'worldanviluser',
        provider: SsoProvider.WORLDANVIL,
      };

      expect(discordProfile.provider).toBe(SsoProvider.DISCORD);
      expect(worldanvilProfile.provider).toBe(SsoProvider.WORLDANVIL);
    });
  });

  describe('SsoAuthResult Interface', () => {
    it('should validate successful authentication result', () => {
      const result: SsoAuthResult = {
        success: true,
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          provider: SsoProvider.DISCORD,
        },
        tokens: {
          access_token: 'access-token-123',
          token_type: 'Bearer',
          expires_in: 3600,
          scope: 'identify email',
        },
      };

      expect(result.success).toBe(true);
      expect(result.user?.id).toBe('user-123');
      expect(result.tokens?.access_token).toBe('access-token-123');
      expect(result.error).toBeUndefined();
    });

    it('should validate failed authentication result', () => {
      const result: SsoAuthResult = {
        success: false,
        error: 'Invalid authorization code',
      };

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid authorization code');
      expect(result.user).toBeUndefined();
      expect(result.tokens).toBeUndefined();
    });

    it('should validate partial success result', () => {
      const result: SsoAuthResult = {
        success: true,
        user: {
          id: 'user-123',
          username: 'testuser',
          provider: SsoProvider.DISCORD,
        },
        // No tokens provided
      };

      expect(result.success).toBe(true);
      expect(result.user?.id).toBe('user-123');
      expect(result.tokens).toBeUndefined();
      expect(result.error).toBeUndefined();
    });
  });
});