export default {
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/tests/discord/bot/**/*.test.js'],
  collectCoverageFrom: [
    '**/packages/discord/bot/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: ['text', 'lcov'],
  verbose: true,
  // Important for proper sourcemap support
  transformIgnorePatterns: [],
  // Setup file for bot tests
  setupFilesAfterEnv: ['<rootDir>/tests/discord/bot/setup.js'],
};
