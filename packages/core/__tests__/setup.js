"use strict";
/**
 * Test setup for @crit-fumble/core package
 * Global test configuration and mocks
 */
// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
// Clean up after each test
afterEach(function () {
    jest.restoreAllMocks();
});
//# sourceMappingURL=setup.js.map