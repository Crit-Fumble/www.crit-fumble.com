export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
  },
  transform: {
    '^.+\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  // Setup file to run before tests
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  // Don't run setup.ts as a test
  testPathIgnorePatterns: ['<rootDir>/__tests__/setup.ts'],
};
