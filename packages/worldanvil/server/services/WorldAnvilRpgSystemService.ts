/**
 * World Anvil RPG System Service
 * Service for interacting with World Anvil RPG system endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 * Specifically follows rpgsystem.yml and rpgsystems.yml specifications
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { WorldAnvilRpgSystem, WorldAnvilRpgSystemResponse, WorldAnvilRpgSystemsListResponse } from '../../models/WorldAnvilRpgSystem';
import { getWorldAnvilConfig } from '../configs';

/**
 * RPG system granularity options as defined in rpgsystem.yml
 */
export type RpgSystemGranularity = '-1' | '0';

/**
 * Options for retrieving a specific RPG system
 */
export interface RpgSystemOptions {
  granularity?: RpgSystemGranularity; // Granularity level for RPG system details
}

/**
 * Options for listing RPG systems
 */
export interface RpgSystemListOptions {
  offset?: number;
  limit?: number;
  filter?: string; // For filtering by name
  sort?: 'name' | 'popularity';
  order?: 'asc' | 'desc';
}

/**
 * Response for RPG system operations
 */
export interface RpgSystemResponse {
  success: boolean;
  entities?: WorldAnvilRpgSystemResponse[];
}

export class WorldAnvilRpgSystemService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilRpgSystemService
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
   * Get an RPG system by ID
   * @param id The ID of the RPG system to retrieve
   * @param granularity The level of detail to return (-1 or 0 as per API spec)
   */
  async getRpgSystemById(id: number, granularity: RpgSystemGranularity = '0'): Promise<WorldAnvilRpgSystem> {
    const response = await this.apiClient.get<WorldAnvilRpgSystemResponse>('/rpgsystem', { 
      params: { id, granularity }
    });
    return this.mapRpgSystemResponse(response);
  }

  /**
   * Get a list of all available RPG systems
   * Based on the POST operation in rpgsystems.yml
   * @param options Options for filtering and pagination
   */
  async getAllRpgSystems(options: RpgSystemListOptions = {}): Promise<WorldAnvilRpgSystem[]> {
    // Using POST as specified in the API documentation
    const response = await this.apiClient.post<WorldAnvilRpgSystemsListResponse>('/rpgsystems', options);
    
    if (!response.success) {
      throw new Error('Failed to retrieve RPG systems');
    }
    
    return (response.entities || []).map(system => this.mapRpgSystemResponse(system));
  }

  /**
   * Get RPG systems by filter
   * @param filter Filter string to search for in RPG system names
   * @param options Additional options for pagination and sorting
   */
  async getRpgSystemsByFilter(filter: string, options: Omit<RpgSystemListOptions, 'filter'> = {}): Promise<WorldAnvilRpgSystem[]> {
    return this.getAllRpgSystems({
      ...options,
      filter
    });
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
