/**
 * World Anvil Reference File Downloader
 * 
 * This script parses the World Anvil OpenAPI specification and downloads
 * all referenced YML files to their corresponding local paths.
 * 
 * Uses packages from @crit-fumble/worldanvil package.json:
 * - axios for HTTP requests
 * - yaml for YAML parsing
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('yaml');
const axios = require('axios'); // Use axios for HTTP requests

// Configuration
const OPENAPI_PATH = path.join(__dirname, '../docs/boromir/yml/openapi.yml');
const TARGET_DIR = path.join(__dirname, '../docs/boromir/yml');
const WORLD_ANVIL_API_BASE = 'https://wa-cdn.nyc3.cdn.digitaloceanspaces.com/assets/prod/boromir-documentation/swagger';

// Rate limiting parameters
let DELAY_BETWEEN_REQUESTS_MS = 500; // 500ms delay between requests
const MAX_RETRIES = 3; // Maximum number of retries if rate limited
const RETRY_DELAY_MS = 2000; // Wait 2 seconds before retrying
const RATE_LIMIT_BACKOFF_MS = 15000; // 15 seconds backoff for rate limit failures

// API Authentication - Get these from environment variables or command line args
let API_KEY = process.env.WORLD_ANVIL_KEY || '';
let API_TOKEN = process.env.WORLD_ANVIL_TOKEN || '';

// Command line options
let RETRY_PLACEHOLDERS_ONLY = false;
let FULL_UPDATE = false;

// Check for command line arguments
process.argv.forEach((arg, index) => {
  if (arg === '--key' && process.argv[index + 1]) {
    API_KEY = process.argv[index + 1];
  }
  if (arg === '--token' && process.argv[index + 1]) {
    API_TOKEN = process.argv[index + 1];
  }
  if (arg === '--retry-placeholders-only') {
    RETRY_PLACEHOLDERS_ONLY = true;
  }
  if (arg === '--full-update') {
    FULL_UPDATE = true;
  }
  if (arg === '--delay' && process.argv[index + 1]) {
    const delay = parseInt(process.argv[index + 1], 10);
    if (!isNaN(delay) && delay > 0) {
      DELAY_BETWEEN_REQUESTS_MS = delay;
    }
  }
});

// Create headers for authenticated requests
const AUTH_HEADERS = {};
if (API_KEY) {
  AUTH_HEADERS['x-application-key'] = API_KEY;
}
if (API_TOKEN) {
  AUTH_HEADERS['x-auth-token'] = API_TOKEN;
}

// Ensure directory exists
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Load a YAML file
async function loadYamlFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return yaml.parse(content);
  } catch (err) {
    console.error(`Error loading ${filePath}: ${err.message}`);
    return null;
  }
}

// Extract all $ref paths from an object recursively
function extractRefPaths(obj, refPaths = new Set()) {
  if (!obj || typeof obj !== 'object') return refPaths;
  
  if (Array.isArray(obj)) {
    for (const item of obj) {
      extractRefPaths(item, refPaths);
    }
    return refPaths;
  }
  
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$ref' && typeof value === 'string') {
      // Only add the file path part, not the anchor
      const filePath = value.split('#')[0];
      if (filePath) refPaths.add(filePath);
    } else if (value && typeof value === 'object') {
      extractRefPaths(value, refPaths);
    }
  }
  
  return refPaths;
}

// Check if file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (err) {
    return false;
  }
}

// Sleep function for rate limiting
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if a file is a placeholder file with 403 error
async function isPlaceholder(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content.includes('Placeholder file - Download failed with status');
  } catch (err) {
    return false;
  }
}

// Download and save a referenced YML file
async function downloadRefFile(refPath) {
  // Calculate the full path where the file should be saved
  const targetPath = path.join(TARGET_DIR, refPath);
  const targetDir = path.dirname(targetPath);
  
  // Check if file already exists
  const fileAlreadyExists = await fileExists(targetPath);
  
  // Default behavior: 
  // - Skip existing non-placeholder files (unless FULL_UPDATE is true)
  // - Download placeholder files
  // - Download non-existing files
  if (fileAlreadyExists) {
    // Check if it's a placeholder file
    const isPlaceholderFile = await isPlaceholder(targetPath);
    
    if (!isPlaceholderFile && !FULL_UPDATE) {
      // Skip normal files with content unless we're doing a full update
      console.log(`File already exists with content: ${refPath}`);
      return { status: 'skipped', isPlaceholder: false };
    } else if (isPlaceholderFile) {
      console.log(`Found placeholder file, downloading: ${refPath}`);
    } else {
      console.log(`Full update: re-downloading ${refPath}`);
    }
  } else {
    // New file to download
    console.log(`New file to download: ${refPath}`);
  }
  
  // Create directory if it doesn't exist
  await ensureDir(targetDir);
  
  // Construct the World Anvil URL for the schema file
  const schemaUrl = `${WORLD_ANVIL_API_BASE}/${refPath}`;
  
  // Apply rate limiting
  await sleep(DELAY_BETWEEN_REQUESTS_MS);
  
  // Try to download with retries
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Downloading [attempt ${attempt}/${MAX_RETRIES}]: ${refPath}`);
      
      // Add auth headers to axios request
      const headers = { ...AUTH_HEADERS };
      
      // Use axios instead of fetch
      const response = await axios.get(schemaUrl, { headers });
      
      // Axios stores the response data directly in response.data
      const content = response.data;
      await fs.writeFile(targetPath, content);
      console.log(`Downloaded: ${refPath}`);
      return { status: 'success', isPlaceholder: false }; // Success, exit retry loop
    } catch (err) {
      console.error(`Error downloading ${refPath}: ${err.message}`);
      
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS/1000} seconds...`);
        await sleep(RETRY_DELAY_MS);
      } else {
        // Create placeholder file if all retries fail
        await fs.writeFile(targetPath, `# Placeholder file - Download failed\n# Error: ${err.message}\n# URL: ${schemaUrl}\n`);
        return { status: 'error', error: err.message, isPlaceholder: true };
      }
    }
  }
  
  return { status: 'error', error: 'Max retries exceeded', isPlaceholder: true };
}

// Process a single YAML file to find more references
async function processYamlFile(filePath) {
  // For the main openapi.yml file, use the original location
  const isMainFile = filePath === 'openapi.yml';
  const fullPath = isMainFile 
    ? OPENAPI_PATH 
    : path.join(TARGET_DIR, filePath);
  
  try {
    // Skip if file doesn't exist yet
    if (!await fileExists(fullPath)) {
      console.log(`File not found for processing: ${fullPath}`);
      return new Set();
    }
    
    const content = await loadYamlFile(fullPath);
    if (!content) return new Set();
    
    // Extract all references from this file
    return extractRefPaths(content);
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
    return new Set();
  }
}

// Show help info
function showHelp() {
  console.log('\nWorld Anvil Schema Extractor');
  console.log('\nUsage: node extract-world-anvil-schema.js [options]\n');
  console.log('Options:');
  console.log('  --key <key>             World Anvil API Key');
  console.log('  --token <token>         World Anvil Auth Token');
  console.log('  --retry-placeholders-only  Only retry downloading placeholder files (failed downloads)');
  console.log('  --full-update           Download all files again, replacing existing non-placeholder files');
  console.log('  --delay <ms>            Milliseconds to delay between requests (default: 500)');
  console.log('  --help                  Show this help message\n');
  process.exit(0);
}

// Process command line arguments for help
if (process.argv.includes('--help')) {
  showHelp();
}

// Main function
async function main() {
  try {
    console.log('====================================');
    console.log('Starting World Anvil reference file download...');
    console.log(`OpenAPI Path: ${OPENAPI_PATH}`);
    console.log(`Target Directory: ${TARGET_DIR}`);
    
    // Print configuration information
    console.log('\nConfiguration:');
    console.log(`Delay between requests: ${DELAY_BETWEEN_REQUESTS_MS}ms`);
    console.log(`Rate limit backoff: ${RATE_LIMIT_BACKOFF_MS/1000} seconds`);
    console.log(`Retry placeholders only: ${RETRY_PLACEHOLDERS_ONLY}`);
    console.log(`Full update: ${FULL_UPDATE}`);
    
    // Check if authentication credentials are provided
    if (!API_KEY && !API_TOKEN) {
      console.log('\nWARNING: No authentication credentials provided.\nYou may encounter 403 Forbidden errors when downloading schema files.');
      console.log('To provide credentials, use:\n  node extract-world-anvil-schema.js --key YOUR_API_KEY --token YOUR_AUTH_TOKEN');
      console.log('Or set environment variables WORLD_ANVIL_KEY and WORLD_ANVIL_TOKEN');
    } else {
      console.log('\nAuthentication credentials provided:');
      console.log(`API Key: ${API_KEY ? '[Set]' : '[Not set]'}`);
      console.log(`Auth Token: ${API_TOKEN ? '[Set]' : '[Not set]'}`);
    }
    console.log('====================================');
    
    // Ensure target directories exist
    await ensureDir(TARGET_DIR);
    
    // Create the docs/boromir directory if it doesn't exist
    const boromirDir = path.join(__dirname, '../docs/boromir');
    await ensureDir(boromirDir);
    
    // Load the main OpenAPI file
    const openapiContent = await fs.readFile(OPENAPI_PATH, 'utf8');
    const openapi = yaml.parse(openapiContent);
    
    // Extract all reference paths
    const refs = extractRefPaths(openapi);
    console.log(`Found ${refs.size} references in OpenAPI file`);
    
    // Process references one by one with rate limiting
    const processedFiles = new Set();
    const pendingRefs = Array.from(refs);
    
    while (pendingRefs.length > 0) {
      const refPath = pendingRefs.shift();
      
      // Skip if already processed
      if (processedFiles.has(refPath)) {
        console.log(`Already processed: ${refPath}`);
        continue;
      }
      processedFiles.add(refPath);
      
      // Calculate the target file path
      const targetPath = path.join(TARGET_DIR, refPath);
      // Check if file exists
      const fileExists = await fs.access(targetPath).then(() => true).catch(() => false);
      
      if (fileExists) {
        // Check if it's a placeholder file
        const isPlaceholder = await fs.readFile(targetPath, 'utf-8')
          .then(content => content.trim().startsWith('# Placeholder file'))
          .catch(() => false);
        
        if (isPlaceholder) {
          console.log(`Found placeholder file, downloading: ${refPath}`);
          await downloadRefFile(refPath);
        } else if (FULL_UPDATE) {
          console.log(`Full update mode: re-downloading ${refPath}`);
          await downloadRefFile(refPath);
        } else {
          console.log(`File exists with content, skipping download: ${refPath}`);
        }
      } else {
        // File doesn't exist, download it
        console.log(`New file to download: ${refPath}`);
        await downloadRefFile(refPath);
      }
      
      // Process the file to find more references, regardless of whether we just downloaded it or not
      try {
        const newRefs = await processYamlFile(refPath);
        if (newRefs && newRefs.size > 0) {
          console.log(`Found ${newRefs.size} references in ${refPath}`);
          for (const newRef of newRefs) {
            if (!processedFiles.has(newRef)) {
              pendingRefs.push(newRef);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing ${refPath}: ${error.message}`);
      }
    }
    
    console.log(`Processed ${processedFiles.size} reference files.`);
    console.log('Reference file download completed successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
}

// Run the main function
main();
