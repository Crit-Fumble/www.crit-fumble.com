/**
 * Admin User Suggestions API Endpoint
 * 
 * Provides autocomplete suggestions for user selection.
 * Requires admin authentication via database admin flag.
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserManagementService } from '@crit-fumble/core/server/services';
import { withAdminAuth } from '../../../../lib/admin-auth';

// GET /api/admin/users/suggestions - Get user suggestions for autocomplete
export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const userService = new UserManagementService();
    const suggestions = await userService.getUserSuggestions(query, limit);

    return NextResponse.json(suggestions);

  } catch (error) {
    console.error('Error getting user suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to get user suggestions' },
      { status: 500 }
    );
  }
});