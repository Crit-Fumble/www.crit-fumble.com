# Discord Command Registration

This document explains the automated Discord slash command registration system.

## 🤖 Automatic Registration

Discord commands are now automatically registered in the following scenarios:

### Production Deployment
- **When**: Automatically during app startup
- **How**: The `lib/startup.js` module runs on server start
- **Config**: Always enabled in `NODE_ENV=production`

### Build Process  
- **When**: After `npm run build` completes
- **How**: The `postbuild` script in `package.json` runs
- **Config**: Controlled by `DISCORD_REGISTER_ON_BUILD` environment variable

### Manual Registration
- **When**: On demand during development
- **How**: Run `npm run discord:register`
- **Config**: Always available

## 📋 Available Scripts

```bash
# Register commands manually
npm run discord:register

# Force registration (ignores environment settings)
npm run discord:register:force

# Clear all commands (useful for development)
npm run discord:clear
```

## ⚙️ Environment Variables

### Required for Registration
```bash
DISCORD_WEB_BOT_TOKEN=your_bot_token
DISCORD_WEB_BOT_APP_ID=your_application_id
AUTH_DISCORD_PUBLIC_KEY=your_public_key
```

### Optional Configuration
```bash
# Force auto-registration in development (default: false)
DISCORD_AUTO_REGISTER_COMMANDS=true

# Disable registration during build (default: true)
DISCORD_REGISTER_ON_BUILD=false
```

## 🎯 Available Slash Commands

The system automatically registers these commands:

### `/event`
- **`/event create`** - Create a new Discord scheduled event
- **`/event list`** - List scheduled events

### `/campaign` 
- **`/campaign create`** - Create a new D&D campaign
- **`/campaign list`** - List your campaigns

### `/character`
- **`/character create`** - Create a new character
- **`/character sheet`** - View character sheet

## 🔧 How It Works

### 1. Registration Script (`scripts/register-discord-commands.js`)
- Contains the command definitions
- Handles Discord API communication
- Provides detailed logging and error handling

### 2. Startup Hook (`lib/startup.js`)
- Runs when the Next.js app starts
- Automatically registers commands in production
- Gracefully handles failures without crashing the app

### 3. Configuration (`lib/discord-config.js`)
- Centralizes environment-based logic
- Provides validation and strategy selection
- Makes the system configurable and testable

## 🚀 Deployment Flow

### Development
1. Manual registration: `npm run discord:register`
2. Commands are registered to Discord immediately
3. Test slash commands in your Discord server

### Production (Vercel)
1. Code is deployed to Vercel
2. Build process runs: `npm run build`
3. Post-build hook runs: `npm run discord:register`
4. App starts with commands already registered
5. Startup hook validates registration (backup)

## 🛠️ Troubleshooting

### Commands Not Appearing
1. Check Discord Developer Portal for the interaction endpoint URL
2. Ensure bot is added to server with `applications.commands` scope
3. Manually register: `npm run discord:register:force`

### Registration Failures
1. Verify environment variables are set correctly
2. Check Discord API rate limits (rare)
3. Ensure bot token has correct permissions

### Development Issues
1. Commands may take up to 1 hour to appear globally
2. Use guild-specific commands for faster testing (future enhancement)
3. Clear commands if needed: `npm run discord:clear`

## 📝 Adding New Commands

1. Update the `commands` array in `scripts/register-discord-commands.js`
2. Add command handling logic in `app/api/discord/webhooks/route.ts`
3. Run `npm run discord:register` to update Discord
4. Test the new command in your Discord server

The system will automatically register your new commands in production deployments.