/**
 * Base Event class for Discord bot events
 * All Discord bot events should extend this class
 */
export abstract class DiscordServerEvent {
  /**
   * The Discord.js event name to listen for
   * Examples: 'ready', 'interactionCreate', 'messageCreate', etc.
   */
  public eventName: string;

  constructor(eventName: string) {
    this.eventName = eventName;
  }

  /**
   * Execute the event handler with the given client and event arguments
   * This method must be implemented by all event classes
   * 
   * @param client The Discord client instance
   * @param args Any additional arguments provided by the event
   */
  abstract execute(client: any, ...args: any[]): Promise<void> | void;
}
