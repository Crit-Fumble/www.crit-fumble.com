/**
 * Tests for WorldAnvilVariableService
 */

import { 
  WorldAnvilVariableService,
  WorldAnvilVariableInput,
  WorldAnvilVariableUpdate,
  WorldAnvilVariableCollectionInput,
  WorldAnvilVariableCollectionUpdate,
  VariableListResponse,
  VariableCollectionListResponse
} from '../../../server/services/WorldAnvilVariableService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import { WorldAnvilVariable, WorldAnvilVariableCollection } from '../../../models/WorldAnvilVariable';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilVariableService', () => {
  // Mock data for tests
  const mockVariableId = 'var-123';
  const mockCollectionId = 'coll-456';
  const mockWorldId = 'world-789';

  const mockVariable: WorldAnvilVariable = {
    id: mockVariableId,
    k: 'testKey',
    v: 'testValue',
    type: 'string',
    collection_id: mockCollectionId,
    world_id: mockWorldId,
    user_id: 'user-123'
  };

  const mockVariableCollection: WorldAnvilVariableCollection = {
    id: mockCollectionId,
    title: 'Test Collection',
    is_private: false,
    world_id: mockWorldId,
    user_id: 'user-123',
    variables: [mockVariable]
  };

  const mockVariableInput: WorldAnvilVariableInput = {
    k: 'testKey',
    v: 'testValue',
    type: 'string',
    collection: mockCollectionId,
    world: mockWorldId
  };

  const mockVariableUpdate: WorldAnvilVariableUpdate = {
    k: 'updatedKey',
    v: 'updatedValue',
    type: 'string'
  };

  const mockCollectionInput: WorldAnvilVariableCollectionInput = {
    title: 'New Collection',
    world: mockWorldId,
    is_private: true
  };

  const mockCollectionUpdate: WorldAnvilVariableCollectionUpdate = {
    title: 'Updated Collection',
    is_private: false
  };

  const mockVariableListResponse: VariableListResponse = {
    success: true,
    entities: [mockVariable]
  };

  const mockCollectionListResponse: VariableCollectionListResponse = {
    success: true,
    entities: [mockVariableCollection]
  };

  // Mock client and config
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilVariableService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock client
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      setApiKey: jest.fn(),
      setAccessToken: jest.fn(),
      getCurrentUser: jest.fn(),
      getMyWorlds: jest.fn(),
      getWorldById: jest.fn(),
      handleApiError: jest.fn()
    } as unknown as jest.Mocked<WorldAnvilApiClient>;
    
    // Create instance of service under test with mock client
    service = new WorldAnvilVariableService(mockApiClient);
  });

  describe('constructor', () => {
    it('should initialize with the provided API client', () => {
      // When created with a client, it should use that client
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
      const newService = new WorldAnvilVariableService();
      expect(newService).toBeDefined();
    });
  });

  describe('getVariable', () => {
    it('should get a variable by ID with default granularity', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockVariable);
      
      // Execute
      const result = await service.getVariable(mockVariableId);
      
      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/variable', {
        params: { id: mockVariableId, granularity: '0' }
      });
      expect(result).toEqual(mockVariable);
    });

    it('should get a variable by ID with specified granularity', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockVariable);
      
      // Execute
      const result = await service.getVariable(mockVariableId, -1);
      
      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/variable', {
        params: { id: mockVariableId, granularity: '-1' }
      });
      expect(result).toEqual(mockVariable);
    });
  });

  describe('createVariable', () => {
    it('should create a new variable', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockVariable);
      
      // Execute
      const result = await service.createVariable(mockVariableInput);
      
      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/variable', mockVariableInput);
      expect(result).toEqual(mockVariable);
    });
  });

  describe('updateVariable', () => {
    it('should update an existing variable', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockVariable);
      
      // Execute
      const result = await service.updateVariable(mockVariableId, mockVariableUpdate);
      
      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/variable', {
        id: mockVariableId,
        ...mockVariableUpdate
      });
      expect(result).toEqual(mockVariable);
    });
  });

  describe('deleteVariable', () => {
    it('should delete a variable by ID', async () => {
      // Setup
      mockApiClient.delete.mockResolvedValue(undefined);
      
      // Execute
      await service.deleteVariable(mockVariableId);
      
      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/variable', {
        params: { id: mockVariableId }
      });
    });
  });

  describe('listVariablesByCollection', () => {
    it('should list variables in a collection with default pagination', async () => {
      // Setup
      mockApiClient.post.mockResolvedValue(mockVariableListResponse);
      
      // Execute
      const result = await service.listVariablesByCollection(mockCollectionId);
      
      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/variable_collection/variables',
        {},
        {
          params: { id: mockCollectionId }
        }
      );
      expect(result).toEqual(mockVariableListResponse.entities);
    });

    it('should list variables in a collection with pagination options', async () => {
      // Setup
      mockApiClient.post.mockResolvedValue(mockVariableListResponse);
      const options = { offset: 10, limit: 20 };
      
      // Execute
      const result = await service.listVariablesByCollection(mockCollectionId, options);
      
      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/variable_collection/variables',
        options,
        {
          params: { id: mockCollectionId }
        }
      );
      expect(result).toEqual(mockVariableListResponse.entities);
    });

    it('should return empty array if no entities in response', async () => {
      // Setup
      mockApiClient.post.mockResolvedValue({ success: true });
      
      // Execute
      const result = await service.listVariablesByCollection(mockCollectionId);
      
      // Verify
      expect(result).toEqual([]);
    });
  });

  describe('getVariableCollection', () => {
    it('should get a variable collection by ID with default granularity', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockVariableCollection);
      
      // Execute
      const result = await service.getVariableCollection(mockCollectionId);
      
      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/variable_collection', {
        params: { id: mockCollectionId, granularity: '0' }
      });
      expect(result).toEqual(mockVariableCollection);
    });

    it('should get a variable collection by ID with specified granularity', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockVariableCollection);
      
      // Execute
      const result = await service.getVariableCollection(mockCollectionId, 2);
      
      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/variable_collection', {
        params: { id: mockCollectionId, granularity: '2' }
      });
      expect(result).toEqual(mockVariableCollection);
    });
  });

  describe('createVariableCollection', () => {
    it('should create a new variable collection', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockVariableCollection);
      
      // Execute
      const result = await service.createVariableCollection(mockCollectionInput);
      
      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/variable_collection', mockCollectionInput);
      expect(result).toEqual(mockVariableCollection);
    });
  });

  describe('updateVariableCollection', () => {
    it('should update an existing variable collection', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockVariableCollection);
      
      // Execute
      const result = await service.updateVariableCollection(mockCollectionId, mockCollectionUpdate);
      
      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/variable_collection', {
        id: mockCollectionId,
        ...mockCollectionUpdate
      });
      expect(result).toEqual(mockVariableCollection);
    });
  });

  describe('deleteVariableCollection', () => {
    it('should delete a variable collection by ID', async () => {
      // Setup
      mockApiClient.delete.mockResolvedValue(undefined);
      
      // Execute
      await service.deleteVariableCollection(mockCollectionId);
      
      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/variable_collection', {
        params: { id: mockCollectionId }
      });
    });
  });

  describe('listVariableCollectionsByWorld', () => {
    it('should list variable collections in a world with default pagination', async () => {
      // Setup
      mockApiClient.post.mockResolvedValue(mockCollectionListResponse);
      
      // Execute
      const result = await service.listVariableCollectionsByWorld(mockWorldId);
      
      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/world/variablecollections',
        {},
        {
          params: { id: mockWorldId }
        }
      );
      expect(result).toEqual(mockCollectionListResponse.entities);
    });

    it('should list variable collections in a world with pagination options', async () => {
      // Setup
      mockApiClient.post.mockResolvedValue(mockCollectionListResponse);
      const options = { offset: 5, limit: 15 };
      
      // Execute
      const result = await service.listVariableCollectionsByWorld(mockWorldId, options);
      
      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/world/variablecollections',
        options,
        {
          params: { id: mockWorldId }
        }
      );
      expect(result).toEqual(mockCollectionListResponse.entities);
    });

    it('should return empty array if no entities in response', async () => {
      // Setup
      mockApiClient.post.mockResolvedValue({ success: true });
      
      // Execute
      const result = await service.listVariableCollectionsByWorld(mockWorldId);
      
      // Verify
      expect(result).toEqual([]);
    });
  });
});
