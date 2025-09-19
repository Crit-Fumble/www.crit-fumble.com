/**
 * Discord.js and Discord API Types Re-exports
 * 
 * Re-export commonly used Discord.js types and discord-api-types
 * for consistent usage across the monorepo. Handles naming conflicts with prefixes.
 */

// Re-export Discord.js types (not classes/clients) with conflict resolution
export type {
  User as DiscordUser,
  Channel as DiscordChannel,
  Message as DiscordMessage,
  Guild as DiscordGuild,
  Role as DiscordRole,
  GuildMember as DiscordGuildMember,
  TextChannel as DiscordTextChannel,
  VoiceChannel as DiscordVoiceChannel,
  CategoryChannel as DiscordCategoryChannel,
  DMChannel as DiscordDMChannel,
  ThreadChannel as DiscordThreadChannel,
  Interaction as DiscordInteraction,
  ButtonInteraction as DiscordButtonInteraction,
  SelectMenuInteraction as DiscordSelectMenuInteraction,
  ModalSubmitInteraction as DiscordModalSubmitInteraction,
  ChatInputCommandInteraction as DiscordChatInputCommandInteraction,
  SlashCommandBuilder as DiscordSlashCommandBuilder,
  EmbedBuilder as DiscordEmbedBuilder,
  ActionRowBuilder as DiscordActionRowBuilder,
  ButtonBuilder as DiscordButtonBuilder,
  StringSelectMenuBuilder as DiscordStringSelectMenuBuilder,
  ModalBuilder as DiscordModalBuilder,
  TextInputBuilder as DiscordTextInputBuilder,
  IntentsBitField,
  Partials,
  PresenceStatus,
  GatewayIntentBits,
  PermissionsBitField,
  ButtonStyle,
  TextInputStyle,
  GuildScheduledEventStatus
} from 'discord.js/typings';

// Re-export Discord API types
export {
  ActivityType,
  ChannelType,
  ApplicationCommandType,
  InteractionType,
  ComponentType
} from 'discord-api-types/v10';