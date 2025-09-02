/**
 * Tests for WorldAnvilBlockService
 */

import { WorldAnvilBlockService } from '../../../server/services/WorldAnvilBlockService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import {
  BlockResponse,
  BlockInput,
  BlockFolderResponse,
  BlockFolderInput,
  BlockFolderListOptions,
  BlockFolderBlocksResponse,
  WorldBlockFoldersResponse
} from '../../../models/WorldAnvilBlock';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilBlockService', () => {
  // Mock data
  const mockBlockResponse: BlockResponse = {
    id: 'block-123',
    title: 'Test Block',
    content: '<p>This is a test block</p>',
    type: 'text',
    world: {
      id: 'world-456',
      title: 'Test World'
    },
    folder: {
      id: 'folder-789',
      title: 'Test Folder'
    },
    state: 'public',
    creation_date: '2023-01-01T12:00:00Z',
    update_date: '2023-01-02T12:00:00Z'
  };

  const mockBlockInput: BlockInput = {
    title: 'Test Block',
    content: '<p>This is a test block</p>',
    type: 'text',
    world: {
      id: 'world-456'
    },
    folder: {
      id: 'folder-789'
    }
  };

  const mockBlockFolderResponse: BlockFolderResponse = {
    id: 'folder-789',
    title: 'Test Block Folder',
    world: {
      id: 'world-456',
      title: 'Test World'
    },
    parent: null,
    state: 'public',
    creation_date: '2023-01-01T12:00:00Z',
    update_date: '2023-01-02T12:00:00Z'
  };

  const mockBlockFolderInput: BlockFolderInput = {
    title: 'Test Block Folder',
    world: {
      id: 'world-456'
    },
    parent: null
  };

  const mockBlockFolderBlocksResponse: BlockFolderBlocksResponse = {
    success: true,
    entities: [
      {
        id: 'block-123',
        title: 'Test Block'
      },
      {
        id: 'block-456',
        title: 'Another Block'
      }
    ]
  };

  const mockWorldBlockFoldersResponse: WorldBlockFoldersResponse = {
    success: true,
    entities: [
      {
        id: 'folder-789',
        title: 'Test Block Folder'
      },
      {
        id: 'folder-012',
        title: 'Another Block Folder'
      }
    ]
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilBlockService;

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
    service = new WorldAnvilBlockService(mockApiClient);
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
      const newService = new WorldAnvilBlockService();
      expect(newService).toBeDefined();
    });
  });

  // Block methods tests
  describe('getBlockById', () => {
    it('should get a block by ID with default granularity', async () => {
      // Setup
      const blockId = 'block-123';
      mockApiClient.get.mockResolvedValue(mockBlockResponse);

      // Execute
      const result = await service.getBlockById(blockId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/block', { 
        params: {
          id: blockId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockBlockResponse);
    });

    it('should get a block with custom granularity', async () => {
      // Setup
      const blockId = 'block-123';
      const granularity = '2';
      mockApiClient.get.mockResolvedValue(mockBlockResponse);

      // Execute
      const result = await service.getBlockById(blockId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/block', { 
        params: {
          id: blockId,
          granularity
        }
      });
      expect(result).toEqual(mockBlockResponse);
    });
  });

  describe('createBlock', () => {
    it('should create a new block', async () => {
      // Setup
      const expectedResponse = { id: 'block-123', title: 'Test Block' };
      mockApiClient.put.mockResolvedValue(expectedResponse);

      // Execute
      const result = await service.createBlock(mockBlockInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/block', mockBlockInput);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('updateBlock', () => {
    it('should update an existing block', async () => {
      // Setup
      const blockId = 'block-123';
      const updateData: Partial<BlockInput> = {
        title: 'Updated Block Title',
        content: '<p>Updated content</p>'
      };
      const expectedResponse = { id: 'block-123', title: 'Updated Block Title' };
      mockApiClient.patch.mockResolvedValue(expectedResponse);

      // Execute
      const result = await service.updateBlock(blockId, updateData);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/block', updateData, {
        params: {
          id: blockId
        }
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteBlock', () => {
    it('should delete a block', async () => {
      // Setup
      const blockId = 'block-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteBlock(blockId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/block', {
        params: {
          id: blockId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getBlocksByFolder', () => {
    it('should get blocks by folder with default options', async () => {
      // Setup
      const folderId = 'folder-789';
      mockApiClient.post.mockResolvedValue(mockBlockFolderBlocksResponse);

      // Execute
      const result = await service.getBlocksByFolder(folderId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/blockfolder-blocks', {
        offset: 0,
        limit: 50
      }, {
        params: { id: folderId }
      });
      expect(result).toEqual(mockBlockFolderBlocksResponse);
    });

    it('should get blocks by folder with custom options', async () => {
      // Setup
      const folderId = 'folder-789';
      const options: BlockFolderListOptions = {
        offset: 10,
        limit: 25
      };
      mockApiClient.post.mockResolvedValue(mockBlockFolderBlocksResponse);

      // Execute
      const result = await service.getBlocksByFolder(folderId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/blockfolder-blocks', {
        offset: 10,
        limit: 25
      }, {
        params: { id: folderId }
      });
      expect(result).toEqual(mockBlockFolderBlocksResponse);
    });
  });

  // Block folder methods tests
  describe('getBlockFolderById', () => {
    it('should get a block folder by ID with default granularity', async () => {
      // Setup
      const folderId = 'folder-789';
      mockApiClient.get.mockResolvedValue(mockBlockFolderResponse);

      // Execute
      const result = await service.getBlockFolderById(folderId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/blockfolder', { 
        params: {
          id: folderId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockBlockFolderResponse);
    });

    it('should get a block folder with custom granularity', async () => {
      // Setup
      const folderId = 'folder-789';
      const granularity = '2';
      mockApiClient.get.mockResolvedValue(mockBlockFolderResponse);

      // Execute
      const result = await service.getBlockFolderById(folderId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/blockfolder', { 
        params: {
          id: folderId,
          granularity
        }
      });
      expect(result).toEqual(mockBlockFolderResponse);
    });
  });

  describe('createBlockFolder', () => {
    it('should create a new block folder', async () => {
      // Setup
      const expectedResponse = { id: 'folder-789', title: 'Test Block Folder' };
      mockApiClient.put.mockResolvedValue(expectedResponse);

      // Execute
      const result = await service.createBlockFolder(mockBlockFolderInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/blockfolder', mockBlockFolderInput);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('updateBlockFolder', () => {
    it('should update an existing block folder', async () => {
      // Setup
      const folderId = 'folder-789';
      const updateData: Partial<BlockFolderInput> = {
        title: 'Updated Folder Title'
      };
      const expectedResponse = { id: 'folder-789', title: 'Updated Folder Title' };
      mockApiClient.patch.mockResolvedValue(expectedResponse);

      // Execute
      const result = await service.updateBlockFolder(folderId, updateData);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/blockfolder', updateData, {
        params: {
          id: folderId
        }
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteBlockFolder', () => {
    it('should delete a block folder', async () => {
      // Setup
      const folderId = 'folder-789';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteBlockFolder(folderId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/blockfolder', {
        params: {
          id: folderId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getBlockFoldersByWorld', () => {
    it('should get block folders by world with default options', async () => {
      // Setup
      const worldId = 'world-456';
      mockApiClient.post.mockResolvedValue(mockWorldBlockFoldersResponse);

      // Execute
      const result = await service.getBlockFoldersByWorld(worldId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-blockfolders', {
        offset: 0,
        limit: 50
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldBlockFoldersResponse);
    });

    it('should get block folders by world with custom options', async () => {
      // Setup
      const worldId = 'world-456';
      const options: BlockFolderListOptions = {
        offset: 10,
        limit: 25
      };
      mockApiClient.post.mockResolvedValue(mockWorldBlockFoldersResponse);

      // Execute
      const result = await service.getBlockFoldersByWorld(worldId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-blockfolders', {
        offset: 10,
        limit: 25
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldBlockFoldersResponse);
    });
  });
});
