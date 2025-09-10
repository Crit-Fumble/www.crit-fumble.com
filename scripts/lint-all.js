#!/usr/bin/env node

/**
 * Script to run ESLint across the entire monorepo
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Default patterns to lint
const defaultPatterns = [
  'packages/*/server/**/*.ts',
  'packages/*/client/**/*.ts',
  'packages/*/client/**/*.tsx',
  'packages/*/models/**/*.ts',
  'packages/*/*.ts',
  // Exclude files
  '!packages/*/node_modules/**',
  '!packages/*/**/*.d.ts',
];

try {
  // Get arguments - allow passing additional directories or files to lint
  const args = process.argv.slice(2);
  const patterns = args.length > 0 ? args : defaultPatterns;
  
  console.log('Running ESLint on the entire repository...');
  console.log(`Linting patterns: ${patterns.join(', ')}`);
  
  const command = `npx eslint ${patterns.join(' ')} --ext .js,.jsx,.ts,.tsx`;
  
  execSync(command, {
    stdio: 'inherit',
    cwd: rootDir
  });
  
  console.log('Linting completed successfully!');
} catch (error) {
  console.error('Linting failed with errors.');
  process.exit(1);
}
