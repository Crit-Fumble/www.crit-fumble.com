import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Mock axios for unit testing - uncomment this block to convert to unit tests
// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Discord API Integration', () => {
  const DISCORD_API_BASE_URL = 'https://discord.com/api';
  
  // OPTION 1: Real integration test (current approach)
  // Use the actual environment variable names from .env
  const DISCORD_CLIENT_ID = process.env.AUTH_DISCORD_ID;
  const DISCORD_CLIENT_SECRET = process.env.AUTH_DISCORD_SECRET;
  const DISCORD_BOT_TOKEN = process.env.DISCORD_WEB_BOT_TOKEN;

  // Skip integration tests if environment variables are not set
  // This is CORRECT behavior for integration tests
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_BOT_TOKEN) {
    it.skip('should skip integration tests when environment variables are missing', () => {
      console.log('🔄 Discord integration test skipped - add real Discord credentials to .env to run this test');
      console.log('📝 Required variables: AUTH_DISCORD_ID, AUTH_DISCORD_SECRET, DISCORD_WEB_BOT_TOKEN');
      console.log('📖 See .env.example for setup instructions');
    });
    return;
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