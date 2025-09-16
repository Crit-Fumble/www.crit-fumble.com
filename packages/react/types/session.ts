/**
 * Generic session interfaces for framework-agnostic authentication
 * These can be implemented by Next.js (NextAuth), React Native, etc.
 */

export interface SessionUser {
  id: string;
  email?: string;
  name?: string;
  image?: string;
}

export interface AuthSession {
  user?: SessionUser;
  expires?: string;
}

export interface SessionContextValue {
  data: AuthSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update?: (data?: any) => Promise<AuthSession | null>;
}

export interface SessionProviderProps {
  children: React.ReactNode;
  session?: AuthSession | null;
}

// Default context value
export const defaultSessionContext: SessionContextValue = {
  data: null,
  status: 'loading'
};