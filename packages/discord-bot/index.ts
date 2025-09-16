import { config } from 'dotenv';
import { DiscordBotServer } from './server/DiscordBotServer';

// Load environment variables
config({ path: '.env.bot' });
config({ path: '../.env' }); // Fallback to workspace env

/**
 * Launch the Discord bot server
 */
async function launch(): Promise<DiscordBotServer> {
  try {
    console.log('🚀 Starting Discord Bot...');
    
    const client = new DiscordBotServer();
    await client.start();
    
    console.log('✅ Discord Bot launched successfully');
    return client;
  } catch (error) {
    console.error('❌ Failed to launch Discord Bot:', error);
    process.exit(1);
  }
}

// Execute the function when this module is the entry point
if (require.main === module) {
  launch().catch((error) => {
    console.error('Fatal error during bot launch:', error);
    process.exit(1);
  });
}

// Export for testing
export { launch };