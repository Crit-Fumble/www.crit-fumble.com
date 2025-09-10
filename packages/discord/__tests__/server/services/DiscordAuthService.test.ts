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
          }),
          // Mock OAuth methods
          clientId: 'mocked-client-id',
          clientSecret: 'mocked-client-secret',
          getAuthorizationUrl: jest.fn((redirectUri, scope, state) => {
            const params = new URLSearchParams({
              client_id: 'mocked-client-id',
              redirect_uri: redirectUri,
              response_type: 'code',
              scope: scope || 'identify email guilds',
            });
            if (state) {
              params.append('state', state);
            }
            return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
          }),
          exchangeOAuthCode: jest.fn(),
          getUserByOAuthToken: jest.fn(),
          getUserGuilds: jest.fn(),
          refreshOAuthToken: jest.fn(),
          revokeOAuthToken: jest.fn()
        };
      }
      // Otherwise return mock implementation
      return {
        initialize: jest.fn().mockResolvedValue(undefined),
        // Mock OAuth methods
        clientId: 'mocked-client-id',
        clientSecret: 'mocked-client-secret',
        getAuthorizationUrl: jest.fn((redirectUri, scope, state) => {
          const params = new URLSearchParams({
            client_id: 'mocked-client-id',
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: scope || 'identify email guilds',
          });
          if (state) {
            params.append('state', state);
          }
          return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
        }),
        exchangeOAuthCode: jest.fn(),
        getUserByOAuthToken: jest.fn(),
        getUserGuilds: jest.fn(),
        refreshOAuthToken: jest.fn(),
        revokeOAuthToken: jest.fn()
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
  let apiClientMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    const DiscordApiClientMock = DiscordApiClient as jest.MockedClass<typeof DiscordApiClient>;
    DiscordApiClientMock.mockClear();
    
    // Create a mock instance of the API client with our test methods
    apiClientMock = {
      initialize: jest.fn().mockResolvedValue(undefined),
      getAuthorizationUrl: jest.fn().mockImplementation((redirectUri, scope, state) => {
        const params = new URLSearchParams({
          client_id: 'mocked-client-id',
          redirect_uri: redirectUri,
          response_type: 'code',
          scope: scope || 'identify email guilds',
        });
        if (state) {
          params.append('state', state);
        }
        return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
      }),
      exchangeOAuthCode: jest.fn(),
      getUserByOAuthToken: jest.fn(),
      getUserGuilds: jest.fn(),
      refreshOAuthToken: jest.fn(),
      revokeOAuthToken: jest.fn()
    };
    
    // Create the auth service and replace its API client
    authService = new DiscordAuthService({
      clientId: 'mocked-client-id',
      clientSecret: 'mocked-client-secret',
      redirectUri: 'https://example.com/callback'
    });
    
    // Replace the API client with our mock
    (authService as any).apiClient = apiClientMock;
    
    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
  });

  describe('initialize', () => {
    it('should initialize the Discord client', async () => {
      await authService.initialize();
      
      // Check that initialize was called on our API client
      expect(apiClientMock.initialize).toHaveBeenCalled();
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
      // Mock successful token and user responses
      const mockTokenData = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'test-refresh-token',
        scope: 'identify email'
      };
      
      const mockUserData = {
        id: 'user-123',
        username: 'testuser',
        discriminator: '1234',
        avatar: 'avatar-hash',
        email: 'user@example.com'
      };
      
      // Set up our API client mocks
      apiClientMock.exchangeOAuthCode.mockResolvedValueOnce({
        success: true,
        data: mockTokenData
      });
      
      apiClientMock.getUserByOAuthToken.mockResolvedValueOnce({
        success: true,
        data: mockUserData
      });
      
      const result = await authService.exchangeCode('test-code', 'https://example.com/callback');
      
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.token?.access_token).toBe('test-access-token');
      expect(result.user).toBeDefined();
      expect(result.user?.id).toBe('user-123');
      expect(result.user?.email).toBe('user@example.com');
      
      // Verify the API client methods were called
      expect(apiClientMock.exchangeOAuthCode).toHaveBeenCalledWith('test-code', 'https://example.com/callback');
      expect(apiClientMock.getUserByOAuthToken).toHaveBeenCalledWith('test-access-token', 'Bearer');
    });
    
    it('should handle token exchange failure', async () => {
      // Mock failed token response
      apiClientMock.exchangeOAuthCode.mockResolvedValueOnce({
        success: false,
        error: 'Failed to exchange code: Invalid code'
      });
      
      const result = await authService.exchangeCode('invalid-code', 'https://example.com/callback');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Failed to exchange code');
    });
    
    it('should handle user info fetch failure', async () => {
      // Mock successful token response but failed user info
      const mockTokenData = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'test-refresh-token',
        scope: 'identify email'
      };
      
      apiClientMock.exchangeOAuthCode.mockResolvedValueOnce({
        success: true,
        data: mockTokenData
      });
      
      apiClientMock.getUserByOAuthToken.mockResolvedValueOnce({
        success: false,
        error: 'Failed to fetch user data'
      });
      
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
      const mockTokenData = {
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'new-refresh-token',
        scope: 'identify email'
      };
      
      apiClientMock.refreshOAuthToken.mockResolvedValueOnce({
        success: true,
        data: mockTokenData
      });
      
      const result = await authService.refreshToken('old-refresh-token');
      
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.token?.access_token).toBe('new-access-token');
      expect(result.token?.refresh_token).toBe('new-refresh-token');
      
      // Verify the API client was called
      expect(apiClientMock.refreshOAuthToken).toHaveBeenCalledWith('old-refresh-token');
    });
    
    it('should handle token refresh failure', async () => {
      // Mock failed token refresh
      apiClientMock.refreshOAuthToken.mockResolvedValueOnce({
        success: false,
        error: 'Failed to refresh token: Invalid refresh token'
      });
      
      const result = await authService.refreshToken('invalid-refresh-token');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Failed to refresh token');
    });
  });

  describe('getUserGuilds', () => {
    it('should fetch user guilds successfully', async () => {
      // Mock successful guilds fetch
      const mockGuilds = [
        { id: 'guild-1', name: 'Test Guild 1', owner_id: 'owner-1' },
        { id: 'guild-2', name: 'Test Guild 2', owner_id: 'owner-2' }
      ];
      
      apiClientMock.getUserGuilds.mockResolvedValueOnce({
        success: true,
        data: mockGuilds
      });
      
      const result = await authService.getUserGuilds('test-access-token');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0].id).toBe('guild-1');
      
      // Verify the API client was called
      expect(apiClientMock.getUserGuilds).toHaveBeenCalledWith('test-access-token', 'Bearer');
    });
    
    it('should handle guilds fetch failure', async () => {
      // Mock failed guilds fetch
      apiClientMock.getUserGuilds.mockResolvedValueOnce({
        success: false,
        data: [],
        error: 'Failed to fetch guilds: Invalid token'
      });
      
      const result = await authService.getUserGuilds('invalid-token');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Failed to fetch guilds');
    });
  });

  describe('revokeToken', () => {
    it('should revoke token successfully', async () => {
      // Mock successful revocation
      apiClientMock.revokeOAuthToken.mockResolvedValueOnce({
        success: true
      });
      
      const result = await authService.revokeToken('test-token');
      
      expect(result.success).toBe(true);
      
      // Verify the API client was called
      expect(apiClientMock.revokeOAuthToken).toHaveBeenCalledWith('test-token');
    });
    
    it('should handle revocation failure', async () => {
      // Mock failed revocation
      apiClientMock.revokeOAuthToken.mockResolvedValueOnce({
        success: false,
        error: 'Failed to revoke token'
      });
      
      const result = await authService.revokeToken('invalid-token');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toBe('Failed to revoke token');
    });
  });
  
  describe('getUserProfile', () => {
    it('should fetch user profile successfully', async () => {
      // Mock successful user profile fetch
      const mockUserData = {
        id: 'user-123',
        username: 'testuser',
        discriminator: '1234',
        avatar: 'avatar-hash',
        email: 'user@example.com'
      };
      
      apiClientMock.getUserByOAuthToken.mockResolvedValueOnce({
        success: true,
        data: mockUserData
      });
      
      const result = await authService.getUserProfile('test-access-token');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe('user-123');
      
      // Verify the API client was called
      expect(apiClientMock.getUserByOAuthToken).toHaveBeenCalledWith('test-access-token', 'Bearer');
    });
  });
});
