import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

describe('Discord API Integration', () => {
  const DISCORD_API_BASE_URL = 'https://discord.com/api';
  const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN } = process.env;

  // Ensure environment variables are loaded
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_BOT_TOKEN) {
    throw new Error('One or more required environment variables are missing: DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN');
  }

  it('should authenticate and fetch bot user details', async () => {
    if (!DISCORD_BOT_TOKEN) {
      throw new Error('DISCORD_BOT_TOKEN is not set in environment variables');
    }

    // Make a request to fetch bot user details
    const response = await axios.get(`${DISCORD_API_BASE_URL}/users/@me`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    });

    // Validate the response
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('username');
    expect(response.data).toHaveProperty('discriminator');
  });

  it('should fail with invalid token', async () => {
    try {
      await axios.get(`${DISCORD_API_BASE_URL}/users/@me`, {
        headers: {
          Authorization: 'Bot INVALID_TOKEN',
        },
      });
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty('message', '401: Unauthorized');
    }
  });
});