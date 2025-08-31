# ConfigRegistry Usage Guide

The ConfigRegistry is a central configuration management system for all Crit-Fumble packages. It provides a type-safe, centralized way to access environment variables and other configuration values.

## Type System

The ConfigRegistry uses a comprehensive type system defined in the core models:

```typescript
import { 
  ConfigValue,          // Basic configuration value types (string|number|boolean|null|undefined)
  ConfigSource,         // Record<string, ConfigValue>
  ConfigOptions,        // Options for accessing config values
  ConfigSchema,         // Schema for typed configurations
  EnvironmentConfig,    // Application environment requirements
  ConfigValidationError // Validation error structure
} from '@cfg/core/models';
```

## Initialization

The ConfigRegistry now supports more flexible initialization options:

```typescript
import { initializeConfig } from '@cfg/core/server/config';

// Simple initialization
initializeConfig();

// Advanced initialization with options
initializeConfig({
  validateRequired: true,          // Validate required keys immediately
  requiredConfigType: 'NEXT_WEB', // Which environment config to validate
  overwrite: false                // Don't overwrite existing values
});
```

### Next.js Application

In your Next.js application, initialize the ConfigRegistry in your app's entry point:

```typescript
// app/layout.tsx or equivalent
import { initializeConfig, verifyRequiredConfig, REQUIRED_CONFIG } from '@cfg/core/config';

// Initialize at application startup
export function RootLayout({ children }: { children: React.ReactNode }) {
  // Initialize with process.env
  initializeConfig();
  
  // Optionally verify required configs for the application
  try {
    verifyRequiredConfig(REQUIRED_CONFIG.NEXT_WEB);
  } catch (error) {
    console.error('Missing required configuration:', error.message);
    // Handle gracefully in production
  }
  
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Discord Bot

In your Discord bot, initialize at the entry point:

```typescript
// index.js or server.js
import { initializeConfig, verifyRequiredConfig, REQUIRED_CONFIG } from '@cfg/core/config';

// Initialize before starting the bot
initializeConfig();
verifyRequiredConfig(REQUIRED_CONFIG.DISCORD_BOT);

// Continue with bot initialization
// ...
```

## Using Configuration

### Error Handling

The ConfigRegistry provides robust error handling for validation:

```typescript
import { verifyRequiredConfig, REQUIRED_CONFIG } from '@cfg/core/server/config';

// Get validation errors without throwing
const errors = verifyRequiredConfig(REQUIRED_CONFIG.NEXT_WEB, false);
if (errors.length > 0) {
  console.warn('Configuration warnings:', errors);
}

// Or let it throw errors (default behavior)
try {
  verifyRequiredConfig(REQUIRED_CONFIG.DISCORD_BOT); 
} catch (error) {
  console.error('Fatal configuration error:', error.message);
}
```

### Environment-Specific Configuration

Retrieve configuration filtered by environment:

```typescript
import { ConfigRegistry } from '@cfg/core/server/config';

// Get all development-prefixed config with prefix removed
const devConfig = ConfigRegistry.getInstance().getAll('development');
// e.g., DEVELOPMENT_API_URL becomes just API_URL in the result
```

### Using Service Configs

```typescript
// Import specific services
import { discord, postgres, openAi } from '@cfg/core/config';

// Example: Connect to database
async function connectToDb() {
  const connection = await createConnection({
    host: postgres.host,
    port: postgres.port,
    user: postgres.user,
    password: postgres.password,
    database: postgres.database,
  });
  return connection;
}

// Example: Initialize Discord client
const client = new Discord.Client({
  intents: [...],
  token: discord.key,
});
```

### Using Auth Config

```typescript
import NextAuth from 'next-auth';
import { authConfig } from '@cfg/core/config';

// Use the auth config directly
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
```

### Direct Registry Access

For specialized cases, you can access the registry directly:

```typescript
import { ConfigRegistry } from '@cfg/core/config';

// Get with fallback
const apiKey = ConfigRegistry.getInstance().get('CUSTOM_API_KEY', 'default-key');

// Get required value (throws if missing)
const requiredValue = ConfigRegistry.getInstance().requireConfig('MUST_HAVE_THIS');

// Get a section of configuration with common prefix
const allAwsConfig = ConfigRegistry.getInstance().getSection('AWS_');
```

## Advanced Features

### Schema Validation

You can define typed schemas for your configuration:

```typescript
import { ConfigSchema } from '@cfg/core/models';

// Define a schema for database configuration
interface DatabaseConfigSchema extends ConfigSchema {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

// Use it with type safety
function getDatabaseConfig(): DatabaseConfigSchema {
  const registry = ConfigRegistry.getInstance();
  return {
    host: registry.get('DB_HOST', 'localhost'),
    port: registry.get<number>('DB_PORT', 5432),
    username: registry.requireConfig('DB_USERNAME'),
    password: registry.requireConfig('DB_PASSWORD'),
    database: registry.get('DB_NAME', 'default')
  };
}
```

## Testing

The ConfigRegistry makes testing easier by allowing you to mock configuration:

```typescript
import { ConfigRegistry } from '@cfg/core/config';

describe('My Service', () => {
  beforeEach(() => {
    // Reset and initialize with test values
    ConfigRegistry.getInstance().reset();
    ConfigRegistry.getInstance().initialize({
      'API_KEY': 'test-api-key',
      'API_URL': 'http://test-api.local',
    });
  });
  
  it('should use the API key from config', () => {
    const service = new MyService();
    expect(service.apiKey).toBe('test-api-key');
  });
});
```
