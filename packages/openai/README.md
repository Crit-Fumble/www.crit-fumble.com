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

### Using with Environment Variables

```typescript
import { OpenAIClient } from '@crit-fumble/openai';

// Will read OPENAI_API_KEY from environment
const openai = new OpenAIClient();

// Or explicitly from ConfigRegistry
import { ConfigRegistry } from '@crit-fumble/core';
const apiKey = ConfigRegistry.getInstance().get('OPENAI_API_KEY');
const openai = new OpenAIClient(apiKey);
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

Configure the package by setting environment variables:

```
OPENAI_API_KEY=your-api-key
OPENAI_ORGANIZATION=your-organization-id (optional)
```

## License

MIT
