import { cookies } from 'next/headers';

export interface Session {
  userId: string;
  username: string;
  email?: string;
  avatar?: string;
}

/**
 * Get the current user session from cookies
 */
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('fumble-session');
    
    if (!sessionCookie?.value) {
      return null;
    }
    
    const session = JSON.parse(sessionCookie.value);
    return session;
  } catch (error) {
    console.error('Error parsing session cookie:', error);
    return null;
  }
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}