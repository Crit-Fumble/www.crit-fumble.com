# @crit-fumble/worldanvil

A TypeScript client library for the World Anvil API, designed for Crit-Fumble applications.

## Installation

```bash
npm install @crit-fumble/worldanvil
```

## Features

- TypeScript definitions for World Anvil API responses
- Client implementation for World Anvil API endpoints
- User authentication and OAuth token management
- World fetching and management
- Type-safe API client with automatic error handling

## Usage

### Authentication

```typescript
import { WorldAnvilUserService } from '@crit-fumble/worldanvil';

const userService = new WorldAnvilUserService();

// OAuth authentication flow
const authUrl = userService.getAuthorizationUrl('your-redirect-uri');
// Redirect user to authUrl

// After OAuth redirect
const tokens = await userService.getAccessToken('auth-code-from-redirect', 'your-redirect-uri');
```

### Fetching User Data

```typescript
import { WorldAnvilUserService } from '@crit-fumble/worldanvil';

const userService = new WorldAnvilUserService();
const user = await userService.getUser('access-token');
console.log(`Hello, ${user.username}!`);
```

### Fetching Worlds

```typescript
import { WorldAnvilWorldService } from '@crit-fumble/worldanvil';

const worldService = new WorldAnvilWorldService();

// Get worlds for the authenticated user
const worlds = await worldService.getMyWorlds('access-token');

// Get world by ID
const world = await worldService.getWorldById('access-token', 'world-id');

// Get world by slug
const worldBySlug = await worldService.getWorldBySlug('access-token', 'world-slug');
```

### Direct API Access

```typescript
import { WorldAnvilApiService } from '@crit-fumble/worldanvil';

const apiService = new WorldAnvilApiService('access-token');
const response = await apiService.get('/user');
```

## Configuration

Configure the package by setting environment variables:

```
WORLD_ANVIL_CLIENT_ID=your-client-id
WORLD_ANVIL_CLIENT_SECRET=your-client-secret
```

## License

MIT
