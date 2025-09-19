import { loadWorkspaceEnvironment } from '@crit-fumble/core/models/config/EnvironmentConfig';
import { createDiscordBot } from './server/DiscordBotServer';

/**
 * Load environment variables from workspace root and package-specific locations
 */
function loadEnvironment(): void {
  loadWorkspaceEnvironment(__dirname, { verbose: true });
}

/**
 * Launch the Discord bot server
 */
async function launch() {
  try {
    loadEnvironment();
    
    console.info('🚀 Starting Discord Bot...');
    
    const client = await createDiscordBot();
    await client.start();
    
    console.info('✅ Discord Bot launched successfully');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.info('📡 Received SIGINT, shutting down gracefully...');
      await client.shutdown();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.info('📡 Received SIGTERM, shutting down gracefully...');
      await client.shutdown();
      process.exit(0);
    });
    
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