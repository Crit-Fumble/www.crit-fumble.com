import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../lib/auth';

// This route uses dynamic features
export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to check session data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({
      session: {
        ...session,
        // Mask sensitive fields for debugging
        email: session.email ? '***@***.***' : null,
      },
      hasRoles: !!session.roles,
      roleCount: session.roles?.length || 0,
      roleIds: session.roles || [],
    });
    
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}