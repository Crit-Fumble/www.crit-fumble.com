import {
  Client as DiscordClient, GatewayIntentBits, Partials, ActivityType,
} from 'discord.js';
import { createWinstonLogger } from '@crit-fumble/core/utils/Logger.js';
import HandleScheduledEvents from './server/services/HandleScheduledEvents.js';

export class DiscordBotServer extends DiscordClient {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
      partials: [Partials.Channel, Partials.User, Partials.GuildMember, Partials.Message, Partials.GuildScheduledEvent],
      failIfNotExists: false,
      allowedMentions: {
        parse: ['users'],
        repliedUser: false,
      },
      presence: {
        status: process.env.NODE_ENV === 'development' ? 'idle' : 'online',
        activities: [{
          name: '/help', type: ActivityType.Playing,
        }],
      },
    });

    // Store configuration
    this.apiBaseUrl = process.env.WEBSITE_API_URL || 'http://localhost:3000/api';
    this.apiKey = process.env.BOT_API_KEY;
    
    // Initialize simple managers
    this.commands = new Map();
    this.events = new Map();
    this.scheduledEventsHandler = new HandleScheduledEvents();
  }

  /**
   * Make authenticated API request to website
   */
  async makeApiRequest(endpoint, options = {}) {
    const url = `${this.apiBaseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger?.error('API request failed:', error);
      throw error;
    }
  }

  async start() {
    this.logger = createWinstonLogger(
      {
        handleExceptions: true,
        handleRejections: true,
      },
      this,
    );

    // Start scheduled events handler
    this.scheduledEventsHandler.start(this);
    
    // TODO: Load commands and events from website API
    // These should be simplified and use website API endpoints
    
    await super.login(process.env.BOT_TOKEN);
  }

  async stop() {
    // Stop scheduled events handler
    this.scheduledEventsHandler.stop();
    
    // Destroy the client
    this.destroy();
  }
}
