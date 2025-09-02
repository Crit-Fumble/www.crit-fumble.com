/**
 * World Anvil Variable Service
 * Service for interacting with World Anvil variable endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import { WorldAnvilVariable, WorldAnvilVariableCollection } from '../../models/WorldAnvilVariable';

/**
 * Interface for creating a variable
 */
export interface WorldAnvilVariableInput {
  k: string; // key (name)
  v: string; // value
  type: 'string' | 'number' | 'boolean' | 'json';
  collection: string; // collection ID
  world: string; // world ID
}

/**
 * Interface for updating a variable
 */
export interface WorldAnvilVariableUpdate {
  k?: string; // key (name)
  v?: string; // value
  type?: 'string' | 'number' | 'boolean' | 'json';
  collection?: string; // collection ID
}

/**
 * Interface for creating a variable collection
 */
export interface WorldAnvilVariableCollectionInput {
  title: string;
  world: string;
  is_private?: boolean;
}

/**
 * Interface for updating a variable collection
 */
export interface WorldAnvilVariableCollectionUpdate {
  title?: string;
  is_private?: boolean;
}

/**
 * Interface for pagination options
 */
export interface PaginationOptions {
  offset?: number;
  limit?: number;
}

/**
 * Interface for variable list response
 */
export interface VariableListResponse {
  success: boolean;
  entities: WorldAnvilVariable[];
}

/**
 * Interface for variable collection list response
 */
export interface VariableCollectionListResponse {
  success: boolean;
  entities: WorldAnvilVariableCollection[];
}

/**
 * Service for World Anvil variable operations
 */
export class WorldAnvilVariableService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilVariableService
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
   * Get a variable by ID
   * @param variableId The ID of the variable to get
   * @param granularity The detail level of the response (-1 to 2)
   */
  async getVariable(variableId: string, granularity: number = 0): Promise<WorldAnvilVariable> {
    return this.apiClient.get<WorldAnvilVariable>('/variable', {
      params: { id: variableId, granularity: granularity.toString() }
    });
  }

  /**
   * Create a new variable
   * @param variableData The variable data
   */
  async createVariable(variableData: WorldAnvilVariableInput): Promise<WorldAnvilVariable> {
    return this.apiClient.put<WorldAnvilVariable>('/variable', variableData);
  }

  /**
   * Update an existing variable
   * @param variableId The ID of the variable to update
   * @param variableData The updated variable data
   */
  async updateVariable(variableId: string, variableData: WorldAnvilVariableUpdate): Promise<WorldAnvilVariable> {
    return this.apiClient.put<WorldAnvilVariable>('/variable', {
      id: variableId,
      ...variableData
    });
  }

  /**
   * Delete a variable
   * @param variableId The ID of the variable to delete
   */
  async deleteVariable(variableId: string): Promise<void> {
    await this.apiClient.delete('/variable', {
      params: { id: variableId }
    });
  }

  /**
   * List variables in a specific variable collection
   * @param collectionId The collection ID
   * @param options Pagination options
   */
  async listVariablesByCollection(collectionId: string, options: PaginationOptions = {}): Promise<WorldAnvilVariable[]> {
    const response = await this.apiClient.post<VariableListResponse>('/variable_collection/variables', options, {
      params: { id: collectionId }
    });
    
    return response.entities || [];
  }

  /**
   * Get a variable collection by ID
   * @param collectionId The ID of the collection to get
   * @param granularity The detail level of the response (-1, 0, or 2)
   */
  async getVariableCollection(collectionId: string, granularity: number = 0): Promise<WorldAnvilVariableCollection> {
    return this.apiClient.get<WorldAnvilVariableCollection>('/variable_collection', {
      params: { id: collectionId, granularity: granularity.toString() }
    });
  }

  /**
   * Create a new variable collection
   * @param collectionData The collection data
   */
  async createVariableCollection(collectionData: WorldAnvilVariableCollectionInput): Promise<WorldAnvilVariableCollection> {
    return this.apiClient.put<WorldAnvilVariableCollection>('/variable_collection', collectionData);
  }

  /**
   * Update an existing variable collection
   * @param collectionId The ID of the collection to update
   * @param collectionData The updated collection data
   */
  async updateVariableCollection(collectionId: string, collectionData: WorldAnvilVariableCollectionUpdate): Promise<WorldAnvilVariableCollection> {
    return this.apiClient.put<WorldAnvilVariableCollection>('/variable_collection', {
      id: collectionId,
      ...collectionData
    });
  }

  /**
   * Delete a variable collection
   * @param collectionId The ID of the collection to delete
   */
  async deleteVariableCollection(collectionId: string): Promise<void> {
    await this.apiClient.delete('/variable_collection', {
      params: { id: collectionId }
    });
  }

  /**
   * List variable collections in a specific world
   * @param worldId The world ID
   * @param options Pagination options
   */
  async listVariableCollectionsByWorld(worldId: string, options: PaginationOptions = {}): Promise<WorldAnvilVariableCollection[]> {
    const response = await this.apiClient.post<VariableCollectionListResponse>('/world/variablecollections', options, {
      params: { id: worldId }
    });
    
    return response.entities || [];
  }
}
