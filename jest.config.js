export default {
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  transform: {
    '^.+\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    '**/*.{js,ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: ['text', 'lcov'],
  verbose: true,
};
