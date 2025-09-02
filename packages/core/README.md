# Core Package

The Core package provides shared functionality used across the Crit-Fumble application, including authentication, integration with third-party services, and common utilities.

## Authentication System

The authentication system uses a unified approach with Discord OAuth as the primary login method, with additional support for API key management for services that don't support standard OAuth flows.

### User Authentication Flow

1. **Primary Authentication**: Users sign in via Discord OAuth using NextAuth.
2. **Session Management**: JWT sessions are used to maintain user state.
3. **User Records**: A unified user record is created in the database with related accounts linked through the `Account` table.

### API Key Management

For services that don't support OAuth (WorldAnvil, OpenAI), we provide API key management:

1. **Storage**: API keys are securely stored in the database with associations to user accounts.
2. **Validation**: Keys are validated against respective services before being stored.
3. **Usage**: Service implementations automatically use user-specific keys when available.

## Service Integration

### Service Pattern

All third-party service integrations follow a consistent pattern:

1. **Interface Definition**: Located in `models/<service>/I<Service>Service.ts`
2. **Service Implementation**: Located in `server/services/<Service>Service.ts`
3. **User-Specific Configuration**: Services dynamically load configuration based on user context

### Using Services with User Context

```typescript
// Example of using a service with user context
const worldAnvilService = new WorldAnvilService();
const worlds = await worldAnvilService.getWorlds(userId);

const openAIService = new OpenAIService();
const completion = await openAIService.createChatCompletion(messages, { 
  userId: userId,
  model: 'gpt-4o'
});
```

## Database Schema

The database uses Prisma with the following key models:

### User Model

Central user record that maintains core identity information.

### Account Model

Links external identity providers (like Discord) to the user.

### ApiKey Model

Stores API keys for various services:

```prisma
model ApiKey {
  id        String    @id @default(uuid())
  userId    String
  provider  String    // 'worldanvil', 'openai', etc.
  key       String
  token     String?   // Secondary token (e.g., WorldAnvil uses both key and token)
  name      String?   // Optional friendly name for the key
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("api_keys")
}
```

## Folder Structure

The core package uses a clear separation between interfaces/models and implementations:

- `/models` - Type definitions, interfaces, and DTOs
  - `/discord` - Discord-related interfaces
  - `/openai` - OpenAI-related interfaces
  - `/worldanvil` - WorldAnvil-related interfaces
  - `/auth` - Authentication-related models
  - `/user` - User-related models
  - `/prisma` - Prisma schema definitions

- `/server` - Server-side implementations
  - `/services` - Service implementations
  - `/config` - Configuration management

## API Key Management UI

The Next.js package includes a React component (`ApiKeyManager.tsx`) that provides a UI for managing API keys. This component can be embedded in any page that requires API key management functionality.

## Future Expansion

The authentication system is designed for future expansion:

1. **Additional OAuth Providers**: More OAuth providers can be added through NextAuth.
2. **Additional API-based Services**: The API key management system can be extended to support other services.
