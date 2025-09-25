/**
 * Admin User Management API Endpoint
 * 
 * Provides CRUD operations for individual user management.
 * Requires admin authentication via database admin flag.
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserManagementService } from '@crit-fumble/core/server/services';
import { withAdminAuth, AdminUser } from '../../../../lib/admin-auth';

// GET /api/admin/users/[id] - Get specific user
async function handleGetUser(
  request: NextRequest,
  context: { params: { id: string } },
  user: AdminUser
) {
  try {
    const userId = context.params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const userService = new UserManagementService();
    const userData = await userService.getUserById(userId);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: userData });

  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Update user
async function handleUpdateUser(
  request: NextRequest,
  context: { params: { id: string } },
  adminUser: AdminUser
) {
  try {
    const userId = context.params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    
    // Validate required fields if provided
    if (updateData.email && typeof updateData.email !== 'string') {
      return NextResponse.json(
        { error: 'Email must be a string' },
        { status: 400 }
      );
    }
    
    if (updateData.name && typeof updateData.name !== 'string') {
      return NextResponse.json(
        { error: 'Name must be a string' },
        { status: 400 }
      );
    }
    
    if (updateData.admin !== undefined && typeof updateData.admin !== 'boolean') {
      return NextResponse.json(
        { error: 'Admin flag must be a boolean' },
        { status: 400 }
      );
    }

    const userService = new UserManagementService();
    const updatedUser = await userService.updateUser(userId, {
      name: updateData.name,
      email: updateData.email,
      admin: updateData.admin
    });
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'User updated successfully',
      user: updatedUser 
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
async function handleDeleteUser(
  request: NextRequest,
  context: { params: { id: string } },
  adminUser: AdminUser
) {
  try {
    const userId = context.params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Prevent admins from deleting themselves
    if (userId === adminUser.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own admin account' },
        { status: 400 }
      );
    }

    const userService = new UserManagementService();
    const deletedUser = await userService.deleteUser(userId);
    
    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'User deleted successfully',
      user: deletedUser 
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

// Export the wrapped handlers
export const GET = withAdminAuth(handleGetUser);
export const PUT = withAdminAuth(handleUpdateUser);
export const DELETE = withAdminAuth(handleDeleteUser);