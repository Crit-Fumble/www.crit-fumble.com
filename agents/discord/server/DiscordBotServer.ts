import {
  Client as DiscordClient,
  IntentsBitField,
  Partials,
  PrismaClient,
  OpenAI
} from '@crit-fumble/core/server';
import { ActivityType } from 'discord-api-types/v10';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';
import { DiscordBotConfig, loadDiscordBotConfig, validateDiscordBotConfig } from './config/DiscordBotConfig';
import { HandleScheduledEvents } from './services/HandleScheduledEvents';
import { DatabaseService } from './services/DatabaseService';
import * as http from 'http';

export class DiscordBotServer extends DiscordClient {
  public config: DiscordBotConfig;
  
  // Core package clients
  public readonly database?: PrismaClient;
  public readonly openai?: OpenAI;
  public readonly worldanvil?: WorldAnvilApiClient;
  
  // Service layer
  public readonly db?: DatabaseService;
  
  // HTTP server for health checks
  private httpServer?: http.Server;

  constructor(config: DiscordBotConfig) {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildScheduledEvents,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
      ],
      partials: [
        Partials.User,
        Partials.Channel,
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
        status: config.environment === 'development' ? 'idle' : 'online',
        activities: [{
          name: config.bot.defaultActivity,
          type: ActivityType.Playing,
        }],
      },
    });

    this.config = config;
    
    // Initialize core package clients if configs are available
    this.database = config.database ? new PrismaClient({
      datasources: {
        db: {
          url: config.database.url
        }
      }
    }) : undefined;
    
    this.openai = config.openai ? new OpenAI({
      apiKey: config.openai.apiKey
    }) : undefined;
    
    this.worldanvil = config.worldanvil ? new WorldAnvilApiClient({
      apiKey: config.worldanvil.apiKey,
      accessToken: config.worldanvil.token
    }) : undefined;
    
    // Initialize service layer
    this.db = this.database ? new DatabaseService(this) : undefined;
  }

  static async initialize(): Promise<DiscordBotServer> {
    const config = loadDiscordBotConfig();
    validateDiscordBotConfig(config);
    
    console.info('Configuration loaded for environment:', config.environment);
    
    return new DiscordBotServer(config);
  }

  async start(): Promise<void> {
    console.info('Starting bot...');
    
    this.setupEventHandlers();
    this.setupHttpServer();
    
    await this.login(this.config.discord.token);
    
    console.info('Bot logged in successfully!');
  }

  private setupEventHandlers(): void {
    this.once('ready', () => {
      console.info('Bot is ready!');
      console.info('Serving guilds:', this.guilds.cache.size);
      
      HandleScheduledEvents.startMonitoring(this);
    });

    this.on('error', (error: Error) => {
      console.error('Discord client error:', error);
    });

    this.on('warn', (warning: string) => {
      console.warn('Discord client warning:', warning);
    });
  }

  private setupHttpServer(): void {
    if (!this.config.api.enabled) {
      console.info('HTTP server disabled in configuration');
      return;
    }

    const port = this.config.api.port;
    
    this.httpServer = http.createServer((req, res) => {
      if (req.url === '/health' || req.url === '/') {
        const status = this.getStatus();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          bot: status
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    this.httpServer.listen(port, '0.0.0.0', () => {
      console.info(`HTTP server listening on 0.0.0.0:${port}`);
    });

    this.httpServer.on('error', (error) => {
      console.error('HTTP server error:', error);
    });
  }

  async shutdown(): Promise<void> {
    console.info('Shutting down Discord bot...');
    
    HandleScheduledEvents.stopMonitoring();
    
    // Close HTTP server if it exists
    if (this.httpServer) {
      await new Promise<void>((resolve) => {
        this.httpServer!.close(() => {
          console.info('HTTP server closed');
          resolve();
        });
      });
    }
    
    // Close database connection if it exists
    if (this.database) {
      await this.database.$disconnect();
      console.info('Database connection closed');
    }
    
    this.destroy();
    
    console.info('Discord bot shutdown complete');
  }

  getStatus() {
    return {
      ready: this.isReady(),
      guildCount: this.guilds.cache.size,
      userCount: this.users.cache.size,
      uptime: this.uptime,
      ping: this.ws.ping,
    };
  }
}

export async function createDiscordBot(): Promise<DiscordBotServer> {
  return await DiscordBotServer.initialize();
}

export default DiscordBotServer;
