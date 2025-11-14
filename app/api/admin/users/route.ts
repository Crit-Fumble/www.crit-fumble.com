/**
 * Admin Users API Endpoint
 * 
 * Provides user listing for admin management.
 * Requires admin authentication via database admin flag.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@crit-fumble/core';
import { getSession } from '../../../lib/auth';

// GET /api/admin/users - List users with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getSession();
    if (!session?.admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000); // Max 1000
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause for search
    const whereClause = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { discord_id: { contains: search } }
      ]
    } : {};

    // Get total count
    const totalCount = await prisma.user.count({ where: whereClause });

    // Get users with pagination
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        discord_id: true,
        name: true,
        email: true,
        image: true,
        admin: true,
        createdAt: true,
        updatedAt: true,
        data: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    return NextResponse.json({
      users: users.map(user => ({
        id: user.id,
        discord_id: user.discord_id,
        name: user.name,
        email: user.email,
        image: user.image,
        admin: user.admin,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        discord_data: (user.data as any)?.discord || null
      })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error listing users:', error);
    return NextResponse.json(
      { error: 'Failed to list users' },
      { status: 500 }
    );
  }
}