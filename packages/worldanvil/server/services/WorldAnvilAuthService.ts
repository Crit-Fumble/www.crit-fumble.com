/**
 * World Anvil Auth Service
 * Service for handling World Anvil authentication and token management
 */

import { WorldAnvilApiClient } from '../clients/WorldAnvilApiClient';
import { getWorldAnvilConfig } from '../configs';
import { WorldAnvilIdentityService, WorldAnvilIdentity } from './WorldAnvilIdentityService';

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
  private identityService: WorldAnvilIdentityService;
  
  /**
   * Creates a new WorldAnvilAuthService
   * @param customClient Optional client for testing/dependency injection
   */
  constructor(customClient?: WorldAnvilApiClient) {
    if (customClient) {
      this.apiClient = customClient;
      // Create identity service with the same client for consistent token state
      this.identityService = new WorldAnvilIdentityService(customClient);
    } else {
      const config = getWorldAnvilConfig();
      this.apiClient = new WorldAnvilApiClient({
        apiUrl: config.apiUrl,
        apiKey: config.apiKey,
        accessToken: config.accessToken
      });
      this.identityService = new WorldAnvilIdentityService(this.apiClient);
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
    this.identityService.setAccessToken(token);
  }

  /**
   * Check if a token is valid by attempting to access a protected endpoint
   * Uses the identity endpoint which is lightweight and returns user info
   * @returns True if the token is valid, false otherwise
   */
  async isTokenValid(): Promise<boolean> {
    return this.identityService.verifyAccessToken();
  }

  /**
   * Get the current user identity from the access token
   * @returns User identity information if token is valid
   * @throws Error if the token is invalid or expired
   */
  async getCurrentIdentity(): Promise<WorldAnvilIdentity> {
    return this.identityService.getCurrentIdentity();
  }
}