/**
 * Tests for WorldAnvilWorldService
 */

import { WorldAnvilWorldService, WorldListOptions, WorldListResponse } from '../../../server/services/WorldAnvilWorldService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import { WorldAnvilWorld, WorldAnvilWorldResponse } from '../../../models/WorldAnvilWorld';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilWorldService', () => {
  // Mock data
  const mockWorldResponse: WorldAnvilWorldResponse = {
    id: 'world-123',
    title: 'Test World',
    slug: 'test-world',
    description: 'A test world for unit tests',
    creation_date: '2023-01-01T12:00:00Z',
    tags: ['fantasy', 'medieval'],
    genres: ['rpg'],
    image_url: 'https://worldanvil.com/world-image.jpg',
    visibility: 'public',
    owner: {
      id: 'user-456',
      username: 'testuser'
    }
  };

  const mockWorld: WorldAnvilWorld = {
    id: 'world-123',
    title: 'Test World',
    slug: 'test-world',
    description: 'A test world for unit tests',
    creation_date: '2023-01-01T12:00:00Z',
    tags: ['fantasy', 'medieval'],
    genres: ['rpg'],
    image_url: 'https://worldanvil.com/world-image.jpg',
    visibility: 'public',
    owner_id: 'user-456',
    is_author_world: false
  };

  const mockWorldListResponse: WorldListResponse = {
    worlds: [mockWorldResponse, {
      ...mockWorldResponse,
      id: 'world-456',
      title: 'Another World',
      slug: 'another-world'
    }],
    total: 2,
    page: 1,
    pages: 1
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilWorldService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock client
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      setApiKey: jest.fn(),
      setAccessToken: jest.fn()
    } as unknown as jest.Mocked<WorldAnvilApiClient>;

    // Create instance of service under test
    service = new WorldAnvilWorldService(mockApiClient);
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
      const newService = new WorldAnvilWorldService();
      expect(newService).toBeDefined();
    });
  });

  describe('getMyWorlds', () => {
    it('should throw an error if identity retrieval fails', async () => {
      // Setup
      mockApiClient.get.mockImplementation((path) => {
        if (path === '/identity') {
          return Promise.resolve(null);
        } else {
          return Promise.resolve(mockWorldListResponse);
        }
      });
      
      // Execute and verify
      await expect(service.getMyWorlds()).rejects.toThrow('Failed to get current user identity');
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
    });

    it('should throw an error if identity has no id', async () => {
      // Setup
      mockApiClient.get.mockImplementation((path) => {
        if (path === '/identity') {
          return Promise.resolve({ name: 'User without ID' });
        } else {
          return Promise.resolve(mockWorldListResponse);
        }
      });
      
      // Execute and verify
      await expect(service.getMyWorlds()).rejects.toThrow('Failed to get current user identity');
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
    });
    
    it('should get worlds owned by the authenticated user with default options', async () => {
      // Setup
      mockApiClient.get.mockImplementation((path) => {
        if (path === '/identity') {
          return Promise.resolve({ id: 'user-456' });
        } else {
          return Promise.resolve(mockWorldListResponse);
        }
      });
      
      mockApiClient.post.mockResolvedValue(mockWorldListResponse);

      // Execute
      const result = await service.getMyWorlds();

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/user-worlds', {}, { params: { id: 'user-456' } });
      expect(result).toEqual({
        worlds: [
          mockWorld,
          {
            ...mockWorld,
            id: 'world-456',
            title: 'Another World',
            slug: 'another-world'
          }
        ],
        pagination: {
          total: 2,
          page: 1,
          pages: 1
        }
      });
    });

    it('should get worlds with custom options', async () => {
      // Setup
      const options: WorldListOptions = {
        page: 2,
        limit: 10,
        sort: 'title',
        order: 'asc'
      };
      mockApiClient.get.mockImplementation((path) => {
        if (path === '/identity') {
          return Promise.resolve({ id: 'user-456' });
        } else {
          return Promise.resolve(mockWorldListResponse);
        }
      });
      
      mockApiClient.post.mockResolvedValue(mockWorldListResponse);

      // Execute
      const result = await service.getMyWorlds(options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/user-worlds', options, { params: { id: 'user-456' } });
      expect(result.pagination).toEqual({
        total: 2,
        page: 1,
        pages: 1
      });
    });
  });

  describe('getWorldsByUser', () => {
    it('should get worlds owned by a specific user with default options', async () => {
      // Setup
      const userId = 'user-456';
      mockApiClient.post.mockResolvedValue({
        worlds: [mockWorldResponse, {
          ...mockWorldResponse,
          id: 'world-456',
          title: 'Another World',
          slug: 'another-world'
        }],
        total: 2,
        page: 1,
        pages: 1
      });

      // Execute
      const result = await service.getWorldsByUser(userId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/user-worlds', {}, { params: { id: userId } });
      expect(result.worlds).toHaveLength(2);
      expect(result.worlds[0].id).toBe('world-123');
      expect(result.worlds[1].id).toBe('world-456');
    });

    it('should get worlds with custom options', async () => {
      // Setup
      const userId = 'user-456';
      const options: WorldListOptions = {
        page: 2,
        limit: 10,
        sort: 'creation_date',
        order: 'desc'
      };
      mockApiClient.post.mockResolvedValue({
        worlds: [mockWorldResponse, {
          ...mockWorldResponse,
          id: 'world-456',
          title: 'Another World',
          slug: 'another-world'
        }],
        total: 2,
        page: 1,
        pages: 1
      });

      // Execute
      const result = await service.getWorldsByUser(userId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/user-worlds', options, { params: { id: userId } });
      expect(result.pagination).toEqual({
        total: 2,
        page: 1,
        pages: 1
      });
    });
  });

  describe('getWorldById', () => {
    it('should get a world by ID', async () => {
      // Setup
      const worldId = 'world-123';
      mockApiClient.get.mockResolvedValue(mockWorldResponse);

      // Execute
      const result = await service.getWorldById(worldId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/world', {
        params: { id: worldId, granularity: '-1' }
      });
      expect(result).toEqual(mockWorld);
    });
  });

  describe('getWorldBySlug', () => {
    it('should get a world by slug', async () => {
      // Setup
      const slug = 'test-world';
      mockApiClient.get.mockResolvedValue(mockWorldResponse);

      // Execute
      const result = await service.getWorldBySlug(slug);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/world/by-slug', {
        params: { slug: slug, granularity: '-1' }
      });
      expect(result).toEqual(mockWorld);
    });
  });

  describe('createWorld', () => {
    it('should create a new world', async () => {
      // Setup
      const worldData = {
        title: 'New Test World',
        description: 'A newly created test world',
        excerpt: 'Short description',
        tags: ['fantasy', 'medieval'],
        genres: ['rpg'],
        visibility: 'public' as 'public' | 'private' | 'unlisted'
      };
      mockApiClient.put.mockResolvedValue(mockWorldResponse);

      // Execute
      const result = await service.createWorld(worldData);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/world', worldData);
      expect(result).toEqual(mockWorld);
    });
  });

  describe('updateWorld', () => {
    it('should update an existing world', async () => {
      // Setup
      const worldId = 'world-123';
      const worldData = {
        title: 'Updated World',
        description: 'An updated world description'
      };
      const expectedParams = {
        id: worldId,
        title: 'Updated World',
        description: 'An updated world description'
      };
      mockApiClient.put.mockResolvedValue({
        ...mockWorldResponse,
        title: 'Updated World',
        description: 'An updated world description'
      });

      // Execute
      const result = await service.updateWorld(worldId, worldData);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/world', expectedParams);
      expect(result.title).toBe('Updated World');
      expect(result.description).toBe('An updated world description');
    });
  });

  describe('deleteWorld', () => {
    it('should delete a world', async () => {
      // Setup
      const worldId = 'world-123';
      mockApiClient.delete.mockResolvedValue({ success: true });

      // Execute
      const result = await service.deleteWorld(worldId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/world', {
        params: { id: worldId }
      });
      expect(result).toBe(true);
    });

    it('should return false if deletion fails', async () => {
      // Setup
      const worldId = 'world-123';
      mockApiClient.delete.mockResolvedValue({ success: false });

      // Execute
      const result = await service.deleteWorld(worldId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/world', {
        params: { id: worldId }
      });
      expect(result).toBe(false);
    });
  });

  describe('mapWorldResponse', () => {
    it('should properly map API response to internal model', async () => {
      // Setup - we need to call a public method to test the private mapWorldResponse
      mockApiClient.get.mockResolvedValue(mockWorldResponse);
      
      // Execute
      const result = await service.getWorldById('world-123');
      
      // Verify the mapping logic
      expect(result).toEqual({
        id: mockWorldResponse.id,
        title: mockWorldResponse.title,
        slug: mockWorldResponse.slug,
        description: mockWorldResponse.description,
        creation_date: mockWorldResponse.creation_date,
        tags: mockWorldResponse.tags,
        genres: mockWorldResponse.genres,
        image_url: mockWorldResponse.image_url,
        visibility: mockWorldResponse.visibility as 'public' | 'private' | 'unlisted',
        owner_id: mockWorldResponse.owner?.id,
        is_author_world: false
      });
    });

    it('should correctly set is_author_world flag when owner is author', async () => {
      // Setup - response with author username
      const authorWorldResponse = {
        ...mockWorldResponse,
        owner: {
          id: 'author-123',
          username: 'author'
        }
      };
      mockApiClient.get.mockResolvedValue(authorWorldResponse);
      
      // Execute
      const result = await service.getWorldById('world-123');
      
      // Verify the mapping logic
      expect(result.is_author_world).toBe(true);
    });
  });
});
