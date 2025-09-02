import { Client, Guild, TextChannel, User, GuildMember } from 'discord.js';
import { DiscordApiClient } from '../../../server/clients/DiscordApiClient';

// Mock the config module
jest.mock('../../../server/configs/config', () => ({
  getDiscordConfig: jest.fn().mockReturnValue({
    botToken: 'mocked-token',
    clientId: 'mocked-client-id',
    clientSecret: 'mocked-client-secret',
    defaultGuildId: 'guild-123'
  })
}));

// Mock discord.js client
jest.mock('discord.js', () => {
  // Mock implementations
  const mockGuild = {
    id: 'guild-123',
    name: 'Test Guild',
    icon: 'icon-url',
    ownerId: 'owner-123',
    members: {
      fetch: jest.fn().mockResolvedValue({
        id: 'member-123',
        user: { id: 'user-123', username: 'TestUser' }
      })
    }
  };

  const mockChannel = {
    id: 'channel-123',
    type: 0,
    guildId: 'guild-123',
    name: 'test-channel',
    send: jest.fn().mockResolvedValue({
      id: 'message-123',
      content: 'Test message'
    })
  };

  const mockUser = {
    id: 'user-123',
    username: 'TestUser',
    discriminator: '1234',
    avatar: 'avatar-url',
    bot: false
  };

  return {
    Client: jest.fn().mockImplementation(() => ({
      login: jest.fn().mockResolvedValue('token'),
      destroy: jest.fn(),
      once: jest.fn((event, callback) => {
        if (event === 'ready') {
          callback();
        }
      }),
      on: jest.fn(),
      guilds: {
        fetch: jest.fn().mockResolvedValue(mockGuild),
        cache: new Map([['guild-123', mockGuild]])
      },
      channels: {
        fetch: jest.fn().mockResolvedValue(mockChannel),
        cache: new Map([['channel-123', mockChannel]])
      },
      users: {
        fetch: jest.fn().mockResolvedValue(mockUser),
        cache: new Map([['user-123', mockUser]])
      }
    })),
    TextChannel: jest.fn(),
    Guild: jest.fn(),
    User: jest.fn(),
    GuildMember: jest.fn()
  };
});

describe('DiscordApiClient', () => {
  let client: DiscordApiClient;
  let mockDiscordClient: jest.Mocked<Client>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockDiscordClient = new Client({
      intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent', 'GuildVoiceStates', 'DirectMessages']
    }) as unknown as jest.Mocked<Client>;
    client = new DiscordApiClient({
      botToken: 'test-token',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      defaultGuildId: 'guild-123'
    }, mockDiscordClient);
  });
  
  describe('constructor', () => {
    it('should initialize with config values', () => {
      const testClient = new DiscordApiClient({
        botToken: 'custom-token',
        clientId: 'custom-client-id',
        clientSecret: 'custom-client-secret',
        defaultGuildId: 'custom-guild'
      });
      
      expect(testClient).toBeInstanceOf(DiscordApiClient);
      // We can't directly test private fields, but we can test the behavior
    });
    
    it('should accept a custom client for testing', () => {
      expect(client.getRawClient()).toBe(mockDiscordClient);
    });
  });
  
  describe('initialize', () => {
    it('should login with the bot token', async () => {
      await client.initialize();
      expect(mockDiscordClient.login).toHaveBeenCalled();
    });
    
    it('should return the client', async () => {
      const result = await client.initialize();
      expect(result).toBe(mockDiscordClient);
    });
  });
  
  describe('getGuild', () => {
    it('should fetch a guild by ID', async () => {
      const guild = await client.getGuild('guild-123');
      expect(mockDiscordClient.guilds.fetch).toHaveBeenCalledWith('guild-123');
      expect(guild).toBeDefined();
    });
    
    it('should use default guild ID if not provided', async () => {
      const guild = await client.getGuild();
      expect(mockDiscordClient.guilds.fetch).toHaveBeenCalledWith('guild-123');
      expect(guild).toBeDefined();
    });
    
    it('should throw error if no guild ID is available', async () => {
      // Override the mocked config to have no default guild ID
      const originalDefaultGuildId = mockDiscordClient.guilds.fetch;
      
      // Create a client with no default guild ID
      const testClient = new DiscordApiClient({
        botToken: 'test-token',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        defaultGuildId: undefined
      }, mockDiscordClient);
      
      // Override the implementation for this test to force the client to use provided logic
      // @ts-ignore - Accessing private property for test
      testClient['defaultGuildId'] = undefined;
      
      await expect(testClient.getGuild()).rejects.toThrow('No guild ID provided and no default guild ID set');
    });
  });
  
  describe('getChannel', () => {
    it('should fetch a channel by ID', async () => {
      const channel = await client.getChannel('channel-123');
      expect(mockDiscordClient.channels.fetch).toHaveBeenCalledWith('channel-123');
      expect(channel).toBeDefined();
    });
  });
  
  describe('getUser', () => {
    it('should fetch a user by ID', async () => {
      const user = await client.getUser('user-123');
      expect(mockDiscordClient.users.fetch).toHaveBeenCalledWith('user-123');
      expect(user).toBeDefined();
    });
  });
  
  describe('sendMessage', () => {
    it('should send a message to a channel', async () => {
      // Create a proper mock that will pass the instanceof TextChannel check
      const mockTextChannel = {
        id: 'channel-123',
        send: jest.fn().mockResolvedValue({ id: 'message-123' }),
        type: 0,
        guildId: 'guild-123',
        name: 'test-channel'
      };
      
      // Make TextChannel constructor function return true for instanceof checks
      const TextChannelMock = jest.requireMock('discord.js').TextChannel;
      TextChannelMock.prototype = {};
      Object.setPrototypeOf(mockTextChannel, TextChannelMock.prototype);
      
      // Override the channels.fetch mock for this test
      mockDiscordClient.channels.fetch = jest.fn().mockResolvedValue(mockTextChannel);
      
      await client.sendMessage('channel-123', 'Test message');
      expect(mockDiscordClient.channels.fetch).toHaveBeenCalledWith('channel-123');
      expect(mockTextChannel.send).toHaveBeenCalledWith('Test message');
    });
  });
  
  describe('mapping methods', () => {
    it('should convert Discord.js Guild to DiscordGuild', () => {
      const mockGuild = {
        id: 'guild-123',
        name: 'Test Guild',
        icon: 'icon-url',
        ownerId: 'owner-123'
      } as unknown as Guild;
      
      const result = client.mapToDiscordGuild(mockGuild);
      expect(result).toEqual({
        id: 'guild-123',
        name: 'Test Guild',
        icon: 'icon-url',
        owner_id: 'owner-123'
      });
    });
    
    it('should convert Discord.js User to DiscordUser', () => {
      const mockUser = {
        id: 'user-123',
        username: 'TestUser',
        discriminator: '1234',
        avatar: 'avatar-url',
        bot: false
      } as unknown as User;
      
      const result = client.mapToDiscordUser(mockUser);
      expect(result).toEqual({
        id: 'user-123',
        username: 'TestUser',
        discriminator: '1234',
        avatar: 'avatar-url',
        bot: false
      });
    });
  });
  
  describe('createApiResponse', () => {
    it('should create a successful API response', () => {
      const data = { test: 'data' };
      const response = client.createApiResponse(true, data);
      
      expect(response).toEqual({
        success: true,
        data,
        error: undefined
      });
    });
    
    it('should create an error API response', () => {
      const response = client.createApiResponse(false, undefined, 'Error message');
      
      expect(response).toEqual({
        success: false,
        data: undefined,
        error: 'Error message'
      });
    });
  });
});
