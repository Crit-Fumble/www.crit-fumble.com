/**
 * Jest configuration file for architecture tests
 */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/architecture'],
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@crit-fumble/(.*)$': '<rootDir>/packages/$1',
  },
  bail: 1,
  verbose: true
};
