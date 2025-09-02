/**
 * World Anvil Manuscript Service
 * Service for interacting with World Anvil manuscript endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  ManuscriptRef,
  ManuscriptResponse,
  ManuscriptInput,
  ManuscriptUpdateInput,
  WorldManuscriptsResponse,
  ManuscriptListOptions
} from '../../models/WorldAnvilManuscript';

/**
 * Service for World Anvil manuscript operations
 */
export class WorldAnvilManuscriptService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilManuscriptService
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
   * Get a manuscript by ID
   * @param manuscriptId The ID of the manuscript to get
   * @param granularity The level of detail to return (-1 to 2)
   * @returns Manuscript data at specified granularity
   */
  async getManuscriptById(manuscriptId: string, granularity: '-1' | '0' | '1' | '2' = '0'): Promise<ManuscriptResponse> {
    return this.apiClient.get<ManuscriptResponse>('/manuscript', {
      params: {
        id: manuscriptId,
        granularity
      }
    });
  }

  /**
   * Create a new manuscript
   * @param manuscriptData The manuscript data to create (requires title and world.id)
   * @returns Created manuscript reference
   */
  async createManuscript(manuscriptData: ManuscriptInput): Promise<ManuscriptRef> {
    return this.apiClient.put<ManuscriptRef>('/manuscript', manuscriptData);
  }

  /**
   * Update an existing manuscript
   * @param manuscriptId The ID of the manuscript to update
   * @param manuscriptData The updated manuscript data
   * @returns Updated manuscript reference
   */
  async updateManuscript(manuscriptId: string, manuscriptData: ManuscriptUpdateInput): Promise<ManuscriptRef> {
    return this.apiClient.patch<ManuscriptRef>('/manuscript', manuscriptData, {
      params: {
        id: manuscriptId
      }
    });
  }

  /**
   * Delete a manuscript
   * @param manuscriptId The ID of the manuscript to delete
   * @returns Success response
   */
  async deleteManuscript(manuscriptId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/manuscript', {
      params: {
        id: manuscriptId
      }
    });
  }

  /**
   * Get a list of manuscripts in a world
   * Based on world-manuscripts.yml POST endpoint
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getManuscriptsByWorld(worldId: string, options: ManuscriptListOptions = {}): Promise<WorldManuscriptsResponse> {
    // Using POST as specified in the world-manuscripts.yml specification
    return this.apiClient.post<WorldManuscriptsResponse>('/world-manuscripts', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: worldId }
    });
  }
  
  // Note: Additional manuscript-related endpoints like Manuscript Beat, Bookmark, Part, Version, Tag, etc.
  // can be implemented as needed in future updates.
}