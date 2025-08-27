/** @type {import('jest').Config} */
module.exports = {
  // File extensions to look for
  moduleFileExtensions: ['js', 'json'],
  
  // Use babel for transpiling
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.bot.cjs' }]
  },
  
  // Use Node.js environment for bot tests
  testEnvironment: 'node',
  
  // Support importing ESM files
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  
  // Look for test files in the bot test directory
  testMatch: ['**/tests/bot/**/*.test.js'],
  
  // Files to collect coverage from
  collectCoverageFrom: [
    '**/src/bot/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  
  // Coverage report formats
  coverageReporters: ['text', 'lcov'],
  
  // Detailed output
  verbose: true,
  
  // Don't transform any node_modules - process them as-is
  transformIgnorePatterns: [],
  
  // Setup files for bot tests
  setupFilesAfterEnv: ['<rootDir>/tests/bot/setup.js']
};
