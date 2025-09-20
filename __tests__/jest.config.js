/**
 * Jest Configuration for API Tests
 * 
 * Configures Jest for testing Next.js API routes with proper TypeScript support
 * and mocking capabilities.
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
  
  // Module resolution
  moduleNameMapping: {
    '^@crit-fumble/core/(.*)$': '<rootDir>/../packages/core/$1',
    '^@crit-fumble/react/(.*)$': '<rootDir>/../packages/react/$1',
    '^@crit-fumble/types/(.*)$': '<rootDir>/../packages/types/$1',
    '^@/(.*)$': '<rootDir>/../$1',
  },
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/setup.ts'
  ],
  
  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'app/api/**/*.{ts,tsx}',
    'packages/core/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
};