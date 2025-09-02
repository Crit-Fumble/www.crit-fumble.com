import { DiscordAuthService, DiscordAuthResult } from '../../../server/services/DiscordAuthService';
import { DiscordApiClient } from '../../../server/clients/DiscordApiClient';
import { IDiscordClient } from '../../../models/DiscordClientInterface';

// Mock the fetch API
global.fetch = jest.fn();

// Mock the Discord API client
jest.mock('../../../server/clients/DiscordApiClient', () => {
  return {
    DiscordApiClient: jest.fn().mockImplementation((config, customClient) => {
      // If a custom client is provided, use it for testing
      if (customClient) {
        return {
          initialize: jest.fn().mockImplementation(() => {
            return customClient.login('mocked-token-from-client');
          })
        };
      }
      // Otherwise return mock implementation
      return {
        initialize: jest.fn().mockResolvedValue(undefined)
      };
    })
  };
});

// Mock the config module
jest.mock('../../../server/configs/config', () => ({
  getDiscordConfig: jest.fn().mockReturnValue({
    botToken: 'mocked-token',
    clientId: 'mocked-client-id',
    clientSecret: 'mocked-client-secret',
    defaultGuildId: 'guild-123'
  })
}));

describe('DiscordAuthService', () => {
  let authService: DiscordAuthService;
  let mockClient: jest.Mocked<IDiscordClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = {
      login: jest.fn(),
      destroy: jest.fn(),
      on: jest.fn(),
      once: jest.fn(),
      emit: jest.fn(),
      guilds: {
        fetch: jest.fn(),
        cache: new Map()
      },
      channels: {
        fetch: jest.fn(),
        cache: new Map()
      },
      users: {
        fetch: jest.fn(),
        cache: new Map()
      }
    } as unknown as jest.Mocked<IDiscordClient>;
    
    const DiscordApiClientMock = DiscordApiClient as jest.MockedClass<typeof DiscordApiClient>;
    DiscordApiClientMock.mockClear();
    
    // Create the auth service with our mock client
    authService = new DiscordAuthService(mockClient);
    
    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
  });

  describe('initialize', () => {
    it('should initialize the Discord client', async () => {
      // Set up the mock login method to be called when initialize is called
      mockClient.login.mockResolvedValueOnce('mocked-token');
      
      await authService.initialize();
      
      // Check that login was called on our mock client
      expect(mockClient.login).toHaveBeenCalled();
    });
  });

  describe('getAuthorizationUrl', () => {
    it('should generate a valid authorization URL', () => {
      const redirectUri = 'https://example.com/callback';
      const scope = 'identify email';
      const state = 'random-state';
      
      const url = authService.getAuthorizationUrl(redirectUri, scope, state);
      
      expect(url).toContain('https://discord.com/api/oauth2/authorize');
      expect(url).toContain('client_id=mocked-client-id');
      expect(url).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
      // Discord uses + for spaces in query params
      expect(url).toContain('scope=identify+email');
      expect(url).toContain(`state=${state}`);
    });
    
    it('should use default scope if not provided', () => {
      const redirectUri = 'https://example.com/callback';
      
      const url = authService.getAuthorizationUrl(redirectUri);
      
      // Discord uses + for spaces in query params
      expect(url).toContain('scope=identify+email+guilds');
    });
  });

  describe('exchangeCode', () => {
    it('should exchange code for access token successfully', async () => {
      // Mock successful token response
      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            access_token: 'test-access-token',
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: 'test-refresh-token',
            scope: 'identify email'
          })
        })
      ).mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 'user-123',
            username: 'testuser',
            discriminator: '1234',
            avatar: 'avatar-hash',
            email: 'user@example.com'
          })
        })
      );
      
      const result = await authService.exchangeCode('test-code', 'https://example.com/callback');
      
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.token?.access_token).toBe('test-access-token');
      expect(result.user).toBeDefined();
      expect(result.user?.id).toBe('user-123');
      expect(result.user?.email).toBe('user@example.com');
      
      // Verify the token fetch call
      expect(global.fetch).toHaveBeenCalledWith(
        'https://discord.com/api/oauth2/token',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: expect.stringContaining('code=test-code')
        })
      );
    });
    
    it('should handle token exchange failure', async () => {
      // Mock failed token response
      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: false,
          text: () => Promise.resolve('Invalid code')
        })
      );
      
      const result = await authService.exchangeCode('invalid-code', 'https://example.com/callback');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Failed to exchange code');
    });
    
    it('should handle user info fetch failure', async () => {
      // Mock successful token response but failed user info
      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            access_token: 'test-access-token',
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: 'test-refresh-token',
            scope: 'identify email'
          })
        })
      ).mockImplementationOnce(() => 
        Promise.resolve({
          ok: false
        })
      );
      
      const result = await authService.exchangeCode('test-code', 'https://example.com/callback');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toBe('Failed to fetch user data');
      expect(result.token).toBeDefined();
    });
  });

  describe('refreshToken', () => {
    it('should refresh a token successfully', async () => {
      // Mock successful token refresh
      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            access_token: 'new-access-token',
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: 'new-refresh-token',
            scope: 'identify email'
          })
        })
      );
      
      const result = await authService.refreshToken('old-refresh-token');
      
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.token?.access_token).toBe('new-access-token');
      expect(result.token?.refresh_token).toBe('new-refresh-token');
      
      // Verify the refresh token fetch call
      expect(global.fetch).toHaveBeenCalledWith(
        'https://discord.com/api/oauth2/token',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: expect.stringContaining('refresh_token=old-refresh-token')
        })
      );
    });
    
    it('should handle token refresh failure', async () => {
      // Mock failed token refresh
      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: false,
          text: () => Promise.resolve('Invalid refresh token')
        })
      );
      
      const result = await authService.refreshToken('invalid-refresh-token');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Failed to refresh token');
    });
  });

  describe('getUserGuilds', () => {
    it('should fetch user guilds successfully', async () => {
      // Mock successful guilds fetch
      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 'guild-1', name: 'Test Guild 1' },
            { id: 'guild-2', name: 'Test Guild 2' }
          ])
        })
      );
      
      const result = await authService.getUserGuilds('test-access-token');
      
      expect(result.success).toBe(true);
      expect(result.guilds).toBeDefined();
      expect(result.guilds).toHaveLength(2);
      expect(result.guilds[0].id).toBe('guild-1');
      
      // Verify the guilds fetch call
      expect(global.fetch).toHaveBeenCalledWith(
        'https://discord.com/api/users/@me/guilds',
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-access-token' }
        })
      );
    });
    
    it('should handle guilds fetch failure', async () => {
      // Mock failed guilds fetch
      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: false,
          text: () => Promise.resolve('Invalid token')
        })
      );
      
      const result = await authService.getUserGuilds('invalid-token');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Failed to fetch guilds');
    });
  });

  describe('revokeToken', () => {
    it('should revoke token successfully', async () => {
      // Mock successful revocation
      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: true
        })
      );
      
      const result = await authService.revokeToken('test-token');
      
      expect(result.success).toBe(true);
      
      // Verify the revoke token fetch call
      expect(global.fetch).toHaveBeenCalledWith(
        'https://discord.com/api/oauth2/token/revoke',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('token=test-token')
        })
      );
    });
    
    it('should handle revocation failure', async () => {
      // Mock failed revocation
      (global.fetch as jest.Mock).mockImplementationOnce(() => 
        Promise.resolve({
          ok: false
        })
      );
      
      const result = await authService.revokeToken('invalid-token');
      
      expect(result.success).toBe(false);
    });
  });
});
