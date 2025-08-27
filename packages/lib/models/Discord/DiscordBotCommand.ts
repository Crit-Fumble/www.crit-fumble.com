import { ApplicationCommandType } from 'discord.js';
import type { CommandOptions } from './types';

/**
 * Base Command class for Discord bot commands
 * All Discord bot commands should extend this class
 */
export abstract class DiscordBotCommand {
  public options: CommandOptions;
  
  constructor(options: CommandOptions) {
    this.options = options;
  }

  /**
   * Execute the command with the given interaction
   * This method must be implemented by all command classes
   */
  abstract execute(props: { interaction: any }): Promise<void> | void;
}

/**
 * Create a basic slash command with the given name and description
 */
export function createSlashCommand(name: string, description: string): CommandOptions {
  return {
    name,
    description,
    type: ApplicationCommandType.ChatInput
  };
}
