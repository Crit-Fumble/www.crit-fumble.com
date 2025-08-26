import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';
import winston from 'winston';

// Configuration
import config, { validateConfig, ensureDirectories } from './config.js';

// Managers
import CommandManager from './managers/CommandManager.js';
import CronJobManager from './managers/CronJobManager.js';
import ApiManager from './managers/ApiManager.js';

// API Server
import { startApiServer } from './api/server.js';

// Validate configuration
validateConfig();
ensureDirectories();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/bot.log' })
  ]
});

// Log environment and configuration
logger.info(`Starting bot in ${config.environment} mode`);
logger.info(`Bot name: ${config.bot.name} v${config.bot.version}`);

// Initialize Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [
    Partials.Channel,
    Partials.Message
  ]
});

// Initialize managers
const commandManager = new CommandManager(client, logger);
const cronJobManager = new CronJobManager(client, logger);
const apiManager = new ApiManager(logger);

// Handle client events
client.once(Events.ClientReady, () => {
  logger.info(`Bot logged in as ${client.user.tag}`);
  
  // Register commands
  commandManager.registerCommands();
  
  // Start cron jobs
  cronJobManager.startAll();
  
  // Start API server if enabled
  startApiServer();
  
  // Set bot activity
  client.user.setActivity(config.bot.defaultActivity, { type: config.bot.defaultActivityType });
});

// Load event handlers
import('./listeners/Ready.js').then(module => {
  module.default(client, logger);
});

import('./listeners/InteractionCreate.js').then(module => {
  module.default(client, commandManager, logger);
});

import('./listeners/VoiceStateUpdate.js').then(module => {
  module.default(client, logger);
});

// Login to Discord
client.login(config.discord.token)
  .catch(error => {
    logger.error('Failed to login:', error);
    process.exit(1);
  });

// Handle process termination
process.on('SIGINT', () => {
  logger.info('Bot shutting down');
  client.destroy();
  process.exit(0);
});

export { client, logger, commandManager, cronJobManager, apiManager };
