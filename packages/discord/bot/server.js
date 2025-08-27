import {
  Client as DiscordClient, GatewayIntentBits, Partials, ActivityType,
} from 'discord.js';
import { EventManager } from '../../lib/discord/bot/services/managers/EventManager.js';
import { CommandManager } from '../../lib/discord/bot/services/managers/CommandManager.js';
import { DatabaseManager } from '../../lib/discord/bot/services/managers/DatabaseManager.js';
import { CronJobManager } from '../../lib/discord/bot/services/managers/CronJobManager.js';
import { createWinstonLogger } from '../../lib/utils/Logger.js';
import { ApiManager } from '../../lib/discord/bot/services/managers/ApiManager.js';

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
