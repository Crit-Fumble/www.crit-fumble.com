#!/usr/bin/env node

/**
 * Discord Command Registration Script
 * 
 * Automatically registers Discord slash commands when the application starts.
 * This script runs during production deployment to ensure commands are always up-to-date.
 */

import { config } from 'dotenv';

// Load environment variables
config();

const DISCORD_API_BASE = 'https://discord.com/api/v10';
const botToken = process.env.DISCORD_WEB_BOT_TOKEN;
const applicationId = process.env.DISCORD_WEB_BOT_APP_ID;
const nodeEnv = process.env.NODE_ENV || 'development';

/**
 * Discord slash commands definition
 */
const commands = [
  {
    name: 'event',
    description: 'Manage Discord scheduled events',
    options: [
      {
        name: 'create',
        description: 'Create a new scheduled event',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'name',
            description: 'Event name',
            type: 3, // STRING
            required: true,
          },
          {
            name: 'description',
            description: 'Event description',
            type: 3, // STRING
            required: false,
          },
        ],
      },
      {
        name: 'list',
        description: 'List scheduled events',
        type: 1, // SUB_COMMAND
      },
    ],
  },
  {
    name: 'campaign',
    description: 'Manage D&D campaigns',
    options: [
      {
        name: 'create',
        description: 'Create a new campaign',
        type: 1, // SUB_COMMAND
      },
      {
        name: 'list',
        description: 'List your campaigns',
        type: 1, // SUB_COMMAND
      },
    ],
  },
  {
    name: 'character',
    description: 'Manage D&D characters',
    options: [
      {
        name: 'create',
        description: 'Create a new character',
        type: 1, // SUB_COMMAND
      },
      {
        name: 'sheet',
        description: 'View character sheet',
        type: 1, // SUB_COMMAND
      },
    ],
  },
];

/**
 * Register commands with Discord API
 */
async function registerCommands() {
  if (!botToken || !applicationId) {
    console.warn('⚠️  Discord bot credentials not configured. Skipping command registration.');
    return false;
  }

  console.log('🤖 Registering Discord slash commands...');

  try {
    const response = await fetch(`${DISCORD_API_BASE}/applications/${applicationId}/commands`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to register Discord commands:', response.status, errorText);
      return false;
    }

    const registeredCommands = await response.json();
    console.log(`✅ Successfully registered ${registeredCommands.length} Discord commands`);
    
    // Log command details in development
    if (nodeEnv === 'development') {
      registeredCommands.forEach(cmd => {
        console.log(`   • /${cmd.name} (ID: ${cmd.id})`);
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Error registering Discord commands:', error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  const startTime = Date.now();
  
  console.log('🚀 Starting Discord command registration...');
  console.log(`   Environment: ${nodeEnv}`);
  console.log(`   Application ID: ${applicationId ? `${applicationId.slice(0, 8)}...` : 'Not set'}`);
  
  const success = await registerCommands();
  const duration = Date.now() - startTime;
  
  if (success) {
    console.log(`✅ Discord command registration completed in ${duration}ms`);
    process.exit(0);
  } else {
    console.log(`❌ Discord command registration failed after ${duration}ms`);
    process.exit(1);
  }
}

// Only run if this script is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

// Export for use in other modules
export { registerCommands, commands };