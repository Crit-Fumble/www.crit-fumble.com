/**
 * Application Startup Hook
 * 
 * Handles initialization tasks when the Next.js application starts.
 * This includes Discord command registration based on environment configuration.
 */

import discordConfig from './discord-config.js';

/**
 * Register Discord commands automatically based on configuration
 */
async function initializeDiscordCommands() {
  if (!discordConfig.autoRegisterOnStartup) {
    console.log(`🤖 Discord command auto-registration disabled (${discordConfig.getRegistrationStrategy()} mode)`);
    return;
  }

  if (!discordConfig.isConfigured()) {
    console.warn('⚠️  Discord bot credentials not configured. Skipping command registration.');
    return;
  }

  try {
    // Dynamic import to avoid dependency issues during build
    const { registerCommands } = await import('../scripts/register-discord-commands.js');
    
    console.log('🤖 Auto-registering Discord commands on startup...');
    const success = await registerCommands();
    
    if (success) {
      console.log('✅ Discord commands registered successfully on startup');
    } else {
      console.warn('⚠️  Discord command registration failed, but continuing startup');
    }
  } catch (error) {
    console.warn('⚠️  Could not auto-register Discord commands:', error.message);
    console.warn('   Continuing with application startup...');
  }
}

/**
 * Initialize all startup tasks
 */
async function initializeApp() {
  const startTime = Date.now();
  console.log('🚀 Initializing Crit-Fumble application...');
  
  // Register Discord commands
  await initializeDiscordCommands();
  
  // Add other startup tasks here as needed
  // await initializeDatabase();
  // await initializeCache();
  
  const duration = Date.now() - startTime;
  console.log(`✅ Application initialization completed in ${duration}ms`);
}

// Auto-run initialization on import
if (typeof window === 'undefined') { // Server-side only
  initializeApp().catch(error => {
    console.error('💥 Application initialization failed:', error);
    // Don't exit process - let the app continue running
  });
}

export { initializeApp, initializeDiscordCommands };