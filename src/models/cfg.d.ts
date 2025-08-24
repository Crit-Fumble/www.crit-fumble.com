/**
 * Central type definitions for the application
 * These types extend the Prisma-generated types with additional fields needed for the frontend
 */
import { DiscordProfile } from "next-auth/providers/discord"
import { 
  User as PrismaUser,
  Character as PrismaCharacter,
  Campaign as PrismaCampaign,
  CampaignWorldAnvil as PrismaCampaignWorldAnvil,
  CampaignDiscord as PrismaCampaignDiscord,
  Party as PrismaParty,
  PartyDiscord as PrismaPartyDiscord,
  PartyDndBeyond as PrismaPartyDndBeyond,
  PartyRoll20 as PrismaPartyRoll20,
  GameSystem,
  GameSession,
  UserDiscord,
  UserDndBeyond,
  UserRoll20,
  UserWorldAnvil
} from '@prisma/client';

// Re-export Prisma types for convenience
export type {
  PrismaUser,
  PrismaCharacter,
  PrismaCampaign,
  PrismaCampaignWorldAnvil,
  PrismaCampaignDiscord,
  PrismaParty,
  PrismaPartyDiscord,
  PrismaPartyDndBeyond,
  PrismaPartyRoll20,
  GameSystem,
  GameSession,
  UserDiscord,
  UserDndBeyond,
  UserRoll20,
  UserWorldAnvil
};

// Extending types with frontend-specific properties
export type User = PrismaUser & {
  token?: string;
  discord?: DiscordProfile;
};

export type System = GameSystem;

export type Campaign = PrismaCampaign & {
  worldAnvil?: {
    id: string;
    name: string;
    slug: string;
    worldMapId?: string;
    chronicleId?: string;
    chronicleSlug?: string;
  };
  discord?: {
    id?: string;
    fumbleBotId?: string;
    playerRoles?: string[];
    botRoles?: string[];
    voiceChannelId?: string;
    chatChannelId?: string;
    chatThreadId?: string;
    forumChannelId?: string;
    playByPostChannelId?: string;
    playByPostThreadId?: string;
  };
};

export type Party = PrismaParty & {
  playtime?: {
    day: string;
    times?: string[];
  };
  dndBeyond?: {
    id: string;
    join?: string;
  };
  roll20?: {
    id: string;
    join?: string;
  };
  discord?: {
    roleId: string;
    voiceChannelId: string;
    sideChatThreadId: string;
    questLogThreadId: string;
    gameplayThreadId: string;
  };
};

// The Character model doesn't have createdAt/updatedAt fields in Prisma schema
export type Character = PrismaCharacter & {
  // Characters use direct fields in the database:
  // - dnd_beyond_id: String field for D&D Beyond IDs
  // - world_anvil_id: String field for World Anvil IDs
  // - pdf_url: String field for PDF URLs
  // - sheet_data: JSON field for storing flexible data
};