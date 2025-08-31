import {
  Client as DiscordClient, GatewayIntentBits, Partials, ActivityType,
} from 'discord.js';
import { EventManager } from '@cfg/discord/services/managers/EventManager.js';
import { CommandManager } from '@cfg/discord/services/managers/CommandManager.js';
import { DatabaseManager } from '@cfg/discord/services/managers/DatabaseManager.js';
import { CronJobManager } from '@cfg/discord/services/managers/CronJobManager.js';
import { createWinstonLogger } from '@cfg/core/utils/Logger.js';
import { ApiManager } from '@cfg/discord/services/managers/ApiManager.js';

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

    this.database = new DatabaseManager(this);
    this.commands = new CommandManager(this);
    this.events = new EventManager(this);
    this.cronJobs = new CronJobManager(this);
    this.api = new ApiManager(this).start();
  }

  async start() {
    this.logger = createWinstonLogger(
      {
        handleExceptions: true,
        handleRejections: true,
      },
      this,
    );
    await this.commands.loadCommands(this);
    await this.events.loadEvents();
    await this.cronJobs.loadCronJobs();

    await super.login(process.env.BOT_TOKEN);
  }
}
