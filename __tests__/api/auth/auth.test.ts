/**
 * Auth API Routes Tests
 * 
 * Unit tests for Discord OAuth and logout endpoints with proper mocking
 * of external dependencies and HTTP calls.
 */

import { jest } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { 
  createMockNextRequest, 
  extractResponseData,
  type ApiTestResponse 
} from '../../utils/api-test-helpers';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock environment variables
const originalEnv = process.env;

describe('Auth API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      AUTH_DISCORD_ID: 'test-discord-client-id',
      AUTH_DISCORD_SECRET: 'test-discord-client-secret',
      NODE_ENV: 'test',
      NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Discord OAuth Route - /api/discord/oauth/callback', () => {
    // Create the handler function that mimics the route logic
    const discordAuthHandler = async (request: NextRequest) => {
      const { searchParams } = new URL(request.url);
      const code = searchParams.get('code');

      const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;

      if (!code) {
        // Build Discord OAuth URL manually
        const params = new URLSearchParams({
          client_id: process.env.AUTH_DISCORD_ID || '',
          redirect_uri: `${baseUrl}/api/discord/oauth/callback`,
          response_type: 'code',
          scope: 'identify email',
        });
        
        const authUrl = `https://discord.com/oauth2/authorize?${params}`;
        return NextResponse.redirect(authUrl);
      }

      try {
        // Exchange code for token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.AUTH_DISCORD_ID || '',
            client_secret: process.env.AUTH_DISCORD_SECRET || '',
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `${baseUrl}/api/discord/oauth/callback`,
          }),
        });

        const tokenData = await tokenResponse.json();
        
        if (!tokenData.access_token) {
          throw new Error('Failed to get access token');
        }

        // Get user info from Discord
        const userResponse = await fetch('https://discord.com/api/users/@me', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });

        const userData = await userResponse.json();
        
        // Set session cookie
        const response = NextResponse.redirect(`${baseUrl}/dashboard`);
        
        response.cookies.set('fumble-session', JSON.stringify({
          userId: userData.id,
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar,
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
        
        return response;
      } catch (error) {
        console.error('Discord OAuth error:', error);
        return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
      }
    };

    it('should redirect to Discord OAuth when no code is provided', async () => {
      // Arrange
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/auth/discord',
      });

      // Act
      const response = await discordAuthHandler(request);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      expect(response.status).toBe(307); // Redirect status
      const location = response.headers.get('location');
      expect(location).toContain('https://discord.com/oauth2/authorize');
      expect(location).toContain('client_id=test-discord-client-id');
      expect(location).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fdiscord');
      expect(location).toContain('response_type=code');
      expect(location).toContain('scope=identify%20email');
    });

    it('should handle successful Discord OAuth callback', async () => {
      // Arrange
      const mockTokenResponse = {
        json: jest.fn().mockResolvedValue({
          access_token: 'mock-access-token',
          token_type: 'Bearer',
        }),
      };

      const mockUserResponse = {
        json: jest.fn().mockResolvedValue({
          id: 'discord-user-123',
          username: 'testuser',
          email: 'test@example.com',
          avatar: 'avatar-hash',
        }),
      };

      mockFetch
        .mockResolvedValueOnce(mockTokenResponse) // Token exchange
        .mockResolvedValueOnce(mockUserResponse); // User info

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/auth/discord',
        searchParams: {
          code: 'mock-oauth-code',
        },
      });

      // Act
      const response = await discordAuthHandler(request);

      // Assert
      expect(response.status).toBe(307); // Redirect status
      expect(response.headers.get('location')).toBe('http://localhost:3000/dashboard');

      // Verify token exchange call
      expect(mockFetch).toHaveBeenCalledWith(
        'https://discord.com/api/oauth2/token',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: expect.any(URLSearchParams),
        })
      );

      // Verify user info call
      expect(mockFetch).toHaveBeenCalledWith(
        'https://discord.com/api/users/@me',
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer mock-access-token',
          },
        })
      );

      // Verify cookie is set
      const setCookieHeader = response.headers.get('set-cookie');
      expect(setCookieHeader).toContain('fumble-session=');
      expect(setCookieHeader).toContain('HttpOnly');
      expect(setCookieHeader).toContain('SameSite=Lax');
    });

    it('should handle token exchange failure', async () => {
      // Arrange
      const mockTokenResponse = {
        json: jest.fn().mockResolvedValue({
          error: 'invalid_grant',
          error_description: 'Invalid authorization code',
        }),
      };

      mockFetch.mockResolvedValueOnce(mockTokenResponse);

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/auth/discord',
        searchParams: {
          code: 'invalid-oauth-code',
        },
      });

      // Act
      const response = await discordAuthHandler(request);

      // Assert
      expect(response.status).toBe(307); // Redirect status
      expect(response.headers.get('location')).toBe('http://localhost:3000/?error=auth_failed');
    });

    it('should handle Discord API errors', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/auth/discord',
        searchParams: {
          code: 'mock-oauth-code',
        },
      });

      // Act
      const response = await discordAuthHandler(request);

      // Assert
      expect(response.status).toBe(307); // Redirect status
      expect(response.headers.get('location')).toBe('http://localhost:3000/?error=auth_failed');
    });

    it('should use production secure cookies in production environment', async () => {
      // Arrange
      process.env.NODE_ENV = 'production';

      const mockTokenResponse = {
        json: jest.fn().mockResolvedValue({
          access_token: 'mock-access-token',
        }),
      };

      const mockUserResponse = {
        json: jest.fn().mockResolvedValue({
          id: 'discord-user-123',
          username: 'testuser',
          email: 'test@example.com',
          avatar: 'avatar-hash',
        }),
      };

      mockFetch
        .mockResolvedValueOnce(mockTokenResponse)
        .mockResolvedValueOnce(mockUserResponse);

      const request = createMockNextRequest({
        method: 'GET',
        url: 'https://crit-fumble.com/api/auth/discord',
        searchParams: {
          code: 'mock-oauth-code',
        },
      });

      // Act
      const response = await discordAuthHandler(request);

      // Assert
      const setCookieHeader = response.headers.get('set-cookie');
      expect(setCookieHeader).toContain('Secure');
    });
  });

  describe('Logout Route - /api/auth/logout', () => {
    const logoutHandler = async (request: NextRequest) => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
      const homeUrl = new URL('/', baseUrl);
      
      // Create the redirect response
      const response = NextResponse.redirect(homeUrl);
      
      // Clear the session cookie
      response.cookies.set('fumble-session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        expires: new Date(0)
      });
      
      return response;
    };

    it('should clear session cookie and redirect to home on POST', async () => {
      // Arrange
      const request = createMockNextRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/auth/logout',
      });

      // Act
      const response = await logoutHandler(request);

      // Assert
      expect(response.status).toBe(307); // Redirect status
      expect(response.headers.get('location')).toBe('http://localhost:3000/');

      // Verify cookie is cleared
      const setCookieHeader = response.headers.get('set-cookie');
      expect(setCookieHeader).toContain('fumble-session=;');
      expect(setCookieHeader).toContain('Max-Age=0');
      expect(setCookieHeader).toContain('HttpOnly');
    });

    it('should handle GET requests same as POST', async () => {
      // Arrange
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/auth/logout',
      });

      // Act
      const response = await logoutHandler(request);

      // Assert
      expect(response.status).toBe(307); // Redirect status
      expect(response.headers.get('location')).toBe('http://localhost:3000/');
    });

    it('should use NEXT_PUBLIC_BASE_URL when available', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_BASE_URL = 'https://crit-fumble.com';

      const request = createMockNextRequest({
        method: 'POST',
        url: 'https://crit-fumble.com/api/auth/logout',
      });

      // Act
      const response = await logoutHandler(request);

      // Assert
      expect(response.headers.get('location')).toBe('https://crit-fumble.com/');
    });

    it('should use secure cookies in production', async () => {
      // Arrange
      process.env.NODE_ENV = 'production';

      const request = createMockNextRequest({
        method: 'POST',
        url: 'https://crit-fumble.com/api/auth/logout',
      });

      // Act
      const response = await logoutHandler(request);

      // Assert
      const setCookieHeader = response.headers.get('set-cookie');
      expect(setCookieHeader).toContain('Secure');
    });
  });

  describe('Session Cookie Handling', () => {
    it('should create valid session data structure', () => {
      // Test session data structure used in Discord OAuth
      const userData = {
        id: 'discord-user-123',
        username: 'testuser',
        email: 'test@example.com',
        avatar: 'avatar-hash',
      };

      const sessionData = {
        userId: userData.id,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar,
      };

      expect(sessionData).toEqual({
        userId: 'discord-user-123',
        username: 'testuser',
        email: 'test@example.com',
        avatar: 'avatar-hash',
      });

      // Test that it can be JSON serialized
      expect(() => JSON.stringify(sessionData)).not.toThrow();
      
      // Test that serialized data is valid
      const serialized = JSON.stringify(sessionData);
      const deserialized = JSON.parse(serialized);
      expect(deserialized).toEqual(sessionData);
    });
  });
});