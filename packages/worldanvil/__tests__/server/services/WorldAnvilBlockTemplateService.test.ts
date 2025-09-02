/**
 * Tests for WorldAnvilBlockTemplateService
 */

import { WorldAnvilBlockTemplateService, UserBlockTemplatesResponse, BlockTemplateRef } from '../../../server/services/WorldAnvilBlockTemplateService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilBlockTemplateService', () => {
  // Mock data for tests
  const mockUserId = 'user-123';
  
  const mockBlockTemplate: BlockTemplateRef = {
    id: 'template-123',
    name: 'Test Template',
    description: 'A test block template',
    user_id: 'user-123',
    is_public: true,
    schema_version: '1.0'
  };
  
  const mockBlockTemplatesResponse: UserBlockTemplatesResponse = {
    success: true,
    entities: [mockBlockTemplate]
  };

  const mockIdentityResponse = {
    id: mockUserId,
    username: 'testuser',
    userhash: 'abc123',
    success: true,
    display_name: 'Test User'
  };

  // Mock client and config
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilBlockTemplateService;

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
    service = new WorldAnvilBlockTemplateService(mockApiClient);
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
      const newService = new WorldAnvilBlockTemplateService();
      expect(newService).toBeDefined();
    });
  });

  describe('getBlockTemplatesByUser', () => {
    it('should get block templates for a specific user', async () => {
      // Setup
      mockApiClient.post.mockResolvedValue(mockBlockTemplatesResponse);
      
      // Execute
      const result = await service.getBlockTemplatesByUser(mockUserId);
      
      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/user-blocktemplates',
        {
          offset: 0,
          limit: 50
        },
        {
          params: { id: mockUserId }
        }
      );
      expect(result).toEqual(mockBlockTemplatesResponse);
    });
    
    it('should use provided pagination options', async () => {
      // Setup
      mockApiClient.post.mockResolvedValue(mockBlockTemplatesResponse);
      const options = { offset: 10, limit: 20 };
      
      // Execute
      const result = await service.getBlockTemplatesByUser(mockUserId, options);
      
      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/user-blocktemplates',
        {
          offset: 10,
          limit: 20
        },
        {
          params: { id: mockUserId }
        }
      );
      expect(result).toEqual(mockBlockTemplatesResponse);
    });
  });
  
  describe('getMyBlockTemplates', () => {
    it('should get block templates for the current user', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockIdentityResponse);
      mockApiClient.post.mockResolvedValue(mockBlockTemplatesResponse);
      
      // Execute
      const result = await service.getMyBlockTemplates();
      
      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/user-blocktemplates',
        {
          offset: 0,
          limit: 50
        },
        {
          params: { id: mockUserId }
        }
      );
      expect(result).toEqual(mockBlockTemplatesResponse);
    });
    
    it('should throw an error if identity cannot be retrieved', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(null);
      
      // Execute & Verify
      await expect(service.getMyBlockTemplates()).rejects.toThrow('Failed to get current user identity');
    });
    
    it('should throw an error if identity has no ID', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue({});
      
      // Execute & Verify
      await expect(service.getMyBlockTemplates()).rejects.toThrow('Failed to get current user identity');
    });
    
    it('should use provided pagination options', async () => {
      // Setup
      mockApiClient.get.mockResolvedValue(mockIdentityResponse);
      mockApiClient.post.mockResolvedValue(mockBlockTemplatesResponse);
      const options = { offset: 5, limit: 15 };
      
      // Execute
      const result = await service.getMyBlockTemplates(options);
      
      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/identity');
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/user-blocktemplates',
        {
          offset: 5,
          limit: 15
        },
        {
          params: { id: mockUserId }
        }
      );
      expect(result).toEqual(mockBlockTemplatesResponse);
    });
  });
});
