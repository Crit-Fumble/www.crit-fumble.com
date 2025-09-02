/**
 * Tests for WorldAnvilSubscriberGroupService
 */

import { WorldAnvilSubscriberGroupService } from '../../../server/services/WorldAnvilSubscriberGroupService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import {
  SubscriberGroupRef,
  SubscriberGroupResponse,
  SubscriberGroupInput,
  SubscriberGroupUpdateInput,
  WorldSubscriberGroupsResponse,
  SubscriberGroupListOptions
} from '../../../models/WorldAnvilSubscriberGroup';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilSubscriberGroupService', () => {
  // Mock data
  const mockSubscriberGroupResponse: SubscriberGroupResponse = {
    id: 'subscribergroup-123',
    title: 'Test Subscriber Group',
    slug: 'test-subscriber-group',
    world_id: 'world-456',
    user_id: 'user-789',
    description: 'This is a test subscriber group',
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-01-02T12:00:00Z'
  };

  const mockSubscriberGroupInput: SubscriberGroupInput = {
    title: 'Test Subscriber Group',
    world: {
      id: 'world-456'
    },
    description: 'This is a test subscriber group'
  };

  const mockSubscriberGroupUpdateInput: SubscriberGroupUpdateInput = {
    title: 'Updated Subscriber Group Title',
    description: 'Updated subscriber group description'
  };

  const mockSubscriberGroupRef: SubscriberGroupRef = {
    id: 'subscribergroup-123',
    title: 'Test Subscriber Group',
    slug: 'test-subscriber-group',
    world_id: 'world-456',
    user_id: 'user-789'
  };

  const mockWorldSubscriberGroupsResponse: WorldSubscriberGroupsResponse = {
    success: true,
    entities: [
      {
        id: 'subscribergroup-123',
        title: 'Test Subscriber Group',
        slug: 'test-subscriber-group',
        world_id: 'world-456',
        user_id: 'user-789'
      },
      {
        id: 'subscribergroup-456',
        title: 'Another Subscriber Group',
        slug: 'another-subscriber-group',
        world_id: 'world-456',
        user_id: 'user-789'
      }
    ]
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilSubscriberGroupService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock client
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      setApiKey: jest.fn(),
      setAccessToken: jest.fn()
    } as unknown as jest.Mocked<WorldAnvilApiClient>;

    // Create instance of service under test
    service = new WorldAnvilSubscriberGroupService(mockApiClient);
  });

  describe('constructor', () => {
    it('should initialize with the provided API client', () => {
      expect(service).toBeDefined();
    });
    
    it('should create a new client if none provided', () => {
      // Mock config values
      const mockConfig = {
        apiUrl: 'https://test.worldanvil.com',
        apiKey: 'test-key',
        accessToken: 'test-token'
      };
      
      // Setup the mock to return our config
      (configModule.getWorldAnvilConfig as jest.Mock).mockReturnValue(mockConfig);
      
      // Create service without providing a client
      const newService = new WorldAnvilSubscriberGroupService();
      expect(newService).toBeDefined();
    });
  });

  describe('getSubscriberGroupById', () => {
    it('should get a subscriber group by ID with default granularity', async () => {
      // Setup
      const subscriberGroupId = 'subscribergroup-123';
      mockApiClient.get.mockResolvedValue(mockSubscriberGroupResponse);

      // Execute
      const result = await service.getSubscriberGroupById(subscriberGroupId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/subscribergroup', { 
        params: {
          id: subscriberGroupId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockSubscriberGroupResponse);
    });

    it('should get a subscriber group with custom granularity', async () => {
      // Setup
      const subscriberGroupId = 'subscribergroup-123';
      const granularity = '1';
      mockApiClient.get.mockResolvedValue(mockSubscriberGroupResponse);

      // Execute
      const result = await service.getSubscriberGroupById(subscriberGroupId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/subscribergroup', { 
        params: {
          id: subscriberGroupId,
          granularity
        }
      });
      expect(result).toEqual(mockSubscriberGroupResponse);
    });
  });

  describe('createSubscriberGroup', () => {
    it('should create a new subscriber group', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockSubscriberGroupRef);

      // Execute
      const result = await service.createSubscriberGroup(mockSubscriberGroupInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/subscribergroup', mockSubscriberGroupInput);
      expect(result).toEqual(mockSubscriberGroupRef);
    });
  });

  describe('updateSubscriberGroup', () => {
    it('should update an existing subscriber group', async () => {
      // Setup
      const subscriberGroupId = 'subscribergroup-123';
      mockApiClient.patch.mockResolvedValue(mockSubscriberGroupRef);

      // Execute
      const result = await service.updateSubscriberGroup(subscriberGroupId, mockSubscriberGroupUpdateInput);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/subscribergroup', mockSubscriberGroupUpdateInput, {
        params: {
          id: subscriberGroupId
        }
      });
      expect(result).toEqual(mockSubscriberGroupRef);
    });
  });

  describe('deleteSubscriberGroup', () => {
    it('should delete a subscriber group', async () => {
      // Setup
      const subscriberGroupId = 'subscribergroup-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteSubscriberGroup(subscriberGroupId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/subscribergroup', {
        params: {
          id: subscriberGroupId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getSubscriberGroupsByWorld', () => {
    it('should get subscriber groups by world with default options', async () => {
      // Setup
      const worldId = 'world-456';
      mockApiClient.post.mockResolvedValue(mockWorldSubscriberGroupsResponse);

      // Execute
      const result = await service.getSubscriberGroupsByWorld(worldId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-subscribergroups', {
        offset: 0,
        limit: 50
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldSubscriberGroupsResponse);
    });

    it('should get subscriber groups by world with custom options', async () => {
      // Setup
      const worldId = 'world-456';
      const options: SubscriberGroupListOptions = {
        offset: 10,
        limit: 25
      };
      mockApiClient.post.mockResolvedValue(mockWorldSubscriberGroupsResponse);

      // Execute
      const result = await service.getSubscriberGroupsByWorld(worldId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-subscribergroups', {
        offset: 10,
        limit: 25
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldSubscriberGroupsResponse);
    });
  });
});
