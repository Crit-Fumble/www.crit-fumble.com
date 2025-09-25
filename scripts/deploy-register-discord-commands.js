#!/usr/bin/env node

/**
 * Deploy-time Discord Command Registration Script
 * 
 * This script registers Discord slash commands during Vercel deployment.
 * It's called automatically as part of the build process in vercel.json
 */

const https = require('https');

async function registerDiscordCommands() {
  console.log('🤖 Starting Discord command registration...');

  const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
  const applicationId = process.env.DISCORD_WEB_BOT_APP_ID;

  if (!botToken) {
    console.error('❌ DISCORD_WEB_BOT_TOKEN not found in environment variables');
    process.exit(1);
  }

  if (!applicationId) {
    console.error('❌ DISCORD_WEB_BOT_APP_ID not found in environment variables');
    process.exit(1);
  }

  // Define the Discord slash commands
  const commands = [
    {
      name: 'help',
      description: 'Provides information about bot commands.',
      options: [],
    },
    // Add more commands here as needed
  ];

  console.log(`📝 Registering ${commands.length} Discord slash command(s)...`);

  try {
    const response = await fetch(`https://discord.com/api/v10/applications/${applicationId}/commands`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Failed to register Discord commands:', error);
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Successfully registered Discord commands:', result.length || commands.length);
    
    // Log each command that was registered
    commands.forEach(cmd => {
      console.log(`   • /${cmd.name} - ${cmd.description}`);
    });

    console.log('🎉 Discord command registration complete!');
    
  } catch (error) {
    console.error('❌ Error during Discord command registration:', error.message);
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  registerDiscordCommands().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { registerDiscordCommands };