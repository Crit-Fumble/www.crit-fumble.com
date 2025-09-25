/**
 * Discord Slash Command Definitions
 * 
 * This file contains the canonical definitions for all Discord slash commands.
 * It's used by both the API routes and the registration scripts to ensure consistency.
 */

export const DISCORD_COMMANDS = [
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
];

/**
 * Discord Application Command Option Types
 * Reference: https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
 */
export const DISCORD_OPTION_TYPES = {
  SUB_COMMAND: 1,
  SUB_COMMAND_GROUP: 2,
  STRING: 3,
  INTEGER: 4,
  BOOLEAN: 5,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8,
  MENTIONABLE: 9,
  NUMBER: 10,
  ATTACHMENT: 11,
} as const;