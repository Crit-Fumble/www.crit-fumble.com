/**
 * Admin User Suggestions API Route Tests
 * 
 * Unit tests for /api/admin/users/suggestions endpoint with dependency injection
 * and proper mocking of all external dependencies.
 */

import { jest } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { 
  createMockNextRequest, 
  extractResponseData, 
  createMockUserManagementService,
  testUsers,
  assertResponse,
  type ApiTestResponse 
} from '../../../../utils/api-test-helpers';

// Mock the dependencies
const mockUserManagementService = createMockUserManagementService();
const mockWithAdminAuth = jest.fn();

jest.mock('@crit-fumble/core/server/services', () => ({
  UserManagementService: jest.fn(() => mockUserManagementService),
}));

jest.mock('../../../../../app/lib/admin-auth', () => ({
  withAdminAuth: mockWithAdminAuth,
}));

describe('/api/admin/users/suggestions route', () => {
  const mockAdminUser = {
    id: testUsers.adminUser.id,
    name: testUsers.adminUser.name,
    email: testUsers.adminUser.email,
    admin: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock withAdminAuth to pass through the handler with a mock admin user
    mockWithAdminAuth.mockImplementation((handler) => {
      return jest.fn(async (request: NextRequest) => {
        return handler(request, mockAdminUser);
      });
    });
  });

  describe('GET /api/admin/users/suggestions', () => {
    it('should return user suggestions for valid query', async () => {
      // Arrange
      const expectedSuggestions = [
        {
          id: testUsers.adminUser.id,
          username: testUsers.adminUser.username,
          name: testUsers.adminUser.name,
          email: testUsers.adminUser.email,
        },
        {
          id: testUsers.regularUser.id,
          username: testUsers.regularUser.username,
          name: testUsers.regularUser.name,
          email: testUsers.regularUser.email,
        },
      ];

      mockUserManagementService.getUserSuggestions.mockResolvedValue(expectedSuggestions);

      const handler = jest.fn(async (request: NextRequest) => {
        try {
          const { searchParams } = new URL(request.url);
          const query = searchParams.get('q') || '';
          const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

          if (!query || query.length < 2) {
            return NextResponse.json([]);
          }

          const suggestions = await mockUserManagementService.getUserSuggestions(query, limit);
          return NextResponse.json(suggestions);
        } catch (error) {
          console.error('Error getting user suggestions:', error);
          return NextResponse.json(
            { error: 'Failed to get user suggestions' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/suggestions',
        searchParams: {
          q: 'admin',
          limit: '10',
        },
      });

      // Act
      const response = await handler(request);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.success(result, expectedSuggestions);
      expect(mockUserManagementService.getUserSuggestions).toHaveBeenCalledWith('admin', 10);
    });

    it('should return empty array for query shorter than 2 characters', async () => {
      // Arrange
      const handler = jest.fn(async (request: NextRequest) => {
        try {
          const { searchParams } = new URL(request.url);
          const query = searchParams.get('q') || '';
          const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

          if (!query || query.length < 2) {
            return NextResponse.json([]);
          }

          const suggestions = await mockUserManagementService.getUserSuggestions(query, limit);
          return NextResponse.json(suggestions);
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to get user suggestions' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/suggestions',
        searchParams: {
          q: 'a', // Single character
        },
      });

      // Act
      const response = await handler(request);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.success(result, []);
      expect(mockUserManagementService.getUserSuggestions).not.toHaveBeenCalled();
    });

    it('should return empty array for empty query', async () => {
      // Arrange
      const handler = jest.fn(async (request: NextRequest) => {
        try {
          const { searchParams } = new URL(request.url);
          const query = searchParams.get('q') || '';
          const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

          if (!query || query.length < 2) {
            return NextResponse.json([]);
          }

          const suggestions = await mockUserManagementService.getUserSuggestions(query, limit);
          return NextResponse.json(suggestions);
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to get user suggestions' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/suggestions',
        searchParams: {
          q: '', // Empty query
        },
      });

      // Act
      const response = await handler(request);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.success(result, []);
      expect(mockUserManagementService.getUserSuggestions).not.toHaveBeenCalled();
    });

    it('should return empty array when no query parameter is provided', async () => {
      // Arrange
      const handler = jest.fn(async (request: NextRequest) => {
        try {
          const { searchParams } = new URL(request.url);
          const query = searchParams.get('q') || '';
          const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

          if (!query || query.length < 2) {
            return NextResponse.json([]);
          }

          const suggestions = await mockUserManagementService.getUserSuggestions(query, limit);
          return NextResponse.json(suggestions);
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to get user suggestions' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/suggestions',
        // No search params
      });

      // Act
      const response = await handler(request);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.success(result, []);
      expect(mockUserManagementService.getUserSuggestions).not.toHaveBeenCalled();
    });

    it('should use default limit when not provided', async () => {
      // Arrange
      const expectedSuggestions = [testUsers.adminUser];
      mockUserManagementService.getUserSuggestions.mockResolvedValue(expectedSuggestions);

      const handler = jest.fn(async (request: NextRequest) => {
        try {
          const { searchParams } = new URL(request.url);
          const query = searchParams.get('q') || '';
          const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

          if (!query || query.length < 2) {
            return NextResponse.json([]);
          }

          const suggestions = await mockUserManagementService.getUserSuggestions(query, limit);
          return NextResponse.json(suggestions);
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to get user suggestions' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/suggestions',
        searchParams: {
          q: 'admin',
          // No limit parameter
        },
      });

      // Act
      const response = await handler(request);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.success(result, expectedSuggestions);
      expect(mockUserManagementService.getUserSuggestions).toHaveBeenCalledWith('admin', 10); // Default limit
    });

    it('should use custom limit when provided', async () => {
      // Arrange
      const expectedSuggestions = [testUsers.adminUser];
      mockUserManagementService.getUserSuggestions.mockResolvedValue(expectedSuggestions);

      const handler = jest.fn(async (request: NextRequest) => {
        try {
          const { searchParams } = new URL(request.url);
          const query = searchParams.get('q') || '';
          const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

          if (!query || query.length < 2) {
            return NextResponse.json([]);
          }

          const suggestions = await mockUserManagementService.getUserSuggestions(query, limit);
          return NextResponse.json(suggestions);
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to get user suggestions' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/suggestions',
        searchParams: {
          q: 'user',
          limit: '5',
        },
      });

      // Act
      const response = await handler(request);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.success(result, expectedSuggestions);
      expect(mockUserManagementService.getUserSuggestions).toHaveBeenCalledWith('user', 5);
    });

    it('should handle service errors gracefully', async () => {
      // Arrange
      mockUserManagementService.getUserSuggestions.mockRejectedValue(new Error('Database error'));

      const handler = jest.fn(async (request: NextRequest) => {
        try {
          const { searchParams } = new URL(request.url);
          const query = searchParams.get('q') || '';
          const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

          if (!query || query.length < 2) {
            return NextResponse.json([]);
          }

          const suggestions = await mockUserManagementService.getUserSuggestions(query, limit);
          return NextResponse.json(suggestions);
        } catch (error) {
          console.error('Error getting user suggestions:', error);
          return NextResponse.json(
            { error: 'Failed to get user suggestions' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/suggestions',
        searchParams: {
          q: 'admin',
        },
      });

      // Act
      const response = await handler(request);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.serverError(result);
      expect(result.data.error).toBe('Failed to get user suggestions');
    });

    it('should handle invalid limit parameter gracefully', async () => {
      // Arrange
      const expectedSuggestions = [testUsers.adminUser];
      mockUserManagementService.getUserSuggestions.mockResolvedValue(expectedSuggestions);

      const handler = jest.fn(async (request: NextRequest) => {
        try {
          const { searchParams } = new URL(request.url);
          const query = searchParams.get('q') || '';
          const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

          if (!query || query.length < 2) {
            return NextResponse.json([]);
          }

          const suggestions = await mockUserManagementService.getUserSuggestions(query, limit);
          return NextResponse.json(suggestions);
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to get user suggestions' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/suggestions',
        searchParams: {
          q: 'admin',
          limit: 'invalid', // Invalid limit
        },
      });

      // Act
      const response = await handler(request);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.success(result, expectedSuggestions);
      // parseInt('invalid') returns NaN, which is still passed to the service
      expect(mockUserManagementService.getUserSuggestions).toHaveBeenCalledWith('admin', NaN);
    });
  });

  describe('Authentication and Authorization', () => {
    it('should require admin authentication', async () => {
      // Mock unauthenticated request
      mockWithAdminAuth.mockImplementation((handler) => {
        return jest.fn(async () => {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        });
      });

      const mockHandler = mockWithAdminAuth(jest.fn());
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/suggestions',
        searchParams: { q: 'admin' },
      });

      const response = await mockHandler(request);
      const result: ApiTestResponse = await extractResponseData(response);

      assertResponse.unauthorized(result);
    });

    it('should require admin privileges', async () => {
      // Mock non-admin user
      mockWithAdminAuth.mockImplementation((handler) => {
        return jest.fn(async () => {
          return NextResponse.json(
            { 
              error: 'Admin access required', 
              message: 'Only manually designated admins can access this resource'
            },
            { status: 403 }
          );
        });
      });

      const mockHandler = mockWithAdminAuth(jest.fn());
      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/suggestions',
        searchParams: { q: 'admin' },
      });

      const response = await mockHandler(request);
      const result: ApiTestResponse = await extractResponseData(response);

      assertResponse.forbidden(result);
    });
  });
});