export default {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/packages/$1'
  },
  testMatch: ['**/tests/web/**/*.test.(js|jsx|ts|tsx)'],
  collectCoverageFrom: [
    '**/packages/web/**/*.(js|jsx|ts|tsx)',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: ['text', 'lcov'],
  verbose: true,
  // Setup for Next.js components
  setupFilesAfterEnv: ['<rootDir>/tests/web/setup.js'],
};
