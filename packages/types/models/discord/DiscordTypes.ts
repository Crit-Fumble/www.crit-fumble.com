/**
 * Discord-specific types - extracted from @crit-fumble/core
 * Pure TypeScript interfaces with no dependencies
 */

// Re-export Discord API enums and constants
export {
  ActivityType,
  ChannelType,
  ApplicationCommandType,
  InteractionType,
  ComponentType,
  ButtonStyle,
  TextInputStyle,
  GuildScheduledEventStatus,
  GatewayIntentBits,
  PermissionFlagsBits as PermissionsBitField
} from 'discord-api-types/v10';

// Custom Discord event types for our application
export interface ScheduledEventData {
  id: string;
  name: string;
  description?: string;
  scheduledStartTime: Date;
  scheduledEndTime?: Date;
  status: string;
  guildId: string;
  channelId?: string;
  creatorId: string;
}

export interface GuildEventNotification {
  eventId: string;
  guildId: string;
  type: 'starting' | 'started' | 'ended' | 'cancelled';
  timestamp: Date;
}