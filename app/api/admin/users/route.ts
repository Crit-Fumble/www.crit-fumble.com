/**
 * Admin Users API Endpoint
 * 
 * Provides CRUD operations for user management.
 * Requires admin authentication via database admin flag.
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserManagementService } from '@crit-fumble/core/server/services';
import { withAdminAuth } from '../../../lib/admin-auth';

// GET /api/admin/users - List users with filtering and pagination
export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    
    const filter = {
      search: searchParams.get('search') || undefined,
      admin: searchParams.get('admin') ? searchParams.get('admin') === 'true' : undefined,
      hasDiscord: searchParams.get('hasDiscord') ? searchParams.get('hasDiscord') === 'true' : undefined,
      hasWorldAnvil: searchParams.get('hasWorldAnvil') ? searchParams.get('hasWorldAnvil') === 'true' : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    };

    const userService = new UserManagementService();
    const result = await userService.listUsers(filter);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error listing users:', error);
    return NextResponse.json(
      { error: 'Failed to list users' },
      { status: 500 }
    );
  }
});

// POST /api/admin/users - Create new user
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    const userService = new UserManagementService();
    
    // Validate email uniqueness if provided
    if (body.email) {
      const emailTaken = await userService.isEmailTaken(body.email);
      if (emailTaken) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        );
      }
    }

    // Validate slug uniqueness if provided
    if (body.slug) {
      const slugTaken = await userService.isSlugTaken(body.slug);
      if (slugTaken) {
        return NextResponse.json(
          { error: 'Slug is already in use' },
          { status: 400 }
        );
      }
    }

    const user = await userService.createUser(body);

    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
});