/**
 * @crit-fumble/core server exports
 * Contains Node.js server utilities and modules
 */

// Re-export Discord.js Client and runtime classes (not types)
export {
  Client,
  IntentsBitField,
  Partials,
  GuildScheduledEventStatus,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder
} from 'discord.js';

// Re-export OpenAI
export { default as OpenAI } from 'openai';

// Re-export WorldAnvil client
export { WorldAnvilApiClient as WorldAnvilClient } from '@crit-fumble/worldanvil';

// Re-export Prisma client and utilities
export { PrismaClient, Prisma } from '@prisma/client';

// Export all configuration modules (now in models/config)
export * from '../models/config';

// Export services
export * from './services';

// Export controllers
export * from './controllers';
