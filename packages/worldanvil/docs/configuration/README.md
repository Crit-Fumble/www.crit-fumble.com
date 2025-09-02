# WorldAnvil Package Configuration

This document describes how to configure the WorldAnvil package in your host application.

## Overview

The WorldAnvil package provides a configuration system that allows:

1. Programmatically setting configuration from the host application
2. Dependency injection for easier testing

## Configuration Options

The main configuration interface is `WorldAnvilConfig`:

```typescript
interface WorldAnvilConfig {
  /**
   * World Anvil API URL
   */
  apiUrl: string;
  
  /**
   * World Anvil API Key
   */
  apiKey: string;
  
  /**
   * Optional access token for authenticated requests
   */
  accessToken?: string;
}
```


## Host Application Configuration

In your host application, you can configure the WorldAnvil package using the `setWorldAnvilConfig` function:

```typescript
import { setWorldAnvilConfig } from '@crit-fumble/worldanvil/server/configs';

// Set configuration
setWorldAnvilConfig({
  apiUrl: 'https://www.worldanvil.com/api/v1', // Required
  apiKey: 'your-api-key',                      // Required
  accessToken: 'user-access-token'             // Optional
});
```

The configuration is stored in a singleton and will be used by all WorldAnvil services and clients throughout your application.

After setting the configuration, you can use the services directly:

```typescript
import { WorldAnvilUserService, WorldAnvilWorldService, WorldAnvilIdentityService } from '@crit-fumble/worldanvil/server/services';

const userService = new WorldAnvilUserService();
const worldService = new WorldAnvilWorldService();
const identityService = new WorldAnvilIdentityService();

// Use the services...
```

## Dependency Injection for Testing

For easier testing, all WorldAnvil services support dependency injection:

### Client-level Injection

```typescript
import { WorldAnvilApiClient, IWorldAnvilHttpClient } from '@crit-fumble/worldanvil/server/clients';

// Create a mock HTTP client for testing
const mockHttpClient: IWorldAnvilHttpClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

// Inject the mock client
const client = new WorldAnvilApiClient({
  apiKey: 'test-key',
  apiUrl: 'https://test-api.worldanvil.com'
}, mockHttpClient);
```

### Service-level Injection

```typescript
import { WorldAnvilUserService } from '@crit-fumble/worldanvil/server/services';
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil/server/clients';

// Mock the client
const mockClient = jest.fn<WorldAnvilApiClient>(() => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  setApiKey: jest.fn(),
  setAccessToken: jest.fn()
}))();

// Create service with mock client
const userService = new WorldAnvilUserService(mockClient);
```

## Testing Utilities

For test environments, a special utility function is provided to reset the configuration between tests:

```typescript
import { resetWorldAnvilConfigForTests } from '@crit-fumble/worldanvil/server/configs';

beforeEach(() => {
  // Reset the configuration to default values
  resetWorldAnvilConfigForTests();
});
```

This function will only work in test environments (when `process.env.NODE_ENV === 'test'`).

## Available Services

The package includes the following services:

- `WorldAnvilUserService`: For user authentication and profile management
- `WorldAnvilWorldService`: For managing worlds and their content
- `WorldAnvilRpgSystemService`: For accessing RPG system information
- `WorldAnvilIdentityService`: For verifying user sessions and identity
