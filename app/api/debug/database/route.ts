import { NextResponse } from 'next/server';
import { PrismaClient } from '@crit-fumble/core';

const prisma = new PrismaClient();

/**
 * Debug endpoint to check database users
 * DEVELOPMENT ONLY - disabled in production for security
 */
export async function GET() {
  // Security: Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      error: 'Debug endpoints are disabled in production'
    }, { status: 404 });
  }

  try {
    // Get basic user count and some sample data
    const totalUsers = await prisma.user.count();
    
    const users = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        discord_id: true,
        name: true,
        email: true,
        admin: true,
        createdAt: true,
        data: true
      }
    });

    return NextResponse.json({
      totalUsers,
      sampleUsers: users,
      debug: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    });

  } catch (error) {
    console.error('Error checking database users:', error);
    return NextResponse.json({
      error: 'Failed to check database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}