/**
 * World Anvil Secret Service
 * Service for interacting with World Anvil secret endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  SecretRef,
  SecretResponse,
  SecretInput,
  SecretUpdateInput,
  WorldSecretsResponse,
  SecretListOptions
} from '../../models/WorldAnvilSecret';

/**
 * Service for World Anvil secret operations
 */
export class WorldAnvilSecretService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilSecretService
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
   * Get a secret by ID
   * @param secretId The ID of the secret to get
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Secret data at specified granularity
   */
  async getSecretById(secretId: string, granularity: '-1' | '0' | '2' = '0'): Promise<SecretResponse> {
    return this.apiClient.get<SecretResponse>('/secret', {
      params: {
        id: secretId,
        granularity
      }
    });
  }

  /**
   * Create a new secret
   * @param secretData The secret data to create (requires title and world.id)
   * @returns Created secret reference
   */
  async createSecret(secretData: SecretInput): Promise<SecretRef> {
    return this.apiClient.put<SecretRef>('/secret', secretData);
  }

  /**
   * Update an existing secret
   * @param secretId The ID of the secret to update
   * @param secretData The updated secret data
   * @returns Updated secret reference
   */
  async updateSecret(secretId: string, secretData: SecretUpdateInput): Promise<SecretRef> {
    return this.apiClient.patch<SecretRef>('/secret', secretData, {
      params: {
        id: secretId
      }
    });
  }

  /**
   * Delete a secret
   * @param secretId The ID of the secret to delete
   * @returns Success response
   */
  async deleteSecret(secretId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/secret', {
      params: {
        id: secretId
      }
    });
  }

  /**
   * Get a list of secrets in a world
   * Based on world-secrets.yml POST endpoint
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getSecretsByWorld(worldId: string, options: SecretListOptions = {}): Promise<WorldSecretsResponse> {
    // Using POST as specified in the world-secrets.yml specification
    return this.apiClient.post<WorldSecretsResponse>('/world-secrets', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: worldId }
    });
  }
}