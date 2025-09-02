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
  SubscriberGroupInput,
  SubscriberGroupListOptions, SubscriberGroupResponse
} from '../../models/WorldAnvilSubscriberGroup';
import { 
  WorldAnvilArticleInput, WorldAnvilArticleResponse, ArticleListOptions, ArticleListResponse
} from '../../models/WorldAnvilArticle';
import { 
  ImageListOptions, ImageResponse, WorldImagesResponse
} from '../../models/WorldAnvilImage';
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
  ManuscriptInput, ManuscriptResponse
} from '../../models/WorldAnvilManuscript';
import { 
  MapInput, MapResponse
} from '../../models/WorldAnvilMap';
import { 
  NotebookInput, NotebookResponse
} from '../../models/WorldAnvilNotebook';
import { 
  SecretInput, SecretResponse
} from '../../models/WorldAnvilSecret';

export class WorldAnvilController {
  private apiClient: WorldAnvilApiClient;
  private authService: services.WorldAnvilAuthService;
  private userService: services.WorldAnvilUserService;
  private identityService: services.WorldAnvilIdentityService;
  private worldService: services.WorldAnvilWorldService;
  private rpgSystemService: services.WorldAnvilRpgSystemService;
  private articleService: services.WorldAnvilArticleService;
  private blockService: services.WorldAnvilBlockService;
  private canvasService: services.WorldAnvilCanvasService;
  private categoryService: services.WorldAnvilCategoryService;
  private imageService: services.WorldAnvilImageService;
  private manuscriptService: services.WorldAnvilManuscriptService;
  private mapService: services.WorldAnvilMapService;
  private notebookService: services.WorldAnvilNotebookService;
  private secretService: services.WorldAnvilSecretService;
  private subscriberGroupService: services.WorldAnvilSubscriberGroupService;
  private timelineService: services.WorldAnvilTimelineService;
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
    this.canvasService = new services.WorldAnvilCanvasService(_client);
    this.categoryService = new services.WorldAnvilCategoryService(_client);
    this.imageService = new services.WorldAnvilImageService(_client);
    this.manuscriptService = new services.WorldAnvilManuscriptService(_client);
    this.mapService = new services.WorldAnvilMapService(_client);
    this.notebookService = new services.WorldAnvilNotebookService(_client);
    this.secretService = new services.WorldAnvilSecretService(_client);
    this.subscriberGroupService = new services.WorldAnvilSubscriberGroupService(_client);
    this.timelineService = new services.WorldAnvilTimelineService(_client);
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
  async updateImage(imageId: string, imageData: Record<string, any>): Promise<{ id: string; title: string }> {
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
  async updateSubscriberGroup(subscriberGroupId: string, subscriberGroupData: Record<string, any>): Promise<{ id: string; title: string }> {
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
   * Get timelines by world
   */
  async getTimelinesByWorld(worldId: string, options: TimelineListOptions = {}): Promise<WorldTimelinesResponse> {
    return this.timelineService.getTimelinesByWorld(worldId, options);
  }
}
