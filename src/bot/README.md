# FumbleBot Discord Integration

This directory contains the Discord bot integration for the Crit Fumble platform, allowing users to interact with the platform through Discord.

## Features

- Slash command support for interacting with campaigns, characters, and events
- Scheduled notifications for upcoming game sessions
- Voice channel integration for gaming sessions
- Admin controls via web interface
- API for communication between bot and web application

## Setup & Installation

### Prerequisites

- Node.js v16 or higher
- Discord Bot Token and Application ID
- Discord Developer Portal access

### Environment Variables

Copy the example environment file:

```bash
cp .env.bot.example .env.bot
```

Configure the following variables in your `.env.bot` file:

```
# Required Discord Credentials
DISCORD_PERSISTENT_BOT_TOKEN=your_bot_token_here
DISCORD_PERSISTENT_BOT_APP_ID=your_application_id_here

# Bot Configuration
BOT_PREFIX=!
BOT_VERSION=1.0.0
BOT_API_ENABLED=true
BOT_API_PORT=3001
BOT_API_KEY=your_secure_api_key_here

# API Integration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the bot in development mode:
   ```bash
   npm run dev:bot
   ```

### Production Deployment

The bot can be deployed using the deployment script:

```bash
node pipeline/deploy-bot.js
```

This will:
1. Build the bot code
2. Package it for deployment
3. Deploy to Fly.io using the configuration in `pipeline/deploy-bot.toml`

## Architecture

### Directory Structure

```
src/bot/
├── api/            # Internal API for web-bot communication
├── commands/       # Bot slash commands
│   ├── admin/      # Admin-only commands
│   ├── dev/        # Development commands
│   └── general/    # General user commands
├── cronJobs/       # Scheduled tasks
├── listeners/      # Discord event handlers
├── managers/       # Service managers
├── config.js       # Configuration module
└── Launcher.js     # Bot entry point
```

### Integration Points

The bot integrates with the main application in several ways:

1. **Database Access**: The bot uses the same database as the web application
2. **API Communication**: 
   - Bot → Web App: Uses ApiManager to call web app endpoints
   - Web App → Bot: Uses the bot's internal API server
3. **Admin UI**: Manages bot status, cron jobs, and configuration via the web interface

## Admin Interface

An admin interface is provided at `/admin/bot` for managing the Discord bot. This interface allows:

- Viewing bot status and performance metrics
- Managing scheduled tasks (cron jobs)
- Viewing event logs
- Configuring bot settings

## Development Guidelines

### Adding New Commands

1. Create a new file in the appropriate command directory:
   ```javascript
   // src/bot/commands/general/example.js
   import { SlashCommandBuilder } from 'discord.js';

   export default {
     data: new SlashCommandBuilder()
       .setName('example')
       .setDescription('Example command'),
     
     async execute(interaction) {
       await interaction.reply('Hello from example command!');
     },
   };
   ```

2. Restart the bot to register the new command

### Adding New Cron Jobs

1. Create a new file in the cronJobs directory:
   ```javascript
   // src/bot/cronJobs/ExampleJob.js
   export default {
     name: 'ExampleJob',
     schedule: '0 * * * *', // Every hour
     
     async execute(client, logger) {
       logger.info('Running example job');
       // Job logic here
     }
   };
   ```

2. Restart the bot to register the new cron job

## Troubleshooting

### Common Issues

1. **Bot not connecting to Discord**
   - Verify the bot token is correct
   - Check Discord Developer Portal for bot status
   - Ensure the bot has proper gateway intents enabled

2. **Commands not registering**
   - Check command file format and exports
   - Verify the bot has the applications.commands scope
   - Allow up to 1 hour for global commands to propagate

3. **API connection issues**
   - Verify the API_URL is accessible
   - Check that API_KEY matches between bot and web app
   - Ensure the bot API server is enabled and running

### Logs

Bot logs are stored in the `logs/` directory. For more detailed logging, set `LOG_LEVEL=debug` in your environment variables.
