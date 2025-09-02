import { 
  Client, 
  Guild, 
  Channel, 
  User, 
  GuildMember, 
  TextChannel, 
  Message, 
  MessageCreateOptions,
  ClientOptions,
  Collection
} from 'discord.js';

/**
 * Interface for Discord client operations
 * This allows for better dependency injection and easier mocking in tests
 */
export interface IDiscordClient {
  /**
   * Log in to Discord with the provided token
   * @param token Discord bot token
   * @returns Promise resolving when login is successful
   */
  login(token: string): Promise<string>;

  /**
   * Clean up and disconnect
   */
  destroy(): void;

  /**
   * Register a one-time event handler
   * @param event Event name to listen for
   * @param listener Event handler function
   */
  once(event: string, listener: (...args: any[]) => void): any;

  /**
   * Register an event handler
   * @param event Event name to listen for
   * @param listener Event handler function
   */
  on(event: string, listener: (...args: any[]) => void): any;

  /**
   * Access to guild operations
   */
  guilds: {
    /**
     * Fetch a guild by ID
     * @param id Guild ID
     * @param options Fetch options
     */
    fetch(id: string, options?: any): Promise<Guild>;

    /**
     * Cache of guilds
     */
    cache: Collection<string, Guild>;
  };

  /**
   * Access to channel operations
   */
  channels: {
    /**
     * Fetch a channel by ID
     * @param id Channel ID
     * @param options Fetch options
     */
    fetch(id: string, options?: any): Promise<Channel | null>;

    /**
     * Cache of channels
     */
    cache: Collection<string, Channel>;
  };

  /**
   * Access to user operations
   */
  users: {
    /**
     * Fetch a user by ID
     * @param id User ID
     * @param options Fetch options
     */
    fetch(id: string, options?: any): Promise<User>;

    /**
     * Cache of users
     */
    cache: Collection<string, User>;
  };
}

/**
 * Adapter class that implements IDiscordClient using the actual Discord.js Client
 */
export class DiscordClientAdapter implements IDiscordClient {
  private client: Client;

  /**
   * Create a new adapter for the Discord.js client
   * @param options Client options for initialization
   */
  constructor(options: ClientOptions) {
    this.client = new Client(options);
  }

  login(token: string): Promise<string> {
    return this.client.login(token);
  }

  destroy(): void {
    this.client.destroy();
  }

  once(event: string, listener: (...args: any[]) => void): any {
    return this.client.once(event, listener);
  }

  on(event: string, listener: (...args: any[]) => void): any {
    return this.client.on(event, listener);
  }

  get guilds() {
    return this.client.guilds;
  }

  get channels() {
    return this.client.channels;
  }

  get users() {
    return this.client.users;
  }

  /**
   * Get the underlying Discord.js client
   * @returns The raw Discord.js client
   */
  getRawClient(): Client {
    return this.client;
  }
}

/**
 * Create a mock Discord client for testing
 * @returns A mock implementation of IDiscordClient
 */
export function createMockDiscordClient(): IDiscordClient {
  // Implementation can be customized as needed for tests
  return {
    login: jest.fn().mockResolvedValue('token'),
    destroy: jest.fn(),
    once: jest.fn((event, callback) => {
      if (event === 'ready') {
        callback();
      }
    }),
    on: jest.fn(),
    guilds: {
      fetch: jest.fn().mockImplementation(async (id) => ({
        id: id || 'mock-guild-id',
        name: 'Mock Guild',
        icon: 'mock-icon',
        ownerId: 'mock-owner-id',
        members: {
          fetch: jest.fn().mockResolvedValue({
            id: 'mock-member-id',
            user: { id: 'mock-user-id', username: 'MockUser' }
          })
        }
      })),
      cache: new Collection()
    },
    channels: {
      fetch: jest.fn().mockImplementation(async (id) => ({
        id: id || 'mock-channel-id',
        type: 0,
        guildId: 'mock-guild-id',
        name: 'mock-channel',
        send: jest.fn().mockResolvedValue({
          id: 'mock-message-id',
          content: 'Mock message'
        })
      })),
      cache: new Collection()
    },
    users: {
      fetch: jest.fn().mockImplementation(async (id) => ({
        id: id || 'mock-user-id',
        username: 'MockUser',
        discriminator: '0000',
        avatar: 'mock-avatar',
        bot: false
      })),
      cache: new Collection()
    }
  };
}
