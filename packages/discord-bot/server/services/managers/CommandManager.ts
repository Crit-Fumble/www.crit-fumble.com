import { Collection, ApplicationCommandData } from 'discord.js';
import { DiscordBotServer } from '../../DiscordBotServer';
import { Command } from '../../controllers/structures/Command';
import { 
  HelpCommand, 
  WriteCommand, 
  ImagineCommand,
  AudioCommand
} from '../../controllers/commands/general';
import { TimestampCommand } from '../../controllers/commands/dev';
import {
  RollCommand,
  CharacterCommand,
  IcCommand
} from '../../controllers/commands/player';
import {
  EventCommand,
  ControlTestCommand
} from '../../controllers/commands/admin';

export class CommandManager {
  private client: DiscordBotServer;
  private commands: Collection<string, Command>;

  constructor(client: DiscordBotServer) {
    this.client = client;
    this.commands = new Collection();
  }

  async loadCommands(): Promise<void> {
    // Manually register converted TypeScript commands
    const commandClasses = [
      // General commands
      HelpCommand,
      WriteCommand,
      ImagineCommand,
      AudioCommand,
      // Dev commands
      TimestampCommand,
      // Player commands  
      RollCommand,
      CharacterCommand,
      IcCommand,
      // Admin commands
      EventCommand,
      ControlTestCommand,
    ];

    for (const CommandClass of commandClasses) {
      const command = new CommandClass(this.client);
      this.commands.set(command.options.name, command);
    }

    console.info(`📋 Loaded ${this.commands.size} commands successfully!`);
  }

  getCommand(commandName: string): Command | undefined {
    return this.commands.get(commandName);
  }

  async registerCommands(): Promise<void> {
    const commandData: ApplicationCommandData[] = this.commands.map(command => 
      command.getCommandData()
    );

    if (this.client.application) {
      await this.client.application.commands.set(commandData);
      console.info(`📤 Posted ${commandData.length} commands to Discord!`);
    } else {
      console.warn('⚠️ Application not available for command registration');
    }
  }

  get size(): number {
    return this.commands.size;
  }
}