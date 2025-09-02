/**
 * World Anvil Canvas Service
 * Service for interacting with World Anvil canvas endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  CanvasRef,
  CanvasResponse,
  CanvasInput,
  WorldCanvasesResponse,
  CanvasListOptions
} from '../../models/WorldAnvilCanvas';

/**
 * Service for World Anvil canvas operations
 */
export class WorldAnvilCanvasService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilCanvasService
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
   * Get a canvas by ID
   * @param canvasId The ID of the canvas to get
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Canvas data
   */
  async getCanvasById(canvasId: string, granularity: '-1' | '0' | '2' = '0'): Promise<CanvasResponse> {
    return this.apiClient.get<CanvasResponse>('/canvas', {
      params: {
        id: canvasId,
        granularity
      }
    });
  }

  /**
   * Create a new canvas
   * @param canvasData The canvas data to create
   * @returns Created canvas reference
   */
  async createCanvas(canvasData: CanvasInput): Promise<CanvasRef> {
    return this.apiClient.put<CanvasRef>('/canvas', canvasData);
  }

  /**
   * Update an existing canvas
   * @param canvasId The ID of the canvas to update
   * @param canvasData The updated canvas data
   * @returns Updated canvas reference
   */
  async updateCanvas(canvasId: string, canvasData: Partial<CanvasInput>): Promise<CanvasRef> {
    return this.apiClient.patch<CanvasRef>('/canvas', canvasData, {
      params: {
        id: canvasId
      }
    });
  }

  /**
   * Delete a canvas
   * @param canvasId The ID of the canvas to delete
   * @returns Success response
   */
  async deleteCanvas(canvasId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/canvas', {
      params: {
        id: canvasId
      }
    });
  }

  /**
   * Get a list of canvases in a world
   * Based on world-canvases.yml POST endpoint
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getCanvasesByWorld(worldId: string, options: CanvasListOptions = {}): Promise<WorldCanvasesResponse> {
    // Using POST as specified in the world-canvases.yml specification
    return this.apiClient.post<WorldCanvasesResponse>('/world-canvases', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: worldId }
    });
  }
}
