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
    '<rootDir>/__tests__/**/*.test.ts',
    '<rootDir>/__tests__/**/*.test.tsx',
  ],
  
  // Module resolution
  moduleNameMapper: {
    '^@crit-fumble/core/(.*)$': '<rootDir>/packages/core/$1',
    '^@crit-fumble/react/(.*)$': '<rootDir>/packages/react/$1',
    '^@crit-fumble/types/(.*)$': '<rootDir>/packages/types/$1',
    '^@crit-fumble/worldanvil/(.*)$': '<rootDir>/packages/worldanvil/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/setup.ts'
  ],
  
  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    }],
  },
  
  // File extensions to recognize
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Coverage configuration
  collectCoverage: false, // Disabled for initial testing
  coverageDirectory: '__tests__/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Files to include in coverage
  collectCoverageFrom: [
    'app/api/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/dist/**',
  ],
  
  // Mock configuration
  clearMocks: true,
  restoreMocks: true,
  
  // Timeout for tests
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
};