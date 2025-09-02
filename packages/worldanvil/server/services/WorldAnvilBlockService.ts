/**
 * World Anvil Block Service
 * Service for interacting with World Anvil block and block folder endpoints
 * Based on Boromir API docs: https://www.worldanvil.com/api/external/boromir/documentation
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import {
  BlockResponse,
  BlockInput,
  BlockFolderResponse,
  BlockFolderInput,
  BlockFolderListOptions,
  BlockFolderBlocksResponse,
  WorldBlockFoldersResponse,
  BlockFolderRef
} from '../../models/WorldAnvilBlock';

/**
 * Service for World Anvil block and block folder operations
 */
export class WorldAnvilBlockService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilBlockService
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

  // Block methods (from block.yml)

  /**
   * Get a block by ID
   * @param blockId The ID of the block to get
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Block data
   */
  async getBlockById(blockId: string, granularity: '-1' | '0' | '2' = '0'): Promise<BlockResponse> {
    return this.apiClient.get<BlockResponse>('/block', {
      params: {
        id: blockId,
        granularity
      }
    });
  }

  /**
   * Create a new block
   * @param blockData The block data to create
   * @returns Created block reference
   */
  async createBlock(blockData: BlockInput): Promise<{ id: string; title: string }> {
    return this.apiClient.put<{ id: string; title: string }>('/block', blockData);
  }

  /**
   * Update an existing block
   * @param blockId The ID of the block to update
   * @param blockData The updated block data
   * @returns Updated block reference
   */
  async updateBlock(blockId: string, blockData: Partial<BlockInput>): Promise<{ id: string; title: string }> {
    return this.apiClient.patch<{ id: string; title: string }>('/block', blockData, {
      params: {
        id: blockId
      }
    });
  }

  /**
   * Delete a block
   * @param blockId The ID of the block to delete
   * @returns Success response
   */
  async deleteBlock(blockId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/block', {
      params: {
        id: blockId
      }
    });
  }

  /**
   * Get blocks in a block folder
   * @param folderIdThe ID of the folder
   * @param options Options for pagination
   * @returns List of blocks in the folder
   */
  async getBlocksByFolder(folderId: string, options: BlockFolderListOptions = {}): Promise<BlockFolderBlocksResponse> {
    return this.apiClient.post<BlockFolderBlocksResponse>('/blockfolder-blocks', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: folderId }
    });
  }

  // Block folder methods (from blockfolder.yml)

  /**
   * Get a block folder by ID
   * @param folderId The ID of the folder to get
   * @param granularity The level of detail to return (-1, 0, or 2)
   * @returns Block folder data
   */
  async getBlockFolderById(folderId: string, granularity: '-1' | '0' | '2' = '0'): Promise<BlockFolderResponse> {
    return this.apiClient.get<BlockFolderResponse>('/blockfolder', {
      params: {
        id: folderId,
        granularity
      }
    });
  }

  /**
   * Create a new block folder
   * @param folderData The folder data to create
   * @returns Created folder reference
   */
  async createBlockFolder(folderData: BlockFolderInput): Promise<{ id: string; title: string }> {
    return this.apiClient.put<{ id: string; title: string }>('/blockfolder', folderData);
  }

  /**
   * Update an existing block folder
   * @param folderId The ID of the folder to update
   * @param folderData The updated folder data
   * @returns Updated folder reference
   */
  async updateBlockFolder(folderId: string, folderData: Partial<BlockFolderInput>): Promise<{ id: string; title: string }> {
    return this.apiClient.patch<{ id: string; title: string }>('/blockfolder', folderData, {
      params: {
        id: folderId
      }
    });
  }

  /**
   * Delete a block folder
   * @param folderId The ID of the folder to delete
   * @returns Success response
   */
  async deleteBlockFolder(folderId: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>('/blockfolder', {
      params: {
        id: folderId
      }
    });
  }

  /**
   * Get a list of block folders in a world
   * Based on world-blockfolders.yml POST endpoint
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getBlockFoldersByWorld(worldId: string, options: BlockFolderListOptions = {}): Promise<WorldBlockFoldersResponse> {
    // Using POST as specified in the world-blockfolders.yml specification
    return this.apiClient.post<WorldBlockFoldersResponse>('/world-blockfolders', {
      offset: options.offset || 0,
      limit: options.limit || 50
    }, {
      params: { id: worldId }
    });
  }
}
