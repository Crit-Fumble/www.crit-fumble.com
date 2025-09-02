/**
 * World Anvil Subscriber Group Service
 * Service for interacting with World Anvil subscriber group endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  SubscriberGroupRef,
  SubscriberGroupResponse,
  SubscriberGroupInput,
  SubscriberGroupUpdateInput,
  WorldSubscriberGroupsResponse,
  SubscriberGroupListOptions
} from '../../models/WorldAnvilSubscriberGroup';

/**
 * Service for World Anvil subscriber group operations
 */
export class WorldAnvilSubscriberGroupService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilSubscriberGroupService
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
   * Get a subscriber group by ID
   * @param subscriberGroupId The ID of the subscriber group to get
   * @param granularity The level of detail to return (-1, 0, or 1)
   * @returns Subscriber group data at specified granularity
   */
  async getSubscriberGroupById(subscriberGroupId: string, granularity: '-1' | '0' | '1' = '0'): Promise<SubscriberGroupResponse> {
    return this.apiClient.get<SubscriberGroupResponse>('/subscribergroup', {
      params: {
        id: subscriberGroupId,
        granularity
      }
    });
  }

  /**
   * Create a new subscriber group
   * @param subscriberGroupData The subscriber group data to create (requires title and world.id)
   * @returns Created subscriber group reference
   */
  async createSubscriberGroup(subscriberGroupData: SubscriberGroupInput): Promise<SubscriberGroupRef> {
    return this.apiClient.put<SubscriberGroupRef>('/subscribergroup', subscriberGroupData);
  }

  /**
   * Update an existing subscriber group
   * @param subscriberGroupId The ID of the subscriber group to update
   * @param subscriberGroupData The updated subscriber group data
   * @returns Updated subscriber group reference
   */
  async updateSubscriberGroup(subscriberGroupId: string, subscriberGroupData: SubscriberGroupUpdateInput): Promise<SubscriberGroupRef> {
    return this.apiClient.patch<SubscriberGroupRef>('/subscribergroup', subscriberGroupData, {
      params: {
        id: subscriberGroupId
      }
    });
  }

  /**
   * Delete a subscriber group
   * @param subscriberGroupId The ID of the subscriber group to delete
   * @returns Success response
   */
  async deleteSubscriberGroup(subscriberGroupId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/subscribergroup', {
      params: {
        id: subscriberGroupId
      }
    });
  }

  /**
   * Get a list of subscriber groups in a world
   * Based on world-subscribergroups.yml POST endpoint
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getSubscriberGroupsByWorld(worldId: string, options: SubscriberGroupListOptions = {}): Promise<WorldSubscriberGroupsResponse> {
    // Using POST as specified in the world-subscribergroups.yml specification
    return this.apiClient.post<WorldSubscriberGroupsResponse>('/world-subscribergroups', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: worldId }
    });
  }
}
