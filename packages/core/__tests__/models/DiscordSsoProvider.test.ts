/**
 * DiscordSsoProvider Unit Tests
 * Tests for Discord SSO authentication provider
 */

import { DiscordSsoProvider } from '../../models/auth/DiscordSsoProvider';
import { SsoProvider, AuthUrlParams, TokenExchangeParams } from '../../models/auth/SsoModels';

// Mock global.fetch used by the provider implementation
const mockFetch = jest.fn();
beforeAll(() => {
  // @ts-ignore - tests run in Node, provide a global fetch mock
  global.fetch = mockFetch;
});

describe('DiscordSsoProvider', () => {
  let discordProvider: DiscordSsoProvider;

  const mockConfig = {
    clientId: 'discord-client-id',
    clientSecret: 'discord-client-secret',
    redirectUri: 'http://localhost:3000/auth/discord/callback',
    scopes: ['identify', 'email'],
    guildId: 'test-guild-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    discordProvider = new DiscordSsoProvider(
      mockConfig.clientId,
      mockConfig.clientSecret,
      mockConfig.redirectUri,
      mockConfig.scopes,
      mockConfig.guildId
    );
  });

  describe('Constructor', () => {
    it('should initialize with correct provider type', () => {
      expect(discordProvider.provider).toBe(SsoProvider.DISCORD);
    });

    it('should work without optional guildId', () => {
      const providerWithoutGuild = new DiscordSsoProvider(
        mockConfig.clientId,
        mockConfig.clientSecret,
        mockConfig.redirectUri,
        mockConfig.scopes
      );

      expect(providerWithoutGuild.provider).toBe(SsoProvider.DISCORD);
    });
  });

  describe('getAuthorizationUrl', () => {
    it('should generate Discord authorization URL', () => {
      const params: AuthUrlParams = {
        clientId: mockConfig.clientId,
        redirectUri: mockConfig.redirectUri,
        scopes: mockConfig.scopes,
        state: 'test-state',
        responseType: 'code',
      };

      const url = discordProvider.getAuthorizationUrl(params);

      expect(url).toContain('https://discord.com/api/oauth2/authorize');
      expect(url).toContain(`client_id=${mockConfig.clientId}`);
      expect(url).toContain(`redirect_uri=${encodeURIComponent(mockConfig.redirectUri)}`);
      expect(url).toContain(`scope=${encodeURIComponent('identify email')}`);
      expect(url).toContain('state=test-state');
      expect(url).toContain('response_type=code');
    });

    it('should handle scopes array properly', () => {
      const params: AuthUrlParams = {
        clientId: mockConfig.clientId,
        redirectUri: mockConfig.redirectUri,
        scopes: ['identify', 'email', 'guilds'],
      };

      const url = discordProvider.getAuthorizationUrl(params);

      expect(url).toContain(`scope=${encodeURIComponent('identify email guilds')}`);
    });

    it('should use default response_type if not provided', () => {
      const params: AuthUrlParams = {
        clientId: mockConfig.clientId,
        redirectUri: mockConfig.redirectUri,
        scopes: mockConfig.scopes,
      };

      const url = discordProvider.getAuthorizationUrl(params);

      expect(url).toContain('response_type=code');
    });
  });

  describe('exchangeCodeForToken', () => {
    it('should exchange authorization code for access token', async () => {
      const mockTokenResponse = {
        access_token: 'discord-access-token',
        token_type: 'Bearer',
        expires_in: 604800,
        refresh_token: 'discord-refresh-token',
        scope: 'identify email',
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTokenResponse),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const params: TokenExchangeParams = {
        code: 'authorization-code',
        clientId: mockConfig.clientId,
        clientSecret: mockConfig.clientSecret,
        redirectUri: mockConfig.redirectUri,
        grantType: 'authorization_code',
      };

      const result = await discordProvider.exchangeCodeForToken(params);

      expect(result).toEqual(mockTokenResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://discord.com/api/oauth2/token',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      );
    });

    it('should handle token exchange errors', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue(JSON.stringify({
          error: 'invalid_grant',
          error_description: 'Invalid authorization code',
        })),
      };

      mockFetch.mockResolvedValue(mockErrorResponse as any);

      const params: TokenExchangeParams = {
        code: 'invalid-code',
        clientId: mockConfig.clientId,
        clientSecret: mockConfig.clientSecret,
        redirectUri: mockConfig.redirectUri,
      };

      await expect(discordProvider.exchangeCodeForToken(params)).rejects.toThrow(
        'Failed to exchange code for token'
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const params: TokenExchangeParams = {
        code: 'authorization-code',
        clientId: mockConfig.clientId,
        clientSecret: mockConfig.clientSecret,
        redirectUri: mockConfig.redirectUri,
      };

      await expect(discordProvider.exchangeCodeForToken(params)).rejects.toThrow(
        'Failed to exchange code for token: Network error'
      );
    });
  });

  describe('getUserProfile', () => {
    it('should get user profile from Discord API', async () => {
      const mockDiscordUser = {
        id: '123456789',
        username: 'testuser',
        discriminator: '1234',
        email: 'test@example.com',
        verified: true,
        avatar: 'avatar-hash',
        public_flags: 0,
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockDiscordUser),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await discordProvider.getUserProfile('access-token');

      expect(result).toEqual({
        id: '123456789',
        username: 'testuser#1234',
        email: 'test@example.com',
        displayName: 'testuser',
        avatar: 'https://cdn.discordapp.com/avatars/123456789/avatar-hash.png',
        provider: SsoProvider.DISCORD,
        providerData: {
          discriminator: '1234',
          global_name: undefined,
          verified: true,
          locale: undefined,
          mfa_enabled: undefined,
          premium_type: undefined,
          public_flags: 0,
          flags: undefined,
          bot: undefined,
          system: undefined,
        },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://discord.com/api/users/@me',
        expect.objectContaining({
          headers: { Authorization: 'Bearer access-token' },
        })
      );
    });

    it('should handle user without avatar', async () => {
      const mockDiscordUser = {
        id: '123456789',
        username: 'testuser',
        discriminator: '1234',
        email: 'test@example.com',
        verified: true,
        avatar: null,
        public_flags: 0,
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockDiscordUser),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await discordProvider.getUserProfile('access-token');

      expect(result.avatar).toBeUndefined();
    });

    it('should handle API errors', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 401,
        text: jest.fn().mockResolvedValue(JSON.stringify({
          message: 'Unauthorized',
          code: 0,
        })),
      };

      mockFetch.mockResolvedValue(mockErrorResponse as any);

      await expect(discordProvider.getUserProfile('invalid-token')).rejects.toThrow(
        'Failed to get Discord user profile'
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token', async () => {
      const mockTokenResponse = {
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 604800,
        refresh_token: 'new-refresh-token',
        scope: 'identify email',
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTokenResponse),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await discordProvider.refreshToken('refresh-token');

      expect(result).toEqual(mockTokenResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://discord.com/api/oauth2/token',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      );
    });

    it('should handle refresh token errors', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue(JSON.stringify({
          error: 'invalid_grant',
          error_description: 'Invalid refresh token',
        })),
      };

      mockFetch.mockResolvedValue(mockErrorResponse as any);

      await expect(discordProvider.refreshToken('invalid-refresh-token')).rejects.toThrow(
        'Failed to refresh Discord token'
      );
    });
  });

  describe('revokeToken', () => {
    it('should revoke access token', async () => {
      const mockResponse = {
        ok: true,
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await discordProvider.revokeToken('access-token');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://discord.com/api/oauth2/token/revoke',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      );
    });

    it('should handle revoke token errors', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 400,
      };

      mockFetch.mockResolvedValue(mockErrorResponse as any);

      const result = await discordProvider.revokeToken('invalid-token');

      expect(result).toBe(false);
    });

    it('should handle network errors during token revocation', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await discordProvider.revokeToken('access-token');

      expect(result).toBe(false);
    });
  });

  describe('checkGuildMembership', () => {
    it('should check guild membership when guildId is provided', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await discordProvider.checkGuildMembership('access-token');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        `https://discord.com/api/v10/users/@me/guilds/${mockConfig.guildId}/member`,
        expect.objectContaining({
          headers: { Authorization: 'Bearer access-token' },
        })
      );
    });

    it('should return false if user is not in required guild', async () => {
      const mockGuilds = [
        { id: 'other-guild-id', name: 'Other Guild' },
      ];

      const mockResponse = {
        ok: false,
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await discordProvider.checkGuildMembership('access-token');

      expect(result).toBe(false);
    });

    it('should return true if no guildId is required', async () => {
      const providerWithoutGuild = new DiscordSsoProvider(
        mockConfig.clientId,
        mockConfig.clientSecret,
        mockConfig.redirectUri,
        mockConfig.scopes
      );

      const result = await providerWithoutGuild.checkGuildMembership('access-token');

      expect(result).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle guild membership check errors', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 403,
      };

      mockFetch.mockResolvedValue(mockErrorResponse as any);

      const result = await discordProvider.checkGuildMembership('access-token');

      expect(result).toBe(false);
    });
  });
});