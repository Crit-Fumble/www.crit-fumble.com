# Testing with the Discord Client Interface

This document provides examples of how to effectively test components that use the Discord API client.

## Basic Mock Setup

The Discord package now includes an interface `IDiscordClient` that makes it easier to test components without relying on the actual Discord.js client.

```typescript
import { 
  IDiscordClient, 
  createMockDiscordClient,
  DiscordApiClient
} from '@crit-fumble/discord';

describe('MyDiscordService', () => {
  let mockClient: IDiscordClient;
  let apiClient: DiscordApiClient;
  let service: MyDiscordService;
  
  beforeEach(() => {
    // Create a mock client using the helper function
    mockClient = createMockDiscordClient();
    
    // Pass the mock client to the API client
    apiClient = new DiscordApiClient({}, mockClient);
    
    // Initialize the service with the API client
    service = new MyDiscordService(apiClient);
  });
  
  test('should send a message to a channel', async () => {
    // Arrange: Set up the mock client response
    const mockChannelId = 'channel-123';
    const mockMessage = 'Test message';
    
    // Act: Call the service method
    await service.sendMessage(mockChannelId, mockMessage);
    
    // Assert: Verify the mock was called correctly
    expect(mockClient.channels.fetch).toHaveBeenCalledWith(mockChannelId);
    // Add more assertions based on your implementation
  });
});
```

## Custom Mock Behavior

You can customize the mock behavior for specific test cases:

```typescript
import { IDiscordClient, DiscordApiClient } from '@crit-fumble/discord';

describe('Error handling tests', () => {
  let mockClient: IDiscordClient;
  let apiClient: DiscordApiClient;
  
  beforeEach(() => {
    // Create a custom mock client
    mockClient = {
      login: jest.fn().mockResolvedValue('token'),
      destroy: jest.fn(),
      once: jest.fn(),
      on: jest.fn(),
      guilds: {
        fetch: jest.fn().mockRejectedValue(new Error('Guild not found')), // Simulate error
        cache: new Map()
      },
      channels: {
        fetch: jest.fn().mockResolvedValue({
          id: 'channel-123',
          send: jest.fn().mockResolvedValue({ id: 'message-id' })
        }),
        cache: new Map()
      },
      users: {
        fetch: jest.fn().mockResolvedValue({ id: 'user-123' }),
        cache: new Map()
      }
    };
    
    apiClient = new DiscordApiClient({}, mockClient);
  });
  
  test('should handle guild not found error gracefully', async () => {
    // Act & Assert
    await expect(apiClient.getGuild('invalid-id')).rejects.toThrow('Guild not found');
    // Test your error handling logic
  });
});
```

## Testing Edge Cases

Here are examples of testing edge cases:

```typescript
describe('Edge case tests', () => {
  let mockClient: IDiscordClient;
  let apiClient: DiscordApiClient;
  
  beforeEach(() => {
    mockClient = createMockDiscordClient();
    apiClient = new DiscordApiClient({}, mockClient);
  });
  
  test('should handle null response from API', async () => {
    // Arrange: Set up the mock to return null
    mockClient.channels.fetch = jest.fn().mockResolvedValue(null);
    
    // Act & Assert: Expect an error to be thrown
    await expect(apiClient.getChannel('channel-id')).rejects.toThrow();
  });
  
  test('should handle rate limiting errors', async () => {
    // Arrange: Mock a rate limit error
    const rateLimitError = new Error('Rate limited');
    rateLimitError.name = 'DiscordAPIError';
    (rateLimitError as any).code = 429; // Rate limit status code
    
    mockClient.users.fetch = jest.fn().mockRejectedValue(rateLimitError);
    
    // Act & Assert: Test your rate limiting handling logic
    await expect(apiClient.getUser('user-id')).rejects.toThrow();
    // Add assertions for any retry logic or error handling
  });
  
  test('should handle network errors', async () => {
    // Arrange: Mock a network error
    mockClient.login = jest.fn().mockRejectedValue(new Error('Network error'));
    
    // Act & Assert
    await expect(apiClient.initialize()).rejects.toThrow('Network error');
    // Test your network error handling logic
  });
});
```

## Integration with Service Testing

Here's an example of testing a service that depends on the Discord API client:

```typescript
import { DiscordEventService } from '@crit-fumble/discord';

describe('DiscordEventService', () => {
  let mockClient: IDiscordClient;
  let apiClient: DiscordApiClient;
  let eventService: DiscordEventService;
  
  beforeEach(() => {
    mockClient = createMockDiscordClient();
    apiClient = new DiscordApiClient({}, mockClient);
    eventService = new DiscordEventService(apiClient);
  });
  
  test('should create guild event', async () => {
    // Arrange
    const guildId = 'guild-123';
    const eventData = {
      name: 'Test Event',
      scheduled_start_time: '2023-01-01T12:00:00Z'
    };
    
    // Act
    const result = await eventService.createGuildEvent(guildId, eventData);
    
    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('name', eventData.name);
    expect(mockClient.guilds.fetch).toHaveBeenCalledWith(guildId);
  });
  
  // Additional tests for different event service methods...
});
```

By using the `IDiscordClient` interface and dependency injection, you can thoroughly test your Discord-related code without relying on the actual Discord API.
