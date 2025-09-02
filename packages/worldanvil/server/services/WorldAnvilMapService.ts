/**
 * World Anvil Map Service
 * Service for interacting with World Anvil map endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  MapRef,
  MapResponse,
  MapInput,
  MapUpdateInput,
  LayerRef,
  LayerResponse,
  LayerInput,
  LayerUpdateInput,
  MarkerGroupRef,
  MarkerGroupResponse,
  MarkerGroupInput,
  MarkerGroupUpdateInput,
  MarkerRef,
  MarkerResponse,
  MarkerInput,
  MarkerUpdateInput,
  MarkerTypeRef,
  MarkerTypeResponse,
  MarkerTypeInput,
  MarkerTypeUpdateInput,
  MarkerTypesResponse,
  WorldMapsResponse,
  MapLayersResponse,
  MapMarkerGroupsResponse,
  MapMarkersResponse,
  MarkerGroupMarkersResponse,
  MapListOptions
} from '../../models/WorldAnvilMap';

/**
 * Service for World Anvil map operations
 */
export class WorldAnvilMapService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilMapService
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
   * Get a map by ID
   * @param mapId The ID of the map to get
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Map data at specified granularity
   */
  async getMapById(mapId: string, granularity: '-1' | '0' | '2' = '0'): Promise<MapResponse> {
    return this.apiClient.get<MapResponse>('/map', {
      params: {
        id: mapId,
        granularity
      }
    });
  }

  /**
   * Create a new map
   * Note: The image parameter should be the ID of an already uploaded image
   * @param mapData The map data to create
   * @returns Created map reference
   */
  async createMap(mapData: MapInput): Promise<MapRef> {
    return this.apiClient.put<MapRef>('/map', mapData);
  }

  /**
   * Update an existing map
   * @param mapId The ID of the map to update
   * @param mapData The updated map data
   * @returns Updated map reference
   */
  async updateMap(mapId: string, mapData: MapUpdateInput): Promise<MapRef> {
    return this.apiClient.patch<MapRef>('/map', mapData, {
      params: {
        id: mapId
      }
    });
  }

  /**
   * Delete a map
   * @param mapId The ID of the map to delete
   * @returns Success response
   */
  async deleteMap(mapId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/map', {
      params: {
        id: mapId
      }
    });
  }

  /**
   * Get a list of maps in a world
   * Based on world-maps.yml POST endpoint
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getMapsByWorld(worldId: string, options: MapListOptions = {}): Promise<WorldMapsResponse> {
    // Using POST as specified in the world-maps.yml specification
    return this.apiClient.post<WorldMapsResponse>('/world-maps', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: worldId }
    });
  }

  // Map Layer endpoints

  /**
   * Get a layer by ID
   * @param layerId The ID of the layer to get
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Layer data at specified granularity
   */
  async getLayerById(layerId: string, granularity: '-1' | '0' | '2' = '0'): Promise<LayerResponse> {
    return this.apiClient.get<LayerResponse>('/layer', {
      params: {
        id: layerId,
        granularity
      }
    });
  }

  /**
   * Create a new layer
   * Note: The image parameter should be the ID of an already uploaded image
   * @param layerData The layer data to create
   * @returns Created layer reference
   */
  async createLayer(layerData: LayerInput): Promise<LayerRef> {
    return this.apiClient.put<LayerRef>('/layer', layerData);
  }

  /**
   * Update an existing layer
   * @param layerId The ID of the layer to update
   * @param layerData The updated layer data
   * @returns Updated layer reference
   */
  async updateLayer(layerId: string, layerData: LayerUpdateInput): Promise<LayerRef> {
    return this.apiClient.patch<LayerRef>('/layer', layerData, {
      params: {
        id: layerId
      }
    });
  }

  /**
   * Delete a layer
   * @param layerId The ID of the layer to delete
   * @returns Success response
   */
  async deleteLayer(layerId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/layer', {
      params: {
        id: layerId
      }
    });
  }

  /**
   * Get layers for a map
   * @param mapId The ID of the map
   * @param options Options for pagination
   * @returns List of layers in the map
   */
  async getLayersByMap(mapId: string, options: MapListOptions = {}): Promise<MapLayersResponse> {
    return this.apiClient.post<MapLayersResponse>('/map-layers', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: mapId }
    });
  }

  // Marker Group endpoints

  /**
   * Get a marker group by ID
   * @param markerGroupId The ID of the marker group to get
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Marker group data at specified granularity
   */
  async getMarkerGroupById(markerGroupId: string, granularity: '-1' | '0' | '2' = '0'): Promise<MarkerGroupResponse> {
    return this.apiClient.get<MarkerGroupResponse>('/markergroup', {
      params: {
        id: markerGroupId,
        granularity
      }
    });
  }

  /**
   * Create a new marker group
   * @param markerGroupData The marker group data to create
   * @returns Created marker group reference
   */
  async createMarkerGroup(markerGroupData: MarkerGroupInput): Promise<MarkerGroupRef> {
    return this.apiClient.put<MarkerGroupRef>('/markergroup', markerGroupData);
  }

  /**
   * Update an existing marker group
   * @param markerGroupId The ID of the marker group to update
   * @param markerGroupData The updated marker group data
   * @returns Updated marker group reference
   */
  async updateMarkerGroup(markerGroupId: string, markerGroupData: MarkerGroupUpdateInput): Promise<MarkerGroupRef> {
    return this.apiClient.patch<MarkerGroupRef>('/markergroup', markerGroupData, {
      params: {
        id: markerGroupId
      }
    });
  }

  /**
   * Delete a marker group
   * @param markerGroupId The ID of the marker group to delete
   * @returns Success response
   */
  async deleteMarkerGroup(markerGroupId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/markergroup', {
      params: {
        id: markerGroupId
      }
    });
  }

  /**
   * Get marker groups for a map
   * @param mapId The ID of the map
   * @param options Options for pagination
   * @returns List of marker groups in the map
   */
  async getMarkerGroupsByMap(mapId: string, options: MapListOptions = {}): Promise<MapMarkerGroupsResponse> {
    return this.apiClient.post<MapMarkerGroupsResponse>('/map-markergroups', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: mapId }
    });
  }

  /**
   * Get markers for a map
   * @param mapId The ID of the map
   * @param options Options for pagination
   * @returns List of markers in the map
   */
  async getMarkersByMap(mapId: string, options: MapListOptions = {}): Promise<MapMarkersResponse> {
    return this.apiClient.post<MapMarkersResponse>('/map-markers', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: mapId }
    });
  }

  /**
   * Get markers for a marker group
   * @param markerGroupId The ID of the marker group
   * @param options Options for pagination
   * @returns List of markers in the marker group
   */
  async getMarkersByMarkerGroup(markerGroupId: string, options: MapListOptions = {}): Promise<MarkerGroupMarkersResponse> {
    return this.apiClient.post<MarkerGroupMarkersResponse>('/markergroup-markers', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: markerGroupId }
    });
  }
  
  // Marker endpoints

  /**
   * Get a marker by ID
   * @param markerId The ID of the marker to get
   * @param granularity The level of detail to return (-1, 0, 1, or 2)
   * @returns Marker data at specified granularity
   */
  async getMarkerById(markerId: string, granularity: '-1' | '0' | '1' | '2' = '0'): Promise<MarkerResponse> {
    return this.apiClient.get<MarkerResponse>('/marker', {
      params: {
        id: markerId,
        granularity
      }
    });
  }

  /**
   * Create a new marker
   * @param markerData The marker data to create
   * @returns Created marker reference
   */
  async createMarker(markerData: MarkerInput): Promise<MarkerRef> {
    return this.apiClient.put<MarkerRef>('/marker', markerData);
  }

  /**
   * Update an existing marker
   * @param markerId The ID of the marker to update
   * @param markerData The updated marker data
   * @returns Updated marker reference
   */
  async updateMarker(markerId: string, markerData: MarkerUpdateInput): Promise<MarkerRef> {
    return this.apiClient.patch<MarkerRef>('/marker', markerData, {
      params: {
        id: markerId
      }
    });
  }

  /**
   * Delete a marker
   * @param markerId The ID of the marker to delete
   * @returns Success response
   */
  async deleteMarker(markerId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/marker', {
      params: {
        id: markerId
      }
    });
  }

  // Marker Type endpoints

  /**
   * Get a marker type by ID
   * @param markerTypeId The ID of the marker type to get
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Marker type data at specified granularity
   */
  async getMarkerTypeById(markerTypeId: string, granularity: '-1' | '0' | '2' = '0'): Promise<MarkerTypeResponse> {
    return this.apiClient.get<MarkerTypeResponse>('/markertype', {
      params: {
        id: markerTypeId,
        granularity
      }
    });
  }

  /**
   * Create a new marker type
   * @param markerTypeData The marker type data to create
   * @returns Created marker type reference
   */
  async createMarkerType(markerTypeData: MarkerTypeInput): Promise<MarkerTypeRef> {
    return this.apiClient.put<MarkerTypeRef>('/markertype', markerTypeData);
  }

  /**
   * Update an existing marker type
   * @param markerTypeId The ID of the marker type to update
   * @param markerTypeData The updated marker type data
   * @returns Updated marker type reference
   */
  async updateMarkerType(markerTypeId: string, markerTypeData: MarkerTypeUpdateInput): Promise<MarkerTypeRef> {
    return this.apiClient.patch<MarkerTypeRef>('/markertype', markerTypeData, {
      params: {
        id: markerTypeId
      }
    });
  }

  /**
   * Delete a marker type
   * @param markerTypeId The ID of the marker type to delete
   * @returns Success response
   */
  async deleteMarkerType(markerTypeId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/markertype', {
      params: {
        id: markerTypeId
      }
    });
  }

  /**
   * Get a list of marker types
   * @param options Options for pagination
   * @returns List of marker types
   */
  async getMarkerTypes(options: MapListOptions = {}): Promise<MarkerTypesResponse> {
    return this.apiClient.post<MarkerTypesResponse>('/markertypes', {
      offset: options.offset || 0,
      limit: options.limit || 50
    });
  }
}
