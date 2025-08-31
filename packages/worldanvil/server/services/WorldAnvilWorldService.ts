/**
 * World Anvil World Service
 * Service for interacting with World Anvil world endpoints
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { WorldAnvilApiService } from './WorldAnvilApiService';
import { WorldAnvilWorld, WorldAnvilWorldResponse } from '../../models/WorldAnvilWorld';

export interface WorldListOptions {
  page?: number;
  limit?: number;
  sort?: 'creation_date' | 'title';
  order?: 'asc' | 'desc';
}

export interface WorldListResponse {
  worlds: WorldAnvilWorldResponse[];
  total: number;
  page: number;
  pages: number;
}

export class WorldAnvilWorldService {
  private apiService: WorldAnvilApiService;
  private apiClient: WorldAnvilApiClient;
  
  constructor(apiService: WorldAnvilApiService) {
    this.apiService = apiService;
    this.apiClient = apiService.getClient();
  }

  /**
   * Get a list of worlds owned by the authenticated user
   */
  async getMyWorlds(options: WorldListOptions = {}): Promise<{ worlds: WorldAnvilWorld[], pagination: { total: number, page: number, pages: number } }> {
    const response = await this.apiClient.get<WorldListResponse>('/user/worlds', { 
      params: options 
    });
    
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
   * Get a list of worlds owned by a specific user
   * @param userId The ID of the user
   */
  async getWorldsByUser(userId: string, options: WorldListOptions = {}): Promise<{ worlds: WorldAnvilWorld[], pagination: { total: number, page: number, pages: number } }> {
    const response = await this.apiClient.get<WorldListResponse>(`/user/${userId}/worlds`, { 
      params: options 
    });
    
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
   */
  async getWorldById(worldId: string): Promise<WorldAnvilWorld> {
    const response = await this.apiClient.get<WorldAnvilWorldResponse>(`/world/${worldId}`);
    return this.mapWorldResponse(response);
  }

  /**
   * Get a world by slug
   * @param slug The slug of the world to get
   */
  async getWorldBySlug(slug: string): Promise<WorldAnvilWorld> {
    const response = await this.apiClient.get<WorldAnvilWorldResponse>(`/world/slug/${slug}`);
    return this.mapWorldResponse(response);
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
