export default {
  moduleFileExtensions: ['js', 'ts', 'json'],
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest'
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1'
  },
  testMatch: ['**/tests/lib/**/*.test.(js|ts)'],
  collectCoverageFrom: [
    '**/src/lib/**/*.(js|ts)',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: ['text', 'lcov'],
  verbose: true,
};
