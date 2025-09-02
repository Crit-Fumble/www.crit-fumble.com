/**
 * World Anvil Timeline Service
 * Service for interacting with World Anvil timeline endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  TimelineRef,
  TimelineResponse,
  TimelineInput,
  TimelineUpdateInput,
  WorldTimelinesResponse,
  TimelineListOptions
} from '../../models/WorldAnvilTimeline';

/**
 * Service for World Anvil timeline operations
 */
export class WorldAnvilTimelineService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilTimelineService
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
   * Get a timeline by ID
   * @param timelineId The ID of the timeline to get
   * @param granularity The level of detail to return (-1, 0, 1, or 2)
   * @returns Timeline data at specified granularity
   */
  async getTimelineById(timelineId: string, granularity: '-1' | '0' | '1' | '2' = '0'): Promise<TimelineResponse> {
    return this.apiClient.get<TimelineResponse>('/timeline', {
      params: {
        id: timelineId,
        granularity
      }
    });
  }

  /**
   * Create a new timeline
   * @param timelineData The timeline data to create (requires title and world.id)
   * @returns Created timeline reference
   */
  async createTimeline(timelineData: TimelineInput): Promise<TimelineRef> {
    return this.apiClient.put<TimelineRef>('/timeline', timelineData);
  }

  /**
   * Update an existing timeline
   * @param timelineId The ID of the timeline to update
   * @param timelineData The updated timeline data
   * @returns Updated timeline reference
   */
  async updateTimeline(timelineId: string, timelineData: TimelineUpdateInput): Promise<TimelineRef> {
    return this.apiClient.patch<TimelineRef>('/timeline', timelineData, {
      params: {
        id: timelineId
      }
    });
  }

  /**
   * Delete a timeline
   * @param timelineId The ID of the timeline to delete
   * @returns Success response
   */
  async deleteTimeline(timelineId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/timeline', {
      params: {
        id: timelineId
      }
    });
  }

  /**
   * Get a list of timelines in a world
   * Based on world-timelines.yml POST endpoint
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getTimelinesByWorld(worldId: string, options: TimelineListOptions = {}): Promise<WorldTimelinesResponse> {
    // Using POST as specified in the world-timelines.yml specification
    return this.apiClient.post<WorldTimelinesResponse>('/world-timelines', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: worldId }
    });
  }
}
