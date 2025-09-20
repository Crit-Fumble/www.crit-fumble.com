/**
 * Jest Test Setup
 * 
 * Global test setup and configuration for all test files.
 */

import { jest } from '@jest/globals';

// Mock Next.js modules that are commonly used
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      headers: new Map(Object.entries(init?.headers || {})),
      text: jest.fn().mockResolvedValue(JSON.stringify(data)),
      json: jest.fn().mockResolvedValue(data),
    })),
    redirect: jest.fn((url, init) => ({
      status: init?.status || 307,
      headers: new Map([['location', url]]),
      text: jest.fn().mockResolvedValue(''),
      cookies: {
        set: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
      },
    })),
  },
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock environment variables
process.env.NODE_ENV = 'test';

// Global test utilities
global.console = {
  ...console,
  // Suppress specific console methods during tests unless explicitly enabled
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup common test data
export const testConstants = {
  MOCK_USER_ID: 'test-user-123',
  MOCK_ADMIN_ID: 'test-admin-456', 
  MOCK_DISCORD_ID: 'discord-user-789',
  MOCK_GUILD_ID: 'discord-guild-123',
  MOCK_BASE_URL: 'http://localhost:3000',
  MOCK_EMAIL: 'test@example.com',
};

// Utility to reset all mocks between tests
export const resetAllMocks = () => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
};