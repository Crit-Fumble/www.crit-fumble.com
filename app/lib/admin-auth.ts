/**
 * Admin Authentication Middleware
 * 
 * Provides middleware to protect admin routes and verify that users have
 * the admin flag set to true in the database. This ensures only manually
 * designated admins can access administrative functions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './auth';

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  admin: boolean;
}

/**
 * Middleware to protect admin routes
 * Checks if user is authenticated and has admin privileges in the database
 */
export function withAdminAuth<T extends Record<string, any> = {}>(
  handler: (request: NextRequest, context: { params: T }, user: AdminUser) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: { params: T }): Promise<NextResponse> => {
    try {
      // Get current user session
      const session = await getSession();
      
      if (!session) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Check if user has admin flag in database
      if (!session.admin) {
        return NextResponse.json(
          { 
            error: 'Admin access required', 
            message: 'Only manually designated admins can access this resource'
          },
          { status: 403 }
        );
      }

      const adminUser: AdminUser = {
        id: session.id,
        name: session.name,
        email: session.email,
        admin: session.admin
      };

      // Call the protected handler with admin user
      return await handler(request, context, adminUser);

    } catch (error) {
      console.error('Admin auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

/**
 * Check if current user is admin (for client-side use)
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const session = await getSession();
    return session?.admin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get current admin user (for client-side use)
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const session = await getSession();
    
    if (!session?.admin) {
      return null;
    }

    return {
      id: session.id,
      name: session.name,
      email: session.email,
      admin: session.admin
    };
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
}