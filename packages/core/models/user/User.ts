/**
 * Implementation for User-related functions and utilities
 */

import { User } from './User';

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
