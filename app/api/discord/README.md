# Discord API Endpoints

This directory contains all Discord-related API endpoints for the Crit-Fumble application. The Discord integration uses a **webhook-based architecture** instead of a persistent bot connection, making it more reliable, cost-effective, and easier to scale.

## 🏗️ Architecture Overview

Instead of running a persistent Discord bot, we use:
- **Vercel Cron Jobs** for scheduled tasks (every 5 minutes)
- **Discord Interaction Webhooks** for slash commands and user interactions
- **Discord REST API** for all Discord operations
- **OAuth2 Flow** for user authentication

## 📁 Endpoint Structure

```
/api/discord/
├── cron/              # Scheduled task endpoint (Vercel cron)
├── webhooks/          # Discord interaction webhooks  
├── oauth/             # Discord OAuth2 authentication
│   ├── authorize/     # Initiate OAuth flow
│   └── callback/      # OAuth callback handler
├── bot/               # Bot management and commands
└── guilds/            # Guild management and information
```

## 🔗 Endpoints

### Cron Jobs
- **`GET /api/discord/cron`** - Scheduled event monitoring (called by Vercel every 5 minutes)

### Interactions
- **`POST /api/discord/webhooks`** - Discord interaction webhook endpoint
  - Handles slash commands (`/event`, `/campaign`, `/character`)
  - Handles button/select menu interactions
  - Handles autocomplete requests

### OAuth2 Authentication
- **`GET /api/discord/oauth2/authorize`** - Initiate Discord OAuth2 flow (supports both user auth and bot installation)
- **`GET /api/discord/oauth2/callback`** - Handle OAuth2 callback and user authentication

### Bot Management
- **`GET /api/discord/bot`** - Get bot status and information
- **`POST /api/discord/bot`** - Manage bot configuration
  - `action: "register_commands"` - Register global slash commands
  - `action: "clear_commands"` - Clear all global commands

### Guild Management
- **`GET /api/discord/guilds`** - List all guilds the bot is in

## 🔧 Configuration

### Environment Variables
```bash
# Required for all Discord functionality
DISCORD_WEB_BOT_TOKEN=your_bot_token_here
DISCORD_WEB_BOT_APP_ID=your_application_id_here

# Required for OAuth2 authentication and webhooks
AUTH_DISCORD_ID=your_client_id_here
AUTH_DISCORD_SECRET=your_client_secret_here
AUTH_DISCORD_PUBLIC_KEY=your_public_key_here

# Base URL for OAuth redirects
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

### Discord Application Setup
1. Set **Interactions Endpoint URL** to: `https://your-domain.vercel.app/api/discord/webhooks`
2. Enable **OAuth2** with redirect URI: `https://your-domain.vercel.app/api/discord/oauth2/callback`
3. Set required **scopes**: `identify`, `email` (guilds access is handled via bot token)
4. Configure **bot permissions** as needed

### Vercel Configuration
The `vercel.json` file automatically configures the cron job:

```json
{
  "crons": [
    {
      "path": "/api/discord/cron",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

## 🎯 Features

### Scheduled Tasks
- **Event Monitoring**: Checks Discord scheduled events every 5 minutes
- **Notifications**: Alerts when events are starting soon or have completed
- **Integration**: Connects with campaign management and session tracking

### Slash Commands
- **`/event`** - Manage Discord scheduled events
- **`/campaign`** - Manage D&D campaigns  
- **`/character`** - Manage D&D characters

### Authentication
- **Discord OAuth2** - Seamless login with Discord account
- **User Linking** - Connect Discord accounts to Crit-Fumble profiles
- **Guild Access** - Verify user permissions in Discord servers

## 🚀 Deployment

### Automatic Deployment
- Push to main branch → Vercel deploys automatically
- Cron jobs start running immediately after deployment
- No manual bot hosting or management required

### Manual Command Registration
```bash
# Register slash commands globally
curl -X POST https://your-domain.vercel.app/api/discord/bot \
  -H "Content-Type: application/json" \
  -d '{"action": "register_commands"}'

# Clear all commands
curl -X POST https://your-domain.vercel.app/api/discord/bot \
  -H "Content-Type: application/json" \
  -d '{"action": "clear_commands"}'
```

## 📊 Monitoring

### Built-in Monitoring
- **Vercel Functions** - Automatic logging and metrics
- **Discord Webhooks** - Built-in delivery confirmation
- **Error Handling** - Comprehensive error logging and responses

### Health Checks
- **`GET /api/discord/bot`** - Check bot status and connectivity
- **`GET /api/discord/guilds`** - Verify guild access and permissions

## ✅ Benefits Over Persistent Bot

- ✅ **Zero hosting costs** (Vercel includes cron jobs)
- ✅ **No memory constraints** (no 256MB limits)
- ✅ **Automatic scaling** with your Next.js application
- ✅ **Built-in monitoring** via Vercel dashboard
- ✅ **Easier debugging** with HTTP request logs
- ✅ **Zero downtime deployments** 
- ✅ **Simplified architecture** with fewer moving parts

## 🔄 Migration from Persistent Bot

If migrating from a persistent Discord bot:

1. **Update Discord Application**: Change interaction endpoint URL
2. **Deploy endpoints**: Push the new API routes to Vercel
3. **Register commands**: Use `/api/discord/bot` to register slash commands
4. **Test functionality**: Verify cron jobs and interactions work
5. **Shut down old bot**: Stop the persistent bot instance

The new webhook-based system provides the same functionality with better reliability and lower costs.