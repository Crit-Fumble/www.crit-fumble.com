/**
 * RPG Sheet Model
 * 
 * Simple type definitions for RPG Sheet model
 */

import { RpgSheet as PrismaRpgSheet } from '@prisma/client';

export interface RpgSheetData {
  [key: string]: any;
}

/**
 * Extended RPG Sheet type that includes the base Prisma data
 */
export interface RpgSheet extends PrismaRpgSheet {
  // Optional computed/parsed data
  parsedData?: RpgSheetData;
  computedData?: RpgSheetData;
}

/**
 * Input for creating a new RPG Sheet
 */
export interface CreateRpgSheetInput {
  title: string;
  summary?: string;
  rpg_system_id?: string;
  rpg_character_id?: string;
  rpg_party_id?: string;
  rpg_campaign_id?: string;
  rpg_world_id?: string;
  data?: RpgSheetData;
}

/**
 * Input for updating an RPG Sheet
 */
export interface UpdateRpgSheetInput {
  title?: string;
  summary?: string;
  data?: RpgSheetData;
  worldanvil_block_id?: string;
  discord_post_id?: string;
  discord_thread_id?: string;
  is_active?: boolean;
}