/**
 * Discord API Types Re-exports
 * 
 * Re-export commonly used Discord API types for consistent usage across the monorepo.
 * For discord.js classes and interfaces, import directly from 'discord.js' in your code.
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