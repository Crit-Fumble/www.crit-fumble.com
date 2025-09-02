/**
 * Tests for WorldAnvilController
 */
import { jest } from '@jest/globals';
import { WorldAnvilController } from '../../../server/controllers/WorldAnvilController';
import { WorldAnvilAuthService, AuthorizationResult } from '../../../server/services/WorldAnvilAuthService';
import { WorldAnvilUserService } from '../../../server/services/WorldAnvilUserService';
import { WorldAnvilWorldService } from '../../../server/services/WorldAnvilWorldService';
import { WorldAnvilRpgSystemService } from '../../../server/services/WorldAnvilRpgSystemService';
import { WorldAnvilIdentityService } from '../../../server/services/WorldAnvilIdentityService';
import { WorldAnvilArticleService } from '../../../server/services/WorldAnvilArticleService';
import { WorldAnvilBlockService } from '../../../server/services/WorldAnvilBlockService';
import { WorldAnvilBlockTemplateService } from '../../../server/services/WorldAnvilBlockTemplateService';
import { WorldAnvilCanvasService } from '../../../server/services/WorldAnvilCanvasService';
import { WorldAnvilCategoryService } from '../../../server/services/WorldAnvilCategoryService';
import { WorldAnvilImageService } from '../../../server/services/WorldAnvilImageService';
import { WorldAnvilManuscriptService } from '../../../server/services/WorldAnvilManuscriptService';
import { WorldAnvilMapService } from '../../../server/services/WorldAnvilMapService';
import { WorldAnvilNotebookService } from '../../../server/services/WorldAnvilNotebookService';
import { WorldAnvilSecretService } from '../../../server/services/WorldAnvilSecretService';
import { WorldAnvilSubscriberGroupService } from '../../../server/services/WorldAnvilSubscriberGroupService';
import { WorldAnvilTimelineService } from '../../../server/services/WorldAnvilTimelineService';
import { WorldAnvilVariableService } from '../../../server/services/WorldAnvilVariableService';
import { WorldAnvilWorld } from '../../../models/WorldAnvilWorld';
import { WorldAnvilUser } from '../../../models/WorldAnvilUser';
import { WorldAnvilApiClient } from '../../../server/clients/WorldAnvilApiClient';
import { WorldAnvilArticleInput, WorldAnvilArticleResponse } from '../../../models/WorldAnvilArticle';
import { MapInput, MapRef, MapResponse, LayerRef, MapLayersResponse } from '../../../models/WorldAnvilMap';
import { TimelineInput, TimelineRef, TimelineResponse, HistoryInput, HistoryUpdateInput, HistoryResponse, WorldHistoriesResponse } from '../../../models/WorldAnvilTimeline';
import { NotebookResponse } from '../../../models/WorldAnvilNotebook';
import { SubscriberGroupRef, SubscriberGroupResponse } from '../../../models/WorldAnvilSubscriberGroup';
import { BlockTemplateRef, UserBlockTemplatesResponse, BlockTemplateListOptions } from '../../../server/services/WorldAnvilBlockTemplateService';
import { 
  WorldAnvilVariable, WorldAnvilVariableCollection
} from '../../../models/WorldAnvilVariable';

import {
  WorldAnvilVariableInput, WorldAnvilVariableUpdate,
  WorldAnvilVariableCollectionInput, WorldAnvilVariableCollectionUpdate,
  PaginationOptions
} from '../../../server/services/WorldAnvilVariableService';

// Mock the service dependencies
jest.mock('../../../server/clients/WorldAnvilApiClient');
jest.mock('../../../server/services/WorldAnvilAuthService');
jest.mock('../../../server/services/WorldAnvilUserService');
jest.mock('../../../server/services/WorldAnvilWorldService');
jest.mock('../../../server/services/WorldAnvilRpgSystemService');
jest.mock('../../../server/services/WorldAnvilIdentityService');
jest.mock('../../../server/services/WorldAnvilArticleService');
jest.mock('../../../server/services/WorldAnvilBlockService');
jest.mock('../../../server/services/WorldAnvilBlockTemplateService');
jest.mock('../../../server/services/WorldAnvilCanvasService');
jest.mock('../../../server/services/WorldAnvilCategoryService');
jest.mock('../../../server/services/WorldAnvilImageService');
jest.mock('../../../server/services/WorldAnvilManuscriptService');
jest.mock('../../../server/services/WorldAnvilMapService');
jest.mock('../../../server/services/WorldAnvilNotebookService');
jest.mock('../../../server/services/WorldAnvilSecretService');
jest.mock('../../../server/services/WorldAnvilSubscriberGroupService');
jest.mock('../../../server/services/WorldAnvilTimelineService');
jest.mock('../../../server/services/WorldAnvilVariableService');

describe('WorldAnvilController', () => {
  let controller: WorldAnvilController;
  let mockApiClient: jest.Mocked<WorldAnvilApiClient>;
  let mockAuthService: jest.Mocked<WorldAnvilAuthService>;
  let mockUserService: jest.Mocked<WorldAnvilUserService>;
  let mockWorldService: jest.Mocked<WorldAnvilWorldService>;
  let mockRpgSystemService: jest.Mocked<WorldAnvilRpgSystemService>;
  let mockIdentityService: jest.Mocked<WorldAnvilIdentityService>;
  let mockArticleService: jest.Mocked<WorldAnvilArticleService>;
  let mockBlockService: jest.Mocked<WorldAnvilBlockService>;
  let mockBlockTemplateService: jest.Mocked<WorldAnvilBlockTemplateService>;
  let mockCanvasService: jest.Mocked<WorldAnvilCanvasService>;
  let mockCategoryService: jest.Mocked<WorldAnvilCategoryService>;
  let mockImageService: jest.Mocked<WorldAnvilImageService>;
  let mockManuscriptService: jest.Mocked<WorldAnvilManuscriptService>;
  let mockMapService: jest.Mocked<WorldAnvilMapService>;
  let mockNotebookService: jest.Mocked<WorldAnvilNotebookService>;
  let mockSecretService: jest.Mocked<WorldAnvilSecretService>;
  let mockSubscriberGroupService: jest.Mocked<WorldAnvilSubscriberGroupService>;
  let mockTimelineService: jest.Mocked<WorldAnvilTimelineService>;
  let mockVariableService: jest.Mocked<WorldAnvilVariableService>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create new controller instance before each test
    controller = new WorldAnvilController();
    
    // Get the mocked instances
    mockApiClient = WorldAnvilApiClient.prototype as jest.Mocked<WorldAnvilApiClient>;
    mockAuthService = WorldAnvilAuthService.prototype as jest.Mocked<WorldAnvilAuthService>;
    mockUserService = WorldAnvilUserService.prototype as jest.Mocked<WorldAnvilUserService>;
    mockWorldService = WorldAnvilWorldService.prototype as jest.Mocked<WorldAnvilWorldService>;
    mockRpgSystemService = WorldAnvilRpgSystemService.prototype as jest.Mocked<WorldAnvilRpgSystemService>;
    mockIdentityService = WorldAnvilIdentityService.prototype as jest.Mocked<WorldAnvilIdentityService>;
    mockArticleService = WorldAnvilArticleService.prototype as jest.Mocked<WorldAnvilArticleService>;
    mockBlockService = WorldAnvilBlockService.prototype as jest.Mocked<WorldAnvilBlockService>;
    mockBlockTemplateService = WorldAnvilBlockTemplateService.prototype as jest.Mocked<WorldAnvilBlockTemplateService>;
    mockCanvasService = WorldAnvilCanvasService.prototype as jest.Mocked<WorldAnvilCanvasService>;
    mockCategoryService = WorldAnvilCategoryService.prototype as jest.Mocked<WorldAnvilCategoryService>;
    mockImageService = WorldAnvilImageService.prototype as jest.Mocked<WorldAnvilImageService>;
    mockManuscriptService = WorldAnvilManuscriptService.prototype as jest.Mocked<WorldAnvilManuscriptService>;
    mockMapService = WorldAnvilMapService.prototype as jest.Mocked<WorldAnvilMapService>;
    mockNotebookService = WorldAnvilNotebookService.prototype as jest.Mocked<WorldAnvilNotebookService>;
    mockSecretService = WorldAnvilSecretService.prototype as jest.Mocked<WorldAnvilSecretService>;
    mockSubscriberGroupService = WorldAnvilSubscriberGroupService.prototype as jest.Mocked<WorldAnvilSubscriberGroupService>;
    mockTimelineService = WorldAnvilTimelineService.prototype as jest.Mocked<WorldAnvilTimelineService>;
    mockVariableService = WorldAnvilVariableService.prototype as jest.Mocked<WorldAnvilVariableService>;
  });

  describe('authentication methods', () => {
  describe('authenticate', () => {
    it('should call authService.authenticate with correct parameters', async () => {
      // Arrange
      const code = 'test-auth-code';
      const clientId = 'test-client-id';
      const clientSecret = 'test-client-secret';
      const redirectUri = 'http://localhost:3000/callback';
      const expectedResult: AuthorizationResult = { 
        access_token: 'test-token', 
        refresh_token: 'test-refresh',
        expires_in: 3600,
        token_type: 'bearer'
      };
      
      mockAuthService.authenticate.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.authenticate(code, clientId, clientSecret, redirectUri);

      // Assert
      expect(mockAuthService.authenticate).toHaveBeenCalledWith(code, clientId, clientSecret, redirectUri);
      expect(result).toEqual(expectedResult);
    });
    
    it('should handle errors from authService.authenticate', async () => {
      // Arrange
      const code = 'invalid-code';
      const clientId = 'test-client-id';
      const clientSecret = 'test-client-secret';
      const redirectUri = 'http://localhost:3000/callback';
      const expectedError = new Error('Authentication failed');
      
      mockAuthService.authenticate.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(
        controller.authenticate(code, clientId, clientSecret, redirectUri)
      ).rejects.toThrow(expectedError);
      
      expect(mockAuthService.authenticate).toHaveBeenCalledWith(code, clientId, clientSecret, redirectUri);
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshToken with correct parameters', async () => {
      // Arrange
      const refreshToken = 'test-refresh-token';
      const clientId = 'test-client-id';
      const clientSecret = 'test-client-secret';
      const expectedResult = { 
        access_token: 'new-token', 
        refresh_token: 'new-refresh',
        expires_in: 3600,
        token_type: 'bearer'
      };
      
      mockAuthService.refreshToken.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.refreshToken(refreshToken, clientId, clientSecret);

      // Assert
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken, clientId, clientSecret);
      expect(result).toEqual(expectedResult);
    });
    
    it('should handle errors from authService.refreshToken', async () => {
      // Arrange
      const refreshToken = 'invalid-token';
      const clientId = 'test-client-id';
      const clientSecret = 'test-client-secret';
      const expectedError = new Error('Token refresh failed');
      
      mockAuthService.refreshToken.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(
        controller.refreshToken(refreshToken, clientId, clientSecret)
      ).rejects.toThrow(expectedError);
      
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken, clientId, clientSecret);
    });
  });

  describe('isTokenValid', () => {
    it('should call authService.isTokenValid and return true when token is valid', async () => {
      // Arrange
      mockAuthService.isTokenValid.mockResolvedValue(true);

      // Act
      const result = await controller.isTokenValid();

      // Assert
      expect(mockAuthService.isTokenValid).toHaveBeenCalled();
      expect(result).toBe(true);
    });
    
    it('should call authService.isTokenValid and return false when token is invalid', async () => {
      // Arrange
      mockAuthService.isTokenValid.mockResolvedValue(false);

      // Act
      const result = await controller.isTokenValid();

      // Assert
      expect(mockAuthService.isTokenValid).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    it('should handle errors from authService.isTokenValid', async () => {
      // Arrange
      const expectedError = new Error('Failed to validate token');
      mockAuthService.isTokenValid.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(controller.isTokenValid()).rejects.toThrow(expectedError);
      expect(mockAuthService.isTokenValid).toHaveBeenCalled();
    });
  });
});

  describe('getCurrentUser', () => {
    it('should call userService.getCurrentUser', async () => {
      // Arrange
      const expectedUser: WorldAnvilUser = { 
        id: 'user-1', 
        username: 'testuser',
        display_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        subscription_type: 'free'
      };
      mockUserService.getCurrentUser.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.getCurrentUser();

      // Assert
      expect(mockUserService.getCurrentUser).toHaveBeenCalled();
      expect(result).toEqual(expectedUser);
    });
    
    it('should handle errors from userService.getCurrentUser', async () => {
      // Arrange
      const expectedError = new Error('User not found');
      mockUserService.getCurrentUser.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(controller.getCurrentUser()).rejects.toThrow(expectedError);
      expect(mockUserService.getCurrentUser).toHaveBeenCalled();
    });
  });

  describe('getMyWorlds', () => {
    it('should call worldService.getMyWorlds', async () => {
      // Arrange
      const expectedResponse = {
        worlds: [
          { id: 'world-1', title: 'Test World 1', slug: 'test-world-1' },
          { id: 'world-2', title: 'Test World 2', slug: 'test-world-2' }
        ] as WorldAnvilWorld[],
        pagination: {
          total: 2,
          page: 1,
          pages: 1
        }
      };
      mockWorldService.getMyWorlds.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.getMyWorlds();

      // Assert
      expect(mockWorldService.getMyWorlds).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
    
    it('should handle errors from worldService.getMyWorlds', async () => {
      // Arrange
      const expectedError = new Error('Failed to fetch worlds');
      mockWorldService.getMyWorlds.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(controller.getMyWorlds()).rejects.toThrow(expectedError);
      expect(mockWorldService.getMyWorlds).toHaveBeenCalled();
    });
  });

  describe('getWorldById', () => {
    it('should call worldService.getWorldById with correct parameters', async () => {
      // Arrange
      const worldId = 'world-1';
      const expectedWorld: WorldAnvilWorld = { 
        id: worldId, 
        title: 'Test World 1',
        slug: 'test-world-1',
        description: 'A test world',
        visibility: 'public'
      };
      mockWorldService.getWorldById.mockResolvedValue(expectedWorld);

      // Act
      const result = await controller.getWorldById(worldId);

      // Assert
      expect(mockWorldService.getWorldById).toHaveBeenCalledWith(worldId);
      expect(result).toEqual(expectedWorld);
    });
    
    it('should handle errors from worldService.getWorldById', async () => {
      // Arrange
      const worldId = 'invalid-world';
      const expectedError = new Error('World not found');
      mockWorldService.getWorldById.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(controller.getWorldById(worldId)).rejects.toThrow(expectedError);
      expect(mockWorldService.getWorldById).toHaveBeenCalledWith(worldId);
    });
  });
  
  // Test for article methods
  describe('article methods', () => {
    it('should call articleService.getArticleById with correct parameters', async () => {
      const articleId = 'article-1';
      const granularity = '0';
      const mockResponse: WorldAnvilArticleResponse = { 
        id: articleId, 
        title: 'Test Article',
        slug: 'test-article',
        content: 'Test content',
        world_id: 'world-1',
        is_draft: false,
        template: 'default',
        created_at: '2021-01-01T00:00:00Z',
        updated_at: '2021-01-01T00:00:00Z'
      };
      
      mockArticleService.getArticleById.mockResolvedValue(mockResponse);
      
      const result = await controller.getArticleById(articleId, granularity);
      
      expect(mockArticleService.getArticleById).toHaveBeenCalledWith(articleId, granularity);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call articleService.createArticle with correct data', async () => {
      const articleData: WorldAnvilArticleInput = { 
        title: 'New Article', 
        content: 'Article content',
        world_id: 'world-1'
      };
      
      const mockResponse: WorldAnvilArticleResponse = { 
        id: 'new-article', 
        title: 'New Article',
        slug: 'new-article',
        content: 'Article content',
        world_id: 'world-1',
        is_draft: false,
        template: 'default',
        created_at: '2021-01-01T00:00:00Z',
        updated_at: '2021-01-01T00:00:00Z'
      };
      
      mockArticleService.createArticle.mockResolvedValue(mockResponse);
      
      const result = await controller.createArticle(articleData);
      
      expect(mockArticleService.createArticle).toHaveBeenCalledWith(articleData);
      expect(result).toEqual(mockResponse);
    });
  });
  
  // Test for map methods
  describe('map methods', () => {
    it('should call mapService.getMapById with correct parameters', async () => {
      const mapId = 'map-1';
      const granularity = '0';
      const mockResponse: MapResponse = { 
        id: mapId, 
        title: 'Test Map',
        slug: 'test-map',
        world_id: 'world-1',
        user_id: 'user-1'
      };
      
      mockMapService.getMapById.mockResolvedValue(mockResponse);
      
      const result = await controller.getMapById(mapId, granularity);
      
      expect(mockMapService.getMapById).toHaveBeenCalledWith(mapId, granularity);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call mapService.createMap with correct data', async () => {
      const mapData: MapInput = { 
        title: 'New Map', 
        world: 'world-1',
        world_id: 'world-1',
        image: 'image-1'
      };
      
      const mockResponse: MapRef = { 
        id: 'new-map', 
        title: 'New Map',
        slug: 'new-map',
        world_id: 'world-1',
        user_id: 'user-1'
      };
      
      mockMapService.createMap.mockResolvedValue(mockResponse);
      
      const result = await controller.createMap(mapData);
      
      expect(mockMapService.createMap).toHaveBeenCalledWith(mapData);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call mapService.getLayersByMap with correct parameters', async () => {
      const mapId = 'map-1';
      const options = { offset: 0, limit: 10 };
      
      const mockResponse: MapLayersResponse = { 
        success: true, 
        entities: [{ 
          id: 'layer-1', 
          title: 'Layer 1',
          slug: 'layer-1',
          map_id: mapId
        }] 
      };
      
      mockMapService.getLayersByMap.mockResolvedValue(mockResponse);
      
      const result = await controller.getLayersByMap(mapId, options);
      
      expect(mockMapService.getLayersByMap).toHaveBeenCalledWith(mapId, options);
      expect(result).toEqual(mockResponse);
    });
  });
  
  // Test for variable methods
  describe('variable methods', () => {
    it('should call variableService.getVariable with correct parameters', async () => {
      const variableId = 'var-1';
      const granularity = 0;
      const mockResponse: WorldAnvilVariable = { 
        id: variableId, 
        name: 'Test Variable',
        value: 'test-value',
        is_private: false,
        variable_collection_id: 'coll-1'
      };
      
      mockVariableService.getVariable.mockResolvedValue(mockResponse);
      
      const result = await controller.getVariable(variableId, granularity);
      
      expect(mockVariableService.getVariable).toHaveBeenCalledWith(variableId, granularity);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call variableService.createVariable with correct data', async () => {
      const variableData: WorldAnvilVariableInput = { 
        k: 'New Variable', 
        v: 'new-value', 
        type: 'string',
        collection: 'coll-1',
        world: 'world-1'
      };
      
      const mockResponse: WorldAnvilVariable = { 
        id: 'new-var', 
        name: 'New Variable', 
        value: 'new-value',
        is_private: false,
        variable_collection_id: 'coll-1'
      };
      
      mockVariableService.createVariable.mockResolvedValue(mockResponse);
      
      const result = await controller.createVariable(variableData);
      
      expect(mockVariableService.createVariable).toHaveBeenCalledWith(variableData);
      expect(result).toEqual(mockResponse);
    });

    it('should call variableService.updateVariable with correct parameters', async () => {
      const variableId = 'var-1';
      const variableData: WorldAnvilVariableUpdate = {
        v: 'updated-value'
      };
      
      const mockResponse: WorldAnvilVariable = { 
        id: variableId,
        name: 'Test Variable',
        value: 'updated-value',
        is_private: false,
        variable_collection_id: 'coll-1'
      };
      
      mockVariableService.updateVariable.mockResolvedValue(mockResponse);
      
      const result = await controller.updateVariable(variableId, variableData);
      
      expect(mockVariableService.updateVariable).toHaveBeenCalledWith(variableId, variableData);
      expect(result).toEqual(mockResponse);
    });

    it('should call variableService.deleteVariable with correct id', async () => {
      const variableId = 'var-1';
      mockVariableService.deleteVariable.mockResolvedValue(undefined);
      
      await controller.deleteVariable(variableId);
      
      expect(mockVariableService.deleteVariable).toHaveBeenCalledWith(variableId);
    });

    it('should call variableService.listVariablesByCollection with correct parameters', async () => {
      const collectionId = 'coll-1';
      const options = { offset: 0, limit: 10 };
      const mockVariables: WorldAnvilVariable[] = [{
        id: 'var-1',
        name: 'Variable 1',
        value: 'value-1',
        is_private: false,
        variable_collection_id: collectionId
      }];
      
      mockVariableService.listVariablesByCollection.mockResolvedValue(mockVariables);
      
      const result = await controller.listVariablesByCollection(collectionId, options);
      
      expect(mockVariableService.listVariablesByCollection).toHaveBeenCalledWith(collectionId, options);
      expect(result).toEqual(mockVariables);
    });
  });

  // Test for variable collection methods
  describe('variable collection methods', () => {
    it('should call variableService.getVariableCollection with correct parameters', async () => {
      const collectionId = 'coll-1';
      const granularity = 0;
      const mockResponse: WorldAnvilVariableCollection = {
        id: collectionId,
        name: 'Test Collection',
        is_private: false,
        world_id: 'world-1'
      };
      
      mockVariableService.getVariableCollection.mockResolvedValue(mockResponse);
      
      const result = await controller.getVariableCollection(collectionId, granularity);
      
      expect(mockVariableService.getVariableCollection).toHaveBeenCalledWith(collectionId, granularity);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call variableService.createVariableCollection with correct data', async () => {
      const collectionData: WorldAnvilVariableCollectionInput = {
        title: 'New Collection',
        world: 'world-1',
        is_private: false
      };
      
      const mockResponse: WorldAnvilVariableCollection = {
        id: 'new-coll',
        name: 'New Collection',
        is_private: false,
        world_id: 'world-1'
      };
      
      mockVariableService.createVariableCollection.mockResolvedValue(mockResponse);
      
      const result = await controller.createVariableCollection(collectionData);
      
      expect(mockVariableService.createVariableCollection).toHaveBeenCalledWith(collectionData);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call variableService.updateVariableCollection with correct parameters', async () => {
      const collectionId = 'coll-1';
      const collectionData: WorldAnvilVariableCollectionUpdate = {
        title: 'Updated Collection'
      };
      
      const mockResponse: WorldAnvilVariableCollection = {
        id: collectionId,
        name: 'Updated Collection',
        is_private: false,
        world_id: 'world-1'
      };
      
      mockVariableService.updateVariableCollection.mockResolvedValue(mockResponse);
      
      const result = await controller.updateVariableCollection(collectionId, collectionData);
      
      expect(mockVariableService.updateVariableCollection).toHaveBeenCalledWith(collectionId, collectionData);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call variableService.deleteVariableCollection with correct id', async () => {
      const collectionId = 'coll-1';
      mockVariableService.deleteVariableCollection.mockResolvedValue(undefined);
      
      await controller.deleteVariableCollection(collectionId);
      
      expect(mockVariableService.deleteVariableCollection).toHaveBeenCalledWith(collectionId);
    });
    
    it('should call variableService.listVariableCollectionsByWorld with correct parameters', async () => {
      const worldId = 'world-1';
      const options = { offset: 0, limit: 10 };
      const mockCollections: WorldAnvilVariableCollection[] = [{
        id: 'coll-1',
        name: 'Collection 1',
        is_private: false,
        world_id: worldId
      }];
      
      mockVariableService.listVariableCollectionsByWorld.mockResolvedValue(mockCollections);
      
      const result = await controller.listVariableCollectionsByWorld(worldId, options);
      
      expect(mockVariableService.listVariableCollectionsByWorld).toHaveBeenCalledWith(worldId, options);
      expect(result).toEqual(mockCollections);
    });
  });
  
  // Test for block template methods
  describe('block template methods', () => {
    it('should call blockTemplateService.getBlockTemplatesByUser with correct parameters', async () => {
      const userId = 'user-1';
      const options = { offset: 0, limit: 10 };
      
      const mockResponse: UserBlockTemplatesResponse = { 
        success: true, 
        entities: [
          { id: 'tpl-1', name: 'Template 1', owner: userId, user_id: userId, is_public: false },
          { id: 'tpl-2', name: 'Template 2', owner: userId, user_id: userId, is_public: false }
        ]
      };
      
      mockBlockTemplateService.getBlockTemplatesByUser.mockResolvedValue(mockResponse);
      
      const result = await controller.getBlockTemplatesByUser(userId, options);
      
      expect(mockBlockTemplateService.getBlockTemplatesByUser).toHaveBeenCalledWith(userId, options);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call blockTemplateService.getMyBlockTemplates with correct options', async () => {
      const options = { offset: 0, limit: 20 };
      
      const mockResponse: UserBlockTemplatesResponse = { 
        success: true, 
        entities: [
          { id: 'tpl-3', name: 'Template 3', owner: 'user-1', user_id: 'user-1', is_public: false },
          { id: 'tpl-4', name: 'Template 4', owner: 'user-1', user_id: 'user-1', is_public: false }
        ]
      };
      
      mockBlockTemplateService.getMyBlockTemplates.mockResolvedValue(mockResponse);
      
      const result = await controller.getMyBlockTemplates(options);
      
      expect(mockBlockTemplateService.getMyBlockTemplates).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockResponse);
    });
  });
  
  // Test for history methods
  describe('history methods', () => {
    it('should call timelineService.getHistoryById with correct parameters', async () => {
      const historyId = 'history-1';
      const granularity = '0';
      
      const mockResponse: HistoryResponse = { 
        id: historyId, 
        title: 'Test History',
        slug: 'test-history',
        world_id: 'world-1',
        user_id: 'user-1',
        year: '2023'
      };
      
      mockTimelineService.getHistoryById.mockResolvedValue(mockResponse);
      
      const result = await controller.getHistoryById(historyId, granularity);
      
      expect(mockTimelineService.getHistoryById).toHaveBeenCalledWith(historyId, granularity);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call timelineService.createHistory with correct data', async () => {
      const historyData: HistoryInput = { 
        title: 'New History', 
        world: { id: 'world-1' },
        year: '2023'
      };
      
      const mockResponse: HistoryResponse = { 
        id: 'new-history', 
        title: 'New History',
        slug: 'new-history',
        world_id: 'world-1',
        user_id: 'user-1',
        year: '2023'
      };
      
      mockTimelineService.createHistory.mockResolvedValue(mockResponse);
      
      const result = await controller.createHistory(historyData);
      
      expect(mockTimelineService.createHistory).toHaveBeenCalledWith(historyData);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call timelineService.updateHistory with correct parameters', async () => {
      const historyId = 'history-1';
      const historyData: HistoryUpdateInput = { 
        title: 'Updated History',
        year: '2024'
      };
      
      const mockResponse: HistoryResponse = { 
        id: historyId, 
        title: 'Updated History',
        slug: 'test-history',
        world_id: 'world-1',
        user_id: 'user-1',
        year: '2024'
      };
      
      mockTimelineService.updateHistory.mockResolvedValue(mockResponse);
      
      const result = await controller.updateHistory(historyId, historyData);
      
      expect(mockTimelineService.updateHistory).toHaveBeenCalledWith(historyId, historyData);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call timelineService.deleteHistory with correct id', async () => {
      const historyId = 'history-1';
      const mockResponse = { success: true };
      
      mockTimelineService.deleteHistory.mockResolvedValue(mockResponse);
      
      const result = await controller.deleteHistory(historyId);
      
      expect(mockTimelineService.deleteHistory).toHaveBeenCalledWith(historyId);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call timelineService.getHistoriesByWorld with correct parameters', async () => {
      const worldId = 'world-1';
      const options = { offset: 0, limit: 10 };
      
      const mockResponse: WorldHistoriesResponse = {
        success: true,
        entities: [{
          id: 'history-1',
          title: 'History 1',
          slug: 'history-1',
          world_id: worldId,
          user_id: 'user-1',
          year: '2023'
        }]
      };
      
      mockTimelineService.getHistoriesByWorld.mockResolvedValue(mockResponse);
      
      const result = await controller.getHistoriesByWorld(worldId, options);
      
      expect(mockTimelineService.getHistoriesByWorld).toHaveBeenCalledWith(worldId, options);
      expect(result).toEqual(mockResponse);
    });
  });
  
  // Test for timeline methods
  describe('timeline methods', () => {
    it('should call timelineService.getTimelineById with correct parameters', async () => {
      const timelineId = 'timeline-1';
      const granularity = '0';
      
      const mockResponse: TimelineResponse = { 
        id: timelineId, 
        title: 'Test Timeline',
        slug: 'test-timeline',
        world_id: 'world-1',
        user_id: 'user-1'
      };
      
      mockTimelineService.getTimelineById.mockResolvedValue(mockResponse);
      
      const result = await controller.getTimelineById(timelineId, granularity);
      
      expect(mockTimelineService.getTimelineById).toHaveBeenCalledWith(timelineId, granularity);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call timelineService.createTimeline with correct data', async () => {
      const timelineData: TimelineInput = { 
        title: 'New Timeline', 
        world: { id: 'world-1' },
        world_id: 'world-1'
      };
      
      const mockResponse: TimelineRef = { 
        id: 'new-timeline', 
        title: 'New Timeline',
        slug: 'new-timeline',
        world_id: 'world-1',
        user_id: 'user-1'
      };
      
      mockTimelineService.createTimeline.mockResolvedValue(mockResponse);
      
      const result = await controller.createTimeline(timelineData);
      
      expect(mockTimelineService.createTimeline).toHaveBeenCalledWith(timelineData);
      expect(result).toEqual(mockResponse);
    });
    
    it('should call timelineService.deleteTimeline with correct id', async () => {
      const timelineId = 'timeline-1';
      const mockResponse = { success: true };
      
      mockTimelineService.deleteTimeline.mockResolvedValue(mockResponse);
      
      const result = await controller.deleteTimeline(timelineId);
      
      expect(mockTimelineService.deleteTimeline).toHaveBeenCalledWith(timelineId);
      expect(result).toEqual(mockResponse);
    });
  });
  
  it('should call manuscriptService.createManuscript with correct data', async () => {
    const manuscriptData = { 
      title: 'New Manuscript',
      world: { id: 'world-1' }
    };
    
    const mockResponse = { 
      id: 'new-manuscript', 
      title: 'New Manuscript',
      slug: 'new-manuscript',
      world_id: 'world-1',
      user_id: 'user-1'
    };
    
    mockManuscriptService.createManuscript.mockResolvedValue(mockResponse);
    
    const result = await controller.createManuscript(manuscriptData);
    
    expect(mockManuscriptService.createManuscript).toHaveBeenCalledWith(manuscriptData);
    expect(result).toEqual(mockResponse);
  });

  it('should call manuscriptService.updateManuscript with correct parameters', async () => {
    const manuscriptId = 'manuscript-1';
    const manuscriptData = {
      title: 'Updated Manuscript'
    };
    
    const mockResponse = { 
      id: manuscriptId, 
      title: 'Updated Manuscript',
      slug: 'updated-manuscript',
      world_id: 'world-1',
      user_id: 'user-1'
    };
    
    mockManuscriptService.updateManuscript.mockResolvedValue(mockResponse);
    
    const result = await controller.updateManuscript(manuscriptId, manuscriptData);
    
    expect(mockManuscriptService.updateManuscript).toHaveBeenCalledWith(manuscriptId, manuscriptData);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.deleteManuscript with correct id', async () => {
    const manuscriptId = 'manuscript-1';
    const mockResponse = { success: true };
    
    mockManuscriptService.deleteManuscript.mockResolvedValue(mockResponse);
    
    const result = await controller.deleteManuscript(manuscriptId);
    
    expect(mockManuscriptService.deleteManuscript).toHaveBeenCalledWith(manuscriptId);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.getManuscriptsByWorld with correct parameters', async () => {
    const worldId = 'world-1';
    const options = { offset: 0, limit: 10 };
    
    const mockResponse = {
      success: true,
      entities: [{
        id: 'manuscript-1',
        title: 'Manuscript 1',
        slug: 'manuscript-1',
        world_id: worldId,
        user_id: 'user-1'
      }]
    };
    
    mockManuscriptService.getManuscriptsByWorld.mockResolvedValue(mockResponse);
    
    const result = await controller.getManuscriptsByWorld(worldId, options);
    
    expect(mockManuscriptService.getManuscriptsByWorld).toHaveBeenCalledWith(worldId, options);
    expect(result).toEqual(mockResponse);
  });

  // Manuscript Beat tests
  describe('manuscript beat methods', () => {
  it('should call manuscriptService.getManuscriptBeatById with correct parameters', async () => {
    const beatId = 'beat-1';
    const granularity = '0';
    const mockResponse = { 
      id: beatId, 
      title: 'Test Beat',
      content: 'Beat content',
      part_id: 'part-1',
      position: 1,
      created_at: '2021-01-01T00:00:00Z',
      updated_at: '2021-01-01T00:00:00Z'
    };
    
    mockManuscriptService.getManuscriptBeatById.mockResolvedValue(mockResponse);
    
    const result = await controller.getManuscriptBeat(beatId, granularity);
    
    expect(mockManuscriptService.getManuscriptBeatById).toHaveBeenCalledWith(beatId, granularity);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.createManuscriptBeat with correct data', async () => {
    const beatData = { 
      content: 'New Beat content',
      part: {
        id: 'part-1'
      },
      position: 1
    };
    
    const mockResponse = { 
      id: 'new-beat', 
      content: 'New Beat content',
      part_id: 'part-1',
      position: 1
    };
    
    mockManuscriptService.createManuscriptBeat.mockResolvedValue(mockResponse);
    
    const result = await controller.createManuscriptBeat(beatData);
    
    expect(mockManuscriptService.createManuscriptBeat).toHaveBeenCalledWith(beatData);
    expect(result).toEqual(mockResponse);
  });

  it('should call manuscriptService.updateManuscriptBeat with correct parameters', async () => {
    const beatId = 'beat-1';
    const beatData = {
      content: 'Updated content',
      position: 2
    };
    
    const mockResponse = { 
      id: beatId, 
      content: 'Updated content',
      part_id: 'part-1',
      position: 2
    };
    
    mockManuscriptService.updateManuscriptBeat.mockResolvedValue(mockResponse);
    
    const result = await controller.updateManuscriptBeat(beatId, beatData);
    
    expect(mockManuscriptService.updateManuscriptBeat).toHaveBeenCalledWith(beatId, beatData);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.deleteManuscriptBeat with correct id', async () => {
    const beatId = 'beat-1';
    const mockResponse = { success: true };
    
    mockManuscriptService.deleteManuscriptBeat.mockResolvedValue(mockResponse);
    
    const result = await controller.deleteManuscriptBeat(beatId);
    
    expect(mockManuscriptService.deleteManuscriptBeat).toHaveBeenCalledWith(beatId);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.getBeatsByPart with correct parameters', async () => {
    const partId = 'part-1';
    const options = { offset: 0, limit: 10 };
    
    const mockResponse = {
      success: true,
      entities: [{
        id: 'beat-1',
        content: 'Beat 1 content',
        part_id: partId,
        position: 1
      }]
    };
    
    mockManuscriptService.getBeatsByPart.mockResolvedValue(mockResponse);
    
    const result = await controller.getBeatsByPart(partId, options);
    
    expect(mockManuscriptService.getBeatsByPart).toHaveBeenCalledWith(partId, options);
    expect(result).toEqual(mockResponse);
  });
  });

  // Manuscript Part tests
  describe('manuscript part methods', () => {
  it('should call manuscriptService.getManuscriptPartById with correct parameters', async () => {
    const partId = 'part-1';
    const granularity = '0';
    const mockResponse = { 
      id: partId, 
      title: 'Test Part',
      synopsis: 'Part synopsis',
      type: 'chapter',
      version_id: 'version-1',
      created_at: '2021-01-01T00:00:00Z',
      updated_at: '2021-01-01T00:00:00Z'
    };
    
    mockManuscriptService.getManuscriptPartById.mockResolvedValue(mockResponse);
    
    const result = await controller.getManuscriptPart(partId, granularity);
    
    expect(mockManuscriptService.getManuscriptPartById).toHaveBeenCalledWith(partId, granularity);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.createManuscriptPart with correct data', async () => {
    const partData = { 
      title: 'New Part',
      type: 'chapter',
      version: {
        id: 'version-1'
      },
      synopsis: 'New part synopsis'
    };
    
    const mockResponse = { 
      id: 'new-part', 
      title: 'New Part',
      type: 'chapter',
      synopsis: 'New part synopsis',
      version_id: 'version-1'
    };
    
    mockManuscriptService.createManuscriptPart.mockResolvedValue(mockResponse);
    
    const result = await controller.createManuscriptPart(partData);
    
    expect(mockManuscriptService.createManuscriptPart).toHaveBeenCalledWith(partData);
    expect(result).toEqual(mockResponse);
  });

  it('should call manuscriptService.updateManuscriptPart with correct parameters', async () => {
    const partId = 'part-1';
    const partData = {
      title: 'Updated Part',
      synopsis: 'Updated synopsis'
    };
    
    const mockResponse = { 
      id: partId, 
      title: 'Updated Part',
      synopsis: 'Updated synopsis',
      type: 'chapter',
      version_id: 'version-1'
    };
    
    mockManuscriptService.updateManuscriptPart.mockResolvedValue(mockResponse);
    
    const result = await controller.updateManuscriptPart(partId, partData);
    
    expect(mockManuscriptService.updateManuscriptPart).toHaveBeenCalledWith(partId, partData);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.deleteManuscriptPart with correct id', async () => {
    const partId = 'part-1';
    const mockResponse = { success: true };
    
    mockManuscriptService.deleteManuscriptPart.mockResolvedValue(mockResponse);
    
    const result = await controller.deleteManuscriptPart(partId);
    
    expect(mockManuscriptService.deleteManuscriptPart).toHaveBeenCalledWith(partId);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.getPartsByVersion with correct parameters', async () => {
    const versionId = 'version-1';
    const options = { offset: 0, limit: 10 };
    
    const mockResponse = {
      success: true,
      entities: [{
        id: 'part-1',
        title: 'Part 1',
        synopsis: 'Part 1 synopsis',
        type: 'chapter',
        version_id: versionId
      }]
    };
    
    mockManuscriptService.getPartsByVersion.mockResolvedValue(mockResponse);
    
    const result = await controller.getPartsByVersion(versionId, options);
    
    expect(mockManuscriptService.getPartsByVersion).toHaveBeenCalledWith(versionId, options);
    expect(result).toEqual(mockResponse);
  });
  });

  // Manuscript Version tests
  describe('manuscript version methods', () => {
  it('should call manuscriptService.getManuscriptVersionById with correct parameters', async () => {
    const versionId = 'version-1';
    const granularity = '0';
    const mockResponse = { 
      id: versionId, 
      title: 'Test Version',
      name: 'Version 1',
      manuscript_id: 'manuscript-1',
      created_at: '2021-01-01T00:00:00Z',
      updated_at: '2021-01-01T00:00:00Z'
    };
    
    mockManuscriptService.getManuscriptVersionById.mockResolvedValue(mockResponse);
    
    const result = await controller.getManuscriptVersion(versionId, granularity);
    
    expect(mockManuscriptService.getManuscriptVersionById).toHaveBeenCalledWith(versionId, granularity);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.createManuscriptVersion with correct data', async () => {
    const versionData = { 
      name: 'New Version',
      manuscript: {
        id: 'manuscript-1'
      }
    };
    
    const mockResponse = { 
      id: 'new-version', 
      name: 'New Version',
      manuscript_id: 'manuscript-1'
    };
    
    mockManuscriptService.createManuscriptVersion.mockResolvedValue(mockResponse);
    
    const result = await controller.createManuscriptVersion(versionData);
    
    expect(mockManuscriptService.createManuscriptVersion).toHaveBeenCalledWith(versionData);
    expect(result).toEqual(mockResponse);
  });

  it('should call manuscriptService.updateManuscriptVersion with correct parameters', async () => {
    const versionId = 'version-1';
    const versionData = {
      name: 'Updated Version'
    };
    
    const mockResponse = { 
      id: versionId, 
      name: 'Updated Version',
      manuscript_id: 'manuscript-1'
    };
    
    mockManuscriptService.updateManuscriptVersion.mockResolvedValue(mockResponse);
    
    const result = await controller.updateManuscriptVersion(versionId, versionData);
    
    expect(mockManuscriptService.updateManuscriptVersion).toHaveBeenCalledWith(versionId, versionData);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.deleteManuscriptVersion with correct id', async () => {
    const versionId = 'version-1';
    const mockResponse = { success: true };
    
    mockManuscriptService.deleteManuscriptVersion.mockResolvedValue(mockResponse);
    
    const result = await controller.deleteManuscriptVersion(versionId);
    
    expect(mockManuscriptService.deleteManuscriptVersion).toHaveBeenCalledWith(versionId);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.getVersionsByManuscript with correct parameters', async () => {
    const manuscriptId = 'manuscript-1';
    const options = { offset: 0, limit: 10 };
    
    const mockResponse = {
      success: true,
      entities: [{
        id: 'version-1',
        name: 'Version 1',
        manuscript_id: manuscriptId
      }]
    };
    
    mockManuscriptService.getVersionsByManuscript.mockResolvedValue(mockResponse);
    
    const result = await controller.getVersionsByManuscript(manuscriptId, options);
    
    expect(mockManuscriptService.getVersionsByManuscript).toHaveBeenCalledWith(manuscriptId, options);
    expect(result).toEqual(mockResponse);
  });
  });

  // Manuscript Bookmark tests
  describe('manuscript bookmark methods', () => {
  it('should call manuscriptService.getManuscriptBookmarkById with correct parameters', async () => {
    const bookmarkId = 'bookmark-1';
    const granularity = '0';
    const mockResponse = { 
      id: bookmarkId, 
      title: 'Test Bookmark',
      note: 'Bookmark note',
      manuscript_id: 'manuscript-1',
      created_at: '2021-01-01T00:00:00Z',
      updated_at: '2021-01-01T00:00:00Z'
    };
    
    mockManuscriptService.getManuscriptBookmarkById.mockResolvedValue(mockResponse);
    
    const result = await controller.getManuscriptBookmark(bookmarkId, granularity);
    
    expect(mockManuscriptService.getManuscriptBookmarkById).toHaveBeenCalledWith(bookmarkId, granularity);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.createManuscriptBookmark with correct data', async () => {
    const bookmarkData = { 
      title: 'New Bookmark',
      manuscript: {
        id: 'manuscript-1'
      },
      note: 'New bookmark note'
    };
    
    const mockResponse = { 
      id: 'new-bookmark', 
      title: 'New Bookmark',
      note: 'New bookmark note',
      manuscript_id: 'manuscript-1'
    };
    
    mockManuscriptService.createManuscriptBookmark.mockResolvedValue(mockResponse);
    
    const result = await controller.createManuscriptBookmark(bookmarkData);
    
    expect(mockManuscriptService.createManuscriptBookmark).toHaveBeenCalledWith(bookmarkData);
    expect(result).toEqual(mockResponse);
  });

  it('should call manuscriptService.updateManuscriptBookmark with correct parameters', async () => {
    const bookmarkId = 'bookmark-1';
    const bookmarkData = {
      title: 'Updated Bookmark',
      note: 'Updated note'
    };
    
    const mockResponse = { 
      id: bookmarkId, 
      title: 'Updated Bookmark',
      note: 'Updated note',
      manuscript_id: 'manuscript-1'
    };
    
    mockManuscriptService.updateManuscriptBookmark.mockResolvedValue(mockResponse);
    
    const result = await controller.updateManuscriptBookmark(bookmarkId, bookmarkData);
    
    expect(mockManuscriptService.updateManuscriptBookmark).toHaveBeenCalledWith(bookmarkId, bookmarkData);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.deleteManuscriptBookmark with correct id', async () => {
    const bookmarkId = 'bookmark-1';
    const mockResponse = { success: true };
    
    mockManuscriptService.deleteManuscriptBookmark.mockResolvedValue(mockResponse);
    
    const result = await controller.deleteManuscriptBookmark(bookmarkId);
    
    expect(mockManuscriptService.deleteManuscriptBookmark).toHaveBeenCalledWith(bookmarkId);
    expect(result).toEqual(mockResponse);
  });
  
  it('should call manuscriptService.getBookmarksByManuscript with correct parameters', async () => {
    const manuscriptId = 'manuscript-1';
    const options = { offset: 0, limit: 10 };
    
    const mockResponse = {
      success: true,
      entities: [{
        id: 'bookmark-1',
        title: 'Bookmark 1',
        note: 'Bookmark 1 note',
        manuscript_id: manuscriptId
      }]
    };
    
    mockManuscriptService.getBookmarksByManuscript.mockResolvedValue(mockResponse);
    
    const result = await controller.getBookmarksByManuscript(manuscriptId, options);
    
    expect(mockManuscriptService.getBookmarksByManuscript).toHaveBeenCalledWith(manuscriptId, options);
    expect(result).toEqual(mockResponse);
  });
  });
});

