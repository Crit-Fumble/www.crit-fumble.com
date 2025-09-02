// FUTURE: implement World Anvil API v2, boromir
// NOTE: see general docs @ https://www.worldanvil.com/api/external/boromir/documentation
// NOTE: see detailed implementation docs @ https://www.worldanvil.com/api/external/boromir/swagger-documentation

/**
 * World Anvil Article Service
 * Service for interacting with World Anvil article endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  WorldAnvilArticleInput,
  ArticleListOptions,
  WorldAnvilArticleResponse,
  ArticleListResponse
} from '../../models/WorldAnvilArticle';

// ArticleListOptions is now imported from the models directory

// ArticleListResponse is now imported from the models directory

/**
 * Service for World Anvil article operations
 */
export class WorldAnvilArticleService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilArticleService
   * @param customClient Optional client for testing/dependency injection
   */
  constructor(customClient?: WorldAnvilApiClient) {
    if (customClient) {
      this.apiClient = customClient;
    } else {
      const config = getWorldAnvilConfig();
      this.apiClient = new WorldAnvilApiClient({
        apiUrl: config.apiUrl,
        apiKey: config.apiKey,
        accessToken: config.accessToken
      });
    }
  }

  /**
   * Get a list of articles
   * @param options Options for filtering and pagination
   */
  async getArticles(options: ArticleListOptions = {}): Promise<{ 
    articles: WorldAnvilArticleResponse[], 
    pagination: { total: number, page: number, pages: number } 
  }> {
    const response = await this.apiClient.get<ArticleListResponse>('/article', { 
      params: options 
    });
    
    return {
      articles: response.articles,
      pagination: {
        total: response.total,
        page: response.page,
        pages: response.pages
      }
    };
  }

  /**
   * Get an article by ID
   * @param articleId The ID of the article to get
   * @param granularity The level of detail to include (-1 to 3)
   */
  async getArticleById(articleId: string, granularity: '-1' | '0' | '1' | '2' | '3' = '0'): Promise<WorldAnvilArticleResponse> {
    return this.apiClient.get<WorldAnvilArticleResponse>('/article', { 
      params: {
        id: articleId,
        granularity
      }
    });
  }

  /**
   * Get an article by slug
   * @param worldId The world ID
   * @param slug The article slug
   */
  async getArticleBySlug(worldId: string, slug: string): Promise<WorldAnvilArticleResponse> {
    return this.apiClient.get<WorldAnvilArticleResponse>(`/article/slug/${worldId}/${slug}`);
  }

  /**
   * Create a new article
   * @param articleData The article data
   */
  async createArticle(articleData: WorldAnvilArticleInput): Promise<WorldAnvilArticleResponse> {
    return this.apiClient.put<WorldAnvilArticleResponse>('/article', articleData);
  }

  /**
   * Update an existing article
   * @param articleId The ID of the article to update
   * @param articleData The updated article data
   */
  async updateArticle(articleId: string, articleData: Partial<WorldAnvilArticleInput>): Promise<WorldAnvilArticleResponse> {
    return this.apiClient.patch<WorldAnvilArticleResponse>('/article', articleData, {
      params: {
        id: articleId
      }
    });
  }

  /**
   * Delete an article
   * @param articleId The ID of the article to delete
   * @returns Success response object
   */
  async deleteArticle(articleId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/article', {
      params: {
        id: articleId
      }
    });
  }

  /**
   * Get articles in a specific world
   * Based on world-articles.yml POST endpoint
   * @param worldId The ID of the world to retrieve articles from
   * @param options Options for filtering and pagination
   */
  async getArticlesByWorld(worldId: string, options: { 
    offset?: number; 
    limit?: number; 
    category?: string;
  } = {}): Promise<{ 
    success: boolean;
    entities: Array<{
      id: string;
      title: string;
      slug: string;
      [key: string]: any;
    }>;
  }> {
    // Using POST as specified in the world-articles.yml specification
    return this.apiClient.post<{
      success: boolean;
      entities: Array<{
        id: string;
        title: string;
        slug: string;
        [key: string]: any;
      }>;
    }>('/world-articles', {
      offset: options.offset || 0,
      limit: options.limit || 50,
      category: options.category
    }, {
      params: { id: worldId }
    });
  }

  /**
   * Get articles in a specific category
   * @param categoryId The ID of the category
   * @param options Options for filtering and pagination
   */
  async getArticlesByCategory(categoryId: string, options: Omit<ArticleListOptions, 'category_id'> = {}): Promise<{ 
    articles: WorldAnvilArticleResponse[], 
    pagination: { total: number, page: number, pages: number } 
  }> {
    return this.getArticles({
      ...options,
      category_id: categoryId
    });
  }
}