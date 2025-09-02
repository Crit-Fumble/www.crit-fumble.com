/**
 * World Anvil World Service
 * Service for interacting with World Anvil world endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import { WorldAnvilWorld, WorldAnvilWorldResponse } from '../../models/WorldAnvilWorld';

/**
 * World granularity options as defined in world.yml
 */
export type WorldGranularity = '-1' | '0' | '1';

/**
 * Input for creating or updating a world
 */
export interface WorldAnvilWorldInput {
  title: string;
  description?: string;
  excerpt?: string;
  tags?: string[];
  genres?: string[];
  image_url?: string;
  visibility?: 'public' | 'private' | 'unlisted';
  [key: string]: any; // For other fields that might be in the schema
}

/**
 * Options for listing worlds
 */
export interface WorldListOptions {
  page?: number;
  limit?: number;
  sort?: 'creation_date' | 'title';
  order?: 'asc' | 'desc';
}

/**
 * Response structure for world lists
 */
export interface WorldListResponse {
  worlds: WorldAnvilWorldResponse[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Response for delete operations
 */
export interface DeleteResponse {
  success: boolean;
}

export class WorldAnvilWorldService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilWorldService
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
   * Get a list of worlds owned by the authenticated user
   * @param options Options for pagination and sorting
   */
  async getMyWorlds(options: WorldListOptions = {}): Promise<{ worlds: WorldAnvilWorld[], pagination: { total: number, page: number, pages: number } }> {
    // First, get the current user's identity to get their ID
    const identity = await this.apiClient.get<{ id: string }>('/identity');
    
    if (!identity || !identity.id) {
      throw new Error('Failed to get current user identity');
    }
    
    // Use the getWorldsByUser method which follows the user-worlds.yml specification
    return this.getWorldsByUser(identity.id, options);
  }

  /**
   * Get a list of worlds owned by a specific user
   * Based on the POST operation in user-worlds.yml specification
   * @param userId The ID of the user
   * @param options Options for pagination and sorting
   */
  async getWorldsByUser(userId: string, options: WorldListOptions = {}): Promise<{ worlds: WorldAnvilWorld[], pagination: { total: number, page: number, pages: number } }> {
    // Using POST as specified in the API documentation (user-worlds.yml)
    const response = await this.apiClient.post<WorldListResponse>('/user-worlds', 
      // Request body contains pagination/sorting options
      options,
      // Query params contain the user ID
      { params: { id: userId } }
    );
    
    const worlds = response.worlds.map(world => this.mapWorldResponse(world));
    
    return {
      worlds,
      pagination: {
        total: response.total,
        page: response.page,
        pages: response.pages
      }
    };
  }

  /**
   * Get a world by ID
   * @param worldId The ID of the world to get
   * @param granularity The level of detail to return (-1, 0, or 1 as per API spec)
   */
  async getWorldById(worldId: string, granularity: WorldGranularity = '-1'): Promise<WorldAnvilWorld> {
    const response = await this.apiClient.get<WorldAnvilWorldResponse>('/world', {
      params: { id: worldId, granularity }
    });
    return this.mapWorldResponse(response);
  }

  /**
   * Get a world by slug
   * @param slug The slug of the world to get
   * @param granularity The level of detail to return (-1, 0, or 1 as per API spec)
   */
  async getWorldBySlug(slug: string, granularity: WorldGranularity = '-1'): Promise<WorldAnvilWorld> {
    // Note: This endpoint might need adjustment based on actual API implementation
    const response = await this.apiClient.get<WorldAnvilWorldResponse>('/world/by-slug', {
      params: { slug, granularity }
    });
    return this.mapWorldResponse(response);
  }
  
  /**
   * Create a new world
   * @param worldData The world data to create
   */
  async createWorld(worldData: WorldAnvilWorldInput): Promise<WorldAnvilWorld> {
    const response = await this.apiClient.put<WorldAnvilWorldResponse>('/world', worldData);
    return this.mapWorldResponse(response);
  }
  
  /**
   * Update an existing world
   * @param worldId The ID of the world to update
   * @param worldData The updated world data
   */
  async updateWorld(worldId: string, worldData: WorldAnvilWorldInput): Promise<WorldAnvilWorld> {
    // API uses PATCH but our client might not support it directly
    // Using PUT as fallback which the client supports
    const response = await this.apiClient.put<WorldAnvilWorldResponse>('/world', {
      id: worldId,
      ...worldData
    });
    return this.mapWorldResponse(response);
  }
  
  /**
   * Delete a world
   * @param worldId The ID of the world to delete
   */
  async deleteWorld(worldId: string): Promise<boolean> {
    const response = await this.apiClient.delete<DeleteResponse>('/world', {
      params: { id: worldId }
    });
    return response.success;
  }

  /**
   * Convert World Anvil API response to our internal model
   */
  private mapWorldResponse(response: WorldAnvilWorldResponse): WorldAnvilWorld {
    return {
      id: response.id,
      title: response.title,
      slug: response.slug,
      description: response.description,
      creation_date: response.creation_date,
      tags: response.tags,
      genres: response.genres,
      image_url: response.image_url,
      visibility: response.visibility as 'public' | 'private' | 'unlisted',
      owner_id: response.owner?.id,
      is_author_world: response.owner?.username === 'author' // Example logic, adjust based on actual API response
    };
  }
}
