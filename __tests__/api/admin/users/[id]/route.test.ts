/**
 * Admin Individual User API Route Tests
 * 
 * Unit tests for /api/admin/users/[id] endpoints with dependency injection
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

describe('/api/admin/users/[id] route', () => {
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
      return jest.fn(async (request: NextRequest, adminUser: any, context: any) => {
        return handler(request, mockAdminUser, context);
      });
    });
  });

  describe('GET /api/admin/users/[id]', () => {
    it('should get user by ID successfully', async () => {
      // Arrange
      mockUserManagementService.getUserById.mockResolvedValue(testUsers.regularUser);

      const handler = jest.fn(async (
        request: NextRequest,
        adminUser: any,
        { params }: { params: { id: string } }
      ) => {
        try {
          const user = await mockUserManagementService.getUserById(params.id);

          if (!user) {
            return NextResponse.json(
              { error: 'User not found' },
              { status: 404 }
            );
          }

          return NextResponse.json(user);
        } catch (error) {
          console.error('Error getting user:', error);
          return NextResponse.json(
            { error: 'Failed to get user' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/regular-user-id',
      });

      const context = { params: { id: 'regular-user-id' } };

      // Act
      const response = await handler(request, mockAdminUser, context);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.success(result, testUsers.regularUser);
      expect(mockUserManagementService.getUserById).toHaveBeenCalledWith('regular-user-id');
    });

    it('should return 404 when user is not found', async () => {
      // Arrange
      mockUserManagementService.getUserById.mockResolvedValue(null);

      const handler = jest.fn(async (
        request: NextRequest,
        adminUser: any,
        { params }: { params: { id: string } }
      ) => {
        try {
          const user = await mockUserManagementService.getUserById(params.id);

          if (!user) {
            return NextResponse.json(
              { error: 'User not found' },
              { status: 404 }
            );
          }

          return NextResponse.json(user);
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to get user' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/nonexistent-id',
      });

      const context = { params: { id: 'nonexistent-id' } };

      // Act
      const response = await handler(request, mockAdminUser, context);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.notFound(result);
      expect(result.data.error).toBe('User not found');
    });

    it('should handle service errors gracefully', async () => {
      // Arrange
      mockUserManagementService.getUserById.mockRejectedValue(new Error('Database error'));

      const handler = jest.fn(async (
        request: NextRequest,
        adminUser: any,
        { params }: { params: { id: string } }
      ) => {
        try {
          const user = await mockUserManagementService.getUserById(params.id);
          return NextResponse.json(user);
        } catch (error) {
          console.error('Error getting user:', error);
          return NextResponse.json(
            { error: 'Failed to get user' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'GET',
        url: 'http://localhost:3000/api/admin/users/regular-user-id',
      });

      const context = { params: { id: 'regular-user-id' } };

      // Act
      const response = await handler(request, mockAdminUser, context);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.serverError(result);
      expect(result.data.error).toBe('Failed to get user');
    });
  });

  describe('PUT /api/admin/users/[id]', () => {
    it('should update user successfully', async () => {
      // Arrange
      const updateData = { name: 'Updated Name', email: 'updated@example.com' };
      const updatedUser = { ...testUsers.regularUser, ...updateData };
      
      mockUserManagementService.getUserById.mockResolvedValue(testUsers.regularUser);
      mockUserManagementService.isEmailTaken.mockResolvedValue(false);
      mockUserManagementService.updateUser.mockResolvedValue(updatedUser);

      const handler = jest.fn(async (
        request: NextRequest,
        adminUser: any,
        { params }: { params: { id: string } }
      ) => {
        try {
          const body = await request.json();

          // Check if user exists
          const existingUser = await mockUserManagementService.getUserById(params.id);
          if (!existingUser) {
            return NextResponse.json(
              { error: 'User not found' },
              { status: 404 }
            );
          }

          // Validate email uniqueness if provided
          if (body.email && body.email !== existingUser.email) {
            const emailTaken = await mockUserManagementService.isEmailTaken(body.email, params.id);
            if (emailTaken) {
              return NextResponse.json(
                { error: 'Email is already in use' },
                { status: 400 }
              );
            }
          }

          // Validate slug uniqueness if provided
          if (body.slug && body.slug !== existingUser.slug) {
            const slugTaken = await mockUserManagementService.isSlugTaken(body.slug, params.id);
            if (slugTaken) {
              return NextResponse.json(
                { error: 'Slug is already in use' },
                { status: 400 }
              );
            }
          }

          const updatedUser = await mockUserManagementService.updateUser(params.id, body);
          return NextResponse.json(updatedUser);
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/admin/users/regular-user-id',
        body: updateData,
      });

      const context = { params: { id: 'regular-user-id' } };

      // Act
      const response = await handler(request, mockAdminUser, context);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.success(result, updatedUser);
      expect(mockUserManagementService.getUserById).toHaveBeenCalledWith('regular-user-id');
      expect(mockUserManagementService.isEmailTaken).toHaveBeenCalledWith('updated@example.com', 'regular-user-id');
      expect(mockUserManagementService.updateUser).toHaveBeenCalledWith('regular-user-id', updateData);
    });

    it('should return 404 when trying to update non-existent user', async () => {
      // Arrange
      mockUserManagementService.getUserById.mockResolvedValue(null);

      const handler = jest.fn(async (
        request: NextRequest,
        adminUser: any,
        { params }: { params: { id: string } }
      ) => {
        try {
          const body = await request.json();
          const existingUser = await mockUserManagementService.getUserById(params.id);
          
          if (!existingUser) {
            return NextResponse.json(
              { error: 'User not found' },
              { status: 404 }
            );
          }

          const updatedUser = await mockUserManagementService.updateUser(params.id, body);
          return NextResponse.json(updatedUser);
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/admin/users/nonexistent-id',
        body: { name: 'Updated Name' },
      });

      const context = { params: { id: 'nonexistent-id' } };

      // Act
      const response = await handler(request, mockAdminUser, context);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.notFound(result);
      expect(result.data.error).toBe('User not found');
      expect(mockUserManagementService.updateUser).not.toHaveBeenCalled();
    });

    it('should reject update when email is already taken', async () => {
      // Arrange
      const updateData = { email: 'taken@example.com' };
      
      mockUserManagementService.getUserById.mockResolvedValue(testUsers.regularUser);
      mockUserManagementService.isEmailTaken.mockResolvedValue(true);

      const handler = jest.fn(async (
        request: NextRequest,
        adminUser: any,
        { params }: { params: { id: string } }
      ) => {
        try {
          const body = await request.json();
          const existingUser = await mockUserManagementService.getUserById(params.id);
          
          if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
          }

          if (body.email && body.email !== existingUser.email) {
            const emailTaken = await mockUserManagementService.isEmailTaken(body.email, params.id);
            if (emailTaken) {
              return NextResponse.json(
                { error: 'Email is already in use' },
                { status: 400 }
              );
            }
          }

          const updatedUser = await mockUserManagementService.updateUser(params.id, body);
          return NextResponse.json(updatedUser);
        } catch (error) {
          return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
        }
      });

      const request = createMockNextRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/admin/users/regular-user-id',
        body: updateData,
      });

      const context = { params: { id: 'regular-user-id' } };

      // Act
      const response = await handler(request, mockAdminUser, context);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.badRequest(result, 'Email is already in use');
      expect(mockUserManagementService.updateUser).not.toHaveBeenCalled();
    });

    it('should reject update when slug is already taken', async () => {
      // Arrange
      const updateData = { slug: 'taken-slug' };
      
      mockUserManagementService.getUserById.mockResolvedValue(testUsers.regularUser);
      mockUserManagementService.isSlugTaken.mockResolvedValue(true);

      const handler = jest.fn(async (
        request: NextRequest,
        adminUser: any,
        { params }: { params: { id: string } }
      ) => {
        try {
          const body = await request.json();
          const existingUser = await mockUserManagementService.getUserById(params.id);
          
          if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
          }

          if (body.slug && body.slug !== existingUser.slug) {
            const slugTaken = await mockUserManagementService.isSlugTaken(body.slug, params.id);
            if (slugTaken) {
              return NextResponse.json(
                { error: 'Slug is already in use' },
                { status: 400 }
              );
            }
          }

          const updatedUser = await mockUserManagementService.updateUser(params.id, body);
          return NextResponse.json(updatedUser);
        } catch (error) {
          return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
        }
      });

      const request = createMockNextRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/admin/users/regular-user-id',
        body: updateData,
      });

      const context = { params: { id: 'regular-user-id' } };

      // Act
      const response = await handler(request, mockAdminUser, context);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.badRequest(result, 'Slug is already in use');
      expect(mockUserManagementService.updateUser).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/admin/users/[id]', () => {
    it('should delete user successfully', async () => {
      // Arrange
      mockUserManagementService.getUserById.mockResolvedValue(testUsers.regularUser);
      mockUserManagementService.deleteUser.mockResolvedValue(testUsers.regularUser);

      const handler = jest.fn(async (
        request: NextRequest,
        adminUser: any,
        { params }: { params: { id: string } }
      ) => {
        try {
          // Check if user exists
          const existingUser = await mockUserManagementService.getUserById(params.id);
          if (!existingUser) {
            return NextResponse.json(
              { error: 'User not found' },
              { status: 404 }
            );
          }

          // Prevent deleting yourself
          if (params.id === adminUser.id) {
            return NextResponse.json(
              { error: 'Cannot delete your own account' },
              { status: 400 }
            );
          }

          const deletedUser = await mockUserManagementService.deleteUser(params.id);
          return NextResponse.json(deletedUser);
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
          );
        }
      });

      const request = createMockNextRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/admin/users/regular-user-id',
      });

      const context = { params: { id: 'regular-user-id' } };

      // Act
      const response = await handler(request, mockAdminUser, context);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.success(result, testUsers.regularUser);
      expect(mockUserManagementService.getUserById).toHaveBeenCalledWith('regular-user-id');
      expect(mockUserManagementService.deleteUser).toHaveBeenCalledWith('regular-user-id');
    });

    it('should return 404 when trying to delete non-existent user', async () => {
      // Arrange
      mockUserManagementService.getUserById.mockResolvedValue(null);

      const handler = jest.fn(async (
        request: NextRequest,
        adminUser: any,
        { params }: { params: { id: string } }
      ) => {
        try {
          const existingUser = await mockUserManagementService.getUserById(params.id);
          if (!existingUser) {
            return NextResponse.json(
              { error: 'User not found' },
              { status: 404 }
            );
          }

          const deletedUser = await mockUserManagementService.deleteUser(params.id);
          return NextResponse.json(deletedUser);
        } catch (error) {
          return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
        }
      });

      const request = createMockNextRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/admin/users/nonexistent-id',
      });

      const context = { params: { id: 'nonexistent-id' } };

      // Act
      const response = await handler(request, mockAdminUser, context);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.notFound(result);
      expect(mockUserManagementService.deleteUser).not.toHaveBeenCalled();
    });

    it('should prevent admin from deleting their own account', async () => {
      // Arrange
      mockUserManagementService.getUserById.mockResolvedValue(testUsers.adminUser);

      const handler = jest.fn(async (
        request: NextRequest,
        adminUser: any,
        { params }: { params: { id: string } }
      ) => {
        try {
          const existingUser = await mockUserManagementService.getUserById(params.id);
          if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
          }

          // Prevent deleting yourself
          if (params.id === adminUser.id) {
            return NextResponse.json(
              { error: 'Cannot delete your own account' },
              { status: 400 }
            );
          }

          const deletedUser = await mockUserManagementService.deleteUser(params.id);
          return NextResponse.json(deletedUser);
        } catch (error) {
          return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
        }
      });

      const request = createMockNextRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/admin/users/admin-user-id',
      });

      const context = { params: { id: testUsers.adminUser.id } };

      // Act
      const response = await handler(request, mockAdminUser, context);
      const result: ApiTestResponse = await extractResponseData(response);

      // Assert
      assertResponse.badRequest(result, 'Cannot delete your own account');
      expect(mockUserManagementService.deleteUser).not.toHaveBeenCalled();
    });
  });
});