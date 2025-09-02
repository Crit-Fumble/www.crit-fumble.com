/**
 * World Anvil Controller
 * Controller for World Anvil API endpoints
 */

import * as services from '../services/';
import { WorldAnvilConfig } from '../configs';
import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';

// Import all model types from consolidated files
import { 
  TimelineInput, TimelineUpdateInput, TimelineResponse, TimelineListOptions,
  GranularityLevel, HistoryInput, HistoryUpdateInput, HistoryResponse, 
  WorldTimelinesResponse, WorldHistoriesResponse
} from '../../models/WorldAnvilTimeline';
import { 
  SubscriberGroupInput, SubscriberGroupUpdateInput,
  SubscriberGroupListOptions, SubscriberGroupResponse, WorldSubscriberGroupsResponse
} from '../../models/WorldAnvilSubscriberGroup';
import { 
  WorldAnvilArticleInput, WorldAnvilArticleResponse, ArticleListOptions, ArticleListResponse
} from '../../models/WorldAnvilArticle';
import { 
  ImageListOptions, ImageResponse, ImageUpdateInput, WorldImagesResponse
} from '../../models/WorldAnvilImage';

// Define image input interface (not exported from the model file)
interface ImageInput {
  title: string;
  description?: string;
  world: { id: string };
  [key: string]: any;
}
import { 
  BlockInput, BlockFolderListOptions, BlockResponse, BlockFolderBlocksResponse
} from '../../models/WorldAnvilBlock';
import { 
  CanvasInput, CanvasResponse
} from '../../models/WorldAnvilCanvas';
import { 
  CategoryInput, CategoryResponse
} from '../../models/WorldAnvilCategory';
import {
  ManuscriptRef,
  ManuscriptResponse,
  ManuscriptInput,
  ManuscriptUpdateInput,
  WorldManuscriptsResponse,
  ManuscriptListOptions,
  // Manuscript Beat types
  ManuscriptBeatRef, ManuscriptBeatResponse, ManuscriptBeatInput, ManuscriptBeatUpdateInput, ManuscriptBeatsResponse,
  // Manuscript Part types
  ManuscriptPartRef, ManuscriptPartResponse, ManuscriptPartInput, ManuscriptPartUpdateInput, ManuscriptPartsResponse,
  // Manuscript Version types
  ManuscriptVersionRef, ManuscriptVersionResponse, ManuscriptVersionInput, ManuscriptVersionUpdateInput, ManuscriptVersionsResponse,
  // Manuscript Bookmark types
  ManuscriptBookmarkRef, ManuscriptBookmarkResponse, ManuscriptBookmarkInput, ManuscriptBookmarkUpdateInput, ManuscriptBookmarksResponse,
  // Common types
  ManuscriptSubResourceListOptions
} from '../../models/WorldAnvilManuscript';
import { 
  MapInput, MapResponse, MapUpdateInput, WorldMapsResponse, MapListOptions,
  LayerInput, LayerResponse, LayerUpdateInput, LayerRef, MapLayersResponse,
  MarkerGroupInput, MarkerGroupResponse, MarkerGroupUpdateInput, MarkerGroupRef,
  MapMarkerGroupsResponse, MapMarkersResponse, MarkerGroupMarkersResponse
} from '../../models/WorldAnvilMap';
import { 
  NotebookInput, NotebookResponse
} from '../../models/WorldAnvilNotebook';
import { 
  SecretInput, SecretResponse
} from '../../models/WorldAnvilSecret';
// Import variable models from the models directory
import {
  WorldAnvilVariable, WorldAnvilVariableCollection
} from '../../models/WorldAnvilVariable';
// Import variable service interfaces from the service
import {
  WorldAnvilVariableInput, WorldAnvilVariableUpdate,
  WorldAnvilVariableCollectionInput, WorldAnvilVariableCollectionUpdate,
  PaginationOptions
} from '../services/WorldAnvilVariableService';
import {
  BlockTemplateRef, BlockTemplateListOptions, UserBlockTemplatesResponse
} from '../services/WorldAnvilBlockTemplateService';

export class WorldAnvilController {
  private apiClient: WorldAnvilApiClient;
  private authService: services.WorldAnvilAuthService;
  private userService: services.WorldAnvilUserService;
  private identityService: services.WorldAnvilIdentityService;
  private worldService: services.WorldAnvilWorldService;
  private rpgSystemService: services.WorldAnvilRpgSystemService;
  private articleService: services.WorldAnvilArticleService;
  private blockService: services.WorldAnvilBlockService;
  private blockTemplateService: services.WorldAnvilBlockTemplateService;
  private canvasService: services.WorldAnvilCanvasService;
  private categoryService: services.WorldAnvilCategoryService;
  private imageService: services.WorldAnvilImageService;
  private manuscriptService: services.WorldAnvilManuscriptService;
  private mapService: services.WorldAnvilMapService;
  private notebookService: services.WorldAnvilNotebookService;
  private secretService: services.WorldAnvilSecretService;
  private subscriberGroupService: services.WorldAnvilSubscriberGroupService;
  private timelineService: services.WorldAnvilTimelineService;
  private variableService: services.WorldAnvilVariableService;
  // private campaignService: services.WorldAnvilCampaignService;

  constructor(customConfig?: WorldAnvilConfig) {
    // Initialize services /w custom config, if one is available
    let _client: WorldAnvilApiClient = customConfig ? new WorldAnvilApiClient(customConfig) : new WorldAnvilApiClient();
    this.apiClient = _client;
    this.authService = new services.WorldAnvilAuthService(_client);
    this.userService = new services.WorldAnvilUserService(_client);
    this.identityService = new services.WorldAnvilIdentityService(_client);
    this.worldService = new services.WorldAnvilWorldService(_client);
    this.rpgSystemService = new services.WorldAnvilRpgSystemService(_client);
    this.articleService = new services.WorldAnvilArticleService(_client);
    this.blockService = new services.WorldAnvilBlockService(_client);
    this.blockTemplateService = new services.WorldAnvilBlockTemplateService(_client);
    this.canvasService = new services.WorldAnvilCanvasService(_client);
    this.categoryService = new services.WorldAnvilCategoryService(_client);
    this.imageService = new services.WorldAnvilImageService(_client);
    this.manuscriptService = new services.WorldAnvilManuscriptService(_client);
    this.mapService = new services.WorldAnvilMapService(_client);
    this.notebookService = new services.WorldAnvilNotebookService(_client);
    this.secretService = new services.WorldAnvilSecretService(_client);
    this.subscriberGroupService = new services.WorldAnvilSubscriberGroupService(_client);
    this.timelineService = new services.WorldAnvilTimelineService(_client);
    this.variableService = new services.WorldAnvilVariableService(_client);
    // this.campaignService = new services.WorldAnvilCampaignService(_client);
  }

  /**
   * Authenticate a user with World Anvil OAuth
   * @param code Authorization code from OAuth flow
   * @param clientId OAuth client ID
   * @param clientSecret OAuth client secret
   * @param redirectUri Redirect URI used in the OAuth flow
   */
  async authenticate(code: string, clientId: string, clientSecret: string, redirectUri: string) {
    return this.authService.authenticate(code, clientId, clientSecret, redirectUri);
  }

  /**
   * Refresh an access token using the refresh token
   * @param refreshToken The refresh token to use
   * @param clientId OAuth client ID
   * @param clientSecret OAuth client secret
   */
  async refreshToken(refreshToken: string, clientId: string, clientSecret: string) {
    return this.authService.refreshToken(refreshToken, clientId, clientSecret);
  }

  /**
   * Check if the current access token is valid
   */
  async isTokenValid() {
    return this.authService.isTokenValid();
  }

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    return this.userService.getCurrentUser();
  }

  /**
   * Get a list of worlds for the current user
   */
  async getMyWorlds(): Promise<any> {
    return this.worldService.getMyWorlds();
  }

  /**
   * Get world by ID
   * @param worldId ID of the world to retrieve
   */
  async getWorldById(worldId: string): Promise<any> {
    return this.worldService.getWorldById(worldId);
  }

  // Article methods

  /**
   * Get article by ID
   */
  async getArticleById(articleId: string, granularity: GranularityLevel = '0'): Promise<WorldAnvilArticleResponse> {
    return this.articleService.getArticleById(articleId, granularity);
  }

  /**
   * Create a new article
   */
  async createArticle(articleData: WorldAnvilArticleInput): Promise<WorldAnvilArticleResponse> {
    return this.articleService.createArticle(articleData);
  }

  /**
   * Update an article
   */
  async updateArticle(articleId: string, articleData: WorldAnvilArticleInput): Promise<WorldAnvilArticleResponse> {
    return this.articleService.updateArticle(articleId, articleData);
  }

  /**
   * Delete an article
   */
  async deleteArticle(articleId: string): Promise<{ success: boolean }> {
    return this.articleService.deleteArticle(articleId);
  }

  /**
   * Get articles by world
   */
  async getArticlesByWorld(worldId: string, options: ArticleListOptions = {}): Promise<{ 
    success: boolean;
    entities: Array<{
      id: string;
      title: string;
      slug: string;
      [key: string]: any;
    }>;
  }> {
    return this.articleService.getArticlesByWorld(worldId, options);
  }

  // Block methods

  /**
   * Get block by ID
   */
  async getBlockById(blockId: string, granularity: '-1' | '0' | '2' = '0'): Promise<BlockResponse> {
    return this.blockService.getBlockById(blockId, granularity);
  }

  /**
   * Create a new block
   */
  async createBlock(blockData: BlockInput): Promise<{ id: string; title: string }> {
    return this.blockService.createBlock(blockData);
  }

  /**
   * Update a block
   */
  async updateBlock(blockId: string, blockData: BlockInput): Promise<{ id: string; title: string }> {
    return this.blockService.updateBlock(blockId, blockData);
  }

  /**
   * Delete a block
   */
  async deleteBlock(blockId: string): Promise<{ success: boolean }> {
    return this.blockService.deleteBlock(blockId);
  }

  /**
   * Get blocks by folder
   */
  async getBlocksByFolder(folderId: string, options: BlockFolderListOptions = {}): Promise<BlockFolderBlocksResponse> {
    return this.blockService.getBlocksByFolder(folderId, options);
  }

  // Canvas methods

  /**
   * Get canvas by ID
   */
  async getCanvasById(canvasId: string, granularity: '-1' | '0' | '2' = '0'): Promise<CanvasResponse> {
    return this.canvasService.getCanvasById(canvasId, granularity);
  }

  /**
   * Create a new canvas
   */
  async createCanvas(canvasData: CanvasInput): Promise<{ id: string; title: string }> {
    return this.canvasService.createCanvas(canvasData);
  }

  /**
   * Update a canvas
   */
  async updateCanvas(canvasId: string, canvasData: CanvasInput): Promise<{ id: string; title: string }> {
    return this.canvasService.updateCanvas(canvasId, canvasData);
  }

  /**
   * Delete a canvas
   */
  async deleteCanvas(canvasId: string): Promise<{ success: boolean }> {
    return this.canvasService.deleteCanvas(canvasId);
  }

  // Category methods

  /**
   * Get category by ID
   */
  async getCategoryById(categoryId: string, granularity: GranularityLevel = '0'): Promise<CategoryResponse> {
    return this.categoryService.getCategoryById(categoryId, granularity);
  }

  /**
   * Create a new category
   */
  async createCategory(categoryData: CategoryInput): Promise<{ id: string; title: string }> {
    return this.categoryService.createCategory(categoryData);
  }

  /**
   * Update a category
   */
  async updateCategory(categoryId: string, categoryData: CategoryInput): Promise<{ id: string; title: string }> {
    return this.categoryService.updateCategory(categoryId, categoryData);
  }

  /**
   * Delete a category
   */
  async deleteCategory(categoryId: string): Promise<{ success: boolean }> {
    return this.categoryService.deleteCategory(categoryId);
  }

  // Image methods

  /**
   * Get image by ID
   */
  async getImageById(imageId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ImageResponse> {
    return this.imageService.getImageById(imageId, granularity);
  }

  /**
   * Note: Image upload via API is not yet supported by WorldAnvil
   * According to the Boromir API documentation, image upload functionality is not available
   */

  /**
   * Update an image
   */
  async updateImage(imageId: string, imageData: ImageUpdateInput): Promise<{ id: string; title: string }> {
    return this.imageService.updateImage(imageId, imageData);
  }

  /**
   * Delete an image
   */
  async deleteImage(imageId: string): Promise<{ success: boolean }> {
    return this.imageService.deleteImage(imageId);
  }

  /**
   * Get images by world
   */
  async getImagesByWorld(worldId: string, options: ImageListOptions = {}): Promise<WorldImagesResponse> {
    return this.imageService.getImagesByWorld(worldId, options);
  }
  
  /**
   * Create a new image
   * Note: According to the Boromir API documentation, image upload functionality is not available
   */
  async createImage(imageData: ImageInput): Promise<{ id: string; title: string }> {
    // Note: Image upload via API is not yet supported by WorldAnvil
    throw new Error('Image upload via API is not yet supported by WorldAnvil');
  }

  // Notebook methods

  /**
   * Get notebook by ID
   */
  async getNotebookById(notebookId: string, granularity: '-1' | '0' | '2' = '0'): Promise<NotebookResponse> {
    return this.notebookService.getNotebookById(notebookId, granularity);
  }

  /**
   * Create a new notebook
   */
  async createNotebook(notebookData: NotebookInput): Promise<{ id: string; title: string }> {
    return this.notebookService.createNotebook(notebookData);
  }

  /**
   * Update a notebook
   */
  async updateNotebook(notebookId: string, notebookData: NotebookInput): Promise<{ id: string; title: string }> {
    return this.notebookService.updateNotebook(notebookId, notebookData);
  }

  /**
   * Delete a notebook
   */
  async deleteNotebook(notebookId: string): Promise<{ success: boolean }> {
    return this.notebookService.deleteNotebook(notebookId);
  }

  // Secret methods

  /**
   * Get secret by ID
   */
  async getSecretById(secretId: string, granularity: '-1' | '0' | '2' = '0'): Promise<SecretResponse> {
    return this.secretService.getSecretById(secretId, granularity);
  }

  /**
   * Create a new secret
   */
  async createSecret(secretData: SecretInput): Promise<{ id: string; title: string }> {
    return this.secretService.createSecret(secretData);
  }

  /**
   * Update a secret
   */
  async updateSecret(secretId: string, secretData: SecretInput): Promise<{ id: string; title: string }> {
    return this.secretService.updateSecret(secretId, secretData);
  }

  /**
   * Delete a secret
   */
  async deleteSecret(secretId: string): Promise<{ success: boolean }> {
    return this.secretService.deleteSecret(secretId);
  }

  // Subscriber Group methods

  /**
   * Get subscriber group by ID
   */
  async getSubscriberGroupById(subscriberGroupId: string, granularity: '-1' | '0' | '1' | undefined = '0'): Promise<SubscriberGroupResponse> {
    return this.subscriberGroupService.getSubscriberGroupById(subscriberGroupId, granularity);
  }

  /**
   * Create a new subscriber group
   */
  async createSubscriberGroup(subscriberGroupData: SubscriberGroupInput): Promise<{ id: string; title: string }> {
    return this.subscriberGroupService.createSubscriberGroup(subscriberGroupData);
  }

  /**
   * Update a subscriber group
   */
  async updateSubscriberGroup(subscriberGroupId: string, subscriberGroupData: SubscriberGroupUpdateInput): Promise<{ id: string; title: string }> {
    return this.subscriberGroupService.updateSubscriberGroup(subscriberGroupId, subscriberGroupData);
  }

  /**
   * Delete a subscriber group
   */
  async deleteSubscriberGroup(subscriberGroupId: string): Promise<{ success: boolean }> {
    return this.subscriberGroupService.deleteSubscriberGroup(subscriberGroupId);
  }

  /**
   * Get subscriber groups by world
   */
  async getSubscriberGroupsByWorld(worldId: string, options: SubscriberGroupListOptions = {}): Promise<{ success: boolean; entities: any[] }> {
    return this.subscriberGroupService.getSubscriberGroupsByWorld(worldId, options);
  }

  // History methods

  /**
   * Get history by ID
   * @param historyId The ID of the history
   * @param granularity The granularity level of the response
   */
  async getHistoryById(historyId: string, granularity: GranularityLevel = '0'): Promise<HistoryResponse> {
    return this.timelineService.getHistoryById(historyId, granularity);
  }

  /**
   * Create a new history
   * @param historyData The history data
   */
  async createHistory(historyData: HistoryInput): Promise<HistoryResponse> {
    return this.timelineService.createHistory(historyData);
  }

  /**
   * Update a history
   * @param historyId The ID of the history to update
   * @param historyData The updated history data
   */
  async updateHistory(historyId: string, historyData: HistoryUpdateInput): Promise<HistoryResponse> {
    return this.timelineService.updateHistory(historyId, historyData);
  }

  /**
   * Delete a history
   * @param historyId The ID of the history to delete
   */
  async deleteHistory(historyId: string): Promise<{ success: boolean }> {
    return this.timelineService.deleteHistory(historyId);
  }

  /**
   * Get a list of histories in a world
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getHistoriesByWorld(worldId: string, options: TimelineListOptions = {}): Promise<WorldHistoriesResponse> {
    return this.timelineService.getHistoriesByWorld(worldId, options);
  }

  // Timeline methods

  /**
   * Get timeline by ID
   */
  async getTimelineById(timelineId: string, granularity: GranularityLevel = '0'): Promise<TimelineResponse> {
    return this.timelineService.getTimelineById(timelineId, granularity);
  }

  /**
   * Create a new timeline
   */
  async createTimeline(timelineData: TimelineInput): Promise<TimelineResponse> {
    return this.timelineService.createTimeline(timelineData);
  }

  /**
   * Update a timeline
   */
  async updateTimeline(timelineId: string, timelineData: TimelineUpdateInput): Promise<TimelineResponse> {
    return this.timelineService.updateTimeline(timelineId, timelineData);
  }

  /**
   * Delete a timeline
   */
  async deleteTimeline(timelineId: string): Promise<{ success: boolean }> {
    return this.timelineService.deleteTimeline(timelineId);
  }

  /**
   * Get a list of timelines in a world
   */
  async getTimelinesByWorld(worldId: string, options: TimelineListOptions = {}): Promise<WorldTimelinesResponse> {
    return this.timelineService.getTimelinesByWorld(worldId, options);
  }

  // Map methods

  /**
   * Get map by ID
   */
  async getMapById(mapId: string, granularity: '-1' | '0' | '2' = '0'): Promise<MapResponse> {
    return this.mapService.getMapById(mapId, granularity);
  }

  /**
   * Create a new map
   */
  async createMap(mapData: MapInput): Promise<{ id: string; title: string }> {
    return this.mapService.createMap(mapData);
  }

  /**
   * Update a map
   */
  async updateMap(mapId: string, mapData: MapUpdateInput): Promise<{ id: string; title: string }> {
    return this.mapService.updateMap(mapId, mapData);
  }

  /**
   * Delete a map
   */
  async deleteMap(mapId: string): Promise<{ success: boolean }> {
    return this.mapService.deleteMap(mapId);
  }

  /**
   * Get maps by world
   * @param worldId The ID of the world
   * @param options Options for pagination
   */
  async getMapsByWorld(worldId: string, options: MapListOptions = {}): Promise<WorldMapsResponse> {
    return this.mapService.getMapsByWorld(worldId, options);
  }

  /**
   * Get a layer by ID
   */
  async getLayerById(layerId: string, granularity: '-1' | '0' | '2' = '0'): Promise<LayerResponse> {
    return this.mapService.getLayerById(layerId, granularity);
  }

  /**
   * Create a new layer
   */
  async createLayer(layerData: LayerInput): Promise<LayerRef> {
    return this.mapService.createLayer(layerData);
  }

  /**
   * Update a layer
   */
  async updateLayer(layerId: string, layerData: LayerUpdateInput): Promise<LayerRef> {
    return this.mapService.updateLayer(layerId, layerData);
  }

  /**
   * Delete a layer
   */
  async deleteLayer(layerId: string): Promise<{ success: boolean }> {
    return this.mapService.deleteLayer(layerId);
  }

  /**
   * Get layers for a map
   */
  async getLayersByMap(mapId: string, options: MapListOptions = {}): Promise<MapLayersResponse> {
    return this.mapService.getLayersByMap(mapId, options);
  }

  /**
   * Get a marker group by ID
   */
  async getMarkerGroupById(markerGroupId: string, granularity: '-1' | '0' | '2' = '0'): Promise<MarkerGroupResponse> {
    return this.mapService.getMarkerGroupById(markerGroupId, granularity);
  }

  /**
   * Create a new marker group
   */
  async createMarkerGroup(markerGroupData: MarkerGroupInput): Promise<MarkerGroupRef> {
    return this.mapService.createMarkerGroup(markerGroupData);
  }

  /**
   * Update a marker group
   */
  async updateMarkerGroup(markerGroupId: string, markerGroupData: MarkerGroupUpdateInput): Promise<MarkerGroupRef> {
    return this.mapService.updateMarkerGroup(markerGroupId, markerGroupData);
  }

  /**
   * Delete a marker group
   */
  async deleteMarkerGroup(markerGroupId: string): Promise<{ success: boolean }> {
    return this.mapService.deleteMarkerGroup(markerGroupId);
  }

  /**
   * Get marker groups for a map
   */
  async getMarkerGroupsByMap(mapId: string, options: MapListOptions = {}): Promise<MapMarkerGroupsResponse> {
    return this.mapService.getMarkerGroupsByMap(mapId, options);
  }

  /**
   * Get markers for a map
   */
  async getMarkersByMap(mapId: string, options: MapListOptions = {}): Promise<MapMarkersResponse> {
    return this.mapService.getMarkersByMap(mapId, options);
  }

  /**
   * Get markers for a marker group
   */
  async getMarkersByMarkerGroup(markerGroupId: string, options: MapListOptions = {}): Promise<MarkerGroupMarkersResponse> {
    return this.mapService.getMarkersByMarkerGroup(markerGroupId, options);
  }

  // Manuscript methods

  /**
   * Get manuscript by ID
   */
  async getManuscriptById(manuscriptId: string, granularity: '-1' | '0' | '1' | '2' = '0'): Promise<ManuscriptResponse> {
    return this.manuscriptService.getManuscriptById(manuscriptId, granularity);
  }

  /**
   * Create a new manuscript
   */
  async createManuscript(manuscriptData: ManuscriptInput): Promise<{ id: string; title: string }> {
    return this.manuscriptService.createManuscript(manuscriptData);
  }

  /**
   * Update a manuscript
   */
  async updateManuscript(manuscriptId: string, manuscriptData: ManuscriptUpdateInput): Promise<{ id: string; title: string }> {
    return this.manuscriptService.updateManuscript(manuscriptId, manuscriptData);
  }

  /**
   * Delete a manuscript
   */
  async deleteManuscript(manuscriptId: string): Promise<{ success: boolean }> {
    return this.manuscriptService.deleteManuscript(manuscriptId);
  }

  /**
   * Get manuscripts by world
   */
  async getManuscriptsByWorld(worldId: string, options: ManuscriptListOptions = {}): Promise<WorldManuscriptsResponse> {
    return this.manuscriptService.getManuscriptsByWorld(worldId, options);
  }

  // Manuscript Beat methods

  /**
   * Get manuscript beat by ID
   * @param beatId The ID of the manuscript beat
   * @param granularity The level of detail to return (-1 to 2)
   */
  async getManuscriptBeat(beatId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ManuscriptBeatResponse> {
    return this.manuscriptService.getManuscriptBeatById(beatId, granularity);
  }

  /**
   * Create a new manuscript beat
   * @param beatData The manuscript beat data
   */
  async createManuscriptBeat(beatData: ManuscriptBeatInput): Promise<ManuscriptBeatRef> {
    return this.manuscriptService.createManuscriptBeat(beatData);
  }

  /**
   * Update a manuscript beat
   * @param beatId The ID of the manuscript beat
   * @param beatData The updated manuscript beat data
   */
  async updateManuscriptBeat(beatId: string, beatData: ManuscriptBeatUpdateInput): Promise<ManuscriptBeatRef> {
    return this.manuscriptService.updateManuscriptBeat(beatId, beatData);
  }

  /**
   * Delete a manuscript beat
   * @param beatId The ID of the manuscript beat
   */
  async deleteManuscriptBeat(beatId: string): Promise<{ success: boolean }> {
    return this.manuscriptService.deleteManuscriptBeat(beatId);
  }

  /**
   * Get beats by manuscript part
   * @param partId The ID of the manuscript part
   * @param options Pagination options
   */
  async getBeatsByPart(partId: string, options: ManuscriptSubResourceListOptions = {}): Promise<ManuscriptBeatsResponse> {
    return this.manuscriptService.getBeatsByPart(partId, options);
  }
  
  // Manuscript Part methods

  /**
   * Get manuscript part by ID
   * @param partId The ID of the manuscript part
   * @param granularity The level of detail to return (-1 to 2)
   */
  async getManuscriptPart(partId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ManuscriptPartResponse> {
    return this.manuscriptService.getManuscriptPartById(partId, granularity);
  }

  /**
   * Create a new manuscript part
   * @param partData The manuscript part data
   */
  async createManuscriptPart(partData: ManuscriptPartInput): Promise<ManuscriptPartRef> {
    return this.manuscriptService.createManuscriptPart(partData);
  }

  /**
   * Update a manuscript part
   * @param partId The ID of the manuscript part
   * @param partData The updated manuscript part data
   */
  async updateManuscriptPart(partId: string, partData: ManuscriptPartUpdateInput): Promise<ManuscriptPartRef> {
    return this.manuscriptService.updateManuscriptPart(partId, partData);
  }

  /**
   * Delete a manuscript part
   * @param partId The ID of the manuscript part
   */
  async deleteManuscriptPart(partId: string): Promise<{ success: boolean }> {
    return this.manuscriptService.deleteManuscriptPart(partId);
  }

  /**
   * Get parts by manuscript version
   * @param versionId The ID of the manuscript version
   * @param options Pagination options
   */
  async getPartsByVersion(versionId: string, options: ManuscriptSubResourceListOptions = {}): Promise<ManuscriptPartsResponse> {
    return this.manuscriptService.getPartsByVersion(versionId, options);
  }

  // Manuscript Version methods

  /**
   * Get manuscript version by ID
   * @param versionId The ID of the manuscript version
   * @param granularity The level of detail to return (-1 to 2)
   */
  async getManuscriptVersion(versionId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ManuscriptVersionResponse> {
    return this.manuscriptService.getManuscriptVersionById(versionId, granularity);
  }

  /**
   * Create a new manuscript version
   * @param versionData The manuscript version data
   */
  async createManuscriptVersion(versionData: ManuscriptVersionInput): Promise<ManuscriptVersionRef> {
    return this.manuscriptService.createManuscriptVersion(versionData);
  }

  /**
   * Update a manuscript version
   * @param versionId The ID of the manuscript version
   * @param versionData The updated manuscript version data
   */
  async updateManuscriptVersion(versionId: string, versionData: ManuscriptVersionUpdateInput): Promise<ManuscriptVersionRef> {
    return this.manuscriptService.updateManuscriptVersion(versionId, versionData);
  }

  /**
   * Delete a manuscript version
   * @param versionId The ID of the manuscript version
   */
  async deleteManuscriptVersion(versionId: string): Promise<{ success: boolean }> {
    return this.manuscriptService.deleteManuscriptVersion(versionId);
  }

  /**
   * Get versions by manuscript
   * @param manuscriptId The ID of the manuscript
   * @param options Pagination options
   */
  async getVersionsByManuscript(manuscriptId: string, options: ManuscriptSubResourceListOptions = {}): Promise<ManuscriptVersionsResponse> {
    return this.manuscriptService.getVersionsByManuscript(manuscriptId, options);
  }

  // Manuscript Bookmark methods

  /**
   * Get manuscript bookmark by ID
   * @param bookmarkId The ID of the manuscript bookmark
   * @param granularity The level of detail to return (-1 to 2)
   */
  async getManuscriptBookmark(bookmarkId: string, granularity: '-1' | '0' | '2' = '0'): Promise<ManuscriptBookmarkResponse> {
    return this.manuscriptService.getManuscriptBookmarkById(bookmarkId, granularity);
  }

  /**
   * Create a new manuscript bookmark
   * @param bookmarkData The manuscript bookmark data
   */
  async createManuscriptBookmark(bookmarkData: ManuscriptBookmarkInput): Promise<ManuscriptBookmarkRef> {
    return this.manuscriptService.createManuscriptBookmark(bookmarkData);
  }

  /**
   * Update a manuscript bookmark
   * @param bookmarkId The ID of the manuscript bookmark
   * @param bookmarkData The updated manuscript bookmark data
   */
  async updateManuscriptBookmark(bookmarkId: string, bookmarkData: ManuscriptBookmarkUpdateInput): Promise<ManuscriptBookmarkRef> {
    return this.manuscriptService.updateManuscriptBookmark(bookmarkId, bookmarkData);
  }

  /**
   * Delete a manuscript bookmark
   * @param bookmarkId The ID of the manuscript bookmark
   */
  async deleteManuscriptBookmark(bookmarkId: string): Promise<{ success: boolean }> {
    return this.manuscriptService.deleteManuscriptBookmark(bookmarkId);
  }

  /**
   * Get bookmarks by manuscript
   * @param manuscriptId The ID of the manuscript
   * @param options Pagination options
   */
  async getBookmarksByManuscript(manuscriptId: string, options: ManuscriptSubResourceListOptions = {}): Promise<ManuscriptBookmarksResponse> {
    return this.manuscriptService.getBookmarksByManuscript(manuscriptId, options);
  }

  // Variable methods

  /**
   * Get a variable by ID
   * @param variableId The ID of the variable to get
   * @param granularity The detail level of the response
   */
  async getVariable(variableId: string, granularity: number = 0): Promise<WorldAnvilVariable> {
    return this.variableService.getVariable(variableId, granularity);
  }

  /**
   * Create a new variable
   * @param variableData The variable data
   */
  async createVariable(variableData: WorldAnvilVariableInput): Promise<WorldAnvilVariable> {
    return this.variableService.createVariable(variableData);
  }

  /**
   * Update an existing variable
   * @param variableId The ID of the variable to update
   * @param variableData The updated variable data
   */
  async updateVariable(variableId: string, variableData: WorldAnvilVariableUpdate): Promise<WorldAnvilVariable> {
    return this.variableService.updateVariable(variableId, variableData);
  }

  /**
   * Delete a variable
   * @param variableId The ID of the variable to delete
   * @returns Success response
   */
  async deleteVariable(variableId: string): Promise<{ success: boolean }> {
    return this.variableService.deleteVariable(variableId);
  }

  /**
   * List variables in a specific variable collection
   * @param collectionId The collection ID
   * @param options Pagination options
   */
  async listVariablesByCollection(collectionId: string, options: PaginationOptions = {}): Promise<WorldAnvilVariable[]> {
    return this.variableService.listVariablesByCollection(collectionId, options);
  }

  /**
   * Get a variable collection by ID
   * @param collectionId The ID of the collection to get
   * @param granularity The detail level of the response
   */
  async getVariableCollection(collectionId: string, granularity: number = 0): Promise<WorldAnvilVariableCollection> {
    return this.variableService.getVariableCollection(collectionId, granularity);
  }

  /**
   * Create a new variable collection
   * @param collectionData The collection data
   */
  async createVariableCollection(collectionData: WorldAnvilVariableCollectionInput): Promise<WorldAnvilVariableCollection> {
    return this.variableService.createVariableCollection(collectionData);
  }

  /**
   * Update an existing variable collection
   * @param collectionId The ID of the collection to update
   * @param collectionData The updated collection data
   */
  async updateVariableCollection(collectionId: string, collectionData: WorldAnvilVariableCollectionUpdate): Promise<WorldAnvilVariableCollection> {
    return this.variableService.updateVariableCollection(collectionId, collectionData);
  }

  /**
   * Delete a variable collection
   * @param collectionId The ID of the collection to delete
   * @returns Success response
   */
  async deleteVariableCollection(collectionId: string): Promise<{ success: boolean }> {
    return this.variableService.deleteVariableCollection(collectionId);
  }

  /**
   * List variable collections in a specific world
   * @param worldId The world ID
   * @param options Pagination options
   */
  async listVariableCollectionsByWorld(worldId: string, options: PaginationOptions = {}): Promise<WorldAnvilVariableCollection[]> {
    return this.variableService.listVariableCollectionsByWorld(worldId, options);
  }

  // Article methods - additional list functionality
  
  /**
   * Get articles by category
   * @param categoryId The ID of the category
   * @param options Options for pagination and filtering
   */
  async getArticlesByCategory(categoryId: string, options: Omit<ArticleListOptions, 'category_id'> = {}): Promise<{ articles: WorldAnvilArticleResponse[], pagination: { total: number, page: number, pages: number } }> {
    return this.articleService.getArticlesByCategory(categoryId, options);
  }
  
  /**
   * Get all articles with filtering options
   * @param options Options for filtering and pagination
   */
  async getArticles(options: ArticleListOptions = {}): Promise<{ articles: WorldAnvilArticleResponse[], pagination: { total: number, page: number, pages: number } }> {
    return this.articleService.getArticles(options);
  }
  
  // Block Template methods

  /**
   * Get block templates by user
   * @param userId The ID of the user
   * @param options Options for pagination
   */
  async getBlockTemplatesByUser(userId: string, options: BlockTemplateListOptions = {}): Promise<UserBlockTemplatesResponse> {
    return this.blockTemplateService.getBlockTemplatesByUser(userId, options);
  }

  /**
   * Get block templates for the current user
   * @param options Options for pagination
   */
  async getMyBlockTemplates(options: BlockTemplateListOptions = {}): Promise<UserBlockTemplatesResponse> {
    return this.blockTemplateService.getMyBlockTemplates(options);
  }
}

