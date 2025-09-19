import { DiscordBotServer } from '../../DiscordBotServer';

/**
 * Base class for Discord bot event listeners
 */
export abstract class Event {
  public readonly eventName: string;

  constructor(eventName: string) {
    this.eventName = eventName;
  }

  /**
   * Execute the event handler
   */
  abstract execute(client: DiscordBotServer, ...args: unknown[]): Promise<void> | void;
}

/**
 * Ready event - triggered when bot connects to Discord
 */
export abstract class ReadyEvent extends Event {
  constructor() {
    super('ready');
  }

  abstract execute(client: DiscordBotServer): Promise<void> | void;
}

/**
 * Interaction create event - triggered when user interacts with bot
 */
export abstract class InteractionCreateEvent extends Event {
  constructor() {
    super('interactionCreate');
  }

  abstract execute(client: DiscordBotServer, interaction: import('discord.js').Interaction): Promise<void> | void;
}

/**
 * Message create event - triggered when a message is sent
 */
export abstract class MessageCreateEvent extends Event {
  constructor() {
    super('messageCreate');
  }

  abstract execute(client: DiscordBotServer, message: import('discord.js').Message): Promise<void> | void;
}

/**
 * Voice state update event - triggered when user joins/leaves voice channel
 */
export abstract class VoiceStateUpdateEvent extends Event {
  constructor() {
    super('voiceStateUpdate');
  }

  abstract execute(
    client: DiscordBotServer, 
    oldState: import('discord.js').VoiceState, 
    newState: import('discord.js').VoiceState
  ): Promise<void> | void;
}