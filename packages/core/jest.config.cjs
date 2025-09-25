// Package-specific Jest config for @crit-fumble/core
// Loads the workspace test config and adjusts moduleNameMapper for package-relative paths
const rootConfig = require('../../jest.config.test.cjs');

// Clone and adjust moduleNameMapper for package context
const moduleNameMapper = Object.assign({}, rootConfig.moduleNameMapper, {
  '^@crit-fumble/core/(.*)$': '<rootDir>/$1',
  '^@crit-fumble/react/(.*)$': '<rootDir>/../react/$1',
  '^@crit-fumble/types/(.*)$': '<rootDir>/../types/$1',
  '^@crit-fumble/worldanvil/(.*)$': '<rootDir>/../worldanvil/$1',
  '^@/(.*)$': '<rootDir>/../../$1',
});

module.exports = Object.assign({}, rootConfig, {
  moduleNameMapper,
});
