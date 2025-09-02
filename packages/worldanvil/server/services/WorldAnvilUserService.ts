/**
 * World Anvil User Service
 * Service for interacting with World Anvil user endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import { WorldAnvilUser, WorldAnvilUserResponse } from '../../models/WorldAnvilUser';

/**
 * User update data interface based on user.yml schema
 */
export interface WorldAnvilUserUpdateData {
  display_name?: string;
  first_name?: string;
  last_name?: string;
  birthday?: string;
  gender?: string;
  country?: string;
  biography?: string;
  [key: string]: any; // For other fields that might be in the schema
}

/**
 * User granularity options as defined in user.yml
 */
export type UserGranularity = '-1' | '0' | '2';

export class WorldAnvilUserService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilUserService
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
   * Get the current user's profile
   * @param granularity The level of detail to return (-1, 0, or 2 as per API spec)
   */
  async getCurrentUser(granularity: UserGranularity = '-1'): Promise<WorldAnvilUser> {
    const response = await this.apiClient.get<WorldAnvilUserResponse>('/user/me', {
      params: { granularity }
    });
    
    return this.mapUserResponse(response);
  }

  /**
   * Get a user by ID
   * @param userId The ID of the user to get
   * @param granularity The level of detail to return (-1, 0, or 2 as per API spec)
   */
  async getUserById(userId: string, granularity: UserGranularity = '-1'): Promise<WorldAnvilUser> {
    const response = await this.apiClient.get<WorldAnvilUserResponse>('/user', {
      params: { id: userId, granularity }
    });
    
    return this.mapUserResponse(response);
  }

  /**
   * Get a user by username
   * @param username The username of the user to get
   * @param granularity The level of detail to return (-1, 0, or 2 as per API spec)
   */
  async getUserByUsername(username: string, granularity: UserGranularity = '-1'): Promise<WorldAnvilUser> {
    // This endpoint might need to be adjusted based on actual API implementation
    const response = await this.apiClient.get<WorldAnvilUserResponse>('/user/by-username', {
      params: { username, granularity }
    });
    
    return this.mapUserResponse(response);
  }

  /**
   * Update a user's information
   * Based on the PATCH operation in user.yml
   * @param userId The ID of the user to update
   * @param userData The updated user data
   */
  async updateUser(userId: string, userData: WorldAnvilUserUpdateData): Promise<WorldAnvilUser> {
    // The API uses PATCH but our client might not support it directly
    // Using PUT as a fallback which the client supports
    const response = await this.apiClient.put<WorldAnvilUserResponse>('/user', {
      id: userId,
      ...userData
    });
    
    return this.mapUserResponse(response);
  }
  
  /**
   * Map the API response to our internal model
   */
  private mapUserResponse(response: WorldAnvilUserResponse): WorldAnvilUser {
    return {
      id: response.id,
      username: response.username,
      display_name: response.display_name,
      avatar_url: response.avatar_url,
      subscription_type: response.subscription_type,
      is_author: response.is_author
    };
  }
}
