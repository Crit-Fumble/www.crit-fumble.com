/**
 * World Anvil API Client
 * Server-side client for interacting with World Anvil API
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { WorldAnvilUser } from '../../models/WorldAnvilUser';
import { WorldAnvilWorld } from '../../models/WorldAnvilWorld';
import { getWorldAnvilConfig } from '../configs/config';

/**
 * Interface to define HTTP client functionality for dependency injection
 */
export interface IWorldAnvilHttpClient {
  get<T>(url: string, config?: any): Promise<T>;
  post<T>(url: string, data?: any, config?: any): Promise<T>;
  put<T>(url: string, data?: any, config?: any): Promise<T>;
  patch<T>(url: string, data?: any, config?: any): Promise<T>;
  delete<T>(url: string, config?: any): Promise<T>;
}

/**
 * Configuration options for WorldAnvilApiClient
 */
export interface WorldAnvilApiClientConfig {
  apiUrl?: string;
  apiKey?: string;
  accessToken?: string;
}

export class WorldAnvilApiClient {
  private client: IWorldAnvilHttpClient;
  private apiKey?: string;
  private accessToken?: string;
  private baseUrl: string;

  /**
   * Creates a new WorldAnvilApiClient instance
   * 
   * @param config Optional explicit config (overrides global config)
   * @param customHttpClient Optional HTTP client for testing
   */
  constructor(config?: WorldAnvilApiClientConfig, customHttpClient?: IWorldAnvilHttpClient) {
    // Get configuration from global config if not explicitly provided
    let effectiveConfig: WorldAnvilApiClientConfig;
    
    try {
      // Try to get global config first
      const globalConfig = getWorldAnvilConfig();
      // Override with explicitly provided config if any
      effectiveConfig = {
        apiUrl: globalConfig.apiUrl,
        apiKey: globalConfig.apiKey,
        accessToken: globalConfig.accessToken,
        ...config
      };
    } catch (e) {
      // Fallback to provided config or empty if global config not available
      effectiveConfig = config || {};
    }
    
    this.apiKey = effectiveConfig.apiKey;
    this.accessToken = effectiveConfig.accessToken;
    this.baseUrl = effectiveConfig.apiUrl || 'https://www.worldanvil.com/api/v1';

    // Use custom HTTP client for testing if provided, otherwise create axios instance
    if (customHttpClient) {
      this.client = customHttpClient;
    } else {
      const axiosInstance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      // Add request interceptor to add auth headers
      axiosInstance.interceptors.request.use((request) => {
        if (this.apiKey) {
          request.headers['x-application-key'] = this.apiKey;
        }
        
        if (this.accessToken) {
          request.headers['Authorization'] = `Bearer ${this.accessToken}`;
        }
        
        return request;
      });

      // Create adapter to match IWorldAnvilHttpClient interface
      this.client = {
        get: <T>(url: string, config?: any) => axiosInstance.get<T, AxiosResponse<T>>(url, config).then(res => res.data),
        post: <T>(url: string, data?: any, config?: any) => axiosInstance.post<T, AxiosResponse<T>>(url, data, config).then(res => res.data),
        put: <T>(url: string, data?: any, config?: any) => axiosInstance.put<T, AxiosResponse<T>>(url, data, config).then(res => res.data),
        patch: <T>(url: string, data?: any, config?: any) => axiosInstance.patch<T, AxiosResponse<T>>(url, data, config).then(res => res.data),
        delete: <T>(url: string, config?: any) => axiosInstance.delete<T, AxiosResponse<T>>(url, config).then(res => res.data)
      };
    }
  }

  /**
   * Set the API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Set the access token
   */
  setAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
  }

  /**
   * Make a generic GET request to the World Anvil API
   */
  async get<T = any>(url: string, config?: any): Promise<T> {
    try {
      return await this.client.get<T>(url, config);
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Make a generic POST request to the World Anvil API
   */
  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      return await this.client.post<T>(url, data, config);
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Make a generic PUT request to the World Anvil API
   */
  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      return await this.client.put<T>(url, data, config);
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Make a generic PATCH request to the World Anvil API
   */
  async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      return await this.client.patch<T>(url, data, config);
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Make a generic DELETE request to the World Anvil API
   */
  async delete<T = any>(url: string, config?: any): Promise<T> {
    try {
      return await this.client.delete<T>(url, config);
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: any): void {
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const responseData = error.response?.data;

      // Handle specific error codes
      if (statusCode === 401) {
        console.error('Authentication failed. Please check your API key and access token.');
      } else if (statusCode === 403) {
        console.error('You do not have permission to access this resource.');
      } else if (statusCode === 429) {
        console.error('Rate limit exceeded. Please try again later.');
      } else {
        console.error(`API Error (${statusCode}):`, responseData);
      }
    } else {
      // Handle non-Axios errors
      console.error('World Anvil API Error:', error?.message || error);
    }
  }

  /**
   * Get the current user profile
   */
  async getCurrentUser(): Promise<WorldAnvilUser> {
    return this.get<WorldAnvilUser>('/user');
  }

  /**
   * Get a list of worlds for the current user
   */
  async getMyWorlds(): Promise<WorldAnvilWorld[]> {
    return this.get<WorldAnvilWorld[]>('/user/worlds');
  }

  /**
   * Get a world by ID
   */
  async getWorldById(worldId: string): Promise<WorldAnvilWorld> {
    return this.get<WorldAnvilWorld>(`/world/${worldId}`);
  }
}
