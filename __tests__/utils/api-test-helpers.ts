/**
 * API Test Helpers
 * 
 * Utilities for testing Next.js API routes with proper mocking
 * and dependency injection patterns.
 */

import { NextRequest, NextResponse } from 'next/server';
import { jest } from '@jest/globals';

// Import service types for mocking
type UserManagementService = {
  getUserById: (id: string) => Promise<any>;
  getUserByEmail: (email: string) => Promise<any>;
  createUser: (userData: any) => Promise<any>;
  updateUser: (id: string, updates: any) => Promise<any>;
  deleteUser: (id: string) => Promise<any>;
  listUsers: (options?: any) => Promise<any>;
  searchUsers: (query: string, options?: any) => Promise<any>;
  isEmailTaken: (email: string) => Promise<boolean>;
  isSlugTaken: (slug: string) => Promise<boolean>;
  getUserSuggestions: (query: string, limit?: number) => Promise<any>;
};

/**
 * Mock NextRequest for testing
 */
export function createMockNextRequest(options: {
  method?: string;
  url?: string;
  body?: any;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  searchParams?: Record<string, string>;
}): NextRequest {
  const { 
    method = 'GET', 
    url = 'http://localhost:3000/test',
    body,
    headers = {},
    cookies = {},
    searchParams = {}
  } = options;

  // Create URL with search params
  const requestUrl = new URL(url);
  Object.entries(searchParams).forEach(([key, value]) => {
    requestUrl.searchParams.set(key, value);
  });

  const mockRequest = {
    method,
    url: requestUrl.toString(),
    nextUrl: requestUrl,
    headers: new Map(Object.entries(headers)),
    cookies: {
      get: jest.fn((name: string) => {
        const value = cookies[name];
        return value ? { name, value } : undefined;
      }),
      getAll: jest.fn(() => 
        Object.entries(cookies).map(([name, value]) => ({ name, value }))
      ),
    },
    json: jest.fn().mockResolvedValue(body),
    text: jest.fn().mockResolvedValue(body ? JSON.stringify(body) : ''),
    formData: jest.fn(),
    blob: jest.fn(),
  } as unknown as NextRequest;

  return mockRequest;
}

/**
 * Extract response data from NextResponse for testing
 */
export async function extractResponseData(response: NextResponse): Promise<{
  status: number;
  data?: any;
  headers: Record<string, string>;
}> {
  const status = response.status;
  const headers: Record<string, string> = {};
  
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let data;
  try {
    const text = await response.text();
    if (text) {
      data = JSON.parse(text);
    }
  } catch (error) {
    // Not JSON, might be plain text
    data = await response.text();
  }

  return { status, data, headers };
}

/**
 * Mock admin-auth middleware for testing
 */
export function createMockAdminAuth(adminUser?: {
  id: string;
  name: string | null;
  email: string | null;
  admin: boolean;
}) {
  return jest.fn((handler: Function) => {
    return jest.fn(async (request: NextRequest, ...args: any[]) => {
      if (!adminUser) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (!adminUser.admin) {
        return NextResponse.json(
          { 
            error: 'Admin access required', 
            message: 'Only manually designated admins can access this resource'
          },
          { status: 403 }
        );
      }

      return handler(request, adminUser, ...args);
    });
  });
}

/**
 * Mock UserManagementService for testing
 */
export function createMockUserManagementService(): jest.Mocked<UserManagementService> {
  return {
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    listUsers: jest.fn(),
    searchUsers: jest.fn(),
    isEmailTaken: jest.fn(),
    isSlugTaken: jest.fn(),
    getUserSuggestions: jest.fn(),
  } as jest.Mocked<UserManagementService>;
}

/**
 * Mock PermissionService for testing
 */
export function createMockPermissionService() {
  return {
    validateDiscordServerPermission: jest.fn(),
    validateWebAdminPermission: jest.fn(),
    createDiscordServerContext: jest.fn(),
    createWebAdminContext: jest.fn(),
    canDiscordServerContextGrantWebAdmin: jest.fn().mockReturnValue(false),
  };
}

/**
 * Mock SiteAdminProtection for testing
 */
export function createMockSiteAdminProtection() {
  return {
    validateWebAdminOperation: jest.fn(),
    canDiscordPermissionsGrantWebAccess: jest.fn().mockReturnValue(false),
    auditAdminPermissionUsage: jest.fn(),
    getSecurityBoundaries: jest.fn(),
  };
}

/**
 * Common test data for users
 */
export const testUsers = {
  adminUser: {
    id: 'admin-user-id',
    username: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    admin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  regularUser: {
    id: 'regular-user-id',
    username: 'user',
    name: 'Regular User',
    email: 'user@example.com',
    admin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  newUserData: {
    username: 'newuser',
    name: 'New User',
    email: 'newuser@example.com',
    admin: false,
  },
};

/**
 * Test response types for consistency
 */
export interface ApiTestResponse {
  status: number;
  data?: any;
  headers: Record<string, string>;
}

/**
 * Assert helpers for common response patterns
 */
export const assertResponse = {
  success: (response: ApiTestResponse, expectedData?: any) => {
    expect(response.status).toBe(200);
    if (expectedData) {
      expect(response.data).toEqual(expectedData);
    }
  },
  
  created: (response: ApiTestResponse, expectedData?: any) => {
    expect(response.status).toBe(201);
    if (expectedData) {
      expect(response.data).toEqual(expectedData);
    }
  },
  
  badRequest: (response: ApiTestResponse, expectedError?: string) => {
    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('error');
    if (expectedError) {
      expect(response.data.error).toContain(expectedError);
    }
  },
  
  unauthorized: (response: ApiTestResponse) => {
    expect(response.status).toBe(401);
    expect(response.data).toHaveProperty('error', 'Authentication required');
  },
  
  forbidden: (response: ApiTestResponse) => {
    expect(response.status).toBe(403);
    expect(response.data).toHaveProperty('error', 'Admin access required');
  },
  
  notFound: (response: ApiTestResponse) => {
    expect(response.status).toBe(404);
    expect(response.data).toHaveProperty('error');
  },
  
  serverError: (response: ApiTestResponse) => {
    expect(response.status).toBe(500);
    expect(response.data).toHaveProperty('error');
  },
};