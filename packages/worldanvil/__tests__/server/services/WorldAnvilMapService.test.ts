/**
 * Tests for WorldAnvilMapService
 */

import { WorldAnvilMapService } from '../../../server/services/WorldAnvilMapService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
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
  WorldMapsResponse,
  MapLayersResponse,
  MapMarkerGroupsResponse,
  MapMarkersResponse,
  MarkerGroupMarkersResponse,
  MapListOptions
} from '../../../models/WorldAnvilMap';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilMapService', () => {
  // Mock data
  const mockMapResponse: MapResponse = {
    id: 'map-123',
    title: 'Test Map',
    slug: 'test-map',
    world: {
      id: 'world-456',
      title: 'Test World'
    },
    image: 'image-789',
    description: 'This is a test map',
    creation_date: '2023-01-01T12:00:00Z',
    update_date: '2023-01-02T12:00:00Z'
  };

  const mockMapInput: MapInput = {
    title: 'Test Map',
    world: {
      id: 'world-456'
    },
    image: 'image-789',
    description: 'This is a test map'
  };

  const mockMapUpdateInput: MapUpdateInput = {
    title: 'Updated Map Title',
    description: 'Updated map description'
  };

  const mockMapRef: MapRef = {
    id: 'map-123',
    title: 'Test Map'
  };

  const mockWorldMapsResponse: WorldMapsResponse = {
    success: true,
    entities: [
      {
        id: 'map-123',
        title: 'Test Map'
      },
      {
        id: 'map-456',
        title: 'Another Map'
      }
    ]
  };

  // Mock Layer Data
  const mockLayerResponse: LayerResponse = {
    id: 'layer-123',
    title: 'Test Layer',
    map: {
      id: 'map-123',
      title: 'Test Map'
    },
    image: 'image-789',
    description: 'This is a test layer',
    creation_date: '2023-01-01T12:00:00Z'
  };

  const mockLayerInput: LayerInput = {
    title: 'Test Layer',
    map: {
      id: 'map-123'
    },
    image: 'image-789',
    description: 'This is a test layer'
  };

  const mockLayerUpdateInput: LayerUpdateInput = {
    title: 'Updated Layer Title',
    description: 'Updated layer description'
  };

  const mockLayerRef: LayerRef = {
    id: 'layer-123',
    title: 'Test Layer'
  };

  const mockMapLayersResponse: MapLayersResponse = {
    success: true,
    entities: [
      {
        id: 'layer-123',
        title: 'Test Layer'
      },
      {
        id: 'layer-456',
        title: 'Another Layer'
      }
    ]
  };

  // Mock MarkerGroup Data
  const mockMarkerGroupResponse: MarkerGroupResponse = {
    id: 'markergroup-123',
    name: 'Test Marker Group',
    map: {
      id: 'map-123',
      title: 'Test Map'
    },
    description: 'This is a test marker group',
    creation_date: '2023-01-01T12:00:00Z'
  };

  const mockMarkerGroupInput: MarkerGroupInput = {
    name: 'Test Marker Group',
    map: {
      id: 'map-123'
    },
    description: 'This is a test marker group'
  };

  const mockMarkerGroupUpdateInput: MarkerGroupUpdateInput = {
    name: 'Updated Marker Group Name',
    description: 'Updated marker group description'
  };

  const mockMarkerGroupRef: MarkerGroupRef = {
    id: 'markergroup-123',
    name: 'Test Marker Group'
  };

  const mockMapMarkerGroupsResponse: MapMarkerGroupsResponse = {
    success: true,
    entities: [
      {
        id: 'markergroup-123',
        name: 'Test Marker Group'
      },
      {
        id: 'markergroup-456',
        name: 'Another Marker Group'
      }
    ]
  };

  // Mock Marker Data
  const mockMapMarkersResponse: MapMarkersResponse = {
    success: true,
    entities: [
      {
        id: 'marker-123',
        name: 'Test Marker'
      },
      {
        id: 'marker-456',
        name: 'Another Marker'
      }
    ]
  };

  const mockMarkerGroupMarkersResponse: MarkerGroupMarkersResponse = {
    success: true,
    entities: [
      {
        id: 'marker-123',
        name: 'Test Marker'
      },
      {
        id: 'marker-456',
        name: 'Another Marker'
      }
    ]
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilMapService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock client
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      setApiKey: jest.fn(),
      setAccessToken: jest.fn()
    } as unknown as jest.Mocked<WorldAnvilApiClient>;

    // Create instance of service under test
    service = new WorldAnvilMapService(mockApiClient);
  });

  describe('constructor', () => {
    it('should initialize with the provided API client', () => {
      expect(service).toBeDefined();
    });
    
    it('should create a new client if none provided', () => {
      // Mock config values
      const mockConfig = {
        apiUrl: 'https://test.worldanvil.com',
        apiKey: 'test-key',
        accessToken: 'test-token'
      };
      
      // Setup the mock to return our config
      (configModule.getWorldAnvilConfig as jest.Mock).mockReturnValue(mockConfig);
      
      // Create service without providing a client
      const newService = new WorldAnvilMapService();
      expect(newService).toBeDefined();
    });
  });

  // Map Tests
  describe('getMapById', () => {
    it('should get a map by ID with default granularity', async () => {
      // Setup
      const mapId = 'map-123';
      mockApiClient.get.mockResolvedValue(mockMapResponse);

      // Execute
      const result = await service.getMapById(mapId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/map', { 
        params: {
          id: mapId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockMapResponse);
    });

    it('should get a map with custom granularity', async () => {
      // Setup
      const mapId = 'map-123';
      const granularity = '2';
      mockApiClient.get.mockResolvedValue(mockMapResponse);

      // Execute
      const result = await service.getMapById(mapId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/map', { 
        params: {
          id: mapId,
          granularity
        }
      });
      expect(result).toEqual(mockMapResponse);
    });
  });

  describe('createMap', () => {
    it('should create a new map', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockMapRef);

      // Execute
      const result = await service.createMap(mockMapInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/map', mockMapInput);
      expect(result).toEqual(mockMapRef);
    });
  });

  describe('updateMap', () => {
    it('should update an existing map', async () => {
      // Setup
      const mapId = 'map-123';
      mockApiClient.patch.mockResolvedValue(mockMapRef);

      // Execute
      const result = await service.updateMap(mapId, mockMapUpdateInput);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/map', mockMapUpdateInput, {
        params: {
          id: mapId
        }
      });
      expect(result).toEqual(mockMapRef);
    });
  });

  describe('deleteMap', () => {
    it('should delete a map', async () => {
      // Setup
      const mapId = 'map-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteMap(mapId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/map', {
        params: {
          id: mapId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getMapsByWorld', () => {
    it('should get maps by world with default options', async () => {
      // Setup
      const worldId = 'world-456';
      mockApiClient.post.mockResolvedValue(mockWorldMapsResponse);

      // Execute
      const result = await service.getMapsByWorld(worldId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-maps', {
        offset: 0,
        limit: 50
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldMapsResponse);
    });

    it('should get maps by world with custom options', async () => {
      // Setup
      const worldId = 'world-456';
      const options: MapListOptions = {
        offset: 10,
        limit: 25
      };
      mockApiClient.post.mockResolvedValue(mockWorldMapsResponse);

      // Execute
      const result = await service.getMapsByWorld(worldId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-maps', {
        offset: 10,
        limit: 25
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldMapsResponse);
    });
  });

  // Layer Tests
  describe('getLayerById', () => {
    it('should get a layer by ID with default granularity', async () => {
      // Setup
      const layerId = 'layer-123';
      mockApiClient.get.mockResolvedValue(mockLayerResponse);

      // Execute
      const result = await service.getLayerById(layerId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/layer', { 
        params: {
          id: layerId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockLayerResponse);
    });
  });

  describe('createLayer', () => {
    it('should create a new layer', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockLayerRef);

      // Execute
      const result = await service.createLayer(mockLayerInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/layer', mockLayerInput);
      expect(result).toEqual(mockLayerRef);
    });
  });

  describe('updateLayer', () => {
    it('should update an existing layer', async () => {
      // Setup
      const layerId = 'layer-123';
      mockApiClient.patch.mockResolvedValue(mockLayerRef);

      // Execute
      const result = await service.updateLayer(layerId, mockLayerUpdateInput);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/layer', mockLayerUpdateInput, {
        params: {
          id: layerId
        }
      });
      expect(result).toEqual(mockLayerRef);
    });
  });

  describe('deleteLayer', () => {
    it('should delete a layer', async () => {
      // Setup
      const layerId = 'layer-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteLayer(layerId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/layer', {
        params: {
          id: layerId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getLayersByMap', () => {
    it('should get layers by map with default options', async () => {
      // Setup
      const mapId = 'map-123';
      mockApiClient.post.mockResolvedValue(mockMapLayersResponse);

      // Execute
      const result = await service.getLayersByMap(mapId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/map-layers', {
        offset: 0,
        limit: 50
      }, {
        params: { id: mapId }
      });
      expect(result).toEqual(mockMapLayersResponse);
    });
  });

  // Marker Group Tests
  describe('getMarkerGroupById', () => {
    it('should get a marker group by ID with default granularity', async () => {
      // Setup
      const markerGroupId = 'markergroup-123';
      mockApiClient.get.mockResolvedValue(mockMarkerGroupResponse);

      // Execute
      const result = await service.getMarkerGroupById(markerGroupId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/markergroup', { 
        params: {
          id: markerGroupId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockMarkerGroupResponse);
    });
  });

  describe('createMarkerGroup', () => {
    it('should create a new marker group', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockMarkerGroupRef);

      // Execute
      const result = await service.createMarkerGroup(mockMarkerGroupInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/markergroup', mockMarkerGroupInput);
      expect(result).toEqual(mockMarkerGroupRef);
    });
  });

  describe('updateMarkerGroup', () => {
    it('should update an existing marker group', async () => {
      // Setup
      const markerGroupId = 'markergroup-123';
      mockApiClient.patch.mockResolvedValue(mockMarkerGroupRef);

      // Execute
      const result = await service.updateMarkerGroup(markerGroupId, mockMarkerGroupUpdateInput);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/markergroup', mockMarkerGroupUpdateInput, {
        params: {
          id: markerGroupId
        }
      });
      expect(result).toEqual(mockMarkerGroupRef);
    });
  });

  describe('deleteMarkerGroup', () => {
    it('should delete a marker group', async () => {
      // Setup
      const markerGroupId = 'markergroup-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteMarkerGroup(markerGroupId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/markergroup', {
        params: {
          id: markerGroupId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getMarkerGroupsByMap', () => {
    it('should get marker groups by map with default options', async () => {
      // Setup
      const mapId = 'map-123';
      mockApiClient.post.mockResolvedValue(mockMapMarkerGroupsResponse);

      // Execute
      const result = await service.getMarkerGroupsByMap(mapId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/map-markergroups', {
        offset: 0,
        limit: 50
      }, {
        params: { id: mapId }
      });
      expect(result).toEqual(mockMapMarkerGroupsResponse);
    });
  });

  describe('getMarkersByMap', () => {
    it('should get markers by map with default options', async () => {
      // Setup
      const mapId = 'map-123';
      mockApiClient.post.mockResolvedValue(mockMapMarkersResponse);

      // Execute
      const result = await service.getMarkersByMap(mapId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/map-markers', {
        offset: 0,
        limit: 50
      }, {
        params: { id: mapId }
      });
      expect(result).toEqual(mockMapMarkersResponse);
    });
  });

  describe('getMarkersByMarkerGroup', () => {
    it('should get markers by marker group with default options', async () => {
      // Setup
      const markerGroupId = 'markergroup-123';
      mockApiClient.post.mockResolvedValue(mockMarkerGroupMarkersResponse);

      // Execute
      const result = await service.getMarkersByMarkerGroup(markerGroupId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/markergroup-markers', {
        offset: 0,
        limit: 50
      }, {
        params: { id: markerGroupId }
      });
      expect(result).toEqual(mockMarkerGroupMarkersResponse);
    });
  });
});
