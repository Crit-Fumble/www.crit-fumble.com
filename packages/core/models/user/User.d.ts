/**
 * User model interface representing a user in the system
 */

import { DiscordOAuthProfile } from "@crit-fumble/discord/models";
import { User as PrismaUser } from '@prisma/client';
import { Campaign } from '../campaign';
import { Character } from '../character';

// External service data now comes from services instead of database models
// Extending types with frontend-specific properties
export type User = PrismaUser & {
  token?: string;
  discord?: DiscordOAuthProfile;
};

/**
 * User data interface that includes related data
 * Used by the UserDataProvider
 */
export interface UserData {
  user: User | null;
  campaigns?: Campaign[];
  characters?: Character[];
}

/**
 * Type guard to check if an object is a valid User
 */
export function isUser(obj: any): obj is User;

/**
 * Type guard to check if an object is a valid partial User
 */
export function isPartialUser(obj: any): obj is Partial<User>;