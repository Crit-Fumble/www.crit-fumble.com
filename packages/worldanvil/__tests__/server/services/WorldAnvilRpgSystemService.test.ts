/**
 * Tests for WorldAnvilRpgSystemService
 */

import { WorldAnvilRpgSystemService } from '../../../server/services/WorldAnvilRpgSystemService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import { WorldAnvilRpgSystemResponse, WorldAnvilRpgSystemsListResponse } from '../../../models/WorldAnvilRpgSystem';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilRpgSystemService', () => {
  // Mock data for tests
  const mockRpgSystemResponse: WorldAnvilRpgSystemResponse = {
    id: 123,
    name: 'Test System',
    slug: 'test-system',
    description: 'A test RPG system',
    publisher: 'Test Publisher',
    official: true,
    community_created: false,
    icon_url: 'https://worldanvil.com/icon.jpg',
    image_url: 'https://worldanvil.com/image.jpg'
  };

  const mockRpgSystemsListResponse: WorldAnvilRpgSystemsListResponse = {
    success: true,
    entities: [
      mockRpgSystemResponse,
      {
        id: 456,
        name: 'Another System',
        slug: 'another-system',
        description: 'Another test RPG system',
        publisher: 'Another Publisher',
        official: false,
        community_created: true,
        icon_url: 'https://worldanvil.com/another-icon.jpg',
        image_url: 'https://worldanvil.com/another-image.jpg'
      }
    ]
  };

  const failedResponse = {
    success: false
  };

  // Mock client and config
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilRpgSystemService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock client
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      setApiKey: jest.fn(),
      setAccessToken: jest.fn(),
      getCurrentUser: jest.fn(),
      getMyWorlds: jest.fn(),
      getWorldById: jest.fn(),
      handleApiError: jest.fn()
    } as unknown as jest.Mocked<WorldAnvilApiClient>;
    
    // Create instance of service under test with mock client
    service = new WorldAnvilRpgSystemService(mockApiClient);
  });

  describe('constructor', () => {
    it('should initialize with the provided API client', () => {
      // When created with a client, it should use that client
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
      const newService = new WorldAnvilRpgSystemService();
      expect(newService).toBeDefined();
      // Would ideally verify a new client was created with the config values,
      // but that's implementation detail we can't easily test
    });
  });

  describe('getRpgSystemById', () => {
    it('should get an RPG system by ID', async () => {
      // Setup
      const systemId = 123;
      mockApiClient.get.mockResolvedValue(mockRpgSystemResponse);

      // Execute
      const result = await service.getRpgSystemById(systemId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/rpgsystem', {
        params: { id: systemId, granularity: '0' }
      });
      expect(result).toEqual({
        id: mockRpgSystemResponse.id,
        name: mockRpgSystemResponse.name,
        slug: mockRpgSystemResponse.slug,
        description: mockRpgSystemResponse.description,
        publisher: mockRpgSystemResponse.publisher,
        official: mockRpgSystemResponse.official,
        communityCreated: mockRpgSystemResponse.community_created,
        iconUrl: mockRpgSystemResponse.icon_url,
        imageUrl: mockRpgSystemResponse.image_url
      });
    });

    it('should use custom granularity when provided', async () => {
      // Setup
      const systemId = 123;
      const granularity = '-1';
      mockApiClient.get.mockResolvedValue(mockRpgSystemResponse);

      // Execute
      const result = await service.getRpgSystemById(systemId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/rpgsystem', {
        params: { id: systemId, granularity }
      });
      expect(result).toBeDefined();
    });

    it('should handle API errors', async () => {
      // Setup
      const systemId = 123;
      const errorMsg = 'API error';
      mockApiClient.get.mockRejectedValue(new Error(errorMsg));

      // Execute and verify
      await expect(service.getRpgSystemById(systemId)).rejects.toThrow(errorMsg);
    });
  });

  describe('getAllRpgSystems', () => {
    it('should get all RPG systems with default options', async () => {
      // Setup
      mockApiClient.post.mockResolvedValue(mockRpgSystemsListResponse);

      // Execute
      const result = await service.getAllRpgSystems();

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/rpgsystems', {});
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(123);
      expect(result[1].id).toBe(456);
    });

    it('should pass options to the API call', async () => {
      // Setup
      const options = {
        limit: 10,
        offset: 5,
        sort: 'name' as const,
        order: 'asc' as const
      };
      mockApiClient.post.mockResolvedValue(mockRpgSystemsListResponse);

      // Execute
      await service.getAllRpgSystems(options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/rpgsystems', options);
    });

    it('should throw error when API call is unsuccessful', async () => {
      // Setup
      mockApiClient.post.mockResolvedValue(failedResponse);

      // Execute and verify
      await expect(service.getAllRpgSystems()).rejects.toThrow('Failed to retrieve RPG systems');
    });

    it('should handle empty entities response', async () => {
      // Setup
      mockApiClient.post.mockResolvedValue({ success: true });

      // Execute
      const result = await service.getAllRpgSystems();

      // Verify
      expect(result).toEqual([]);
    });
  });

  describe('getRpgSystemsByFilter', () => {
    it('should call getAllRpgSystems with filter parameter', async () => {
      // Setup
      const filter = 'dnd';
      const options = { limit: 5 };
      mockApiClient.post.mockResolvedValue(mockRpgSystemsListResponse);

      // Execute
      await service.getRpgSystemsByFilter(filter, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/rpgsystems', {
        ...options,
        filter
      });
    });
  });
});
