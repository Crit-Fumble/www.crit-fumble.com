import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';

/**
 * Core interface for WorldAnvil service integration
 */
export interface IWorldAnvilService {
  /**
   * Initialize the WorldAnvil service
   */
  initialize(): Promise<void>;

  /**
   * Get the underlying WorldAnvil client
   */
  getClient(): WorldAnvilApiClient;

  /**
   * Get a list of worlds owned by the user
   */
  getWorlds(): Promise<any>;

  /**
   * Get a specific world by ID
   */
  getWorld(worldId: string): Promise<any>;

  /**
   * Get articles in a world
   */
  getArticles(worldId: string, options?: { category?: string; limit?: number }): Promise<any>;

  /**
   * Get a specific article by ID
   */
  getArticle(articleId: string): Promise<any>;

  /**
   * Create a new article in a world
   */
  createArticle(worldId: string, articleData: any): Promise<any>;

  /**
   * Update an existing article
   */
  updateArticle(articleId: string, articleData: any): Promise<any>;

  /**
   * Get categories in a world
   */
  getCategories(worldId: string): Promise<any>;

  /**
   * Get timelines in a world
   */
  getTimelines(worldId: string): Promise<any>;
}
