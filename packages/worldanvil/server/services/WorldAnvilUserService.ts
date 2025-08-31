/**
 * World Anvil User Service
 * Service for interacting with World Anvil user endpoints
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { WorldAnvilApiService } from './WorldAnvilApiService';
import { WorldAnvilUser, WorldAnvilUserResponse } from '../../models/WorldAnvilUser';

export interface AuthorizationResult {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export class WorldAnvilUserService {
  private apiService: WorldAnvilApiService;
  private apiClient: WorldAnvilApiClient;
  
  constructor(apiService: WorldAnvilApiService) {
    this.apiService = apiService;
    this.apiClient = apiService.getClient();
  }

  /**
   * Authenticate a user with World Anvil OAuth
   * @param code Authorization code from OAuth flow
   * @param clientId Your application's client ID
   * @param clientSecret Your application's client secret
   * @param redirectUri The redirect URI used in the authorization request
   */
  async authenticate(
    code: string, 
    clientId: string, 
    clientSecret: string, 
    redirectUri: string
  ): Promise<AuthorizationResult> {
    const data = {
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri
    };

    const result = await this.apiClient.post<AuthorizationResult>('/oauth/token', data);
    
    // Set the access token for subsequent API calls
    this.apiService.setAccessToken(result.access_token);
    
    return result;
  }

  /**
   * Refresh an access token using the refresh token
   * @param refreshToken The refresh token
   * @param clientId Your application's client ID
   * @param clientSecret Your application's client secret
   */
  async refreshToken(
    refreshToken: string,
    clientId: string,
    clientSecret: string
  ): Promise<AuthorizationResult> {
    const data = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret
    };

    const result = await this.apiClient.post<AuthorizationResult>('/oauth/token', data);
    
    // Update the access token for subsequent API calls
    this.apiService.setAccessToken(result.access_token);
    
    return result;
  }

  /**
   * Get the current user's profile
   */
  async getCurrentUser(): Promise<WorldAnvilUser> {
    const response = await this.apiClient.get<WorldAnvilUserResponse>('/user/me');
    
    return {
      id: response.id,
      username: response.username,
      display_name: response.display_name,
      avatar_url: response.avatar_url,
      subscription_type: response.subscription_type,
      is_author: response.is_author
    };
  }

  /**
   * Get a user by ID
   * @param userId The ID of the user to get
   */
  async getUserById(userId: string): Promise<WorldAnvilUser> {
    const response = await this.apiClient.get<WorldAnvilUserResponse>(`/user/${userId}`);
    
    return {
      id: response.id,
      username: response.username,
      display_name: response.display_name,
      avatar_url: response.avatar_url,
      subscription_type: response.subscription_type,
      is_author: response.is_author
    };
  }

  /**
   * Get a user by username
   * @param username The username of the user to get
   */
  async getUserByUsername(username: string): Promise<WorldAnvilUser> {
    const response = await this.apiClient.get<WorldAnvilUserResponse>(`/user/username/${username}`);
    
    return {
      id: response.id,
      username: response.username,
      display_name: response.display_name,
      avatar_url: response.avatar_url,
      subscription_type: response.subscription_type,
      is_author: response.is_author
    };
  }
}
