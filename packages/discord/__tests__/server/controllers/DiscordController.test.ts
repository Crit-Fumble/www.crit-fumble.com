/**
 * Tests for DiscordController
 */
import { DiscordController } from '../../../server/controllers/DiscordController';
import { DiscordEventService } from '../../../server/services/DiscordEventService';
import { DiscordBotService } from '../../../server/services/DiscordBotService';
import { DiscordAuthService } from '../../../server/services/DiscordAuthService';

// Define generic HTTP request/response types instead of using Next.js specifics
interface HttpRequest {
  query?: Record<string, string | string[]>;
  body?: any;
  headers?: Record<string, string | string[]>;
}

interface HttpResponse {
  status(code: number): {
    json(body: any): void;
    send(body: any): void;
  };
}
// Import enums directly to avoid TS/Jest module resolution issues
const GuildScheduledEventStatus = {
  Scheduled: 1,
  Active: 2,
  Completed: 3,
  Cancelled: 4
};

// Mock the service dependencies
jest.mock('../../../server/services/DiscordEventService');
jest.mock('../../../server/services/DiscordBotService');
jest.mock('../../../server/services/DiscordAuthService');

describe('DiscordController', () => {
  let controller: DiscordController;
  let mockEventService: jest.Mocked<DiscordEventService>;
  let mockBotService: jest.Mocked<DiscordBotService>;
  let mockAuthService: jest.Mocked<DiscordAuthService>;
  let mockReq: Partial<HttpRequest>;
  
  // Create a mock response with the required methods
  let mockRes: {
    status: jest.Mock;
  } & Partial<HttpResponse>;

  beforeEach(() => {
    // Create fresh mocks for each test
    mockEventService = new DiscordEventService() as jest.Mocked<DiscordEventService>;
    mockBotService = new DiscordBotService() as jest.Mocked<DiscordBotService>;
    mockAuthService = new DiscordAuthService() as jest.Mocked<DiscordAuthService>;
    
    // Set up mock request
    mockReq = {
      body: {},
      query: {}
    };
    
    // Create a chainable mock response with json method
    const jsonMock = jest.fn().mockReturnValue({});
    const statusReturnMock = { json: jsonMock };
    const statusMock = jest.fn().mockReturnValue(statusReturnMock);
    
    // Use Partial<NextApiResponse> for proper typing
    mockRes = {
      status: statusMock
    };
    
    // Now we can safely chain mockRes.status().json without TypeScript errors
    
    // Create controller with mocked services
    controller = new DiscordController(mockEventService, mockBotService, mockAuthService);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('initialize should call service initializations', async () => {
    await controller.initialize();
    expect(mockEventService.initialize).toHaveBeenCalled();
    expect(mockBotService.initialize).toHaveBeenCalled();
    expect(mockAuthService.initialize).toHaveBeenCalled();
  });
  
  describe('Guild Events API', () => {
    test('getGuildEvents should call eventService and return result', async () => {
      const mockGuildId = 'test-guild';
      const mockEvents = [
        { 
          id: 'event-1', 
          name: 'Test Event',
          guild_id: mockGuildId,
          channel_id: 'channel-1',
          scheduled_start_time: '2023-01-01T12:00:00.000Z',
          status: GuildScheduledEventStatus.Scheduled,
          entity_type: 2
        }
      ];
      mockReq.query = { guildId: mockGuildId };
      
      // Set up mock implementation
      mockEventService.getGuildEvents.mockResolvedValueOnce({
        success: true,
        data: mockEvents
      });
      
      await controller.getGuildEvents(mockReq as HttpRequest, mockRes as HttpResponse);
      
      expect(mockEventService.getGuildEvents).toHaveBeenCalledWith(mockGuildId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      // Use explicit type assertions to avoid TypeScript errors
      expect(mockRes.status(200)?.json).toHaveBeenCalledWith({
        success: true,
        data: mockEvents
      });
    });
    
    test('getGuildEvents should handle errors', async () => {
      mockReq.query = { guildId: 'test-guild' };
      
      mockEventService.getGuildEvents.mockResolvedValueOnce({
        success: false,
        error: 'Failed to get events',
        data: []
      });
      
      await controller.getGuildEvents(mockReq as HttpRequest, mockRes as HttpResponse);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
    
    test('createGuildEvent should call eventService and return created event', async () => {
      const mockGuildId = 'test-guild';
      const mockEventData = {
        name: 'New Event',
        scheduled_start_time: '2023-01-01T12:00:00.000Z'
      };
      const mockCreatedEvent = {
        id: 'new-event-id',
        guild_id: mockGuildId,
        channel_id: 'channel-1',
        name: mockEventData.name,
        scheduled_start_time: mockEventData.scheduled_start_time,
        status: GuildScheduledEventStatus.Scheduled,
        entity_type: 2
      };
      
      mockReq.query = { guildId: mockGuildId };
      mockReq.body = mockEventData;
      
      mockEventService.createGuildEvent.mockResolvedValueOnce({
        success: true,
        data: mockCreatedEvent
      });
      
      await controller.createGuildEvent(mockReq as HttpRequest, mockRes as HttpResponse);
      
      expect(mockEventService.createGuildEvent).toHaveBeenCalledWith(mockGuildId, mockEventData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.status(201)?.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: mockCreatedEvent
      }));
    });
    
    test('createGuildEvent should validate guildId', async () => {
      mockReq.query = {}; // No guildId
      mockReq.body = { name: 'Test Event' };
      
      await controller.createGuildEvent(mockReq as HttpRequest, mockRes as HttpResponse);
      
      expect(mockEventService.createGuildEvent).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.status(400)!.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, error: expect.stringContaining('Guild ID') })
      );
    });
    
    test('updateGuildEvent should call eventService with correct parameters', async () => {
      const mockGuildId = 'test-guild';
      const mockEventId = 'test-event';
      const mockUpdateData = { 
        name: 'Updated Event', 
        guild_id: mockGuildId,
        channel_id: 'channel-1',
        scheduled_start_time: '2023-01-01T12:00:00.000Z',
        status: GuildScheduledEventStatus.Scheduled,
        entity_type: 2
      };
      
      mockReq.query = { guildId: mockGuildId, eventId: mockEventId };
      mockReq.body = mockUpdateData;
      
      mockEventService.updateGuildEvent.mockResolvedValueOnce({
        success: true,
        data: { id: mockEventId, ...mockUpdateData }
      });
      
      await controller.updateGuildEvent(mockReq as HttpRequest, mockRes as HttpResponse);
      
      expect(mockEventService.updateGuildEvent).toHaveBeenCalledWith(
        mockGuildId, mockEventId, mockUpdateData
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
    
    test('deleteGuildEvent should call eventService with correct parameters', async () => {
      const mockGuildId = 'test-guild';
      const mockEventId = 'test-event';
      
      mockReq.query = { guildId: mockGuildId, eventId: mockEventId };
      
      mockEventService.deleteGuildEvent.mockResolvedValueOnce({
        success: true,
        data: true
      });
      
      await controller.deleteGuildEvent(mockReq as HttpRequest, mockRes as HttpResponse);
      
      expect(mockEventService.deleteGuildEvent).toHaveBeenCalledWith(mockGuildId, mockEventId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
  
  describe('Auth API', () => {
    test('getAuthUrl should return OAuth URL', async () => {
      const redirectUri = 'https://example.com/callback';
      const scope = 'identify email';
      const state = 'test-state';
      const mockUrl = 'https://discord.com/api/oauth2/authorize?client_id=123&response_type=code&scope=identify&redirect_uri=example.com';

      mockReq.query = { 
        redirectUri, 
        scope, 
        state 
      };

      mockAuthService.getAuthorizationUrl.mockReturnValueOnce(mockUrl);

      await controller.getAuthUrl(mockReq as HttpRequest, mockRes as HttpResponse);

      expect(mockAuthService.getAuthorizationUrl).toHaveBeenCalledWith(redirectUri, scope, state);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.status(200)?.json).toHaveBeenCalledWith({
        success: true,
        url: mockUrl
      });
    });

    test('getAuthUrl should handle missing redirectUri', async () => {
      mockReq.query = {};

      await controller.getAuthUrl(mockReq as HttpRequest, mockRes as HttpResponse);

      expect(mockAuthService.getAuthorizationUrl).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('handleAuthCallback should exchange code for tokens', async () => {
      const code = 'test-auth-code';
      const redirectUri = 'https://example.com/callback';
      const mockResult = {
        success: true,
        token: {
          access_token: 'test-access-token',
          refresh_token: 'test-refresh-token',
          expires_in: 3600,
          token_type: 'Bearer',
          scope: 'identify email'
        },
        user: {
          id: 'user123',
          username: 'testuser',
          email: 'user@example.com'
        }
      };

      mockReq.query = { code, redirectUri };
      mockAuthService.exchangeCode.mockResolvedValueOnce(mockResult);
      // Make sure the mock implementation actually gets called with the right params
      mockAuthService.exchangeCode.mockImplementation((c, r) => {
        if (c === code && r === redirectUri) {
          return Promise.resolve(mockResult);
        }
        return Promise.resolve({ success: false, error: 'Invalid parameters' });
      });

      await controller.handleAuthCallback(mockReq as HttpRequest, mockRes as HttpResponse);

      expect(mockAuthService.exchangeCode).toHaveBeenCalledWith(code, redirectUri);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.status(200)?.json).toHaveBeenCalledWith(mockResult);
    });

    test('handleAuthCallback should handle validation errors', async () => {
      mockReq.body = {};

      await controller.handleAuthCallback(mockReq as HttpRequest, mockRes as HttpResponse);

      expect(mockAuthService.exchangeCode).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('refreshToken should refresh OAuth token', async () => {
      const refreshToken = 'test-refresh-token';
      const mockResult = {
        success: true,
        token: {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          expires_in: 3600,
          token_type: 'Bearer',
          scope: 'identify email'
        }
      };

      mockReq.body = { refresh_token: refreshToken };
      mockAuthService.refreshToken.mockResolvedValueOnce(mockResult);
      // Make sure the mock implementation actually gets called with the right param
      mockAuthService.refreshToken.mockImplementation((token) => {
        if (token === refreshToken) {
          return Promise.resolve(mockResult);
        }
        return Promise.resolve({ success: false, error: 'Invalid refresh token' });
      });

      await controller.refreshToken(mockReq as HttpRequest, mockRes as HttpResponse);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.status(200)?.json).toHaveBeenCalledWith(mockResult);
    });

    test('getUserGuilds should retrieve user guilds', async () => {
      const accessToken = 'test-access-token';
      const mockResult = {
        success: true,
        guilds: [
          { id: 'guild1', name: 'Test Guild 1' },
          { id: 'guild2', name: 'Test Guild 2' }
        ]
      };

      mockReq.headers = { authorization: `Bearer ${accessToken}` };
      mockAuthService.getUserGuilds.mockResolvedValueOnce(mockResult);

      await controller.getUserGuilds(mockReq as HttpRequest, mockRes as HttpResponse);

      expect(mockAuthService.getUserGuilds).toHaveBeenCalledWith(accessToken);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.status(200)?.json).toHaveBeenCalledWith(mockResult);
    });

    test('getUserGuilds should handle missing token', async () => {
      mockReq.headers = {};

      await controller.getUserGuilds(mockReq as HttpRequest, mockRes as HttpResponse);

      expect(mockAuthService.getUserGuilds).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    test('revokeToken should revoke an access token', async () => {
      const token = 'test-token';
      const mockResult = { success: true };

      mockReq.body = { token };
      mockAuthService.revokeToken.mockResolvedValueOnce(mockResult);

      await controller.revokeToken(mockReq as HttpRequest, mockRes as HttpResponse);

      expect(mockAuthService.revokeToken).toHaveBeenCalledWith(token);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.status(200)?.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('Bot Commands API', () => {
    test('registerCommand should call botService and return registered command', async () => {
      const mockGuildId = 'test-guild';
      const mockCommand = {
        name: 'test-command',
        description: 'A test command',
        type: 1
      };
      
      mockReq.query = { guildId: mockGuildId };
      mockReq.body = mockCommand;
      
      mockBotService.registerCommand.mockResolvedValueOnce({
        success: true,
        data: mockCommand
      });
      
      await controller.registerCommand(mockReq as HttpRequest, mockRes as HttpResponse);
      
      expect(mockBotService.registerCommand).toHaveBeenCalledWith(mockGuildId, mockCommand);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
    
    test('getCommands should call botService and return commands', async () => {
      const mockGuildId = 'test-guild';
      const mockCommands = [
        { name: 'command-1', description: 'First command', type: 1 }
      ];
      
      mockReq.query = { guildId: mockGuildId };
      
      mockBotService.getCommands.mockResolvedValueOnce({
        success: true,
        data: mockCommands
      });
      
      await controller.getCommands(mockReq as HttpRequest, mockRes as HttpResponse);
      
      expect(mockBotService.getCommands).toHaveBeenCalledWith(mockGuildId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.status(200)!.json).toHaveBeenCalledWith({
        success: true,
        data: mockCommands
      });
    });
    
    test('sendChannelMessage should call botService and return result', async () => {
      const mockChannelId = 'test-channel';
      const mockMessage = 'Hello world';
      
      mockReq.query = { channelId: mockChannelId };
      mockReq.body = { message: mockMessage };
      
      mockBotService.sendChannelMessage.mockResolvedValueOnce({
        success: true,
        data: { id: 'message-id', content: mockMessage }
      });
      
      await controller.sendChannelMessage(mockReq as HttpRequest, mockRes as HttpResponse);
      
      expect(mockBotService.sendChannelMessage).toHaveBeenCalledWith(mockChannelId, mockMessage);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
    
    test('handleActivityRequest should call botService and return result', async () => {
      const mockActivityRequest = {
        activity: 'test-activity',
        action: 'test-action',
        data: { someData: 'value' }
      };
      
      mockReq.body = mockActivityRequest;
      
      const mockResponse = {
        activity: mockActivityRequest.activity,
        action: mockActivityRequest.action,
        result: { processed: true },
        processed: true,
        timestamp: expect.any(String)
      };
      
      mockBotService.processActivityRequest.mockResolvedValueOnce(mockResponse);
      
      await controller.handleActivityRequest(mockReq as HttpRequest, mockRes as HttpResponse);
      
      expect(mockBotService.processActivityRequest).toHaveBeenCalledWith(mockActivityRequest);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.status(200)!.json).toHaveBeenCalledWith(mockResponse);
    });
    
    test('handleActivityRequest should validate request data', async () => {
      mockReq.body = { activity: 'test-activity' }; // Missing action
      
      await controller.handleActivityRequest(mockReq as HttpRequest, mockRes as HttpResponse);
      
      expect(mockBotService.processActivityRequest).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
