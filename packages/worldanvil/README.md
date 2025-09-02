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
- Comprehensive services for worlds, articles, maps, timelines, and more
- Type-safe API client with automatic error handling
- Dependency injection support for testing

## Available Services

- **WorldAnvilApiClient**: Low-level HTTP client for World Anvil API
- **WorldAnvilArticleService**: Article management 
- **WorldAnvilAuthService**: Authentication and OAuth
- **WorldAnvilBlockService**: Content block operations
- **WorldAnvilBlockTemplateService**: Block templates management
- **WorldAnvilCanvasService**: Canvas functionality
- **WorldAnvilCategoryService**: Category organization
- **WorldAnvilEntityService**: Entity management
- **WorldAnvilImageService**: Image upload and management
- **WorldAnvilItemService**: Item management
- **WorldAnvilMapService**: Maps and map pins
- **WorldAnvilManuscriptService**: Manuscript handling
- **WorldAnvilNotebookService**: Notebook operations
- **WorldAnvilSecretService**: Secret content management
- **WorldAnvilSubscriberGroupService**: Subscriber group management
- **WorldAnvilTimelineService**: Timeline operations
- **WorldAnvilUserService**: User data and authentication
- **WorldAnvilVariableService**: Variable management
- **WorldAnvilWorldService**: World operations

## Usage

### Configuration

Configure the package by setting environment variables:

```
WORLD_ANVIL_API_URL=https://www.worldanvil.com/api/aragorn
WORLD_ANVIL_CLIENT_ID=your-client-id
WORLD_ANVIL_CLIENT_SECRET=your-client-secret
```

### Controller Usage

The package provides a unified controller for easy access to all services:

```typescript
import { WorldAnvilController } from '@crit-fumble/worldanvil';

// Create controller with optional access token and API key
const controller = new WorldAnvilController({ 
  accessToken: 'your-access-token',  // Optional
  apiKey: 'your-api-key'            // Optional
});

// Access any service through the controller
const worlds = await controller.world.getMyWorlds();
const articles = await controller.article.getArticlesByWorld('world-id');
```

### Direct Service Usage

#### Authentication

```typescript
import { WorldAnvilAuthService } from '@crit-fumble/worldanvil';

const authService = new WorldAnvilAuthService();

// Generate authorization URL
const authUrl = authService.getAuthorizationUrl('your-redirect-uri');
// Redirect user to authUrl

// After OAuth redirect
const tokens = await authService.getAccessToken('auth-code-from-redirect', 'your-redirect-uri');
```

#### User Operations

```typescript
import { WorldAnvilUserService } from '@crit-fumble/worldanvil';

// Create service with client
const userService = new WorldAnvilUserService();

// Set access token if not provided in constructor
userService.setAccessToken('your-access-token');

// Get current authenticated user
const currentUser = await userService.getCurrentUser();
console.log(`Hello, ${currentUser.username}!`);

// Get user by ID or username
const userById = await userService.getUserById('user-id');
const userByName = await userService.getUserByUsername('username');
```

#### World Operations

```typescript
import { WorldAnvilWorldService } from '@crit-fumble/worldanvil';

// Create service
const worldService = new WorldAnvilWorldService();
worldService.setAccessToken('your-access-token');

// Get worlds for the authenticated user
const myWorlds = await worldService.getMyWorlds();

// Get worlds by user ID
const userWorlds = await worldService.getWorldsByUser('user-id');

// Get world by ID or slug
const world = await worldService.getWorldById('world-id');
const worldBySlug = await worldService.getWorldBySlug('world-slug');
```

#### Article Operations

```typescript
import { WorldAnvilArticleService } from '@crit-fumble/worldanvil';

const articleService = new WorldAnvilArticleService();
articleService.setAccessToken('your-access-token');

// Get articles by world
const articles = await articleService.getArticlesByWorld('world-id');

// Get specific article
const article = await articleService.getArticleById('article-id');
```

#### Map Operations

```typescript
import { WorldAnvilMapService } from '@crit-fumble/worldanvil';

const mapService = new WorldAnvilMapService();
mapService.setAccessToken('your-access-token');

// Get maps for a world
const maps = await mapService.getMapsByWorld('world-id');

// Get map details
const map = await mapService.getMapById('map-id');

// Get map pins
const pins = await mapService.getMapPins('map-id');
```

#### Manuscript Operations

```typescript
import { WorldAnvilManuscriptService } from '@crit-fumble/worldanvil';

const manuscriptService = new WorldAnvilManuscriptService();
manuscriptService.setAccessToken('your-access-token');

// Get manuscripts for a world
const manuscripts = await manuscriptService.getManuscriptsByWorld('world-id');

// Get manuscript by ID with specified granularity (0-3)
const manuscript = await manuscriptService.getManuscriptById('manuscript-id', '1');

// Create a new manuscript
const newManuscript = await manuscriptService.createManuscript({
  title: 'My New Novel',
  world: { id: 'world-id' }
});

// Update a manuscript
const updatedManuscript = await manuscriptService.updateManuscript({
  id: 'manuscript-id',
  title: 'Updated Novel Title'
});

// Delete a manuscript
await manuscriptService.deleteManuscript('manuscript-id');

// Working with manuscript versions
const versions = await manuscriptService.getVersionsByManuscript('manuscript-id');
const version = await manuscriptService.getManuscriptVersionById('version-id');
const newVersion = await manuscriptService.createManuscriptVersion({
  title: 'First Draft',
  manuscript: { id: 'manuscript-id' }
});

// Working with manuscript parts
const parts = await manuscriptService.getPartsByVersion('version-id');
const part = await manuscriptService.getManuscriptPartById('part-id');
const newPart = await manuscriptService.createManuscriptPart({
  title: 'Chapter 1',
  version: { id: 'version-id' }
});

// Working with manuscript beats
const beats = await manuscriptService.getBeatsByPart('part-id');
const beat = await manuscriptService.getManuscriptBeatById('beat-id');
const newBeat = await manuscriptService.createManuscriptBeat({
  title: 'Introduction Scene',
  content: 'Scene content goes here...',
  part: { id: 'part-id' }
});

// Working with manuscript bookmarks
const bookmarks = await manuscriptService.getBookmarksByManuscript('manuscript-id');
const bookmark = await manuscriptService.getManuscriptBookmarkById('bookmark-id');
const newBookmark = await manuscriptService.createManuscriptBookmark({
  title: 'Important Plot Point',
  manuscript: { id: 'manuscript-id' },
  beat: { id: 'beat-id' }
});
```

### Direct API Access

For advanced usage, access the API directly:

```typescript
import { WorldAnvilApiClient } from '@crit-fumble/worldanvil';

const apiClient = new WorldAnvilApiClient();
apiClient.setAccessToken('your-access-token');

// Make GET request
const response = await apiClient.get('/user/me');

// Make POST request with data
const createResponse = await apiClient.post('/article/create', {
  title: 'New Article',
  content: 'Article content'
});
```

## Testing

The package supports dependency injection for easy mocking in tests:

```typescript
import { WorldAnvilWorldService } from '@crit-fumble/worldanvil';

// Mock API client
const mockClient = {
  get: jest.fn(),
  post: jest.fn(),
  // ... other methods
};

// Inject mock client
const service = new WorldAnvilWorldService(mockClient);

// Test with mock
mockClient.get.mockResolvedValue({ /* mock data */ });
const result = await service.getWorldById('world-id');
```

## License

MIT
