/**
 * Tests for WorldAnvilCategoryService
 */

import { WorldAnvilCategoryService } from '../../../server/services/WorldAnvilCategoryService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import {
  CategoryRef,
  CategoryResponse,
  CategoryInput,
  WorldCategoriesResponse,
  CategoryListOptions
} from '../../../models/WorldAnvilCategory';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilCategoryService', () => {
  // Mock data
  const mockCategoryResponse: CategoryResponse = {
    id: 'category-123',
    title: 'Test Category',
    slug: 'test-category',
    world: {
      id: 'world-456',
      title: 'Test World'
    },
    parent: null,
    description: 'This is a test category',
    state: 'public',
    template: 'default',
    creation_date: '2023-01-01T12:00:00Z',
    update_date: '2023-01-02T12:00:00Z'
  };

  const mockCategoryInput: CategoryInput = {
    title: 'Test Category',
    world: {
      id: 'world-456'
    },
    parent: null,
    description: 'This is a test category',
    template: 'default'
  };

  const mockCategoryRef: CategoryRef = {
    id: 'category-123',
    title: 'Test Category'
  };

  const mockWorldCategoriesResponse: WorldCategoriesResponse = {
    success: true,
    entities: [
      {
        id: 'category-123',
        title: 'Test Category'
      },
      {
        id: 'category-456',
        title: 'Another Category'
      }
    ]
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilCategoryService;

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
    service = new WorldAnvilCategoryService(mockApiClient);
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
      const newService = new WorldAnvilCategoryService();
      expect(newService).toBeDefined();
    });
  });

  describe('getCategoryById', () => {
    it('should get a category by ID with default granularity', async () => {
      // Setup
      const categoryId = 'category-123';
      mockApiClient.get.mockResolvedValue(mockCategoryResponse);

      // Execute
      const result = await service.getCategoryById(categoryId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/category', { 
        params: {
          id: categoryId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should get a category with custom granularity', async () => {
      // Setup
      const categoryId = 'category-123';
      const granularity = '2';
      mockApiClient.get.mockResolvedValue(mockCategoryResponse);

      // Execute
      const result = await service.getCategoryById(categoryId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/category', { 
        params: {
          id: categoryId,
          granularity
        }
      });
      expect(result).toEqual(mockCategoryResponse);
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockCategoryRef);

      // Execute
      const result = await service.createCategory(mockCategoryInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/category', mockCategoryInput);
      expect(result).toEqual(mockCategoryRef);
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      // Setup
      const categoryId = 'category-123';
      const updateData: Partial<CategoryInput> = {
        title: 'Updated Category Title',
        description: 'Updated description'
      };
      mockApiClient.patch.mockResolvedValue(mockCategoryRef);

      // Execute
      const result = await service.updateCategory(categoryId, updateData);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/category', updateData, {
        params: {
          id: categoryId
        }
      });
      expect(result).toEqual(mockCategoryRef);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      // Setup
      const categoryId = 'category-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteCategory(categoryId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/category', {
        params: {
          id: categoryId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getCategoriesByWorld', () => {
    it('should get categories by world with default options', async () => {
      // Setup
      const worldId = 'world-456';
      mockApiClient.post.mockResolvedValue(mockWorldCategoriesResponse);

      // Execute
      const result = await service.getCategoriesByWorld(worldId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-categories', {
        offset: 0,
        limit: 50
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldCategoriesResponse);
    });

    it('should get categories by world with custom options', async () => {
      // Setup
      const worldId = 'world-456';
      const options: CategoryListOptions = {
        offset: 10,
        limit: 25
      };
      mockApiClient.post.mockResolvedValue(mockWorldCategoriesResponse);

      // Execute
      const result = await service.getCategoriesByWorld(worldId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-categories', {
        offset: 10,
        limit: 25
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldCategoriesResponse);
    });
  });
});
