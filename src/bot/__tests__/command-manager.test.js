import { jest } from '@jest/globals';
import { Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import CommandManager from '../managers/CommandManager.js';

// Mock dependencies
jest.mock('discord.js', () => {
  const originalModule = jest.requireActual('discord.js');
  
  // Only mock the REST and Routes components
  return {
    ...originalModule,
    REST: jest.fn().mockImplementation(() => ({
      setToken: jest.fn().mockReturnThis(),
      put: jest.fn().mockResolvedValue({})
    })),
    Routes: {
      applicationCommands: jest.fn().mockReturnValue('/application-commands-route')
    }
  };
});

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  mkdirSync: jest.fn()
}));

// Mock dynamic imports
jest.mock('../commands/general/ping.js', () => ({
  __esModule: true,
  default: {
    data: {
      name: 'ping',
      toJSON: () => ({ name: 'ping' })
    },
    execute: jest.fn()
  }
}), { virtual: true });

jest.mock('../commands/admin/restart.js', () => ({
  __esModule: true,
  default: {
    data: {
      name: 'restart',
      toJSON: () => ({ name: 'restart' })
    },
    execute: jest.fn()
  }
}), { virtual: true });

// Mock environment variables
process.env.DISCORD_PERSISTENT_BOT_TOKEN = 'mock-token';
process.env.DISCORD_PERSISTENT_BOT_APP_ID = 'mock-app-id';

describe('CommandManager', () => {
  let commandManager;
  let mockClient;
  let mockLogger;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock client and logger
    mockClient = {
      on: jest.fn(),
      once: jest.fn(),
      login: jest.fn()
    };
    
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };
    
    // Create an instance of CommandManager
    commandManager = new CommandManager(mockClient, mockLogger);
    
    // Setup fs mock implementations for default behavior
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(['ping.js']);
  });
  
  describe('constructor', () => {
    test('should initialize with correct properties', () => {
      expect(commandManager.client).toBe(mockClient);
      expect(commandManager.logger).toBe(mockLogger);
      expect(commandManager.commands).toBeInstanceOf(Collection);
      expect(commandManager.commandFolders).toEqual(['general', 'admin', 'dev']);
    });
  });
  
  describe('registerCommands', () => {
    test('should register commands from all folders', async () => {
      // Mock fs.readdirSync for different folders
      fs.readdirSync.mockImplementation(dirPath => {
        if (dirPath.includes('general')) return ['ping.js'];
        if (dirPath.includes('admin')) return ['restart.js'];
        return [];
      });
      
      // Mock dynamic imports
      jest.mock('path', () => ({
        ...jest.requireActual('path'),
        join: jest.fn().mockImplementation((...args) => {
          const lastArg = args[args.length - 1];
          if (lastArg === 'ping.js') {
            return '/path/to/ping.js';
          }
          if (lastArg === 'restart.js') {
            return '/path/to/restart.js';
          }
          return args.join('/');
        })
      }));
      
      // Override the import mechanism
      const originalImport = global.import;
      global.import = jest.fn().mockImplementation(path => {
        if (path.includes('ping.js')) {
          return import('../commands/general/ping.js');
        }
        if (path.includes('restart.js')) {
          return import('../commands/admin/restart.js');
        }
        return Promise.resolve({});
      });
      
      try {
        // Call the method
        await commandManager.registerCommands();
        
        // Verify commands were loaded
        expect(commandManager.commands.size).toBe(2);
        expect(commandManager.commands.has('ping')).toBeTruthy();
        expect(commandManager.commands.has('restart')).toBeTruthy();
        
        // Verify logger was called
        expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('Started refreshing'));
        expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('Successfully reloaded'));
      } finally {
        // Restore original import
        global.import = originalImport;
      }
    });
    
    test('should create directories if they do not exist', async () => {
      // Mock directory check to fail for one folder
      fs.existsSync.mockImplementation(path => !path.includes('admin'));
      
      await commandManager.registerCommands();
      
      expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining('admin'), { recursive: true });
    });
    
    test('should handle errors when registering commands', async () => {
      // Force an error in the registration process
      const mockError = new Error('Registration error');
      jest.spyOn(commandManager, 'registerCommands').mockImplementationOnce(() => {
        throw mockError;
      });
      
      try {
        await commandManager.registerCommands();
      } catch (e) {
        // We expect the error to be caught inside the method
        expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Registration error'));
      }
    });
  });
  
  describe('handleCommand', () => {
    test('should execute a valid command', async () => {
      // Setup a mock command
      const mockExecute = jest.fn();
      const mockCommand = {
        data: { name: 'test-command' },
        execute: mockExecute
      };
      commandManager.commands.set('test-command', mockCommand);
      
      // Setup a mock interaction
      const mockInteraction = {
        commandName: 'test-command',
        replied: false,
        deferred: false,
        reply: jest.fn(),
        followUp: jest.fn()
      };
      
      await commandManager.handleCommand(mockInteraction);
      
      expect(mockExecute).toHaveBeenCalledWith(mockInteraction);
    });
    
    test('should handle non-existent commands', async () => {
      const mockInteraction = {
        commandName: 'non-existent',
        replied: false,
        deferred: false,
        reply: jest.fn(),
        followUp: jest.fn()
      };
      
      await commandManager.handleCommand(mockInteraction);
      
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('No command matching'));
    });
    
    test('should handle errors during command execution', async () => {
      // Setup a mock command that throws an error
      const mockError = new Error('Command execution error');
      const mockExecute = jest.fn().mockRejectedValue(mockError);
      const mockCommand = {
        data: { name: 'error-command' },
        execute: mockExecute
      };
      commandManager.commands.set('error-command', mockCommand);
      
      // Setup a mock interaction
      const mockInteraction = {
        commandName: 'error-command',
        replied: false,
        deferred: false,
        reply: jest.fn(),
        followUp: jest.fn()
      };
      
      await commandManager.handleCommand(mockInteraction);
      
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Command execution error'));
      expect(mockInteraction.reply).toHaveBeenCalled();
    });
    
    test('should use followUp if interaction was already replied to', async () => {
      // Setup a mock command that throws an error
      const mockError = new Error('Command execution error');
      const mockExecute = jest.fn().mockRejectedValue(mockError);
      const mockCommand = {
        data: { name: 'error-command' },
        execute: mockExecute
      };
      commandManager.commands.set('error-command', mockCommand);
      
      // Setup a mock interaction that was already replied to
      const mockInteraction = {
        commandName: 'error-command',
        replied: true,
        deferred: false,
        reply: jest.fn(),
        followUp: jest.fn()
      };
      
      await commandManager.handleCommand(mockInteraction);
      
      expect(mockInteraction.followUp).toHaveBeenCalled();
      expect(mockInteraction.reply).not.toHaveBeenCalled();
    });
  });
});
