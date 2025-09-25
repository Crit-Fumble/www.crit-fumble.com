#!/usr/bin/env node

/**
 * Discord Command Registration Script
 * 
 * This script registers Discord slash commands for development and testing.
 * Use: npm run discord:register
 */

require('dotenv').config();

async function registerDiscordCommands() {
  console.log('🤖 Starting Discord command registration...');

  const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
  const applicationId = process.env.DISCORD_WEB_BOT_APP_ID;
  const autoRegister = process.env.DISCORD_AUTO_REGISTER_COMMANDS === 'true';

  console.log(`🔍 Debug info:`);
  console.log(`   - Bot token: ${botToken ? '✅ Found' : '❌ Missing'}`);
  console.log(`   - App ID: ${applicationId ? '✅ Found' : '❌ Missing'} ${applicationId ? `(${applicationId})` : ''}`);
  console.log(`   - Auto register: ${autoRegister}`);

  if (!botToken) {
    console.error('❌ DISCORD_WEB_BOT_TOKEN not found in .env file');
    process.exit(1);
  }

  if (!applicationId) {
    console.error('❌ DISCORD_WEB_BOT_APP_ID not found in .env file');
    process.exit(1);
  }

  if (!autoRegister) {
    console.log('ℹ️  Auto-registration is disabled. Set DISCORD_AUTO_REGISTER_COMMANDS=true to enable.');
    console.log('ℹ️  Use npm run discord:register:force to register commands anyway.');
    console.log('ℹ️  Exiting without registering commands.');
    process.exit(0);
  }

  // Define the Discord slash commands
  const commands = [
    {
      name: 'help',
      description: 'Provides information about bot commands.',
      options: [],
    },
    {
      name: 'roll',
      description: 'Roll dice using standard notation (e.g., 3d6+2)',
      options: [
        {
          type: 3, // STRING
          name: 'dice',
          description: 'Dice notation (e.g., 1d20, 3d6+2, 2d10+5)',
          required: true,
        },
      ],
    },
    {
      name: 'character',
      description: 'Character sheet commands',
      options: [
        {
          type: 1, // SUB_COMMAND
          name: 'show',
          description: 'Display your character sheet',
          options: [
            {
              type: 3, // STRING
              name: 'name',
              description: 'Character name (optional, uses default if not specified)',
              required: false,
            },
          ],
        },
        {
          type: 1, // SUB_COMMAND
          name: 'list',
          description: 'List all your characters',
        },
      ],
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
      if (cmd.options && cmd.options.length > 0) {
        cmd.options.forEach(opt => {
          if (opt.type === 1) { // SUB_COMMAND
            console.log(`     └─ ${opt.name}: ${opt.description}`);
          } else {
            console.log(`     └─ ${opt.name} (${opt.required ? 'required' : 'optional'}): ${opt.description}`);
          }
        });
      }
    });

    console.log('🎉 Discord command registration complete!');
    console.log('ℹ️  Commands may take up to 1 hour to appear in all Discord servers.');
    
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