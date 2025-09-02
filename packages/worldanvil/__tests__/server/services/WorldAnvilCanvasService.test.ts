/**
 * Tests for WorldAnvilCanvasService
 */

import { WorldAnvilCanvasService } from '../../../server/services/WorldAnvilCanvasService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import {
  CanvasRef,
  CanvasResponse,
  CanvasInput,
  WorldCanvasesResponse,
  CanvasListOptions
} from '../../../models/WorldAnvilCanvas';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilCanvasService', () => {
  // Mock data
  const mockCanvasResponse: CanvasResponse = {
    id: 'canvas-123',
    title: 'Test Canvas',
    description: 'This is a test canvas',
    type: 'relationship',
    world: {
      id: 'world-456',
      title: 'Test World'
    },
    state: 'public',
    is_wip: false,
    creation_date: '2023-01-01T12:00:00Z',
    update_date: '2023-01-02T12:00:00Z',
    nodes: [],
    edges: []
  };

  const mockCanvasInput: CanvasInput = {
    title: 'Test Canvas',
    description: 'This is a test canvas',
    type: 'relationship',
    world: {
      id: 'world-456'
    }
  };

  const mockCanvasRef: CanvasRef = {
    id: 'canvas-123',
    title: 'Test Canvas'
  };

  const mockWorldCanvasesResponse: WorldCanvasesResponse = {
    success: true,
    entities: [
      {
        id: 'canvas-123',
        title: 'Test Canvas'
      },
      {
        id: 'canvas-456',
        title: 'Another Canvas'
      }
    ]
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilCanvasService;

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
    service = new WorldAnvilCanvasService(mockApiClient);
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
      const newService = new WorldAnvilCanvasService();
      expect(newService).toBeDefined();
    });
  });

  describe('getCanvasById', () => {
    it('should get a canvas by ID with default granularity', async () => {
      // Setup
      const canvasId = 'canvas-123';
      mockApiClient.get.mockResolvedValue(mockCanvasResponse);

      // Execute
      const result = await service.getCanvasById(canvasId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/canvas', { 
        params: {
          id: canvasId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockCanvasResponse);
    });

    it('should get a canvas with custom granularity', async () => {
      // Setup
      const canvasId = 'canvas-123';
      const granularity = '2';
      mockApiClient.get.mockResolvedValue(mockCanvasResponse);

      // Execute
      const result = await service.getCanvasById(canvasId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/canvas', { 
        params: {
          id: canvasId,
          granularity
        }
      });
      expect(result).toEqual(mockCanvasResponse);
    });
  });

  describe('createCanvas', () => {
    it('should create a new canvas', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockCanvasRef);

      // Execute
      const result = await service.createCanvas(mockCanvasInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/canvas', mockCanvasInput);
      expect(result).toEqual(mockCanvasRef);
    });
  });

  describe('updateCanvas', () => {
    it('should update an existing canvas', async () => {
      // Setup
      const canvasId = 'canvas-123';
      const updateData: Partial<CanvasInput> = {
        title: 'Updated Canvas Title',
        description: 'Updated description'
      };
      mockApiClient.patch.mockResolvedValue(mockCanvasRef);

      // Execute
      const result = await service.updateCanvas(canvasId, updateData);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/canvas', updateData, {
        params: {
          id: canvasId
        }
      });
      expect(result).toEqual(mockCanvasRef);
    });
  });

  describe('deleteCanvas', () => {
    it('should delete a canvas', async () => {
      // Setup
      const canvasId = 'canvas-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteCanvas(canvasId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/canvas', {
        params: {
          id: canvasId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getCanvasesByWorld', () => {
    it('should get canvases by world with default options', async () => {
      // Setup
      const worldId = 'world-456';
      mockApiClient.post.mockResolvedValue(mockWorldCanvasesResponse);

      // Execute
      const result = await service.getCanvasesByWorld(worldId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-canvases', {
        offset: 0,
        limit: 50
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldCanvasesResponse);
    });

    it('should get canvases by world with custom options', async () => {
      // Setup
      const worldId = 'world-456';
      const options: CanvasListOptions = {
        offset: 10,
        limit: 25
      };
      mockApiClient.post.mockResolvedValue(mockWorldCanvasesResponse);

      // Execute
      const result = await service.getCanvasesByWorld(worldId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-canvases', {
        offset: 10,
        limit: 25
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldCanvasesResponse);
    });
  });
});
