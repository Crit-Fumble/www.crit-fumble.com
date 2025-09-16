import { randomUUID } from "node:crypto";
import { sign, verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Client as DiscordClient, User as DiscordUser } from 'discord.js';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import OpenAI from 'openai';
import { WorldAnvilUser } from '@crit-fumble/worldanvil/models/WorldAnvilUser';
import { servicesConfig } from '../../models/config/services.config';

/**
 * Interface for JWT token payload
 */
export interface AuthTokenPayload {
  userId: string;      // User ID
  discordId?: string;  // Discord ID
  iat: number;        // Issued at timestamp
  exp: number;        // Expiration timestamp
}

/**
 * Extended user interface with integration data
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
 * Auth service for handling unified authentication and user integration
 */
export class AuthService {
  private readonly discordClient: DiscordClient;
  private readonly worldAnvilClient: WorldAnvilApiClient;
  private readonly openaiClient: OpenAI;
  private readonly jwtSecret: string;
  private readonly tokenExpiration: string;
  
  /**
   * Creates a new auth service
   * @param prisma Prisma client instance
   * @param discord Discord client instance for user authentication and notifications
   * @param worldanvil WorldAnvil client instance for user integration
   * @param openai OpenAI client instance for AI-powered auth features
   */
  constructor(
    private readonly prisma: PrismaClient,
    private readonly discord: DiscordClient,
    private readonly worldanvil: WorldAnvilApiClient,
    private readonly openai: OpenAI
  ) {
    // Use provided clients (following unified architecture)
    this.discordClient = discord;
    this.worldAnvilClient = worldanvil;
    this.openaiClient = openai;
    
    // Configure JWT settings from config
    this.jwtSecret = servicesConfig.auth.jwtSecret || 'dev-secret-do-not-use-in-production';
    this.tokenExpiration = servicesConfig.auth.tokenExpiration || '7d';
    
    // Security warning for production environments
    if (process.env.NODE_ENV === 'production' && this.jwtSecret === 'dev-secret-do-not-use-in-production') {
      console.warn('WARNING: Using default JWT secret in production. Configure jwtSecret in services config.');
    }
  }

  /**
   * Initialize the auth service
   */
  async initialize(): Promise<void> {
    // TODO: Initialize Discord client if needed
    // await this.discordClient.login(token);
  }
  
  /**
   * Get Discord authorization URL
   * @param redirectUri URI to redirect after authentication
   * @param state Optional state parameter for security
   */
  getAuthorizationUrl(redirectUri: string, state?: string): string {
    // TODO: Implement Discord OAuth URL generation using Discord.js
    // This would typically use the Discord OAuth2 API directly
    throw new Error('Not implemented - use Discord OAuth2 API directly');
  }
  
  /**
   * Handle Discord OAuth callback
   * @param code OAuth authorization code
   * @param redirectUri Redirect URI used in initial request
   */
  async handleCallback(code: string, redirectUri: string): Promise<{
    success: boolean;
    token?: string;
    error?: string;
  }> {
    // TODO: Implement Discord OAuth using raw Discord.js SDK
    // This is placeholder implementation until we implement proper OAuth2 flow
    return {
      success: false,
      error: 'Discord OAuth not implemented yet - use Discord.js OAuth2 directly'
    };
  }

  /**
            name: discordUser.username,
            discord_id: discordUser.id,
            email: discordUser.email,
            image: discordUser.avatar ? 
              `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` : 
              undefined,
            slug
          }
        });
      }
      
      // Generate JWT token
      const token = this.createToken(user.id, discordUser.id);
      
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
    
    return this.prisma.user.findUnique({
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
   * @param tokenType Optional token type, defaults to 'Bearer'
   */
  async getDiscordUserInfo(discordToken: string, tokenType = 'Bearer'): Promise<DiscordUser | null> {
    try {
      // TODO: Implement Discord OAuth REST API calls directly
      // This would require making HTTP requests to Discord's REST API
      // Example: GET https://discord.com/api/users/@me with Authorization header
      console.warn('getDiscordUserInfo not implemented - use Discord REST API directly');
      return null;
    } catch (error) {
      console.error('Failed to fetch Discord user info:', error);
      return null;
    }
  }
  
  /**
   * Get Discord guilds information using Discord token
   * @param discordToken Discord access token
   * @param tokenType Optional token type, defaults to 'Bearer'
   */
  async getDiscordGuilds(discordToken: string, tokenType = 'Bearer') {
    // TODO: Implement Discord REST API call for user guilds
    // Example: GET https://discord.com/api/users/@me/guilds with Authorization header
    console.warn('getDiscordGuilds not implemented - use Discord REST API directly');
    return { success: false, error: 'Not implemented yet' };
  }

  /**
   * Analyze user authentication patterns for security insights
   * @param userId User ID
   * @returns Security analysis and recommendations
   */
  async analyzeUserSecurityPatterns(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        discord_id: true,
        worldanvil_id: true
      }
    });

    if (!user) throw new Error('User not found');

    const prompt = `Analyze the security profile for this user account:
User ID: ${user.id}
Account Created: ${user.createdAt}
Last Updated: ${user.updatedAt}
Connected Services: ${[
      user.discord_id ? 'Discord' : null,
      user.worldanvil_id ? 'WorldAnvil' : null
    ].filter(Boolean).join(', ') || 'None'}

Provide security recommendations and identify any potential risks or improvements for this user's authentication setup.`;

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500
      });
      
      return response.choices[0]?.message?.content || 'No analysis available';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Security analysis temporarily unavailable';
    }
  }

  /**
   * Generate personalized security recommendations
   * @param userId User ID
   * @returns Personalized security tips
   */
  async generateSecurityRecommendations(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new Error('User not found');

    const prompt = `Generate personalized security recommendations for this user:
Username: ${user.name || 'Anonymous User'}
Connected Accounts: ${[
      user.discord_id ? 'Discord' : null,
      user.worldanvil_id ? 'WorldAnvil' : null
    ].filter(Boolean).join(', ') || 'None'}

Provide specific, actionable security recommendations tailored to their current setup and usage patterns.`;

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500
      });
      
      return response.choices[0]?.message?.content || 'No recommendations available';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Security recommendations temporarily unavailable';
    }
  }

  /**
   * Detect suspicious authentication patterns
   * @param userId User ID
   * @param authAttempts Recent authentication attempts data
   * @returns Suspicious activity analysis
   */
  async detectSuspiciousActivity(userId: string, authAttempts: any[]): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, discord_id: true }
    });

    if (!user) throw new Error('User not found');

    const prompt = `Analyze authentication patterns for suspicious activity:
User: ${user.name || user.id}
Recent Authentication Attempts: ${authAttempts.length}

Based on the authentication patterns, identify any suspicious activity and provide security recommendations. Consider factors like login frequency, timing, and connection patterns.`;

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500
      });
      
      return response.choices[0]?.message?.content || 'No suspicious activity detected';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Activity analysis temporarily unavailable';
    }
  }

  /**
   * Generate user onboarding suggestions based on profile
   * @param userId User ID
   * @returns Personalized onboarding recommendations
   */
  async generateOnboardingSuggestions(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new Error('User not found');

    const prompt = `Generate personalized onboarding suggestions for this new user:
Username: ${user.name || 'New User'}
Connected Services: ${[
      user.discord_id ? 'Discord' : null,
      user.worldanvil_id ? 'WorldAnvil' : null
    ].filter(Boolean).join(', ') || 'None'}
Account Age: ${user.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0} days

Provide helpful next steps and feature recommendations to help them get the most out of the platform.`;

    try {
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500
      });
      
      return response.choices[0]?.message?.content || 'Welcome! Explore the platform features.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Onboarding suggestions temporarily unavailable';
    }
  }
}
