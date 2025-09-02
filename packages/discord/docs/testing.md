# Discord Package Testing Guide

## Overview

This document outlines the testing approach for the Discord package, including common testing patterns, mocking strategies, and solutions to common test issues.

## Testing Structure

The Discord package follows a comprehensive testing approach with tests for:

- **Config Module**: Configuration management tests
- **API Client**: Discord.js client wrapper tests
- **Services**:
  - DiscordAuthService
  - DiscordBotService
  - DiscordEventService
- **Controllers**: HTTP endpoint handlers for Discord operations

## Mocking Strategies

### Discord.js Client Mocking

The Discord package uses a custom interface `IDiscordClient` that abstracts the Discord.js client functionality. For testing:

```typescript
// Example mock client
const mockClient = {
  login: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  emit: jest.fn(),
  guilds: {
    fetch: jest.fn(),
    cache: new Map()
  },
  channels: {
    fetch: jest.fn(),
    cache: new Map()
  },
  users: {
    fetch: jest.fn(),
    cache: new Map()
  }
} as unknown as jest.Mocked<IDiscordClient>;
```

### HTTP Request Mocking

For OAuth flows and API interactions, we mock the global `fetch` API:

```typescript
// Mock fetch API
global.fetch = jest.fn();

// Mock implementation for successful response
(global.fetch as jest.Mock).mockImplementationOnce(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ /* response data */ })
  })
);
```

### HTTP Request/Response Mocking

For controller tests, we use generic HTTP interfaces instead of framework-specific types:

```typescript
// Generic HTTP request/response types
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

// Mock response setup
const jsonMock = jest.fn().mockReturnValue({});
const statusReturnMock = { json: jsonMock };
const statusMock = jest.fn().mockReturnValue(statusReturnMock);
const mockRes = { status: statusMock };
```

## Common Test Issues and Solutions

### Issue 1: Mocked Methods Not Being Called

**Problem**: Assertions fail when expecting a mocked method to be called, but Jest reports 0 calls.

**Solution**: Ensure mock implementation is correctly set up:

```typescript
// Set up the mock with implementation
mockClient.login.mockResolvedValueOnce('mocked-token');

// For explicit mock implementations that need to check arguments
mockService.methodName.mockImplementation((arg1, arg2) => {
  if (arg1 === expectedArg1 && arg2 === expectedArg2) {
    return Promise.resolve(successResult);
  }
  return Promise.resolve(failureResult);
});
```

### Issue 2: Parameter Mismatch in Requests

**Problem**: Tests fail because parameters don't match what's expected in implementation.

**Solution**: Match parameter names exactly as used in the implementation:

```typescript
// Example: Using refresh_token instead of refreshToken
mockReq.body = { refresh_token: refreshToken }; // Correct
mockReq.body = { refreshToken: refreshToken }; // Incorrect
```

### Issue 3: Discord API Client Initialization in Tests

**Problem**: Auth service tests may fail because the mock client isn't properly initialized.

**Solution**: When mocking the DiscordApiClient, forward customClient to the initialize method:

```typescript
jest.mock('../../../server/clients/DiscordApiClient', () => {
  return {
    DiscordApiClient: jest.fn().mockImplementation((config, customClient) => {
      if (customClient) {
        return {
          initialize: jest.fn().mockImplementation(() => {
            return customClient.login('mocked-token');
          })
        };
      }
      return {
        initialize: jest.fn().mockResolvedValue(undefined)
      };
    })
  };
});
```

### Issue 4: URL Encoding in OAuth Tests

**Problem**: OAuth URL tests fail because of encoding differences.

**Solution**: Discord uses `+` instead of `%20` for encoding spaces in query parameters:

```typescript
// For OAuth scope verification
expect(url).toContain('scope=identify+email+guilds');
```

## Best Practices

1. **Reset Mocks Between Tests**: Use `jest.clearAllMocks()` in `beforeEach` to ensure clean state
2. **Mock Only What's Necessary**: Mock external dependencies but keep the system under test real
3. **Test Error Handling**: Include tests for both success and failure scenarios
4. **Explicit Assertions**: Be specific about what you're testing and avoid relying on implementation details
5. **Test Independence**: Ensure tests can run independently without side effects

## Running Tests

Run all Discord package tests:

```bash
cd packages/discord
npm test
```

Run a specific test file:

```bash
npm test -- __tests__/server/services/DiscordAuthService.test.ts
```
