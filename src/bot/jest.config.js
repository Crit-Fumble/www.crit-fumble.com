export default {
  moduleFileExtensions: ['js', 'json'],
  rootDir: '.',
  testRegex: '/__tests__/.*\\.test\\.js$',
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  experimental: {
    vm: true
  },
  collectCoverageFrom: [
    '**/*.js',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'lcov'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
};
