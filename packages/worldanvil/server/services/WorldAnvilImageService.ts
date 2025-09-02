/**
 * World Anvil Image Service
 * Service for interacting with World Anvil image endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  ImageRef,
  ImageResponse,
  ImageUpdateInput,
  WorldImagesResponse,
  ImageListOptions
} from '../../models/WorldAnvilImage';

/**
 * Service for World Anvil image operations
 */
export class WorldAnvilImageService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilImageService
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
   * Get an image by ID
   * @param imageId The ID of the image to get
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Image data at specified granularity
   */
  async getImageById(imageId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ImageResponse> {
    return this.apiClient.get<ImageResponse>('/image', {
      params: {
        id: imageId,
        granularity
      }
    });
  }

  /**
   * Update an existing image's metadata
   * Note: Updating the actual image binary is not supported via API
   * @param imageId The ID of the image to update
   * @param imageData The updated image metadata
   * @returns Updated image reference
   */
  async updateImage(imageId: string, imageData: ImageUpdateInput): Promise<ImageRef> {
    return this.apiClient.patch<ImageRef>('/image', imageData, {
      params: {
        id: imageId
      }
    });
  }

  /**
   * Delete an image
   * @param imageId The ID of the image to delete
   * @returns Success response
   */
  async deleteImage(imageId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/image', {
      params: {
        id: imageId
      }
    });
  }

  /**
   * Get a list of images in a world
   * Based on world-images.yml POST endpoint
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getImagesByWorld(worldId: string, options: ImageListOptions = {}): Promise<WorldImagesResponse> {
    // Using POST as specified in the world-images.yml specification
    return this.apiClient.post<WorldImagesResponse>('/world-images', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: worldId }
    });
  }

  /**
   * Note: Image creation via API is not yet implemented according to the specs
   * The Boromir API documentation explicitly states that image upload is not yet available
   */
}
