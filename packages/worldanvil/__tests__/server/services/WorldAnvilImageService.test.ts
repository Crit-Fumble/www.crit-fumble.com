/**
 * Tests for WorldAnvilImageService
 */

import { WorldAnvilImageService } from '../../../server/services/WorldAnvilImageService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import {
  ImageRef,
  ImageResponse,
  ImageUpdateInput,
  WorldImagesResponse,
  ImageListOptions
} from '../../../models/WorldAnvilImage';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilImageService', () => {
  // Mock data
  const mockImageResponse: ImageResponse = {
    id: 'image-123',
    title: 'Test Image',
    filename: 'test-image.jpg',
    folder: 'uploads',
    mime: 'image/jpeg',
    url: 'https://worldanvil.com/uploads/test-image.jpg',
    world: {
      id: 'world-456',
      title: 'Test World'
    },
    created: '2023-01-01T12:00:00Z',
    visibility: 'public',
    description: 'This is a test image',
    tags: ['test', 'sample']
  };

  const mockImageUpdateInput: ImageUpdateInput = {
    title: 'Updated Image Title',
    description: 'Updated image description',
    tags: ['updated', 'test']
  };

  const mockImageRef: ImageRef = {
    id: 'image-123',
    title: 'Test Image'
  };

  const mockWorldImagesResponse: WorldImagesResponse = {
    success: true,
    entities: [
      {
        id: 'image-123',
        title: 'Test Image'
      },
      {
        id: 'image-456',
        title: 'Another Image'
      }
    ]
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilImageService;

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
    service = new WorldAnvilImageService(mockApiClient);
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
      const newService = new WorldAnvilImageService();
      expect(newService).toBeDefined();
    });
  });

  describe('getImageById', () => {
    it('should get an image by ID with default granularity', async () => {
      // Setup
      const imageId = 'image-123';
      mockApiClient.get.mockResolvedValue(mockImageResponse);

      // Execute
      const result = await service.getImageById(imageId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/image', { 
        params: {
          id: imageId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockImageResponse);
    });

    it('should get an image with custom granularity', async () => {
      // Setup
      const imageId = 'image-123';
      const granularity = '2';
      mockApiClient.get.mockResolvedValue(mockImageResponse);

      // Execute
      const result = await service.getImageById(imageId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/image', { 
        params: {
          id: imageId,
          granularity
        }
      });
      expect(result).toEqual(mockImageResponse);
    });
  });

  describe('updateImage', () => {
    it('should update an existing image', async () => {
      // Setup
      const imageId = 'image-123';
      mockApiClient.patch.mockResolvedValue(mockImageRef);

      // Execute
      const result = await service.updateImage(imageId, mockImageUpdateInput);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/image', mockImageUpdateInput, {
        params: {
          id: imageId
        }
      });
      expect(result).toEqual(mockImageRef);
    });
  });

  describe('deleteImage', () => {
    it('should delete an image', async () => {
      // Setup
      const imageId = 'image-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteImage(imageId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/image', {
        params: {
          id: imageId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getImagesByWorld', () => {
    it('should get images by world with default options', async () => {
      // Setup
      const worldId = 'world-456';
      mockApiClient.post.mockResolvedValue(mockWorldImagesResponse);

      // Execute
      const result = await service.getImagesByWorld(worldId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-images', {
        offset: 0,
        limit: 50
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldImagesResponse);
    });

    it('should get images by world with custom options', async () => {
      // Setup
      const worldId = 'world-456';
      const options: ImageListOptions = {
        offset: 10,
        limit: 25
      };
      mockApiClient.post.mockResolvedValue(mockWorldImagesResponse);

      // Execute
      const result = await service.getImagesByWorld(worldId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-images', {
        offset: 10,
        limit: 25
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldImagesResponse);
    });
  });
});
