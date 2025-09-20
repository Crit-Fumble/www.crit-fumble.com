/**
 * Admin Individual User API Endpoint
 * 
 * Provides CRUD operations for individual users.
 * Requires admin authentication via database admin flag.
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserManagementService } from '@crit-fumble/core/server/services';
import { withAdminAuth } from '../../../../lib/admin-auth';

// GET /api/admin/users/[id] - Get user by ID
export const GET = withAdminAuth(async (
  request: NextRequest,
  adminUser: any,
  { params }: { params: { id: string } }
) => {
  try {
    const userService = new UserManagementService();
    const user = await userService.getUserById(params.id);

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

// PUT /api/admin/users/[id] - Update user
export const PUT = withAdminAuth(async (
  request: NextRequest,
  adminUser: any,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json();
    const userService = new UserManagementService();

    // Check if user exists
    const existingUser = await userService.getUserById(params.id);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate email uniqueness if provided
    if (body.email && body.email !== existingUser.email) {
      const emailTaken = await userService.isEmailTaken(body.email, params.id);
      if (emailTaken) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        );
      }
    }

    // Validate slug uniqueness if provided
    if (body.slug && body.slug !== existingUser.slug) {
      const slugTaken = await userService.isSlugTaken(body.slug, params.id);
      if (slugTaken) {
        return NextResponse.json(
          { error: 'Slug is already in use' },
          { status: 400 }
        );
      }
    }

    const updatedUser = await userService.updateUser(params.id, body);

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
});

// DELETE /api/admin/users/[id] - Delete user
export const DELETE = withAdminAuth(async (
  request: NextRequest,
  adminUser: any,
  { params }: { params: { id: string } }
) => {
  try {
    const userService = new UserManagementService();

    // Check if user exists
    const existingUser = await userService.getUserById(params.id);
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

    const deletedUser = await userService.deleteUser(params.id);

    return NextResponse.json(deletedUser);

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
});