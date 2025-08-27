import { config } from 'dotenv';
import { DiscordBotServer } from './server.js';

// Wrap the main functionality in an async function
async function launch() {
  config({ path: '../.env' });
  
  const client = new DiscordBotServer();
  await client.start();
  
  return client;
}

// Execute the function when this module is the entry point
if (import.meta.url === import.meta.resolve('./Launcher.js')) {
  await launch();
}

// Export the function for testing
export { launch };
