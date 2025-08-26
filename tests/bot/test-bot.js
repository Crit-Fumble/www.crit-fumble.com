import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const botDir = path.join(rootDir, 'src', 'bot');

console.log('Running bot tests...');

// Run Jest with the bot configuration
const result = spawnSync('npx', [
  'jest', 
  '--config',
  path.join(botDir, 'jest.config.js'),
  '--rootDir',
  botDir
], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

process.exit(result.status);
