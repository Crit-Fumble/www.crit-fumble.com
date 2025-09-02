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
import { TimelineInput, TimelineRef, TimelineResponse } from '../../../models/WorldAnvilTimeline';
import { NotebookResponse } from '../../../models/WorldAnvilNotebook';
import { SubscriberGroupRef, SubscriberGroupResponse } from '../../../models/WorldAnvilSubscriberGroup';
import { BlockTemplateRef, UserBlockTemplatesResponse, BlockTemplateListOptions } from '../../../server/services/WorldAnvilBlockTemplateService';
import { 
  WorldAnvilVariable, WorldAnvilVariableInput, WorldAnvilVariableUpdate,
  WorldAnvilVariableCollection, WorldAnvilVariableCollectionInput, WorldAnvilVariableCollectionUpdate,
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
        k: 'Test Variable',
        v: 'test-value',
        type: 'string',
        collection: 'coll-1',
        world: 'world-1'
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
        k: 'New Variable', 
        v: 'new-value',
        type: 'string',
        collection: 'coll-1',
        world: 'world-1'
      };
      
      mockVariableService.createVariable.mockResolvedValue(mockResponse);
      
      const result = await controller.createVariable(variableData);
      
      expect(mockVariableService.createVariable).toHaveBeenCalledWith(variableData);
      expect(result).toEqual(mockResponse);
    });
  });
  
  // Test for block template methods
  describe('block template methods', () => {
    it('should call blockTemplateService.getBlockTemplatesByUser with correct parameters', async () => {
      const userId = 'user-1';
      const options = { offset: 0, limit: 10 };
      
      const mockResponse: UserBlockTemplatesResponse = { 
        success: true, 
        entities: [{ 
          id: 'template-1', 
          name: 'Template 1',
          user_id: userId,
          is_public: true
        }] 
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
        entities: [{ 
          id: 'template-2', 
          name: 'Template 2',
          user_id: 'user-1',
          is_public: false
        }] 
      };
      
      mockBlockTemplateService.getMyBlockTemplates.mockResolvedValue(mockResponse);
      
      const result = await controller.getMyBlockTemplates(options);
      
      expect(mockBlockTemplateService.getMyBlockTemplates).toHaveBeenCalledWith(options);
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
});
