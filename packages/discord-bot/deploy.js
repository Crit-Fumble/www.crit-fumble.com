#!/usr/bin/env node

/**
 * FumbleBot Deployment Script
 * 
 * This script handles building and deploying the Discord bot to Fly.io.
 * It performs the following steps:
 * 1. Build the TypeScript files for the bot
 * 2. Copy necessary assets
 * 3. Deploy to Fly.io using the configuration in pipeline/deploy-bot.toml
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'packages', 'discord', 'bot');
const DIST_DIR = path.join(ROOT_DIR, 'dist', 'discord', 'bot');
const DEPLOY_CONFIG = path.join(ROOT_DIR, 'pipeline', 'deploy-bot.toml');

// Ensure the script is run from the project root
process.chdir(ROOT_DIR);

/**
 * Runs a command and returns its output
 */
function runCommand(command, options = {}) {
  console.log(chalk.cyan(`> ${command}`));
  
  try {
    return execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf-8',
      ...options
    });
  } catch (error) {
    if (options.ignoreError) {
      return null;
    }
    console.error(chalk.red(`Command failed: ${command}`));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

/**
 * Ensures the directory exists, creating it if necessary
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(chalk.green(`Created directory: ${dir}`));
  }
}

/**
 * Builds the TypeScript files for the bot
 */
function buildBot() {
  console.log(chalk.bold('\n📦 Building bot...\n'));
  
  // Ensure the dist directory exists
  ensureDir(DIST_DIR);
  
  // Transpile TypeScript files
  runCommand(`npx tsc --outDir ${DIST_DIR} ${SRC_DIR}/**/*.ts`, { 
    ignoreError: true 
  });
  
  // Copy JavaScript files that don't need transpilation
  console.log(chalk.yellow('Copying JavaScript files...'));
  runCommand(`npx copyfiles -u 3 "${SRC_DIR}/**/*.js" ${DIST_DIR}`);
  
  console.log(chalk.green('✅ Bot build complete\n'));
}

/**
 * Verifies that all required files exist before deployment
 */
function verifyBuild() {
  console.log(chalk.bold('\n🔍 Verifying build...\n'));
  
  const requiredFiles = [
    path.join(DIST_DIR, 'Launcher.js'),
    path.join(DIST_DIR, 'managers', 'CommandManager.js'),
    path.join(DIST_DIR, 'managers', 'CronJobManager.js')
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      console.error(chalk.red(`Missing required file: ${file}`));
      allFilesExist = false;
    }
  }
  
  if (!allFilesExist) {
    console.error(chalk.red('❌ Build verification failed. Missing required files.'));
    process.exit(1);
  }
  
  console.log(chalk.green('✅ Build verification passed\n'));
}

/**
 * Deploys the bot to Fly.io
 */
function deployToFlyIo() {
  console.log(chalk.bold('\n🚀 Deploying to Fly.io...\n'));
  
  // Check if Fly CLI is installed
  try {
    runCommand('flyctl version', { silent: true });
  } catch (error) {
    console.error(chalk.red('Fly CLI not found. Please install it: https://fly.io/docs/hands-on/install-flyctl/'));
    process.exit(1);
  }
  
  // Deploy using the configuration file
  runCommand(`flyctl deploy --config ${DEPLOY_CONFIG}`);
  
  console.log(chalk.green('✅ Bot deployed successfully\n'));
}

/**
 * Main function
 */
function main() {
  console.log(chalk.bold.blue('\n=== FumbleBot Deployment Script ===\n'));
  
  // Check for required environment variables
  if (!process.env.DISCORD_PERSISTENT_BOT_TOKEN || !process.env.DISCORD_PERSISTENT_APP_ID) {
    console.warn(chalk.yellow('⚠️  Warning: DISCORD_PERSISTENT_BOT_TOKEN and/or DISCORD_PERSISTENT_APP_ID environment variables are not set.'));
    console.warn(chalk.yellow('These should be configured in your Fly.io secrets for the bot to work correctly.'));
    
    // Ask for confirmation to continue
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question(chalk.yellow('Continue anyway? (y/N): '), (answer) => {
      readline.close();
      
      if (answer.toLowerCase() !== 'y') {
        console.log(chalk.blue('Deployment cancelled.'));
        process.exit(0);
      }
      
      // Continue with deployment
      buildBot();
      verifyBuild();
      deployToFlyIo();
    });
  } else {
    // Continue with deployment
    buildBot();
    verifyBuild();
    deployToFlyIo();
  }
}

// Run the main function
main();
