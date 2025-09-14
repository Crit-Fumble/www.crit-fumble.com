/**
 * Prisma migration script
 * This script handles Prisma migrations separate from the package exports
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the root directory
const rootDir = path.resolve(__dirname, '..');
const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');

// Check if schema exists
if (!fs.existsSync(schemaPath)) {
  console.error(`Error: Schema file not found at ${schemaPath}`);
  process.exit(1);
}

// Migration name from command line args
const args = process.argv.slice(2);
const migrationName = args[0] || 'database-update';
const isDryRun = args.includes('--dry-run');

try {
  console.log('Running Prisma migration...');
  
  // Construct the Prisma CLI command
  let command = `npx prisma migrate dev --schema=${schemaPath} --name=${migrationName}`;
  
  if (isDryRun) {
    command += ' --create-only';
  }
  
  // Execute the command
  execSync(command, { 
    stdio: 'inherit',
    cwd: rootDir
  });
  
  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
}
