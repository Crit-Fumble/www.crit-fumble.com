/**
 * Authentication and session types - extracted from @crit-fumble/core
 * Pure TypeScript interfaces with no dependencies
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

// Default context value
export const defaultSessionContext: SessionContextValue = {
  data: null,
  status: 'loading'
};