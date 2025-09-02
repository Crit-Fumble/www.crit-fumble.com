# @crit-fumble/discord

A TypeScript client library for Discord API integration, designed for Crit-Fumble applications.

## Installation

```bash
npm install @crit-fumble/discord
```

## Features

- TypeScript definitions for Discord API responses
- Client implementation for Discord API endpoints
- Bot command registration and management
- Guild event scheduling and management
- Channel message handling
- Type-safe API client with automatic error handling
- Framework-agnostic HTTP interfaces

## Usage

### Basic Usage

```typescript
import { DiscordApiClient } from '@crit-fumble/discord';

// Initialize the client
const discord = new DiscordApiClient({
  botToken: 'your-bot-token',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});

await discord.initialize();

// Send a message to a channel
await discord.sendMessage('channel-id', 'Hello from Crit-Fumble!');
```

### Working with Guild Events

```typescript
import { DiscordEventService } from '@crit-fumble/discord';

const eventService = new DiscordEventService();
await eventService.initialize();

// Get all events for a guild
const events = await eventService.getGuildEvents('guild-id');

// Create a new event
const newEvent = await eventService.createGuildEvent('guild-id', {
  name: 'Game Night',
  scheduled_start_time: '2023-12-01T20:00:00.000Z',
  entity_type: 2
});
```

### Bot Commands

```typescript
import { DiscordBotService } from '@crit-fumble/discord';

const botService = new DiscordBotService();
await botService.initialize();

// Register a new command
await botService.registerCommand('guild-id', {
  name: 'roll',
  description: 'Roll dice for your character',
  type: 1
});
```

### HTTP Controllers

The package provides framework-agnostic HTTP controllers that can be used with any HTTP server:

```typescript
import { DiscordController } from '@crit-fumble/discord';

// Set up the controller with required services
const controller = new DiscordController(eventService, botService);
await controller.initialize();

// Handle incoming HTTP request with generic HTTP interfaces
// Works with Express, Next.js, or any other HTTP framework
app.get('/api/discord/events', async (req, res) => {
  await controller.getGuildEvents(req, res);
});
```

## Configuration

Configure the package by setting environment variables:

```
DISCORD_PERSISTENT_BOT_TOKEN=your-bot-token
DISCORD_PERSISTENT_APP_ID=your-client-id
DISCORD_PERSISTENT_SECRET=your-client-secret
DISCORD_DEFAULT_GUILD_ID=your-default-guild-id
```

## HTTP Interfaces

The package uses generic HTTP interfaces instead of framework-specific types:

```typescript
interface HttpRequest {
  query?: Record<string, string | string[]>;
  body?: any;
  headers?: Record<string, string | string[]>;
}

interface HttpResponse {
  status(code: number): {
    json(body: any): void;
    send(body: any): void;
  };
}
```

This allows the controllers to work with any HTTP framework.

## License

MIT
