#!/usr/bin/env node

/**
 * FumbleBot Deployment Script
 * 
 * This script handles building and deploying the Discord bot to Fly.io.
 * It performs the following steps:
 * 1. Load production environment variables
 * 2. Build the TypeScript files for the bot
 * 3. Verify the build
 * 4. Deploy to Fly.io using the configuration in deploy.toml
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { config } = require('dotenv');

// Configuration
const PACKAGE_DIR = __dirname; // Current discord-bot package directory
const DEPLOY_CONFIG = path.join(PACKAGE_DIR, 'deploy.toml');
const WORKSPACE_ROOT = path.resolve(PACKAGE_DIR, '..', '..');
const PROD_ENV_FILE = path.join(WORKSPACE_ROOT, '.env.prod');

/**
 * Load production environment variables
 */
function loadProductionEnvironment() {
  console.log('\n🔧 Loading production environment variables...');
  console.log(`📁 Loading from: ${PROD_ENV_FILE}`);
  
  if (!fs.existsSync(PROD_ENV_FILE)) {
    console.error(`❌ Production environment file not found: ${PROD_ENV_FILE}`);
    console.error('Please create .env.prod file with production secrets');
    process.exit(1);
  }
  
  const result = config({ path: PROD_ENV_FILE });
  
  if (result.error) {
    console.error(`❌ Failed to load production environment: ${result.error.message}`);
    process.exit(1);
  } else {
    console.log('✅ Production environment variables loaded successfully');
  }
}

// Load production environment first
loadProductionEnvironment();

// Ensure the script is run from the package directory
process.chdir(PACKAGE_DIR);

/**
 * Runs a command and returns its output
 */
function runCommand(command, options = {}) {
  console.log(`> ${command}`);
  
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
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * Builds the TypeScript files for the bot
 */
function buildBot() {
  console.log('\n📦 Building bot...\n');
  
  // Build using npm script
  runCommand('npm run build');
  
  console.log('✅ Bot build complete\n');
}

/**
 * Verifies that all required files exist before deployment
 */
function verifyBuild() {
  console.log('\n🔍 Verifying build...\n');
  
  const requiredFiles = [
    path.join(PACKAGE_DIR, 'dist', 'index.js'),
    path.join(PACKAGE_DIR, 'dist', 'server', 'DiscordBotServer.js'),
    path.join(PACKAGE_DIR, 'package.json')
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      console.error(`Missing required file: ${file}`);
      allFilesExist = false;
    } else {
      console.log(`✓ Found: ${path.relative(PACKAGE_DIR, file)}`);
    }
  }
  
  if (!allFilesExist) {
    console.error('❌ Build verification failed. Missing required files.');
    process.exit(1);
  }
  
  console.log('✅ Build verification passed\n');
}

/**
 * Deploys the bot to Fly.io
 */
function deployToFlyIo() {
  console.log('\n🚀 Deploying to Fly.io...\n');
  
  // Check if Fly CLI is installed
  try {
    runCommand('flyctl version', { silent: true });
  } catch (error) {
    console.error('Fly CLI not found. Please install it: https://fly.io/docs/hands-on/install-flyctl/');
    process.exit(1);
  }
  
  // Deploy using the configuration file
  runCommand(`flyctl deploy --config ${DEPLOY_CONFIG}`);
  
  console.log('✅ Bot deployed successfully\n');
}

/**
 * Main function
 */
function main() {
  console.log('\n=== FumbleBot Deployment Script ===\n');
  
  // Check for required environment variables
  if (!process.env.DISCORD_PERSISTENT_BOT_TOKEN || !process.env.DISCORD_PERSISTENT_BOT_APP_ID) {
    console.warn('⚠️  Warning: DISCORD_PERSISTENT_BOT_TOKEN and/or DISCORD_PERSISTENT_BOT_APP_ID environment variables are not set.');
    console.warn('These should be configured in your Fly.io secrets for the bot to work correctly.');
    
    // Ask for confirmation to continue
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('Continue anyway? (y/N): ', (answer) => {
      readline.close();
      
      if (answer.toLowerCase() !== 'y') {
        console.log('Deployment cancelled.');
        process.exit(0);
      }
      
      // Continue with deployment
      buildBot();
      verifyBuild();
      deployToFlyIo();
    });
  } else {
    console.log('✅ Environment variables found');
    
    // Continue with deployment
    buildBot();
    verifyBuild();
    deployToFlyIo();
  }
}

// Run the main function
main();
