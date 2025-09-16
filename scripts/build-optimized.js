#!/usr/bin/env node

/**
 * Optimized build script with caching, performance monitoring, and parallel execution
 */

import { execSync, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Build performance tracking
let buildStartTime;
const packageBuildTimes = new Map();

// Build cache configuration
const CACHE_DIR = path.join(rootDir, '.build-cache');
const CACHE_MANIFEST = path.join(CACHE_DIR, 'manifest.json');

// Available packages in dependency order
const BUILD_ORDER = ['worldanvil', 'core', 'react', 'discord-bot', 'next-web'];

/**
 * Initialize build cache directory
 */
function initializeCache() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    console.log('📁 Created build cache directory');
  }
}

/**
 * Load cache manifest
 */
function loadCacheManifest() {
  if (fs.existsSync(CACHE_MANIFEST)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_MANIFEST, 'utf8'));
    } catch (error) {
      console.warn('⚠️  Cache manifest corrupted, recreating...');
    }
  }
  return { lastBuild: null, packageHashes: {} };
}

/**
 * Save cache manifest
 */
function saveCacheManifest(manifest) {
  fs.writeFileSync(CACHE_MANIFEST, JSON.stringify(manifest, null, 2));
}

/**
 * Get file hash for caching
 */
function getDirectoryHash(dirPath) {
  if (!fs.existsSync(dirPath)) return null;
  
  const { execSync } = require('child_process');
  try {
    // Use git to get a hash of the directory contents
    const hash = execSync(`git ls-files -s "${dirPath}" | git hash-object --stdin`, {
      cwd: rootDir,
      encoding: 'utf8'
    }).trim();
    return hash;
  } catch (error) {
    // Fallback to timestamp if git fails
    const stats = fs.statSync(dirPath, { recursive: true });
    return stats.mtime.getTime().toString();
  }
}

/**
 * Check if package needs rebuilding
 */
function needsRebuild(packageName, manifest) {
  const packagePath = path.join(rootDir, 'packages', packageName);
  const currentHash = getDirectoryHash(packagePath);
  const lastHash = manifest.packageHashes[packageName];
  
  if (!lastHash || currentHash !== lastHash) {
    console.log(`📦 ${packageName}: Changes detected, needs rebuild`);
    return true;
  }
  
  console.log(`✅ ${packageName}: No changes, using cache`);
  return false;
}

/**
 * Build a single package with timing
 */
function buildPackage(packageName, force = false) {
  const packagePath = path.join(rootDir, 'packages', packageName);
  
  if (!fs.existsSync(packagePath)) {
    console.warn(`⚠️  Package ${packageName} not found, skipping`);
    return false;
  }
  
  const packageStartTime = Date.now();
  console.log(`🔨 Building ${packageName}...`);
  
  try {
    const buildCommand = force ? 'tsc --build --force' : 'tsc --build';
    execSync(`npm run build`, {
      cwd: packagePath,
      stdio: 'pipe'
    });
    
    const buildTime = Date.now() - packageStartTime;
    packageBuildTimes.set(packageName, buildTime);
    console.log(`✅ ${packageName} built in ${buildTime}ms`);
    return true;
  } catch (error) {
    console.error(`❌ ${packageName} build failed:`, error.message);
    return false;
  }
}

/**
 * Run optimized TypeScript project references build
 */
function runOptimizedBuild(options = {}) {
  buildStartTime = Date.now();
  console.log('🚀 Starting optimized build...');
  
  const { force = false, packages = null, verbose = false } = options;
  
  initializeCache();
  const manifest = loadCacheManifest();
  
  let packagesToBuild = packages || BUILD_ORDER;
  if (typeof packagesToBuild === 'string') {
    packagesToBuild = [packagesToBuild];
  }
  
  const successfulBuilds = [];
  const failedBuilds = [];
  
  // Filter packages that need rebuilding (unless force is true)
  if (!force) {
    packagesToBuild = packagesToBuild.filter(pkg => needsRebuild(pkg, manifest));
  }
  
  if (packagesToBuild.length === 0) {
    console.log('🎉 All packages are up to date!');
    return true;
  }
  
  console.log(`📋 Building packages: ${packagesToBuild.join(', ')}`);
  
  // Use TypeScript project references for efficient building
  try {
    const tscCommand = force ? 'tsc -b --force' : 'tsc -b';
    const buildArgs = verbose ? `${tscCommand} --verbose` : tscCommand;
    
    console.log(`🔧 Running: ${buildArgs}`);
    execSync(buildArgs, {
      cwd: rootDir,
      stdio: verbose ? 'inherit' : 'pipe'
    });
    
    // Update cache manifest for successfully built packages
    packagesToBuild.forEach(pkg => {
      const packagePath = path.join(rootDir, 'packages', pkg);
      manifest.packageHashes[pkg] = getDirectoryHash(packagePath);
      successfulBuilds.push(pkg);
    });
    
    manifest.lastBuild = new Date().toISOString();
    saveCacheManifest(manifest);
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    return false;
  }
  
  // Print build summary
  const totalBuildTime = Date.now() - buildStartTime;
  console.log('\n📊 Build Summary:');
  console.log(`⏱️  Total build time: ${totalBuildTime}ms`);
  console.log(`✅ Successful: ${successfulBuilds.length} packages`);
  
  if (failedBuilds.length > 0) {
    console.log(`❌ Failed: ${failedBuilds.length} packages`);
    console.log(`   ${failedBuilds.join(', ')}`);
  }
  
  console.log('🎉 Build completed!');
  return failedBuilds.length === 0;
}

/**
 * Clean build outputs and cache
 */
function cleanBuild(options = {}) {
  const { cache = false } = options;
  
  console.log('🧹 Cleaning build outputs...');
  
  // Clean TypeScript build outputs
  execSync('tsc -b --clean', { cwd: rootDir, stdio: 'inherit' });
  
  // Clean dist directories
  BUILD_ORDER.forEach(pkg => {
    const distPath = path.join(rootDir, 'packages', pkg, 'dist');
    if (fs.existsSync(distPath)) {
      fs.rmSync(distPath, { recursive: true, force: true });
      console.log(`🗑️  Cleaned ${pkg}/dist`);
    }
  });
  
  if (cache) {
    // Clean build cache
    if (fs.existsSync(CACHE_DIR)) {
      fs.rmSync(CACHE_DIR, { recursive: true, force: true });
      console.log('🗑️  Cleaned build cache');
    }
  }
  
  console.log('✅ Clean completed');
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const command = args[0] || 'build';
  
  switch (command) {
    case 'build':
      const force = args.includes('--force');
      const verbose = args.includes('--verbose');
      const packages = args.find(arg => arg.startsWith('--packages='))?.split('=')[1]?.split(',');
      
      runOptimizedBuild({ force, packages, verbose });
      break;
      
    case 'clean':
      const cache = args.includes('--cache');
      cleanBuild({ cache });
      break;
      
    case 'help':
    default:
      console.log(`
🔨 Optimized Build Script

Usage:
  node scripts/build-optimized.js [command] [options]

Commands:
  build          Build packages (default)
  clean          Clean build outputs
  help           Show this help

Build Options:
  --force        Force rebuild all packages
  --verbose      Show detailed build output
  --packages=    Comma-separated list of packages to build

Clean Options:
  --cache        Also clean build cache

Examples:
  node scripts/build-optimized.js build
  node scripts/build-optimized.js build --force --verbose
  node scripts/build-optimized.js build --packages=core,react
  node scripts/build-optimized.js clean --cache
      `);
      break;
  }
}