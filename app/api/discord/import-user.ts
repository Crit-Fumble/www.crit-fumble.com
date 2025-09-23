import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'discord.js';

const discordClient = new Client({ intents: ['GuildMembers'] });

// Ensure the bot token is set in the environment variables
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!DISCORD_BOT_TOKEN || !GUILD_ID) {
  throw new Error('DISCORD_BOT_TOKEN and DISCORD_GUILD_ID must be set in the environment variables.');
}

discordClient.login(DISCORD_BOT_TOKEN);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { discordId } = req.body;

  if (!discordId) {
    return res.status(400).json({ error: 'Discord ID is required' });
  }

  try {
    const guild = await discordClient.guilds.fetch(GUILD_ID!);
    const member = await guild.members.fetch(discordId);

    if (!member) {
      return res.status(404).json({ error: 'User not found in the guild' });
    }

    const userData = {
      id: member.id,
      displayName: member.displayName,
      roles: member.roles.cache.map(role => ({ id: role.id, name: role.name })),
    };

    return res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Failed to fetch user from Discord' });
  }
}