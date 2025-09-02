/**
 * World Anvil API Service
 * A wrapper around the WorldAnvilApiClient that provides
 * direct access to the World Anvil API endpoints
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';

export class WorldAnvilApiService {
  private apiClient: WorldAnvilApiClient;

  /**
   * Creates a new WorldAnvilApiService
   * @param accessToken Optional access token for authenticated requests
   * @param apiKey Optional API key for requests
   * @param customClient Optional client for testing/dependency injection
   */
  constructor(accessToken?: string, apiKey?: string, customClient?: WorldAnvilApiClient) {
    if (customClient) {
      this.apiClient = customClient;
    } else {
      const config = getWorldAnvilConfig();
      this.apiClient = new WorldAnvilApiClient({
        apiUrl: config.apiUrl,
        apiKey: apiKey || config.apiKey,
        accessToken: accessToken || config.accessToken
      });
    }
  }

  /**
   * Get the underlying API client
   */
  getClient(): WorldAnvilApiClient {
    return this.apiClient;
  }

  /**
   * Set the API key used for requests
   * @param apiKey The API key to use
   */
  setApiKey(apiKey: string): void {
    this.apiClient.setApiKey(apiKey);
  }

  /**
   * Set the access token used for authenticated requests
   * @param accessToken The access token to use
   */
  setAccessToken(accessToken: string): void {
    this.apiClient.setAccessToken(accessToken);
  }

  /**
   * Make a GET request to the World Anvil API
   * @param endpoint The API endpoint path
   * @param options Optional request options
   */
  async get<T = any>(endpoint: string, options?: any): Promise<T> {
    return this.apiClient.get<T>(endpoint, options);
  }

  /**
   * Make a POST request to the World Anvil API
   * @param endpoint The API endpoint path
   * @param data The data to send in the request body
   * @param options Optional request options
   */
  async post<T = any>(endpoint: string, data?: any, options?: any): Promise<T> {
    return this.apiClient.post<T>(endpoint, data, options);
  }

  /**
   * Make a PUT request to the World Anvil API
   * @param endpoint The API endpoint path
   * @param data The data to send in the request body
   * @param options Optional request options
   */
  async put<T = any>(endpoint: string, data?: any, options?: any): Promise<T> {
    return this.apiClient.put<T>(endpoint, data, options);
  }

  /**
   * Make a DELETE request to the World Anvil API
   * @param endpoint The API endpoint path
   * @param options Optional request options
   */
  async delete<T = any>(endpoint: string, options?: any): Promise<T> {
    return this.apiClient.delete<T>(endpoint, options);
  }
}
