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
 * Interface for block template data with varying levels of detail
 */
export interface BlockTemplateResponse {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // For additional properties based on the schema
}

/**
 * Interface for block template creation input
 */
export interface BlockTemplateInput {
  name: string;
  description?: string;
  is_public?: boolean;
  [key: string]: any; // For additional properties
}

/**
 * Interface for block template update input
 */
export interface BlockTemplateUpdateInput {
  name?: string;
  description?: string;
  is_public?: boolean;
  [key: string]: any; // For additional properties
}

/**
 * Interface for block template part reference
 */
export interface BlockTemplatePartRef {
  id: string;
  name: string;
  description?: string;
  block_template_id: string;
  [key: string]: any; // For additional properties based on the schema
}

/**
 * Interface for block template part data with varying levels of detail
 */
export interface BlockTemplatePartResponse {
  id: string;
  name: string;
  description?: string;
  block_template_id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // For additional properties based on the schema
}

/**
 * Interface for block template part creation input
 */
export interface BlockTemplatePartInput {
  name: string;
  description?: string;
  block_template: {
    id: string;
  };
  [key: string]: any; // For additional properties
}

/**
 * Interface for block template part update input
 */
export interface BlockTemplatePartUpdateInput {
  name?: string;
  description?: string;
  [key: string]: any; // For additional properties
}

/**
 * Interface for API response from blocktemplate-blocktemplateparts endpoint
 */
export interface BlockTemplatePartsResponse {
  success: boolean;
  entities: BlockTemplatePartRef[];
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

  // Block Template endpoints (from blocktemplate.yml)

  /**
   * Get a block template by ID
   * @param templateId The ID of the block template
   * @param granularity The level of detail to return (-1, 0, 1, or 2)
   * @returns Block template data at specified granularity
   * 
   * TODO: Implement based on docs/boromir/yml/parts/blocktemplate/blocktemplate.yml
   */
  async getBlockTemplateById(templateId: string, granularity: '-1' | '0' | '1' | '2' = '0'): Promise<BlockTemplateResponse> {
    return this.apiClient.get<BlockTemplateResponse>('/blocktemplate', {
      params: {
        id: templateId,
        granularity
      }
    });
  }

  /**
   * Create a new block template
   * @param templateData The block template data to create
   * @returns Created block template reference
   * 
   * TODO: Implement based on docs/boromir/yml/parts/blocktemplate/blocktemplate.yml
   */
  async createBlockTemplate(templateData: BlockTemplateInput): Promise<BlockTemplateRef> {
    return this.apiClient.put<BlockTemplateRef>('/blocktemplate', templateData);
  }

  /**
   * Update an existing block template
   * @param templateId The ID of the block template to update
   * @param templateData The updated block template data
   * @returns Updated block template reference
   * 
   * TODO: Implement based on docs/boromir/yml/parts/blocktemplate/blocktemplate.yml
   */
  async updateBlockTemplate(templateId: string, templateData: BlockTemplateUpdateInput): Promise<BlockTemplateRef> {
    return this.apiClient.patch<BlockTemplateRef>('/blocktemplate', templateData, {
      params: {
        id: templateId
      }
    });
  }

  /**
   * Delete a block template
   * @param templateId The ID of the block template to delete
   * @returns Success response
   * 
   * TODO: Implement based on docs/boromir/yml/parts/blocktemplate/blocktemplate.yml
   */
  async deleteBlockTemplate(templateId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/blocktemplate', {
      params: {
        id: templateId
      }
    });
  }

  // Block Template Part endpoints (from blocktemplatepart.yml)

  /**
   * Get a block template part by ID
   * @param partId The ID of the block template part
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Block template part data at specified granularity
   * 
   * TODO: Implement based on docs/boromir/yml/parts/blocktemplate/blocktemplatepart.yml
   */
  async getBlockTemplatePartById(partId: string, granularity: '-1' | '0' | '2' = '0'): Promise<BlockTemplatePartResponse> {
    return this.apiClient.get<BlockTemplatePartResponse>('/blocktemplatepart', {
      params: {
        id: partId,
        granularity
      }
    });
  }

  /**
   * Create a new block template part
   * @param partData The block template part data to create (requires name and block_template.id)
   * @returns Created block template part reference
   * 
   * TODO: Implement based on docs/boromir/yml/parts/blocktemplate/blocktemplatepart.yml
   */
  async createBlockTemplatePart(partData: BlockTemplatePartInput): Promise<BlockTemplatePartRef> {
    return this.apiClient.put<BlockTemplatePartRef>('/blocktemplatepart', partData);
  }

  /**
   * Update an existing block template part
   * @param partId The ID of the block template part to update
   * @param partData The updated block template part data
   * @returns Updated block template part reference
   * 
   * TODO: Implement based on docs/boromir/yml/parts/blocktemplate/blocktemplatepart.yml
   */
  async updateBlockTemplatePart(partId: string, partData: BlockTemplatePartUpdateInput): Promise<BlockTemplatePartRef> {
    return this.apiClient.patch<BlockTemplatePartRef>('/blocktemplatepart', partData, {
      params: {
        id: partId
      }
    });
  }

  /**
   * Delete a block template part
   * @param partId The ID of the block template part to delete
   * @returns Success response
   * 
   * TODO: Implement based on docs/boromir/yml/parts/blocktemplate/blocktemplatepart.yml
   */
  async deleteBlockTemplatePart(partId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/blocktemplatepart', {
      params: {
        id: partId
      }
    });
  }

  /**
   * Get parts in a block template
   * @param templateId The ID of the block template
   * @param options Options for pagination
   * @returns List of block template parts in the block template
   * 
   * TODO: Implement based on docs/boromir/yml/parts/blocktemplate/blocktemplate-blocktemplateparts.yml
   */
  async getPartsByBlockTemplate(templateId: string, options: { offset?: number; limit?: number } = {}): Promise<BlockTemplatePartsResponse> {
    return this.apiClient.post<BlockTemplatePartsResponse>('/blocktemplate-blocktemplateparts', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: templateId }
    });
  }
}
