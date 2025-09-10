// Discord Model Type Definitions
// This file exports shared types used by both the Discord bot and the Next.js web app

import { User, Guild, GuildMember, Channel, APIUser, Collection, Activity } from 'discord.js';

// Re-export discord.js types
export type DiscordUserType = User;
export type DiscordAPIUserType = APIUser;
export type DiscordGuildType = Guild;
export type DiscordGuildMemberType = GuildMember;
export type DiscordChannelType = Channel;

// Simple interface for Discord data
export interface DiscordGuild {
  id: string;
  name: string;
  icon?: string;
  owner_id: string;
}

export interface DiscordChannel {
  id: string;
  type: number;
  guild_id?: string;
  name?: string;
  topic?: string;
  parent_id?: string;
}

// Bot command interface
export interface CommandOptions {
  name: string;
  description: string;
  type: number;
  options?: CommandOption[];
}

export interface CommandOption {
  name: string;
  description: string;
  type: number;
  required?: boolean;
  choices?: CommandChoice[];
}

export interface CommandChoice {
  name: string;
  value: string | number;
}

// Bot event and scheduled event interfaces
export interface GuildScheduledEvent {
  id: string;
  guild_id: string;
  channel_id: string | null;
  creator_id?: string;
  name: string;
  description?: string;
  scheduled_start_time: string; // ISO date
  scheduled_end_time?: string; // ISO date
  status: GuildScheduledEventStatus;
  entity_type: GuildScheduledEventEntityType;
  entity_id?: string;
  creator?: DiscordUser;
}

export enum GuildScheduledEventStatus {
  Scheduled = 1,
  Active = 2,
  Completed = 3,
  Cancelled = 4,
}

export enum GuildScheduledEventEntityType {
  StageInstance = 1,
  Voice = 2,
  External = 3,
}

// API response interface for communication between bot and Next.js
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Discord Activity interfaces
export interface DiscordActivity {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'development';
  metadata?: Record<string, any>;
}

export interface ActivityRequest {
  activity: string;
  action: string;
  data?: any;
  userId?: string;
  guildId?: string;
  channelId?: string;
  timestamp?: string;
}

export interface ActivityResponse {
  activity: string;
  action: string;
  result: any;
  processed: boolean;
  timestamp: string;
  error?: string;
}
