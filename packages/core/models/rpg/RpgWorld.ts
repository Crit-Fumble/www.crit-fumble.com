import { RpgWorld as PrismaRpgWorld } from '@prisma/client';
import { WorldAnvilWorld } from '@crit-fumble/worldanvil/models';

/**
 * Combined world data from our database and World Anvil
 */
export interface RpgWorld extends PrismaRpgWorld {
  worldAnvilData?: WorldAnvilWorld;
}

/**
 * Input for creating a new RPG World
 */
export interface CreateRpgWorldInput {
  title: string;
  slug?: string;
  summary?: string;
  description?: string;
  rpg_system_id?: string;
  gm_ids?: string[];
  worldanvil_world_id?: string;
  discord_post_id?: string;
  discord_chat_id?: string;
  discord_thread_id?: string;
  discord_forum_id?: string;
  discord_voice_id?: string;
  discord_role_id?: string;
  is_active?: boolean;
  data?: any;
}

/**
 * Input for updating an RPG World
 */
export interface UpdateRpgWorldInput {
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  rpg_system_id?: string;
  gm_ids?: string[];
  worldanvil_world_id?: string;
  discord_post_id?: string;
  discord_chat_id?: string;
  discord_thread_id?: string;
  discord_forum_id?: string;
  discord_voice_id?: string;
  discord_role_id?: string;
  is_active?: boolean;
  data?: any;
}