import {
  Client as DiscordClient,
  IntentsBitField,
  Partials,
  ActivityType,
  ClientPresenceStatus,
} from 'discord.js';
import { DiscordBotConfig, loadDiscordBotConfig, validateDiscordBotConfig } from './config/DiscordBotConfig';
import { HandleScheduledEvents } from './services/HandleScheduledEvents';

export class DiscordBotServer extends DiscordClient {
  public readonly config: DiscordBotConfig;
  public readonly commands: Map<string, any>;
  public readonly events: Map<string, any>;
  public readonly scheduledEventsHandler: HandleScheduledEvents;

  constructor() {
    // Load and validate configuration
    const config = loadDiscordBotConfig();
    validateDiscordBotConfig(config);

    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildScheduledEvents,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
      ],
      partials: [
        Partials.Channel,
        Partials.User,
        Partials.GuildMember,
        Partials.Message,
        Partials.GuildScheduledEvent,
      ],
      failIfNotExists: false,
      allowedMentions: {
        parse: ['users'],
        repliedUser: false,
      },
      presence: {
        status: (config.environment === 'development' ? 'idle' : 'online') as ClientPresenceStatus,
        activities: [{
          name: config.bot.defaultActivity,
          type: ActivityType.Playing,
        }],
      },
    });

    this.config = config;
    this.commands = new Map();
    this.events = new Map();
    this.scheduledEventsHandler = new HandleScheduledEvents();
  }

  /**
   * Make authenticated API request to website
   */
  async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.config.api.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.config.api.key && { 'Authorization': `Bearer ${this.config.api.key}` }),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }

  /**
   * Start the Discord bot
   */
  async start(): Promise<void> {
    console.log(`🤖 Starting ${this.config.bot.name} v${this.config.bot.version}...`);
    
    // Set up event handlers
    this.setupEventHandlers();
    
    // Login to Discord
    await this.login(this.config.discord.token);
    
    console.log(`✅ ${this.config.bot.name} is online!`);
  }

  /**
   * Set up Discord event handlers
   */
  private setupEventHandlers(): void {
    this.once('ready', () => {
      console.log(`🚀 ${this.config.bot.name} is ready!`);
      console.log(`📊 Serving ${this.guilds.cache.size} guilds`);
      
      // Start scheduled events if enabled
      if (this.config.features.campaignIntegration) {
        this.scheduledEventsHandler.start();
      }
    });

    this.on('error', (error) => {
      console.error('❌ Discord client error:', error);
    });

    this.on('warn', (warning) => {
      console.warn('⚠️ Discord client warning:', warning);
    });
  }

  /**
   * Gracefully shutdown the bot
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down Discord bot...');
    
    // Stop scheduled events
    this.scheduledEventsHandler.stop();
    
    // Destroy Discord client
    this.destroy();
    
    console.log('✅ Discord bot shutdown complete');
  }
}