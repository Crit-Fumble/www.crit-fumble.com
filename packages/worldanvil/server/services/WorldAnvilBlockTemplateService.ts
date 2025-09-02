/**
 * World Anvil Block Template Service
 * Service for interacting with World Anvil block template endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';

/**
 * Interface for block template reference
 */
export interface BlockTemplateRef {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  is_public: boolean;
  [key: string]: any; // For additional properties based on the schema
}

/**
 * Interface for API response from user-blocktemplates endpoint
 */
export interface UserBlockTemplatesResponse {
  success: boolean;
  entities: BlockTemplateRef[];
}

/**
 * Interface for request options to get block templates
 */
export interface BlockTemplateListOptions {
  offset?: number;
  limit?: number;
}

/**
 * Service for World Anvil block template operations
 */
export class WorldAnvilBlockTemplateService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilBlockTemplateService
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
   * Get a list of block templates by user
   * Based on user-blocktemplates.yml POST endpoint
   * @param userId The ID of the user
   * @param options Options for pagination
   */
  async getBlockTemplatesByUser(userId: string, options: BlockTemplateListOptions = {}): Promise<UserBlockTemplatesResponse> {
    // Using POST as specified in the user-blocktemplates.yml specification
    return this.apiClient.post<UserBlockTemplatesResponse>('/user-blocktemplates', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: userId }
    });
  }

  /**
   * Get the block templates for the current user
   * Uses the identity endpoint to get the user ID first
   * @param options Options for pagination
   */
  async getMyBlockTemplates(options: BlockTemplateListOptions = {}): Promise<UserBlockTemplatesResponse> {
    // First, get the current user's identity to get their ID
    const identity = await this.apiClient.get<{ id: string }>('/identity');
    
    if (!identity || !identity.id) {
      throw new Error('Failed to get current user identity');
    }
    
    // Use the getBlockTemplatesByUser method which follows the user-blocktemplates.yml specification
    return this.getBlockTemplatesByUser(identity.id, options);
  }
}
