/**
 * World Anvil Identity Service
 * Service for interacting with World Anvil identity endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 * Specifically implements user-identity.yml specification
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import { WorldAnvilIdentity, WorldAnvilIdentityResponse } from '../../models/WorldAnvilIdentity';


/**
 * Service for World Anvil identity verification
 */
export class WorldAnvilIdentityService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilIdentityService
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
   * Get the identity of the current user from the access token
   * @returns The identity of the current user
   * @throws Error if the access token is invalid or expired
   */
  async getCurrentIdentity(): Promise<WorldAnvilIdentity> {
    const response = await this.apiClient.get<WorldAnvilIdentityResponse>('/identity');
    
    return this.mapIdentityResponse(response);
  }

  /**
   * Verify if an access token is valid by attempting to get the identity
   * @returns True if the token is valid, false otherwise
   */
  async verifyAccessToken(): Promise<boolean> {
    try {
      await this.getCurrentIdentity();
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Set the access token for this service instance
   * @param accessToken The access token to set
   */
  setAccessToken(accessToken: string): void {
    this.apiClient.setAccessToken(accessToken);
  }

  /**
   * Map the API response to our internal identity model
   * @param response The API response
   * @returns The mapped identity
   */
  private mapIdentityResponse(response: WorldAnvilIdentityResponse): WorldAnvilIdentity {
    return {
      id: response.id,
      username: response.username,
      userhash: response.userhash,
      success: response.success,
      // Optional fields that might be returned by the API but aren't in spec
      displayName: response.display_name,
      subscriptionType: response.subscription_type,
      isAuthor: response.is_author,
      avatarUrl: response.avatar_url
    };
  }
}
