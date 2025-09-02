/**
 * World Anvil Notebook Service
 * Service for interacting with World Anvil notebook endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 * 
 * NOTE: According to the API docs, this endpoint will be replaced with a /user/notebooks endpoint in the future
 * and currently does not work.
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  NotebookRef,
  NotebookResponse,
  NotebookInput,
  NotebookUpdateInput,
  WorldNotebooksResponse,
  NotebookListOptions
} from '../../models/WorldAnvilNotebook';

/**
 * Service for World Anvil notebook operations
 */
export class WorldAnvilNotebookService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilNotebookService
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
   * Get a notebook by ID
   * @param notebookId The ID of the notebook to get
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Notebook data at specified granularity
   */
  async getNotebookById(notebookId: string, granularity: '-1' | '0' | '2' = '0'): Promise<NotebookResponse> {
    return this.apiClient.get<NotebookResponse>('/notebook', {
      params: {
        id: notebookId,
        granularity
      }
    });
  }

  /**
   * Create a new notebook
   * @param notebookData The notebook data to create (requires title and world.id)
   * @returns Created notebook reference
   */
  async createNotebook(notebookData: NotebookInput): Promise<NotebookRef> {
    return this.apiClient.put<NotebookRef>('/notebook', notebookData);
  }

  /**
   * Update an existing notebook
   * @param notebookId The ID of the notebook to update
   * @param notebookData The updated notebook data
   * @returns Updated notebook reference
   */
  async updateNotebook(notebookId: string, notebookData: NotebookUpdateInput): Promise<NotebookRef> {
    return this.apiClient.patch<NotebookRef>('/notebook', notebookData, {
      params: {
        id: notebookId
      }
    });
  }

  /**
   * Delete a notebook
   * @param notebookId The ID of the notebook to delete
   * @returns Success response
   */
  async deleteNotebook(notebookId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/notebook', {
      params: {
        id: notebookId
      }
    });
  }

  /**
   * Get a list of notebooks in a world
   * Based on world-notebooks.yml POST endpoint
   * 
   * NOTE: According to API docs, this endpoint will be replaced with /user/notebooks
   * in the future and may not currently work.
   * 
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getNotebooksByWorld(worldId: string, options: NotebookListOptions = {}): Promise<WorldNotebooksResponse> {
    // Using POST as specified in the world-notebooks.yml specification
    return this.apiClient.post<WorldNotebooksResponse>('/world-notebooks', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: worldId }
    });
  }
  
  // Note: Additional notebook-related endpoints like Notesection
  // can be implemented as needed in future updates.
}