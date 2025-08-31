/**
 * World Anvil API Service
 * Base service for World Anvil API operations
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';

export class WorldAnvilApiService {
  private apiClient: WorldAnvilApiClient;

  constructor() {
    // Get config from environment variables
    const config = getWorldAnvilConfig();
    
    // Initialize the API client with config
    this.apiClient = new WorldAnvilApiClient({
      apiUrl: config.apiUrl,
      apiKey: config.apiKey,
      accessToken: config.accessToken
    });
  }

  /**
   * Get the underlying API client
   */
  getClient(): WorldAnvilApiClient {
    return this.apiClient;
  }

  /**
   * Set or update the API key
   */
  setApiKey(apiKey: string): void {
    this.apiClient.setApiKey(apiKey);
  }

  /**
   * Set or update the access token
   */
  setAccessToken(accessToken: string): void {
    this.apiClient.setAccessToken(accessToken);
  }

  /**
   * Make a GET request to the World Anvil API
   * This method is maintained for backward compatibility
   */
  async get<T = any>(url: string): Promise<T> {
    // Forward to the client
    return this.apiClient.get<T>(url);
  }

  /**
   * Make a POST request to the World Anvil API
   * This method is maintained for backward compatibility
   */
  async post<T = any>(url: string, data?: any): Promise<T> {
    // Forward to the client
    return this.apiClient.post<T>(url, data);
  }

  /**
   * Make a PUT request to the World Anvil API
   * This method is maintained for backward compatibility
   */
  async put<T = any>(url: string, data?: any): Promise<T> {
    // Forward to the client
    return this.apiClient.put<T>(url, data);
  }

  /**
   * Make a DELETE request to the World Anvil API
   * This method is maintained for backward compatibility
   */
  async delete<T = any>(url: string): Promise<T> {
    // Forward to the client
    return this.apiClient.delete<T>(url);
  }
}
