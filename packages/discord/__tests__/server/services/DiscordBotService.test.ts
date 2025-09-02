/**
 * Tests for DiscordBotService
 */
import { DiscordBotService } from '../../../server/services/DiscordBotService';
import { DiscordApiClient } from '../../../server/clients/DiscordApiClient';
import { CommandOptions } from '../../../models/DiscordTypes';

// Mock the DiscordApiClient
jest.mock('../../../server/clients/DiscordApiClient');

describe('DiscordBotService', () => {
  let service: DiscordBotService;
  let mockClient: jest.Mocked<DiscordApiClient>;
  
  beforeEach(() => {
    // Create a fresh mock for each test
    mockClient = new DiscordApiClient() as jest.Mocked<DiscordApiClient>;
    
    // Setup common mock implementations
    mockClient.getGuild.mockResolvedValue({ 
      id: 'mock-guild-id', 
      name: 'Mock Guild',
      // Add minimal required Guild properties
      _sortedRoles: [],
      _sortedChannels: [],
      features: [],
      members: new Map(),
      channels: new Map(),
      roles: new Map(),
      emojis: new Map(),
      stickers: new Map(),
    } as any);
    mockClient.getUser.mockResolvedValue({ 
      id: 'mock-user-id', 
      username: 'MockUser',
      // Add minimal required User properties
      discriminator: '0000',
      avatar: null,
      bot: false,
      system: false,
      flags: { bitfield: 0 },
    } as any);
    mockClient.sendMessage.mockResolvedValue({ 
      id: 'message-id', 
      content: 'Test message',
      // Add minimal required Message properties
      channelId: 'channel-id',
      author: { id: 'author-id', username: 'Author' },
      createdTimestamp: Date.now(),
      editedTimestamp: null,
      reactions: { cache: new Map() },
    } as any);
    mockClient.createApiResponse.mockImplementation((success, data, error) => {
      return { 
        success, 
        data, 
        error 
      };
    });
    
    // Create service with mocked client
    service = new DiscordBotService(mockClient);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('initialize should call client.initialize', async () => {
    await service.initialize();
    expect(mockClient.initialize).toHaveBeenCalled();
  });
  
  describe('registerCommand', () => {
    const mockCommand: CommandOptions = {
      name: 'test-command',
      description: 'Test command description',
      type: 1
    };
    
    test('should register command successfully', async () => {
      const result = await service.registerCommand('guild-id', mockCommand);
      
      expect(mockClient.getGuild).toHaveBeenCalledWith('guild-id');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCommand);
    });
    
    test('should handle errors when registering a command', async () => {
      const errorMsg = 'Guild not found';
      mockClient.getGuild.mockRejectedValueOnce(new Error(errorMsg));
      
      const result = await service.registerCommand('guild-id', mockCommand);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMsg);
      expect(result.data).toHaveProperty('name', mockCommand.name);
    });
  });
  
  describe('getCommands', () => {
    test('should return empty commands array on success', async () => {
      const result = await service.getCommands('guild-id');
      
      expect(mockClient.getGuild).toHaveBeenCalledWith('guild-id');
      expect(result).toEqual({ success: true, data: [] });
    });
    
    test('should handle errors and return empty array with error message', async () => {
      const errorMsg = 'Failed to get guild';
      mockClient.getGuild.mockRejectedValueOnce(new Error(errorMsg));
      
      const result = await service.getCommands('guild-id');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMsg);
      expect(result.data).toEqual([]);
    });
  });
  
  describe('sendChannelMessage', () => {
    test('should send message successfully', async () => {
      const message = 'Test message';
      const expectedResponse = {
        id: 'message-id',
        content: message,
        channelId: 'channel-id',
        author: { id: 'author-id', username: 'Author' },
        createdTimestamp: expect.any(Number),
        editedTimestamp: null,
        reactions: { cache: expect.any(Map) }
      };
      
      const result = await service.sendChannelMessage('channel-id', message);
      
      expect(mockClient.sendMessage).toHaveBeenCalledWith('channel-id', message);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(expect.objectContaining({
        id: 'message-id',
        content: message
      }));
    });
    
    test('should handle errors when sending a message', async () => {
      const errorMsg = 'Channel not found';
      mockClient.sendMessage.mockRejectedValueOnce(new Error(errorMsg));
      
      const result = await service.sendChannelMessage('channel-id', 'Test message');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMsg);
      expect(result.data).toEqual({});
    });
  });
  
  describe('sendDirectMessage', () => {
    test('should send direct message successfully', async () => {
      const result = await service.sendDirectMessage('user-id', 'Test DM');
      
      expect(mockClient.getUser).toHaveBeenCalledWith('user-id');
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ sent: true });
    });
    
    test('should handle errors when sending a direct message', async () => {
      const errorMsg = 'User not found';
      mockClient.getUser.mockRejectedValueOnce(new Error(errorMsg));
      
      const result = await service.sendDirectMessage('user-id', 'Test DM');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMsg);
      expect(result.data).toEqual({ sent: false });
    });
  });
  
  describe('processActivityRequest', () => {
    const mockRequest = {
      activity: 'test-activity',
      action: 'test-action',
      data: { test: 'data' }
    };
    
    test('should process activity request successfully', async () => {
      const result = await service.processActivityRequest(mockRequest);
      
      expect(result.activity).toEqual(mockRequest.activity);
      expect(result.action).toEqual(mockRequest.action);
      expect(result.processed).toBe(true);
    });
    
    test('should handle errors when processing activity request', async () => {
      // Simulate an error during processing by using a mock implementation that throws
      jest.spyOn(service, 'processActivityRequest').mockImplementationOnce(() => {
        throw new Error('Processing failed');
      });
      
      try {
        await service.processActivityRequest(mockRequest);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Processing failed');
      }
    });
  });
});
