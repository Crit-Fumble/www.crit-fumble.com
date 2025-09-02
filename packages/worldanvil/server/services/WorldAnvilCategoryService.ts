/**
 * World Anvil Category Service
 * Service for interacting with World Anvil category endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  CategoryRef,
  CategoryResponse,
  CategoryInput,
  WorldCategoriesResponse,
  CategoryListOptions
} from '../../models/WorldAnvilCategory';

/**
 * Service for World Anvil category operations
 */
export class WorldAnvilCategoryService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilCategoryService
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
   * Get a category by ID
   * @param categoryId The ID of the category to get
   * @param granularity The level of detail to return (-1, 0, 1, or 2)
   * @returns Category data at specified granularity
   */
  async getCategoryById(categoryId: string, granularity: '-1' | '0' | '1' | '2' = '0'): Promise<CategoryResponse> {
    return this.apiClient.get<CategoryResponse>('/category', {
      params: {
        id: categoryId,
        granularity
      }
    });
  }

  /**
   * Create a new category
   * @param categoryData The category data to create
   * @returns Created category reference
   */
  async createCategory(categoryData: CategoryInput): Promise<CategoryRef> {
    return this.apiClient.put<CategoryRef>('/category', categoryData);
  }

  /**
   * Update an existing category
   * @param categoryId The ID of the category to update
   * @param categoryData The updated category data
   * @returns Updated category reference
   */
  async updateCategory(categoryId: string, categoryData: Partial<CategoryInput>): Promise<CategoryRef> {
    return this.apiClient.patch<CategoryRef>('/category', categoryData, {
      params: {
        id: categoryId
      }
    });
  }

  /**
   * Delete a category
   * @param categoryId The ID of the category to delete
   * @returns Success response
   */
  async deleteCategory(categoryId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/category', {
      params: {
        id: categoryId
      }
    });
  }

  /**
   * Get a list of categories in a world
   * Based on world-categories.yml POST endpoint
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getCategoriesByWorld(worldId: string, options: CategoryListOptions = {}): Promise<WorldCategoriesResponse> {
    // Using POST as specified in the world-categories.yml specification
    return this.apiClient.post<WorldCategoriesResponse>('/world-categories', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: worldId }
    });
  }
}
