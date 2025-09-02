/**
 * Tests for WorldAnvilNotebookService
 */

import { WorldAnvilNotebookService } from '../../../server/services/WorldAnvilNotebookService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import {
  NotebookRef,
  NotebookResponse,
  NotebookInput,
  NotebookUpdateInput,
  WorldNotebooksResponse,
  NotebookListOptions
} from '../../../models/WorldAnvilNotebook';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilNotebookService', () => {
  // Mock data
  const mockNotebookResponse: NotebookResponse = {
    id: 'notebook-123',
    title: 'Test Notebook',
    world: {
      id: 'world-456',
      title: 'Test World'
    },
    description: 'This is a test notebook',
    creation_date: '2023-01-01T12:00:00Z',
    update_date: '2023-01-02T12:00:00Z'
  };

  const mockNotebookInput: NotebookInput = {
    title: 'Test Notebook',
    world: {
      id: 'world-456'
    },
    description: 'This is a test notebook'
  };

  const mockNotebookUpdateInput: NotebookUpdateInput = {
    title: 'Updated Notebook Title',
    description: 'Updated notebook description'
  };

  const mockNotebookRef: NotebookRef = {
    id: 'notebook-123',
    title: 'Test Notebook'
  };

  const mockWorldNotebooksResponse: WorldNotebooksResponse = {
    success: true,
    entities: [
      {
        id: 'notebook-123',
        title: 'Test Notebook'
      },
      {
        id: 'notebook-456',
        title: 'Another Notebook'
      }
    ]
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilNotebookService;

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
    service = new WorldAnvilNotebookService(mockApiClient);
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
      const newService = new WorldAnvilNotebookService();
      expect(newService).toBeDefined();
    });
  });

  describe('getNotebookById', () => {
    it('should get a notebook by ID with default granularity', async () => {
      // Setup
      const notebookId = 'notebook-123';
      mockApiClient.get.mockResolvedValue(mockNotebookResponse);

      // Execute
      const result = await service.getNotebookById(notebookId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/notebook', { 
        params: {
          id: notebookId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockNotebookResponse);
    });

    it('should get a notebook with custom granularity', async () => {
      // Setup
      const notebookId = 'notebook-123';
      const granularity = '2';
      mockApiClient.get.mockResolvedValue(mockNotebookResponse);

      // Execute
      const result = await service.getNotebookById(notebookId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/notebook', { 
        params: {
          id: notebookId,
          granularity
        }
      });
      expect(result).toEqual(mockNotebookResponse);
    });
  });

  describe('createNotebook', () => {
    it('should create a new notebook', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockNotebookRef);

      // Execute
      const result = await service.createNotebook(mockNotebookInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/notebook', mockNotebookInput);
      expect(result).toEqual(mockNotebookRef);
    });
  });

  describe('updateNotebook', () => {
    it('should update an existing notebook', async () => {
      // Setup
      const notebookId = 'notebook-123';
      mockApiClient.patch.mockResolvedValue(mockNotebookRef);

      // Execute
      const result = await service.updateNotebook(notebookId, mockNotebookUpdateInput);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/notebook', mockNotebookUpdateInput, {
        params: {
          id: notebookId
        }
      });
      expect(result).toEqual(mockNotebookRef);
    });
  });

  describe('deleteNotebook', () => {
    it('should delete a notebook', async () => {
      // Setup
      const notebookId = 'notebook-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteNotebook(notebookId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/notebook', {
        params: {
          id: notebookId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getNotebooksByWorld', () => {
    it('should get notebooks by world with default options', async () => {
      // Setup
      const worldId = 'world-456';
      mockApiClient.post.mockResolvedValue(mockWorldNotebooksResponse);

      // Execute
      const result = await service.getNotebooksByWorld(worldId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-notebooks', {
        offset: 0,
        limit: 50
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldNotebooksResponse);
    });

    it('should get notebooks by world with custom options', async () => {
      // Setup
      const worldId = 'world-456';
      const options: NotebookListOptions = {
        offset: 10,
        limit: 25
      };
      mockApiClient.post.mockResolvedValue(mockWorldNotebooksResponse);

      // Execute
      const result = await service.getNotebooksByWorld(worldId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-notebooks', {
        offset: 10,
        limit: 25
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldNotebooksResponse);
    });
  });
});
