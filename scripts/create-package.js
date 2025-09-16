#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createPackage(packageName) {
  if (!packageName) {
    console.error('Please provide a package name');
    process.exit(1);
  }

  const packagePath = path.join(__dirname, '..', 'packages', packageName);

  // Create package directory structure
  const directories = [
    '',
    'client',
    'models',
    'server',
    '__tests__',
    'docs'
  ];

  directories.forEach(dir => {
    fs.mkdirSync(path.join(packagePath, dir), { recursive: true });
  });

  // Create package.json
  const packageJson = {
    "name": `@crit-fumble/${packageName}`,
    "version": "0.1.0",
    "private": true,
    "type": "module",
    "main": "index.js",
    "types": "index.d.ts",
    "scripts": {
      "build": "tsc",
      "dev": "tsc -w",
      "test": "jest",
      "lint": "eslint ."
    },
    "dependencies": {},
    "devDependencies": {
      "typescript": "^5.8.2",
      "@types/jest": "^29.5.14",
      "@types/node": "^20.17.24",
      "jest": "^29.7.0",
      "ts-jest": "^29.1.2",
      "eslint": "^8"
    }
  };

  fs.writeFileSync(
    path.join(packagePath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create tsconfig.json
  const tsConfig = {
    "extends": "../../tsconfig.json",
    "compilerOptions": {
      "outDir": "./dist",
      "rootDir": ".",
      "composite": true
    },
    "include": [
      "**/*.ts",
      "**/*.tsx"
    ],
    "exclude": [
      "node_modules",
      "dist",
      "**/*.test.ts",
      "**/*.spec.ts"
    ]
  };

  fs.writeFileSync(
    path.join(packagePath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );

  // Create jest.config.js
  const jestConfig = `export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  extensionsToTreatAsEsm: ['.ts']
};
`;

  fs.writeFileSync(
    path.join(packagePath, 'jest.config.js'),
    jestConfig
  );

  // Create README.md
  const readme = `# @crit-fumble/${packageName}

## Description

Brief description of the package purpose and functionality.

## Installation

\`\`\`bash
npm install @crit-fumble/${packageName}
\`\`\`

## Usage

\`\`\`typescript
// Example usage code
\`\`\`

## Architecture

This package follows the standard @crit-fumble architecture:

- \`/client\` - Client-side code and interfaces
- \`/models\` - Data models and types
- \`/server\` - Server-side code
- \`/__tests__\` - Test files
- \`/docs\` - Documentation

## Development

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run tests:
   \`\`\`bash
   npm test
   \`\`\`

3. Build:
   \`\`\`bash
   npm run build
   \`\`\`
`;

  fs.writeFileSync(
    path.join(packagePath, 'README.md'),
    readme
  );

  // Create index.ts
  const indexTs = `// Main package exports
`;

  fs.writeFileSync(
    path.join(packagePath, 'index.ts'),
    indexTs
  );

  console.log(`Package @crit-fumble/${packageName} created successfully!`);
}

// Execute if run directly
const packageName = process.argv[2];
createPackage(packageName);