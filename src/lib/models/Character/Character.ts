/**
 * Base Character interface representing a character in the system
 * Note: Character-to-Party and Character-to-Campaign relations are managed by the Party table
 */

import { GameSheet } from "../Compendium";

export interface CharacterSheet extends GameSheet {
    id: string;
    character_id: string;
}

export interface Character {
  id: string;
  name: string | null;
  slug: string | null;
  player: string | null;
  title?: string | null;
  description?: string | null;
  summary?: string | null;
  portrait_url?: string | null;
  token_url?: string | null;
  created_at?: Date;
  updated_at?: Date;
  sheets?: CharacterSheet[];
}

/**
 * Type guard to check if an object is a valid Character
 */
export function isCharacter(obj: any): obj is Character {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    (obj.name === null || typeof obj.name === 'string') &&
    (obj.slug === null || typeof obj.slug === 'string') &&
    (obj.player === null || typeof obj.player === 'string')
  );
}

/**
 * Type guard to check if an object is a valid partial Character
 * This is useful when we're not sure if we have a complete Character object
 */
export function isPartialCharacter(obj: any): obj is Partial<Character> {
  return (
    obj &&
    typeof obj === 'object' &&
    (
      (obj.id !== undefined && typeof obj.id === 'string') ||
      (obj.slug !== undefined && typeof obj.slug === 'string')
    )
  );
}
