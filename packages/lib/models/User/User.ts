/**
 * User model interface representing a user in the system
 */

export interface User {
  id: string;
  name?: string | null;
  slug?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  admin?: boolean | null;
  discord?: string | null;
  roll20?: string | null;
  dd_beyond?: string | null;
  world_anvil?: string | null;
  sheet_data?: any; // JSON data
}

/**
 * User data interface that includes related data
 * Used by the UserDataProvider
 */
export interface UserData {
  user: User | null;
  campaigns?: Campaign[];
  characters?: Character[];
}

export interface Campaign {
  id: string;
  name: string;
  description?: string | null;
  // Add other campaign properties as needed
}

/**
 * Type guard to check if an object is a valid User
 */
export function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string'
  );
}

/**
 * Type guard to check if an object is a valid partial User
 */
export function isPartialUser(obj: any): obj is Partial<User> {
  return (
    obj &&
    typeof obj === 'object' &&
    (
      (obj.id !== undefined && typeof obj.id === 'string') ||
      (obj.email !== undefined && (typeof obj.email === 'string' || obj.email === null))
    )
  );
}

// Re-export Character type to avoid circular dependencies
import type { Character } from '../Character';
