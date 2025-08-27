export default {
  moduleFileExtensions: ['js', 'ts', 'json'],
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest'
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/lib/(.*)$': '<rootDir>/packages/lib/$1'
  },
  testMatch: ['**/tests/lib/**/*.test.(js|ts)'],
  collectCoverageFrom: [
    '**/packages/lib/**/*.(js|ts)',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: ['text', 'lcov'],
  verbose: true,
};
