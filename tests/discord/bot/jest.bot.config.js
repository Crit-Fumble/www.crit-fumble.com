export default {
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/tests/bot/**/*.test.js'],
  collectCoverageFrom: [
    '**/src/bot/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: ['text', 'lcov'],
  verbose: true,
  // Important for proper sourcemap support
  transformIgnorePatterns: [],
  // Setup file for bot tests
  setupFilesAfterEnv: ['<rootDir>/tests/bot/setup.js'],
};
