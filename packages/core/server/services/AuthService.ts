import { randomUUID } from "node:crypto";
import { sign, verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthConfig } from '../../models/config';
import { 
  SsoProvider, 
  SsoUserProfile, 
  SsoAuthResult, 
  SsoTokenPayload, 
  SsoUserSession,
  UserLinkResult,
  ISsoProvider,
  DiscordSsoProvider
} from '../../models/auth';

/**
 * Interface for JWT token payload (legacy support)
 */
export interface AuthTokenPayload {
  userId: string;      // User ID
  discordId?: string;  // Discord ID
  iat: number;        // Issued at timestamp
  exp: number;        // Expiration timestamp
}

/**
 * Extended user interface with integration data (legacy support)
 */
export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  discord_id: string | null;
  worldanvil_id: string | null;
  image: string | null;
  slug: string | null;
  worldAnvilData?: any; // We'll type this properly once we determine the shape
}

/**
 * SSO Authentication Service
 * Handles unified SSO authentication with Discord and WorldAnvil providers
 */
export class AuthService {
  private readonly jwtSecret: string;
  private readonly tokenExpiration: string;
  private readonly providers: Map<SsoProvider, ISsoProvider> = new Map();
  
  /**
   * Creates a new SSO Auth service
   * @param prisma Database client instance
   * @param authConfig Authentication configuration including SSO settings
   */
  constructor(
    private readonly prisma: PrismaClient,
    private readonly authConfig: AuthConfig
  ) {
    // Configure JWT settings from config
    this.jwtSecret = authConfig.jwtSecret;
    this.tokenExpiration = authConfig.tokenExpiration;
    
    // Initialize SSO providers
    this.initializeSsoProviders();
    
    // Security warning for production environments
    if (process.env.NODE_ENV === 'production' && this.jwtSecret === 'dev-secret-do-not-use-in-production') {
      console.warn('WARNING: Using default JWT secret in production. Configure jwtSecret in auth config.');
    }
  }

  /**
   * Initialize SSO providers based on configuration
   */
  private initializeSsoProviders(): void {
    // Initialize Discord provider if configured
    if (this.authConfig.sso.discord?.clientId && this.authConfig.sso.discord?.clientSecret) {
      const discordProvider = new DiscordSsoProvider(
        this.authConfig.sso.discord.clientId,
        this.authConfig.sso.discord.clientSecret,
        this.authConfig.sso.discord.redirectUri,
        this.authConfig.sso.discord.scopes,
        this.authConfig.sso.discord.guildId
      );
      this.providers.set(SsoProvider.DISCORD, discordProvider);
    }
    
    // Note: WorldAnvil provider should be added externally via addProvider() method
    // to maintain package separation - see @crit-fumble/worldanvil package
  }

  /**
   * Get available SSO providers
   */
  getAvailableProviders(): SsoProvider[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Add an external SSO provider
   * This allows packages like @crit-fumble/worldanvil to register their providers
   */
  addProvider(provider: SsoProvider, instance: ISsoProvider): void {
    this.providers.set(provider, instance);
  }

  /**
   * Remove an SSO provider
   */
  removeProvider(provider: SsoProvider): boolean {
    return this.providers.delete(provider);
  }

  /**
   * Get SSO authorization URL for a provider
   * @param provider SSO provider
   * @param state Optional state parameter for security
   */
  getSsoAuthorizationUrl(provider: SsoProvider, state?: string): string {
    const ssoProvider = this.providers.get(provider);
    if (!ssoProvider) {
      throw new Error(`SSO provider ${provider} is not configured`);
    }

    const config = this.authConfig.sso[provider];
    if (!config) {
      throw new Error(`Configuration missing for SSO provider ${provider}`);
    }

    return ssoProvider.getAuthorizationUrl({
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      scopes: config.scopes,
      state: state || this.generateSecureState(),
    });
  }

  /**
   * Handle SSO OAuth callback
   * @param provider SSO provider
   * @param code OAuth authorization code
   * @param state State parameter for security validation
   */
  async handleSsoCallback(
    provider: SsoProvider, 
    code: string, 
    state?: string
  ): Promise<SsoAuthResult> {
    try {
      const ssoProvider = this.providers.get(provider);
      if (!ssoProvider) {
        return {
          success: false,
          error: `SSO provider ${provider} is not configured`
        };
      }

      const config = this.authConfig.sso[provider];
      if (!config) {
        return {
          success: false,
          error: `Configuration missing for SSO provider ${provider}`
        };
      }

      // Exchange code for tokens
      const tokens = await ssoProvider.exchangeCodeForToken({
        code,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: config.redirectUri,
      });

      // Get user profile
      const userProfile = await ssoProvider.getUserProfile(tokens.access_token);

      // Additional validation for Discord guild membership if required
      if (provider === SsoProvider.DISCORD && ssoProvider instanceof DiscordSsoProvider) {
        const isMember = await ssoProvider.checkGuildMembership(tokens.access_token);
        if (!isMember) {
          return {
            success: false,
            error: 'User is not a member of the required Discord server'
          };
        }
      }

      return {
        success: true,
        user: userProfile,
        tokens,
      };
    } catch (error) {
      console.error(`SSO callback error for ${provider}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown authentication error'
      };
    }
  }

  /**
   * Create or update user from SSO profile and generate JWT token
   * @param userProfile SSO user profile
   * @param linkToExistingUser Optional user ID to link the SSO account to
   */
  async createOrUpdateUserFromSso(
    userProfile: SsoUserProfile,
    linkToExistingUser?: string
  ): Promise<{
    success: boolean;
    token?: string;
    user?: SsoUserSession;
    error?: string;
  }> {
    try {
      let user;
      
      if (linkToExistingUser) {
        // Link SSO account to existing user
        user = await this.linkSsoToUser(linkToExistingUser, userProfile);
      } else {
        // Find existing user by provider ID or create new one
        const providerField = userProfile.provider === SsoProvider.DISCORD ? 'discord_id' : 'worldanvil_id';
        
        user = await this.prisma.user.findFirst({
          where: {
            [providerField]: userProfile.id
          }
        });

        if (!user) {
          // Create new user
          const slug = await this.generateUniqueSlug(userProfile.username);
          
          user = await this.prisma.user.create({
            data: {
              id: randomUUID(),
              name: userProfile.displayName || userProfile.username,
              email: userProfile.email,
              image: userProfile.avatar,
              slug,
              [providerField]: userProfile.id,
              admin: false,
              data: {
                [userProfile.provider]: userProfile.providerData
              }
            }
          });
        } else {
          // Update existing user
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: {
              name: userProfile.displayName || userProfile.username,
              email: userProfile.email || user.email,
              image: userProfile.avatar || user.image,
              updatedAt: new Date(),
              data: {
                ...((user.data as any) || {}),
                [userProfile.provider]: userProfile.providerData
              }
            }
          });
        }
      }

      // Generate JWT token with SSO information
      const token = this.createSsoToken(user);
      
      // Create user session object
      const userSession = this.createUserSession(user);

      return {
        success: true,
        token,
        user: userSession
      };
    } catch (error) {
      console.error('Error creating/updating user from SSO:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create or update user'
      };
    }
  }

  /**
   * Link SSO account to existing user
   * @param userId Existing user ID
   * @param userProfile SSO user profile to link
   */
  async linkSsoToUser(userId: string, userProfile: SsoUserProfile): Promise<any> {
    const providerField = userProfile.provider === SsoProvider.DISCORD ? 'discord_id' : 'worldanvil_id';
    
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        [providerField]: userProfile.id,
        updatedAt: new Date(),
        data: {
          ...((await this.prisma.user.findUnique({ where: { id: userId } }))?.data as any || {}),
          [userProfile.provider]: userProfile.providerData
        }
      }
    });
  }

  /**
   * Get user linking status for multiple SSO providers
   * @param userId User ID
   */
  async getUserLinkStatus(userId: string): Promise<UserLinkResult> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return {
          success: false,
          userId,
          linkedProviders: [],
          error: 'User not found'
        };
      }

      const linkedProviders: SsoProvider[] = [];
      if (user.discord_id) linkedProviders.push(SsoProvider.DISCORD);
      if (user.worldanvil_id) linkedProviders.push(SsoProvider.WORLDANVIL);

      return {
        success: true,
        userId,
        linkedProviders
      };
    } catch (error) {
      return {
        success: false,
        userId,
        linkedProviders: [],
        error: error instanceof Error ? error.message : 'Failed to get user link status'
      };
    }
  }

  /**
   * Verify JWT token and return user session
   * @param token JWT token
   */
  async verifyToken(token: string): Promise<{
    success: boolean;
    user?: SsoUserSession;
    error?: string;
  }> {
    try {
      const payload = verify(token, this.jwtSecret) as SsoTokenPayload;
      
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId }
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        user: this.createUserSession(user)
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid or expired token'
      };
    }
  }

  /**
   * Create JWT token with SSO information
   * @param user User record from database
   */
  private createSsoToken(user: any): string {
    const payload: SsoTokenPayload = {
      userId: user.id,
      providers: {},
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.parseTokenExpiration()
    };

    // Add provider information
    if (user.discord_id) {
      payload.providers.discord = {
        id: user.discord_id,
        username: (user.data as any)?.discord?.username || user.name || 'Unknown'
      };
    }

    if (user.worldanvil_id) {
      payload.providers.worldanvil = {
        id: user.worldanvil_id,
        username: (user.data as any)?.worldanvil?.username || user.name || 'Unknown'
      };
    }

    return sign(payload, this.jwtSecret);
  }

  /**
   * Create user session object from database user
   * @param user User record from database
   */
  private createUserSession(user: any): SsoUserSession {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      slug: user.slug,
      providers: {
        discord: user.discord_id ? {
          id: user.discord_id,
          username: (user.data as any)?.discord?.username || user.name || 'Unknown',
          discriminator: (user.data as any)?.discord?.discriminator
        } : undefined,
        worldanvil: user.worldanvil_id ? {
          id: user.worldanvil_id,
          username: (user.data as any)?.worldanvil?.username || user.name || 'Unknown'
        } : undefined
      },
      admin: user.admin || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * Generate unique slug for user
   * @param username Base username
   */
  private async generateUniqueSlug(username: string): Promise<string> {
    const baseSlug = username.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.user.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Generate secure state parameter
   */
  private generateSecureState(): string {
    return randomUUID();
  }

  /**
   * Parse token expiration string to seconds
   */
  private parseTokenExpiration(): number {
    const expiration = this.tokenExpiration;
    const match = expiration.match(/^(\d+)([dhms])$/);
    
    if (!match) {
      return 7 * 24 * 60 * 60; // Default to 7 days
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'd': return value * 24 * 60 * 60;
      case 'h': return value * 60 * 60;
      case 'm': return value * 60;
      case 's': return value;
      default: return 7 * 24 * 60 * 60;
    }
  }

  // Legacy methods for backward compatibility
  
  /**
   * @deprecated Use getSsoAuthorizationUrl instead
   */
  getAuthorizationUrl(redirectUri: string, state?: string): string {
    return this.getSsoAuthorizationUrl(SsoProvider.DISCORD, state);
  }

  /**
   * @deprecated Use handleSsoCallback instead
   */
  async handleCallback(code: string, redirectUri: string): Promise<{
    success: boolean;
    token?: string;
    error?: string;
  }> {
    const result = await this.handleSsoCallback(SsoProvider.DISCORD, code);
    
    if (!result.success || !result.user) {
      return {
        success: false,
        error: result.error
      };
    }

    const userResult = await this.createOrUpdateUserFromSso(result.user);
    
    return {
      success: userResult.success,
      token: userResult.token,
      error: userResult.error
    };
  }

  /**
   * @deprecated Use createSsoToken instead
   */
  private createToken(userId: string, discordId?: string): string {
    const payload: AuthTokenPayload = {
      userId: userId,
      discordId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.parseTokenExpiration()
    };

    return sign(payload, this.jwtSecret);
  }
}