# API Test Suite

Comprehensive unit tests for the Crit-Fumble API endpoints with dependency injection and proper mocking.

## Test Structure

### `/utils/api-test-helpers.ts`
Common utilities for testing Next.js API routes:
- Mock request/response creation
- Service mocking functions
- Response assertion helpers
- Test data constants

### API Endpoint Tests

#### Admin API Tests (`/api/admin/`)
- **`users/route.test.ts`** - User listing and creation endpoints
- **`users/[id]/route.test.ts`** - Individual user CRUD operations
- **`users/suggestions/route.test.ts`** - User autocomplete endpoint

#### Auth API Tests (`/api/auth/`)
- **`auth.test.ts`** - Discord OAuth and logout functionality

### Service Tests (`/packages/core/services/`)
- **`PermissionService.test.ts`** - Web admin vs Discord server permission validation
- **`SiteAdminProtection.test.ts`** - Security boundary enforcement

## Testing Principles

### 1. Dependency Injection
All external dependencies are properly mocked:
```typescript
const mockUserService = createMockUserManagementService();
jest.mock('@crit-fumble/core/server/services', () => ({
  UserManagementService: jest.fn(() => mockUserService),
}));
```

### 2. Isolated Unit Tests
Each test focuses on a single function/endpoint without external dependencies:
- Database calls are mocked
- HTTP requests are mocked
- File system operations are mocked
- Environment variables are controlled

### 3. Comprehensive Coverage
Tests cover:
- ✅ Happy path scenarios
- ✅ Error conditions
- ✅ Edge cases
- ✅ Authentication/authorization
- ✅ Input validation
- ✅ Security boundaries

### 4. Clear Test Structure
Each test follows AAA pattern:
```typescript
it('should do something when condition is met', () => {
  // Arrange - Setup mocks and data
  
  // Act - Execute the function under test
  
  // Assert - Verify expected outcomes
});
```

## Running Tests

### Run All Tests
```bash
npm run test
```

### Run Specific Test Files
```bash
npm run test -- __tests__/api/admin/users/route.test.ts
```

### Run with Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

## Test Configuration

### Jest Config (`jest.config.js`)
- TypeScript support with ts-jest
- Module path mapping for monorepo packages
- Coverage thresholds (80% minimum)
- Proper test environment setup

### Setup File (`setup.ts`)
- Global mocks for Next.js modules
- Common test utilities
- Environment configuration

## Key Testing Features

### 1. Admin Authentication Testing
```typescript
// Test admin-only endpoints
mockWithAdminAuth.mockImplementation((handler) => {
  return jest.fn(async () => {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  });
});
```

### 2. Permission System Testing
```typescript
// Test security boundaries
expect(
  permissionService.canDiscordServerContextGrantWebAdmin(discordContext)
).toBe(false);
```

### 3. HTTP Request/Response Testing
```typescript
// Mock Next.js requests
const request = createMockNextRequest({
  method: 'POST',
  url: 'http://localhost:3000/api/admin/users',
  body: userData,
});

const response = await handler(request);
const result = await extractResponseData(response);

assertResponse.created(result, expectedData);
```

### 4. Error Handling Testing
```typescript
// Test service errors
mockUserService.createUser.mockRejectedValue(new Error('Database error'));
const result = await handler(request);
assertResponse.serverError(result);
```

## Security Testing

### Permission Isolation
Tests verify complete separation between Discord and web admin permissions:

```typescript
describe('Security Boundaries', () => {
  it('should never allow Discord permissions to grant web admin access', () => {
    const result = siteAdminProtection.canDiscordPermissionsGrantWebAccess(
      discordContext,
      WebAdminOperation.WEB_ADMINISTRATION
    );
    expect(result).toBe(false);
  });
});
```

### Authentication Testing
All protected endpoints are tested for proper authentication:

```typescript
it('should require admin authentication', async () => {
  // Test unauthenticated request
  const response = await protectedHandler(request);
  assertResponse.unauthorized(response);
});
```

## Coverage Goals

- **Lines**: 80%+ 
- **Functions**: 80%+
- **Branches**: 80%+
- **Statements**: 80%+

Focus areas:
- All API endpoints
- Permission services
- Authentication middleware
- Error handling paths

## Best Practices

### 1. Mock External Dependencies
```typescript
// ✅ Good - Mock the service
const mockUserService = createMockUserManagementService();

// ❌ Bad - Use real service (integration test)
const userService = new UserManagementService();
```

### 2. Test Business Logic, Not Implementation
```typescript
// ✅ Good - Test behavior
expect(result.allowed).toBe(false);
expect(result.reason).toContain('insufficient permissions');

// ❌ Bad - Test implementation details
expect(mockService.someInternalMethod).toHaveBeenCalled();
```

### 3. Use Descriptive Test Names
```typescript
// ✅ Good
it('should return 404 when user does not exist');

// ❌ Bad  
it('should fail');
```

### 4. Group Related Tests
```typescript
describe('Authentication', () => {
  describe('when user is not authenticated', () => {
    it('should return 401 for protected endpoints');
  });
  
  describe('when user lacks admin privileges', () => {
    it('should return 403 for admin endpoints');
  });
});
```

## Maintenance

### Adding New Tests
1. Follow existing patterns in similar test files
2. Use the test helpers from `api-test-helpers.ts`
3. Mock all external dependencies
4. Test both success and failure scenarios
5. Verify authentication/authorization requirements

### Updating Tests
When API changes are made:
1. Update corresponding test files
2. Ensure mocks match new service interfaces
3. Verify coverage thresholds are maintained
4. Run full test suite to catch regressions