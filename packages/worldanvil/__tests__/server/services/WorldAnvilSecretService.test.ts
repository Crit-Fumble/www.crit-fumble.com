/**
 * Tests for WorldAnvilSecretService
 */

import { WorldAnvilSecretService } from '../../../server/services/WorldAnvilSecretService';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import {
  SecretRef,
  SecretResponse,
  SecretInput,
  SecretUpdateInput,
  WorldSecretsResponse,
  SecretListOptions
} from '../../../models/WorldAnvilSecret';
import * as configModule from '../../../server/configs';

// Mock dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/configs');

describe('WorldAnvilSecretService', () => {
  // Mock data
  const mockSecretResponse: SecretResponse = {
    id: 'secret-123',
    title: 'Test Secret',
    world: {
      id: 'world-456',
      title: 'Test World'
    },
    content: 'This is a test secret',
    description: 'Secret description',
    creation_date: '2023-01-01T12:00:00Z',
    update_date: '2023-01-02T12:00:00Z'
  };

  const mockSecretInput: SecretInput = {
    title: 'Test Secret',
    world: {
      id: 'world-456'
    },
    content: 'This is a test secret',
    description: 'Secret description'
  };

  const mockSecretUpdateInput: SecretUpdateInput = {
    title: 'Updated Secret Title',
    content: 'Updated secret content',
    description: 'Updated secret description'
  };

  const mockSecretRef: SecretRef = {
    id: 'secret-123',
    title: 'Test Secret'
  };

  const mockWorldSecretsResponse: WorldSecretsResponse = {
    success: true,
    entities: [
      {
        id: 'secret-123',
        title: 'Test Secret'
      },
      {
        id: 'secret-456',
        title: 'Another Secret'
      }
    ]
  };

  // Mock client
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let service: WorldAnvilSecretService;

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
    service = new WorldAnvilSecretService(mockApiClient);
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
      const newService = new WorldAnvilSecretService();
      expect(newService).toBeDefined();
    });
  });

  describe('getSecretById', () => {
    it('should get a secret by ID with default granularity', async () => {
      // Setup
      const secretId = 'secret-123';
      mockApiClient.get.mockResolvedValue(mockSecretResponse);

      // Execute
      const result = await service.getSecretById(secretId);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/secret', { 
        params: {
          id: secretId,
          granularity: '0'
        }
      });
      expect(result).toEqual(mockSecretResponse);
    });

    it('should get a secret with custom granularity', async () => {
      // Setup
      const secretId = 'secret-123';
      const granularity = '2';
      mockApiClient.get.mockResolvedValue(mockSecretResponse);

      // Execute
      const result = await service.getSecretById(secretId, granularity);

      // Verify
      expect(mockApiClient.get).toHaveBeenCalledWith('/secret', { 
        params: {
          id: secretId,
          granularity
        }
      });
      expect(result).toEqual(mockSecretResponse);
    });
  });

  describe('createSecret', () => {
    it('should create a new secret', async () => {
      // Setup
      mockApiClient.put.mockResolvedValue(mockSecretRef);

      // Execute
      const result = await service.createSecret(mockSecretInput);

      // Verify
      expect(mockApiClient.put).toHaveBeenCalledWith('/secret', mockSecretInput);
      expect(result).toEqual(mockSecretRef);
    });
  });

  describe('updateSecret', () => {
    it('should update an existing secret', async () => {
      // Setup
      const secretId = 'secret-123';
      mockApiClient.patch.mockResolvedValue(mockSecretRef);

      // Execute
      const result = await service.updateSecret(secretId, mockSecretUpdateInput);

      // Verify
      expect(mockApiClient.patch).toHaveBeenCalledWith('/secret', mockSecretUpdateInput, {
        params: {
          id: secretId
        }
      });
      expect(result).toEqual(mockSecretRef);
    });
  });

  describe('deleteSecret', () => {
    it('should delete a secret', async () => {
      // Setup
      const secretId = 'secret-123';
      const successResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(successResponse);

      // Execute
      const result = await service.deleteSecret(secretId);

      // Verify
      expect(mockApiClient.delete).toHaveBeenCalledWith('/secret', {
        params: {
          id: secretId
        }
      });
      expect(result).toEqual(successResponse);
    });
  });

  describe('getSecretsByWorld', () => {
    it('should get secrets by world with default options', async () => {
      // Setup
      const worldId = 'world-456';
      mockApiClient.post.mockResolvedValue(mockWorldSecretsResponse);

      // Execute
      const result = await service.getSecretsByWorld(worldId);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-secrets', {
        offset: 0,
        limit: 50
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldSecretsResponse);
    });

    it('should get secrets by world with custom options', async () => {
      // Setup
      const worldId = 'world-456';
      const options: SecretListOptions = {
        offset: 10,
        limit: 25
      };
      mockApiClient.post.mockResolvedValue(mockWorldSecretsResponse);

      // Execute
      const result = await service.getSecretsByWorld(worldId, options);

      // Verify
      expect(mockApiClient.post).toHaveBeenCalledWith('/world-secrets', {
        offset: 10,
        limit: 25
      }, {
        params: { id: worldId }
      });
      expect(result).toEqual(mockWorldSecretsResponse);
    });
  });
});
