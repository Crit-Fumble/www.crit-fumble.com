/**
 * World Anvil Controller
 * Controller for World Anvil API endpoints
 */

import { WorldAnvilApiService } from '../services/WorldAnvilApiService';
import { WorldAnvilUserService } from '../services/WorldAnvilUserService';
import { WorldAnvilWorldService } from '../services/WorldAnvilWorldService';

export class WorldAnvilController {
  private apiService: WorldAnvilApiService;
  private userService: WorldAnvilUserService;
  private worldService: WorldAnvilWorldService;

  constructor() {
    // Initialize the API service
    this.apiService = new WorldAnvilApiService();
    
    // Initialize services
    this.userService = new WorldAnvilUserService(this.apiService);
    this.worldService = new WorldAnvilWorldService(this.apiService);
  }

  /**
   * Authenticate a user with World Anvil OAuth
   */
  async authenticate(code: string, clientId: string, clientSecret: string, redirectUri: string) {
    return this.userService.authenticate(code, clientId, clientSecret, redirectUri);
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
  async getMyWorlds() {
    return this.worldService.getMyWorlds();
  }

  /**
   * Get world by ID
   */
  async getWorldById(worldId: string) {
    return this.worldService.getWorldById(worldId);
  }
}
