/**
 * World Anvil Auth Service
 * Service for handling World Anvil authentication and token management
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import { WorldAnvilIdentity, WorldAnvilIdentityResponse } from '../../models/WorldAnvilIdentity';

/**
 * Interface for OAuth authorization results
 */
export interface AuthorizationResult {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Service for World Anvil authentication operations
 */
export class WorldAnvilAuthService {
  private apiClient: WorldAnvilApiClient;
  
  /**
   * Creates a new WorldAnvilAuthService
   * @param customClient Optional client for testing/dependency injection
   */
  constructor(customClient?: WorldAnvilApiClient) {
    if (customClient) {
      this.apiClient = customClient;
    } else {
      const config = getWorldAnvilConfig();
      this.apiClient = new WorldAnvilApiClient({
        apiUrl: config.apiUrl,
        apiKey: config.apiKey,
        accessToken: config.accessToken
      });
    }
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
  ): Promise<AuthorizationResult & { identity?: WorldAnvilIdentity }> {
    const data = {
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri
    };

    const result = await this.apiClient.post<AuthorizationResult>('/oauth/token', data);
    
    // Set the access token for subsequent API calls
    this.setAccessToken(result.access_token);
    
    // Optionally fetch the user identity with the new token
    try {
      const identity = await this.getCurrentIdentity();
      return { ...result, identity };
    } catch (error) {
      // Return just the token info if identity fetch fails
      return result;
    }
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
  ): Promise<AuthorizationResult & { identity?: WorldAnvilIdentity }> {
    const data = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret
    };

    const result = await this.apiClient.post<AuthorizationResult>('/oauth/token', data);
    
    // Update the access token for subsequent API calls
    this.setAccessToken(result.access_token);
    
    // Optionally fetch the user identity with the new token
    try {
      const identity = await this.getCurrentIdentity();
      return { ...result, identity };
    } catch (error) {
      // Return just the token info if identity fetch fails
      return result;
    }
  }

  /**
   * Set an access token for the API client
   * @param token The access token to set
   */
  setAccessToken(token: string): void {
    this.apiClient.setAccessToken(token);
  }

  /**
   * Check if a token is valid by attempting to access a protected endpoint
   * Uses the identity endpoint which is lightweight and returns user info
   * @returns True if the token is valid, false otherwise
   */
  async isTokenValid(): Promise<boolean> {
    try {
      await this.getCurrentIdentity();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the current user identity from the access token
   * @returns User identity information if token is valid
   * @throws Error if the token is invalid or expired
   */
  async getCurrentIdentity(): Promise<WorldAnvilIdentity> {
    const response = await this.apiClient.get<WorldAnvilIdentityResponse>('/identity');
    return this.mapIdentityResponse(response);
  }
  
  /**
   * Map the API response to our internal identity model
   * @param response The API response
   * @returns The mapped identity
   */
  private mapIdentityResponse(response: WorldAnvilIdentityResponse): WorldAnvilIdentity {
    return {
      id: response.id,
      username: response.username,
      userhash: response.userhash,
      success: response.success,
      // Optional fields that might be returned by the API but aren't in spec
      displayName: response.display_name,
      subscriptionType: response.subscription_type,
      isAuthor: response.is_author,
      avatarUrl: response.avatar_url
    };
  }
}