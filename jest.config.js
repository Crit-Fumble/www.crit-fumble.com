export default {
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  transform: {
    '^.+\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/tests/**/*.test.js', '**/__tests__/**/*.test.js', '**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    '**/*.{js,ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: ['text', 'lcov'],
  verbose: true,
};
