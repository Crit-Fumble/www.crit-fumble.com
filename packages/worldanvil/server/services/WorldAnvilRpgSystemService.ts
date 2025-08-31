/**
 * World Anvil RPG System Service
 * Service for interacting with World Anvil RPG system endpoints
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { WorldAnvilApiService } from './WorldAnvilApiService';
import { WorldAnvilRpgSystem, WorldAnvilRpgSystemResponse, WorldAnvilRpgSystemsListResponse } from '../../models/WorldAnvilRpgSystem';

export interface RpgSystemOptions {
  granularity?: '-1' | '0'; // Granularity level for RPG system details
}

export class WorldAnvilRpgSystemService {
  private apiService: WorldAnvilApiService;
  private apiClient: WorldAnvilApiClient;
  
  constructor(apiService: WorldAnvilApiService) {
    this.apiService = apiService;
    this.apiClient = apiService.getClient();
  }

  /**
   * Get an RPG system by ID
   * @param id The ID of the RPG system to retrieve
   * @param options Optional parameters for the request
   */
  async getRpgSystemById(id: number, options: RpgSystemOptions = {}): Promise<WorldAnvilRpgSystem> {
    const params = {
      id,
      granularity: options.granularity || '0'
    };

    const response = await this.apiClient.get<WorldAnvilRpgSystemResponse>('/rpgsystem', { params });
    return this.mapRpgSystemResponse(response);
  }

  /**
   * Get a list of all available RPG systems
   */
  async getAllRpgSystems(): Promise<WorldAnvilRpgSystem[]> {
    const response = await this.apiClient.post<WorldAnvilRpgSystemsListResponse>('/rpgsystems');
    
    if (!response.success) {
      throw new Error('Failed to retrieve RPG systems');
    }
    
    return response.entities.map(system => this.mapRpgSystemResponse(system));
  }

  /**
   * Convert World Anvil API response to our internal model
   */
  private mapRpgSystemResponse(response: WorldAnvilRpgSystemResponse): WorldAnvilRpgSystem {
    return {
      id: response.id,
      name: response.name,
      slug: response.slug,
      description: response.description,
      publisher: response.publisher,
      official: response.official,
      communityCreated: response.community_created,
      iconUrl: response.icon_url,
      imageUrl: response.image_url
    };
  }
}
