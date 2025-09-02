module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest'
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    '**/*.{js,ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: ['text', 'lcov'],
  verbose: true,
};
