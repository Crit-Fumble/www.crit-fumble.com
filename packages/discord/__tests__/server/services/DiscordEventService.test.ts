/**
 * Tests for DiscordEventService
 */
import { DiscordEventService } from '../../../server/services/DiscordEventService';
import { DiscordApiClient } from '../../../server/clients/DiscordApiClient';
// Import enums directly to avoid TS/Jest module resolution issues
const GuildScheduledEventStatus = {
  Scheduled: 1,
  Active: 2,
  Completed: 3,
  Cancelled: 4
};

// Mock the DiscordApiClient
jest.mock('../../../server/clients/DiscordApiClient');

describe('DiscordEventService', () => {
  let service: DiscordEventService;
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
    mockClient.createApiResponse.mockImplementation((success, data, error) => {
      return {
        success,
        data,
        error
      };
    });
    
    // Create service with mocked client
    service = new DiscordEventService(mockClient);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('initialize should call client.initialize', async () => {
    await service.initialize();
    expect(mockClient.initialize).toHaveBeenCalled();
  });
  
  describe('getGuildEvents', () => {
    test('should return empty events array on success', async () => {
      const result = await service.getGuildEvents('guild-id');
      
      expect(mockClient.getGuild).toHaveBeenCalledWith('guild-id');
      expect(result).toEqual({ success: true, data: [] });
    });
    
    test('should handle errors and return empty array with error message', async () => {
      const errorMsg = 'Failed to get guild';
      mockClient.getGuild.mockRejectedValueOnce(new Error(errorMsg));
      
      const result = await service.getGuildEvents('guild-id');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMsg);
      expect(result.data).toEqual([]);
    });
  });
  
  describe('createGuildEvent', () => {
    const mockEventInput = {
      name: 'Test Event',
      scheduled_start_time: '2023-01-01T12:00:00.000Z',
      entity_type: 2
    };
    
    test('should create event successfully', async () => {
      const result = await service.createGuildEvent('guild-id', mockEventInput);
      
      expect(mockClient.getGuild).toHaveBeenCalledWith('guild-id');
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('name', mockEventInput.name);
      expect(result.data).toHaveProperty('guild_id', 'guild-id');
    });
    
    test('should handle errors when creating an event', async () => {
      const errorMsg = 'Guild not found';
      mockClient.getGuild.mockRejectedValueOnce(new Error(errorMsg));
      
      const result = await service.createGuildEvent('guild-id', mockEventInput);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMsg);
      expect(result.data).toHaveProperty('status', GuildScheduledEventStatus.Cancelled);
    });
  });
  
  describe('updateGuildEvent', () => {
    const mockUpdateInput = {
      name: 'Updated Event',
      status: GuildScheduledEventStatus.Active
    };
    
    test('should update event successfully', async () => {
      const result = await service.updateGuildEvent('guild-id', 'event-id', mockUpdateInput);
      
      expect(mockClient.getGuild).toHaveBeenCalledWith('guild-id');
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id', 'event-id');
      expect(result.data).toHaveProperty('name', mockUpdateInput.name);
      expect(result.data).toHaveProperty('status', mockUpdateInput.status);
    });
    
    test('should handle errors when updating an event', async () => {
      const errorMsg = 'Event not found';
      mockClient.getGuild.mockRejectedValueOnce(new Error(errorMsg));
      
      const result = await service.updateGuildEvent('guild-id', 'event-id', mockUpdateInput);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMsg);
      expect(result.data).toHaveProperty('id', 'event-id');
      expect(result.data).toHaveProperty('status', GuildScheduledEventStatus.Cancelled);
    });
  });
  
  describe('deleteGuildEvent', () => {
    test('should delete event successfully', async () => {
      const result = await service.deleteGuildEvent('guild-id', 'event-id');
      
      expect(mockClient.getGuild).toHaveBeenCalledWith('guild-id');
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });
    
    test('should handle errors when deleting an event', async () => {
      const errorMsg = 'Event not found';
      mockClient.getGuild.mockRejectedValueOnce(new Error(errorMsg));
      
      const result = await service.deleteGuildEvent('guild-id', 'event-id');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain(errorMsg);
      expect(result.data).toBe(false);
    });
  });
});
