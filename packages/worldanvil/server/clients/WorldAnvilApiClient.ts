/**
 * World Anvil API Client
 * Server-side client for interacting with World Anvil API
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { WorldAnvilUser } from '../../models/WorldAnvilUser';
import { WorldAnvilWorld } from '../../models/WorldAnvilWorld';

export interface WorldAnvilApiClientConfig {
  apiUrl?: string;
  apiKey?: string;
  accessToken?: string;
}

export class WorldAnvilApiClient {
  private client: AxiosInstance;
  private apiKey?: string;
  private accessToken?: string;

  constructor(config: WorldAnvilApiClientConfig = {}) {
    this.apiKey = config.apiKey;
    this.accessToken = config.accessToken;

    this.client = axios.create({
      baseURL: config.apiUrl || 'https://www.worldanvil.com/api/v1',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor to add auth headers
    this.client.interceptors.request.use((request) => {
      if (this.apiKey) {
        request.headers['x-application-key'] = this.apiKey;
      }
      
      if (this.accessToken) {
        request.headers['Authorization'] = `Bearer ${this.accessToken}`;
      }
      
      return request;
    });
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
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Make a generic POST request to the World Anvil API
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Make a generic PUT request to the World Anvil API
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Make a generic DELETE request to the World Anvil API
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: any): void {
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
