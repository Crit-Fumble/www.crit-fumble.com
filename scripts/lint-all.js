#!/usr/bin/env node

/**
 * Script to run ESLint across the entire monorepo
 * Usage: 
 *   npm run lint:all               - Lint all packages
 *   npm run lint:all core          - Lint only core package
 *   npm run lint:all core react    - Lint core and react packages
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Available packages with ESLint configurations
const availablePackages = ['core', 'react', 'next-web', 'discord-bot', 'worldanvil'];

// Default patterns for workspace-level linting
const workspacePatterns = [
  'scripts/**/*.js',
  '*.js',
  '*.ts'
];

try {
  // Get arguments - allow specifying specific packages to lint
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Lint all packages and workspace-level files
    console.log('Running ESLint on all packages and workspace files...');
    
    // First lint workspace-level files
    console.log('Linting workspace-level files...');
    const workspaceCommand = `npx eslint ${workspacePatterns.join(' ')}`;
    execSync(workspaceCommand, {
      stdio: 'inherit',
      cwd: rootDir
    });
    
    // Then lint each package
    for (const pkg of availablePackages) {
      const packagePath = path.join(rootDir, 'packages', pkg);
      const eslintConfigPath = path.join(packagePath, '.eslintrc.js');
      
      if (fs.existsSync(eslintConfigPath)) {
        console.log(`Linting package: ${pkg}...`);
        execSync(`npm run lint`, {
          stdio: 'inherit',
          cwd: packagePath
        });
      } else {
        console.log(`Skipping ${pkg} - no ESLint config found`);
      }
    }
  } else {
    // Lint specific packages
    const packagesToLint = args.filter(arg => availablePackages.includes(arg));
    const invalidPackages = args.filter(arg => !availablePackages.includes(arg));
    
    if (invalidPackages.length > 0) {
      console.warn(`Warning: Unknown packages ignored: ${invalidPackages.join(', ')}`);
      console.warn(`Available packages: ${availablePackages.join(', ')}`);
    }
    
    if (packagesToLint.length === 0) {
      console.error('No valid packages specified for linting.');
      console.log(`Available packages: ${availablePackages.join(', ')}`);
      process.exit(1);
    }
    
    console.log(`Linting packages: ${packagesToLint.join(', ')}...`);
    
    for (const pkg of packagesToLint) {
      const packagePath = path.join(rootDir, 'packages', pkg);
      const eslintConfigPath = path.join(packagePath, '.eslintrc.js');
      
      if (fs.existsSync(eslintConfigPath)) {
        console.log(`Linting package: ${pkg}...`);
        execSync(`npm run lint`, {
          stdio: 'inherit',
          cwd: packagePath
        });
      } else {
        console.log(`Skipping ${pkg} - no ESLint config found`);
      }
    }
  }
  
  console.log('Linting completed successfully!');
} catch (error) {
  console.error('Linting failed with errors.');
  process.exit(1);
}
