# @crit-fumble/openai

A TypeScript client library for the OpenAI API, designed for Crit-Fumble applications.

## Installation

```bash
npm install @crit-fumble/openai
```

## FeaturesII

- TypeScript definitions for OpenAI API responses
- Client implementation for OpenAI API endpoints
- Type-safe API client with automatic error handling
- Configuration management for API keys and options
- Support for multiple OpenAI models and endpoints

## Usage

### Basic Usage

```typescript
import { OpenAIClient } from '@crit-fumble/openai';

const openai = new OpenAIClient('your-api-key');

// Generate text with GPT-4
const completion = await openai.createCompletion({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Write a short poem about coding.' }
  ]
});

console.log(completion.choices[0].message.content);
```ii

### Using with Configuration

```typescript
import { OpenAiApiClient } from '@crit-fumble/openai/server';
import { setOpenAiConfig } from '@crit-fumble/openai/server/configs';

// Configure OpenAI globally
setOpenAiConfig({
  apiKey: 'your-api-key',
  defaultChatModel: 'gpt-4',
  defaultTemperature: 0.7
});

// Client will use the global configuration
const openai = new OpenAiApiClient();

// Or provide specific config just for this client
const openai = new OpenAiApiClient({
  apiKey: 'different-api-key',
  defaultChatModel: 'gpt-3.5-turbo'
});
```

### Advanced Configuration

```typescript
import { OpenAIClient, OpenAIClientConfig } from '@crit-fumble/openai';

const config: OpenAIClientConfig = {
  apiKey: 'your-api-key',
  organization: 'your-organization-id', // Optional
  baseURL: 'https://api.openai.com/v1', // Optional
  defaultModel: 'gpt-4', // Optional
  maxRetries: 3 // Optional
};

const openai = new OpenAIClient(config);
```

## Configuration

Configure the package using the `setOpenAiConfig` function:

```typescript
import { setOpenAiConfig } from '@crit-fumble/openai/server/configs';

setOpenAiConfig({
  apiKey: 'your-api-key',                      // Required
  organization: 'your-organization-id',        // Optional
  defaultChatModel: 'gpt-4',                   // Default model for chat completions
  defaultEmbeddingModel: 'text-embedding-3-small', // Default model for embeddings
  defaultTemperature: 0.7,                     // Default temperature for generations
  defaultMaxTokens: 1000,                      // Default maximum tokens for responses
  defaultImageSize: '1024x1024'                // Default size for image generations
});
```

## License

MIT
