/**
 * Tests for WorldAnvilManuscriptService
 */

import { WorldAnvilManuscriptService } from '../../../server/services/WorldAnvilManuscriptService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import {
  ManuscriptRef,
  ManuscriptResponse,
  ManuscriptInput,
  ManuscriptUpdateInput,
  WorldManuscriptsResponse,
  ManuscriptListOptions
} from '../../../models/WorldAnvilManuscript';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilManuscriptService', () => {
  // Mock data
  const mockManuscriptResponse: ManuscriptResponse = {
    id: 'manuscript-123',
    title: 'Test Manuscript',
    slug: 'test-manuscript',
    world: {
      id: 'world-456',
      title: 'Test World'
    },
    description: 'This is a test manuscript',
    state: 'draft',
    creation_date: '2023-01-01T12:00:00Z',
    update_date: '2023-01-02T12:00:00Z',
    author: {
      id: 'user-789',
      username: 'testuser'
    }
  };

  const mockManuscriptInput: ManuscriptInput = {
    title: 'Test Manuscript',
    world: {
      id: 'world-456'
    },
    description: 'This is a test manuscript'
  };

  const mockManuscriptUpdateInput: ManuscriptUpdateInput = {
    title: 'Updated Manuscript Title',
    description: 'Updated manuscript description'
  };

  const mockManuscriptRef: ManuscriptRef = {
    id: 'manuscript-123',
    title: 'Test Manuscript'
  };

  const mockWorldManuscriptsResponse: WorldManuscriptsResponse = {
    success: true,
    entities: [
      {
        id: 'manuscript-123',
        title: 'Test Manuscript'
      },
      {
        id: 'manuscript-456',
        title: 'Another Manuscript'
      }
    ]
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilManuscriptService;

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
    service = new WorldAnvilManuscriptService(mockApiClient);
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
      const newService = new WorldAnvilManuscriptService();
      expect(newService).toBeDefined();
    });
  });

  describe('getManuscriptById', () => {
    it('should get a manuscript by ID with default granularity', async () => {
      // Setup
      const manuscriptId = 'manuscript-123';
      mockApiClient.get.mockResolvedValue(mockManuscriptResponse);

      // Execute
      const result = await service.getManuscriptById(manuscriptId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/manuscript', { 
        params: {
          id: manuscriptId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockManuscriptResponse);
    });

    it('should get a manuscript with custom granularity', async () => {
      // Setup
      const manuscriptId = 'manuscript-123';
      const granularity = '2';
      mockApiClient.get.mockResolvedValue(mockManuscriptResponse);

      // Execute
      const result = await service.getManuscriptById(manuscriptId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/manuscript', { 
        params: {
          id: manuscriptId,
          granularity
        }
      });
      expect(result).toEqual(mockManuscriptResponse);
    });
  });

  describe('createManuscript', () => {
    it('should create a new manuscript', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockManuscriptRef);

      // Execute
      const result = await service.createManuscript(mockManuscriptInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/manuscript', mockManuscriptInput);
      expect(result).toEqual(mockManuscriptRef);
    });
  });

  describe('updateManuscript', () => {
    it('should update an existing manuscript', async () => {
      // Setup
      const manuscriptId = 'manuscript-123';
      mockApiClient.patch.mockResolvedValue(mockManuscriptRef);

      // Execute
      const result = await service.updateManuscript(manuscriptId, mockManuscriptUpdateInput);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/manuscript', mockManuscriptUpdateInput, {
        params: {
          id: manuscriptId
        }
      });
      expect(result).toEqual(mockManuscriptRef);
    });
  });

  describe('deleteManuscript', () => {
    it('should delete a manuscript', async () => {
      // Setup
      const manuscriptId = 'manuscript-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteManuscript(manuscriptId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/manuscript', {
        params: {
          id: manuscriptId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getManuscriptsByWorld', () => {
    it('should get manuscripts by world with default options', async () => {
      // Setup
      const worldId = 'world-456';
      mockApiClient.post.mockResolvedValue(mockWorldManuscriptsResponse);

      // Execute
      const result = await service.getManuscriptsByWorld(worldId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-manuscripts', {
        offset: 0,
        limit: 50
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldManuscriptsResponse);
    });

    it('should get manuscripts by world with custom options', async () => {
      // Setup
      const worldId = 'world-456';
      const options: ManuscriptListOptions = {
        offset: 10,
        limit: 25
      };
      mockApiClient.post.mockResolvedValue(mockWorldManuscriptsResponse);

      // Execute
      const result = await service.getManuscriptsByWorld(worldId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-manuscripts', {
        offset: 10,
        limit: 25
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldManuscriptsResponse);
    });
  });
});
