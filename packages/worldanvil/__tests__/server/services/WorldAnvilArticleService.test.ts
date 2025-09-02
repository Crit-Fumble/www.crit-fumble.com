/**
 * Tests for WorldAnvilArticleService
 */

import { WorldAnvilArticleService } from '../../../server/services/WorldAnvilArticleService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import {
  WorldAnvilArticleInput,
  ArticleListOptions,
  WorldAnvilArticleResponse,
  ArticleListResponse
} from '../../../models/WorldAnvilArticle';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilArticleService', () => {
  // Mock data
  const mockArticleResponse: WorldAnvilArticleResponse = {
    id: 'article-123',
    title: 'Test Article',
    content: '<p>This is a test article</p>',
    template: 'default',
    slug: 'test-article',
    world: {
      id: 'world-456',
      title: 'Test World'
    },
    category: {
      id: 'category-789',
      title: 'Test Category'
    },
    state: 'public',
    is_wip: false,
    creation_date: '2023-01-01T12:00:00Z',
    update_date: '2023-01-02T12:00:00Z',
    tags: ['fantasy', 'test'],
    wordcount: 100
  };

  const mockArticleInput: WorldAnvilArticleInput = {
    title: 'Test Article',
    content: '<p>This is a test article</p>',
    template: 'default',
    world: {
      id: 'world-456'
    },
    category: {
      id: 'category-789'
    }
  };

  const mockArticleListResponse: ArticleListResponse = {
    articles: [
      mockArticleResponse,
      {
        ...mockArticleResponse,
        id: 'article-456',
        title: 'Another Article',
        slug: 'another-article'
      }
    ],
    total: 2,
    page: 1,
    pages: 1
  };

  const mockWorldArticlesResponse = {
    success: true,
    entities: [
      {
        id: 'article-123',
        title: 'Test Article',
        slug: 'test-article'
      },
      {
        id: 'article-456',
        title: 'Another Article',
        slug: 'another-article'
      }
    ]
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilArticleService;

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
    service = new WorldAnvilArticleService(mockApiClient);
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
      const newService = new WorldAnvilArticleService();
      expect(newService).toBeDefined();
    });
  });

  describe('getArticles', () => {
    it('should get articles with default options', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockArticleListResponse);

      // Execute
      const result = await service.getArticles();

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/article', { params: {} });
      expect(result).toEqual({
        articles: mockArticleListResponse.articles,
        pagination: {
          total: 2,
          page: 1,
          pages: 1
        }
      });
    });

    it('should get articles with custom options', async () => {
      // Setup
      const options: ArticleListOptions = {
        page: 2,
        limit: 10,
        sort: 'title',
        order: 'asc',
        category_id: 'category-789'
      };
      mockApiClient.get.mockResolvedValue(mockArticleListResponse);

      // Execute
      const result = await service.getArticles(options);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/article', { params: options });
      expect(result.pagination).toEqual({
        total: 2,
        page: 1,
        pages: 1
      });
    });
  });

  describe('getArticleById', () => {
    it('should get an article by ID with default granularity', async () => {
      // Setup
      const articleId = 'article-123';
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      // Execute
      const result = await service.getArticleById(articleId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/article', { 
        params: {
          id: articleId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockArticleResponse);
    });

    it('should get an article with custom granularity', async () => {
      // Setup
      const articleId = 'article-123';
      const granularity = '2';
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      // Execute
      const result = await service.getArticleById(articleId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/article', { 
        params: {
          id: articleId,
          granularity
        }
      });
      expect(result).toEqual(mockArticleResponse);
    });
  });

  describe('getArticleBySlug', () => {
    it('should get an article by slug', async () => {
      // Setup
      const worldId = 'world-456';
      const slug = 'test-article';
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      // Execute
      const result = await service.getArticleBySlug(worldId, slug);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith(`/article/slug/${worldId}/${slug}`);
      expect(result).toEqual(mockArticleResponse);
    });
  });

  describe('createArticle', () => {
    it('should create a new article', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockArticleResponse);

      // Execute
      const result = await service.createArticle(mockArticleInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/article', mockArticleInput);
      expect(result).toEqual(mockArticleResponse);
    });
  });

  describe('updateArticle', () => {
    it('should update an existing article', async () => {
      // Setup
      const articleId = 'article-123';
      const updateData: Partial<WorldAnvilArticleInput> = {
        title: 'Updated Title',
        content: '<p>Updated content</p>'
      };
      mockApiClient.patch.mockResolvedValue(mockArticleResponse);

      // Execute
      const result = await service.updateArticle(articleId, updateData);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/article', updateData, {
        params: {
          id: articleId
        }
      });
      expect(result).toEqual(mockArticleResponse);
    });
  });

  describe('deleteArticle', () => {
    it('should delete an article', async () => {
      // Setup
      const articleId = 'article-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteArticle(articleId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/article', {
        params: {
          id: articleId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getArticlesByWorld', () => {
    it('should get articles by world with default options', async () => {
      // Setup
      const worldId = 'world-456';
      mockApiClient.post.mockResolvedValue(mockWorldArticlesResponse);

      // Execute
      const result = await service.getArticlesByWorld(worldId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-articles', {
        offset: 0,
        limit: 50,
        category: undefined
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldArticlesResponse);
    });

    it('should get articles by world with custom options', async () => {
      // Setup
      const worldId = 'world-456';
      const options = {
        offset: 10,
        limit: 25,
        category: 'category-789'
      };
      mockApiClient.post.mockResolvedValue(mockWorldArticlesResponse);

      // Execute
      const result = await service.getArticlesByWorld(worldId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-articles', {
        offset: 10,
        limit: 25,
        category: 'category-789'
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldArticlesResponse);
    });
  });

  describe('getArticlesByCategory', () => {
    it('should get articles by category with default options', async () => {
      // Setup
      const categoryId = 'category-789';
      mockApiClient.get.mockResolvedValue(mockArticleListResponse);

      // Execute
      const result = await service.getArticlesByCategory(categoryId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/article', {
        params: {
          category_id: categoryId
        }
      });
      expect(result).toEqual({
        articles: mockArticleListResponse.articles,
        pagination: {
          total: 2,
          page: 1,
          pages: 1
        }
      });
    });

    it('should get articles by category with custom options', async () => {
      // Setup
      const categoryId = 'category-789';
      const options = {
        page: 2,
        limit: 15,
        sort: 'title'
      };
      mockApiClient.get.mockResolvedValue(mockArticleListResponse);

      // Execute
      const result = await service.getArticlesByCategory(categoryId, options);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/article', {
        params: {
          ...options,
          category_id: categoryId
        }
      });
      expect(result).toEqual({
        articles: mockArticleListResponse.articles,
        pagination: {
          total: 2,
          page: 1,
          pages: 1
        }
      });
    });
  });
});
