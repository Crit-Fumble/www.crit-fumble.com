import { randomUUID } from "node:crypto";
import { DiscordAuthService } from "@crit-fumble/discord/server/services";
import { DatabaseClient } from "../clients/DatabaseClient";
import { sign, verify } from 'jsonwebtoken';

/**
 * Interface for JWT token payload
 */
export interface AuthTokenPayload {
  userId: string;        // User ID
  discordId?: string; // Discord ID
  iat: number;        // Issued at timestamp
  exp: number;        // Expiration timestamp
}

/**
 * Auth service for handling authentication
 */
export class AuthService {
  private discordAuth: DiscordAuthService;
  private jwtSecret: string;
  private tokenExpiration: string;
  
  /**
   * Creates a new auth service
   * @param database Database client instance
   */
  constructor(private database: DatabaseClient) {
    this.discordAuth = new DiscordAuthService();
    this.jwtSecret = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-production';
    this.tokenExpiration = '7d'; // Default token expiration
    
    if (process.env.NODE_ENV === 'production' && this.jwtSecret === 'dev-secret-do-not-use-in-production') {
      console.warn('WARNING: Using default JWT secret in production. Set JWT_SECRET environment variable.');
    }
  }

  /**
   * Initialize the auth service
   */
  async initialize(): Promise<void> {
    await this.discordAuth.initialize();
  }
  
  /**
   * Get Discord authorization URL
   * @param redirectUri URI to redirect after authentication
   * @param state Optional state parameter for security
   */
  getAuthorizationUrl(redirectUri: string, state?: string): string {
    return this.discordAuth.getAuthorizationUrl(redirectUri, 'identify email guilds', state);
  }
  
  /**
   * Handle Discord OAuth callback
   * @param code Authorization code from Discord
   * @param redirectUri Redirect URI used in initial request
   */
  async handleCallback(code: string, redirectUri: string): Promise<{
    success: boolean;
    token?: string;
    error?: string;
  }> {
    try {
      // Exchange code for Discord token
      const authResult = await this.discordAuth.exchangeCode(code, redirectUri);
      
      if (!authResult.success || !authResult.user) {
        return {
          success: false,
          error: authResult.error || 'Failed to authenticate with Discord'
        };
      }
      
      // Find or create user in our database
      let user = await this.database.client.user.findFirst({
        where: { discord_id: authResult.user.id }
      });
      
      if (!user) {
        // Generate a slug based on username
        const baseSlug = (authResult.user.username || 'user').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;
        
        // Create new user
        user = await this.database.client.user.create({
          data: {
            id: randomUUID(),
            name: authResult.user.username,
            discord_id: authResult.user.id,
            email: authResult.user.email,
            image: authResult.user.avatar ? 
              `https://cdn.discordapp.com/avatars/${authResult.user.id}/${authResult.user.avatar}.png` : 
              undefined,
            slug
          }
        });
      }
      
      // Generate JWT token
      const token = this.createToken(user.id, authResult.user.id);
      
      return {
        success: true,
        token
      };
    } catch (error) {
      console.error('Auth callback error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown authentication error'
      };
    }
  }
  
  /**
   * Create JWT token for user
   * @param userId User ID
   * @param discordId Discord ID
   */
  private createToken(userId: string, discordId?: string): string {
    const payload: AuthTokenPayload = {
      userId: userId,
      discordId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
    };
    
    return sign(payload, this.jwtSecret);
  }
  
  /**
   * Verify JWT token
   * @param token JWT token
   */
  verifyToken(token: string): AuthTokenPayload | null {
    try {
      return verify(token, this.jwtSecret) as AuthTokenPayload;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Get user by token
   * @param token JWT token
   */
  async getUserFromToken(token: string) {
    const payload = this.verifyToken(token);
    if (!payload) return null;
    
    return this.database.client.user.findUnique({
      where: { id: payload.userId }
    });
  }
  
  /**
   * Refresh user token
   * @param token Existing token to refresh
   */
  refreshToken(token: string): { success: boolean; token?: string; error?: string } {
    try {
      // Verify the token first
      const payload = this.verifyToken(token);
      if (!payload) {
        return { success: false, error: 'Invalid token' };
      }
      
      // Create a new token with refreshed expiration
      const newToken = this.createToken(payload.userId, payload.discordId);
      
      return { success: true, token: newToken };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh token'
      };
    }
  }
  
  /**
   * Verify if user is authenticated
   * @param token JWT token
   */
  async isAuthenticated(token: string): Promise<boolean> {
    const user = await this.getUserFromToken(token);
    return !!user;
  }
  
  /**
   * Get Discord user information using Discord token
   * @param discordToken Discord access token
   */
  async getDiscordUserInfo(discordToken: string) {
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${discordToken}`
        }
      });
      
      if (!response.ok) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch Discord user info:', error);
      return null;
    }
  }
  
  /**
   * Get Discord guilds information using Discord token
   * @param discordToken Discord access token
   */
  async getDiscordGuilds(discordToken: string) {
    return this.discordAuth.getUserGuilds(discordToken);
  }
}
