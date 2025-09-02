/**
 * Tests for WorldAnvilTimelineService
 */

import { WorldAnvilTimelineService } from '../../../server/services/WorldAnvilTimelineService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import {
  TimelineRef,
  TimelineResponse,
  TimelineInput,
  TimelineUpdateInput,
  WorldTimelinesResponse,
  TimelineListOptions
} from '../../../models/WorldAnvilTimeline';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilTimelineService', () => {
  // Mock data
  const mockTimelineResponse: TimelineResponse = {
    id: 'timeline-123',
    title: 'Test Timeline',
    world: {
      id: 'world-456',
      title: 'Test World'
    },
    description: 'This is a test timeline',
    creation_date: '2023-01-01T12:00:00Z',
    update_date: '2023-01-02T12:00:00Z'
  };

  const mockTimelineInput: TimelineInput = {
    title: 'Test Timeline',
    world: {
      id: 'world-456'
    },
    description: 'This is a test timeline'
  };

  const mockTimelineUpdateInput: TimelineUpdateInput = {
    title: 'Updated Timeline Title',
    description: 'Updated timeline description'
  };

  const mockTimelineRef: TimelineRef = {
    id: 'timeline-123',
    title: 'Test Timeline'
  };

  const mockWorldTimelinesResponse: WorldTimelinesResponse = {
    success: true,
    entities: [
      {
        id: 'timeline-123',
        title: 'Test Timeline'
      },
      {
        id: 'timeline-456',
        title: 'Another Timeline'
      }
    ]
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilTimelineService;

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
    service = new WorldAnvilTimelineService(mockApiClient);
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
      const newService = new WorldAnvilTimelineService();
      expect(newService).toBeDefined();
    });
  });

  describe('getTimelineById', () => {
    it('should get a timeline by ID with default granularity', async () => {
      // Setup
      const timelineId = 'timeline-123';
      mockApiClient.get.mockResolvedValue(mockTimelineResponse);

      // Execute
      const result = await service.getTimelineById(timelineId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/timeline', { 
        params: {
          id: timelineId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockTimelineResponse);
    });

    it('should get a timeline with custom granularity', async () => {
      // Setup
      const timelineId = 'timeline-123';
      const granularity = '2';
      mockApiClient.get.mockResolvedValue(mockTimelineResponse);

      // Execute
      const result = await service.getTimelineById(timelineId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/timeline', { 
        params: {
          id: timelineId,
          granularity
        }
      });
      expect(result).toEqual(mockTimelineResponse);
    });
  });

  describe('createTimeline', () => {
    it('should create a new timeline', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockTimelineRef);

      // Execute
      const result = await service.createTimeline(mockTimelineInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/timeline', mockTimelineInput);
      expect(result).toEqual(mockTimelineRef);
    });
  });

  describe('updateTimeline', () => {
    it('should update an existing timeline', async () => {
      // Setup
      const timelineId = 'timeline-123';
      mockApiClient.patch.mockResolvedValue(mockTimelineRef);

      // Execute
      const result = await service.updateTimeline(timelineId, mockTimelineUpdateInput);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/timeline', mockTimelineUpdateInput, {
        params: {
          id: timelineId
        }
      });
      expect(result).toEqual(mockTimelineRef);
    });
  });

  describe('deleteTimeline', () => {
    it('should delete a timeline', async () => {
      // Setup
      const timelineId = 'timeline-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteTimeline(timelineId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/timeline', {
        params: {
          id: timelineId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getTimelinesByWorld', () => {
    it('should get timelines by world with default options', async () => {
      // Setup
      const worldId = 'world-456';
      mockApiClient.post.mockResolvedValue(mockWorldTimelinesResponse);

      // Execute
      const result = await service.getTimelinesByWorld(worldId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-timelines', {
        offset: 0,
        limit: 50
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldTimelinesResponse);
    });

    it('should get timelines by world with custom options', async () => {
      // Setup
      const worldId = 'world-456';
      const options: TimelineListOptions = {
        offset: 10,
        limit: 25
      };
      mockApiClient.post.mockResolvedValue(mockWorldTimelinesResponse);

      // Execute
      const result = await service.getTimelinesByWorld(worldId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-timelines', {
        offset: 10,
        limit: 25
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldTimelinesResponse);
    });
  });
});
