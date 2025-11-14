import { NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';

/**
 * Test endpoint to check current session data
 * DEVELOPMENT ONLY - will be removed
 */
export async function GET() {
  // Security: Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      error: 'Test endpoints are disabled in production'
    }, { status: 404 });
  }

  try {
    const session = await getSession();
    
    return NextResponse.json({
      session: session,
      hasSession: !!session,
      isAdmin: session?.admin || false,
      userId: session?.id || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json({
      error: 'Failed to get session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}