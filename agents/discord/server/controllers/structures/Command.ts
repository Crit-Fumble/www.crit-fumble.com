import { 
  ApplicationCommandType, 
  CommandInteraction, 
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
  ApplicationCommandData,
  PermissionResolvable,
  PermissionsBitField,
  ApplicationCommandOptionData
} from 'discord.js';
import { DiscordBotServer } from '../../DiscordBotServer';

export interface CommandOptions {
  name: string;
  description: string;
  type: ApplicationCommandType;
  options?: ApplicationCommandOptionData[];
  permissions?: PermissionResolvable[];
  defaultMemberPermissions?: PermissionResolvable;
  dmPermission?: boolean;
  cooldown?: number;
  ownerOnly?: boolean;
  guildOnly?: boolean;
  nsfw?: boolean;
}

export interface CommandExecuteOptions {
  interaction: CommandInteraction;
  client: DiscordBotServer;
}

/**
 * Base class for Discord bot commands
 */
export abstract class Command {
  public readonly client: DiscordBotServer;
  public readonly options: CommandOptions;
  
  constructor(client: DiscordBotServer, options: CommandOptions) {
    this.client = client;
    this.options = options;
  }

  /**
   * Execute the command
   */
  abstract execute(options: CommandExecuteOptions): Promise<void> | void;

  /**
   * Check if user has permission to use this command
   */
  hasPermission(interaction: CommandInteraction): boolean {
    // Owner check
    if (this.options.ownerOnly) {
      const ownerId = this.client.config.bot.ownerIds;
      if (!ownerId.includes(interaction.user.id)) {
        return false;
      }
    }

    // Guild only check
    if (this.options.guildOnly && !interaction.guild) {
      return false;
    }

    // Permission check
    if (this.options.permissions && interaction.guild && interaction.member) {
      const member = interaction.member;
      if ('permissions' in member && member.permissions instanceof PermissionsBitField) {
        return member.permissions.has(this.options.permissions);
      }
    }

    return true;
  }

  /**
   * Get command data for Discord API registration
   */
  getCommandData(): ApplicationCommandData {
    return {
      name: this.options.name,
      description: this.options.description,
      type: this.options.type,
      options: this.options.options,
      defaultMemberPermissions: this.options.defaultMemberPermissions,
      dmPermission: this.options.dmPermission,
      nsfw: this.options.nsfw
    };
  }
}

/**
 * Chat input command (slash command)
 */
export abstract class ChatInputCommand extends Command {
  constructor(client: DiscordBotServer, options: Omit<CommandOptions, 'type'>) {
    super(client, { ...options, type: ApplicationCommandType.ChatInput });
  }

  abstract execute(options: { 
    interaction: ChatInputCommandInteraction; 
    client: DiscordBotServer; 
  }): Promise<void> | void;
}

/**
 * Message context menu command
 */
export abstract class MessageContextCommand extends Command {
  constructor(client: DiscordBotServer, options: Omit<CommandOptions, 'type' | 'description'>) {
    super(client, { ...options, description: '', type: ApplicationCommandType.Message });
  }

  abstract execute(options: { 
    interaction: MessageContextMenuCommandInteraction; 
    client: DiscordBotServer; 
  }): Promise<void> | void;
}

/**
 * User context menu command
 */
export abstract class UserContextCommand extends Command {
  constructor(client: DiscordBotServer, options: Omit<CommandOptions, 'type' | 'description'>) {
    super(client, { ...options, description: '', type: ApplicationCommandType.User });
  }

  abstract execute(options: { 
    interaction: UserContextMenuCommandInteraction; 
    client: DiscordBotServer; 
  }): Promise<void> | void;
}