import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import { IWorldAnvilService } from '../../models/worldanvil/IWorldAnvilService';
import { ConfigRegistry } from '../config/registry';
import { ApiKeyService } from './ApiKeyService';
import { ApiProvider } from '../../models/auth/ApiKey';

/**
 * Core implementation of WorldAnvil service integration
 */
export class WorldAnvilService implements IWorldAnvilService {
  private defaultClient: WorldAnvilApiClient;
  private apiKeyService: ApiKeyService;
  private initialized = false;

  /**
   * Create a new WorldAnvil service
   */
  constructor() {
    // Get API credentials from the registry for default client
    const registry = ConfigRegistry.getInstance();
    const accessToken = registry.get<string>('WORLD_ANVIL_TOKEN', '');
    const apiKey = registry.get<string>('WORLD_ANVIL_KEY', '');
    
    // Initialize the default WorldAnvil client with app credentials
    this.defaultClient = new WorldAnvilApiClient({
      accessToken,
      apiKey
    });
    
    // Initialize the API key service
    this.apiKeyService = new ApiKeyService();
  }

  /**
   * Initialize the WorldAnvil service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    // Validate API credentials exist
    const registry = ConfigRegistry.getInstance();
    const accessToken = registry.get<string>('WORLD_ANVIL_TOKEN', '');
    const apiKey = registry.get<string>('WORLD_ANVIL_KEY', '');
    
    if (!accessToken || !apiKey) {
      throw new Error('WorldAnvil API token and key are required');
    }
    
    try {
      // Test API connection by checking if client is properly initialized
      // Skip actual API call during initialization
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize WorldAnvil service:', error);
      throw error;
    }
  }

  /**
   * Get the WorldAnvil client
   * @returns WorldAnvil client instance
   */
  getClient(): WorldAnvilApiClient {
    // Return the default client for interface compatibility
    return this.defaultClient;
  }
  
  /**
   * Get a user-specific WorldAnvil client
   * @param userId Optional user ID to get client with user's API credentials
   * @returns Promise resolving to WorldAnvil client instance
   * @internal
   */
  private async getUserClient(userId?: string): Promise<WorldAnvilApiClient> {
    // If no userId is provided, return the default client
    if (!userId) {
      return this.defaultClient;
    }
    
    try {
      // Try to get user's WorldAnvil API key
      const apiKeys = await this.apiKeyService.getForUser(userId, ApiProvider.WORLD_ANVIL);
      if (apiKeys.length === 0) {
        console.log(`No WorldAnvil API key found for user ${userId}, using default client`);
        return this.defaultClient;
      }
      
      // Use the first valid API key (normally users will have just one)
      const apiKey = apiKeys[0];
      
      // Create a client with the user's API credentials
      return new WorldAnvilApiClient({
        apiKey: apiKey.key,
        accessToken: apiKey.token || ''
      });
    } catch (error) {
      console.error('Error getting WorldAnvil client for user:', error);
      return this.defaultClient;
    }
  }

  /**
   * Get a list of worlds owned by the user
   */
  async getWorlds(userId?: string): Promise<any> {
    try {
      const client = await this.getClient(userId);
      return await client.getMyWorlds();
    } catch (error) {
      console.error('Failed to get worlds:', error);
      throw error;
    }
  }

  /**
   * Get a specific world by ID
   */
  async getWorld(worldId: string, userId?: string): Promise<any> {
    try {
      const client = await this.getClient(userId);
      // Use SDK method to get a specific world
      const worlds = await client.getMyWorlds();
      const world = worlds.find((w: any) => w.id === worldId);
      if (!world) {
        throw new Error(`World with ID ${worldId} not found`);
      }
      return world;
    } catch (error) {
      console.error(`Failed to get world ${worldId}:`, error);
      throw error;
    }
  }

  /**
   * Get articles in a world
   */
  async getArticles(worldId: string, options: { category?: string; limit?: number } = {}, userId?: string): Promise<any> {
    try {
      const client = await this.getClient(userId);
      return await client.getArticles(worldId, options);
    } catch (error) {
      console.error(`Failed to get articles for world ${worldId}:`, error);
      throw error;
    }
  }

  /**
   * Get a specific article by ID
   */
  async getArticle(articleId: string, userId?: string): Promise<any> {
    try {
      const client = await this.getClient(userId);
      return await client.getArticle(articleId);
    } catch (error) {
      console.error(`Failed to get article ${articleId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new article in a world
   */
  async createArticle(worldId: string, articleData: any, userId?: string): Promise<any> {
    try {
      const client = await this.getClient(userId);
      return await client.createArticle(worldId, articleData);
    } catch (error) {
      console.error(`Failed to create article in world ${worldId}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing article
   */
  async updateArticle(articleId: string, articleData: any, userId?: string): Promise<any> {
    try {
      const client = await this.getClient(userId);
      return await client.updateArticle(articleId, articleData);
    } catch (error) {
      console.error(`Failed to update article ${articleId}:`, error);
      throw error;
    }
  }

  /**
   * Get categories in a world
   */
  async getCategories(worldId: string, userId?: string): Promise<any> {
    try {
      const client = await this.getClient(userId);
      return await client.getCategories(worldId);
    } catch (error) {
      console.error(`Failed to get categories for world ${worldId}:`, error);
      throw error;
    }
  }

  /**
   * Get timelines in a world
   */
  async getTimelines(worldId: string, userId?: string): Promise<any> {
    try {
      const client = await this.getClient(userId);
      return await client.getTimelines(worldId);
    } catch (error) {
      console.error(`Failed to get timelines for world ${worldId}:`, error);
      throw error;
    }
  }
}
