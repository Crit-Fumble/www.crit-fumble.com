import axios from 'axios';

// Mock axios for unit testing
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Discord API Client (Unit Tests)', () => {
  const DISCORD_API_BASE_URL = 'https://discord.com/api';
  
  // OPTION 2: Unit test with mocked environment variables and HTTP calls
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock environment variables for testing
    process.env.AUTH_DISCORD_ID = 'mock_discord_client_id';
    process.env.AUTH_DISCORD_SECRET = 'mock_discord_client_secret';
    process.env.DISCORD_WEB_BOT_TOKEN = 'mock_discord_bot_token';
  });

  afterEach(() => {
    // Clean up mocked environment variables
    delete process.env.AUTH_DISCORD_ID;
    delete process.env.AUTH_DISCORD_SECRET;
    delete process.env.DISCORD_WEB_BOT_TOKEN;
  });

  it('should make authenticated request to fetch bot user details', async () => {
    // Mock successful response
    const mockBotUser = {
      id: '123456789',
      username: 'TestBot',
      discriminator: '0001',
      bot: true,
    };

    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: mockBotUser,
    });

    // Make the request (this would be your actual Discord API client code)
    const response = await axios.get(`${DISCORD_API_BASE_URL}/users/@me`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_WEB_BOT_TOKEN}`,
      },
    });

    // Validate the mock was called correctly
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://discord.com/api/users/@me',
      {
        headers: {
          Authorization: 'Bot mock_discord_bot_token',
        },
      }
    );

    // Validate the response
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockBotUser);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('username');
    expect(response.data).toHaveProperty('discriminator');
  });

  it('should handle 401 unauthorized error', async () => {
    // Mock error response
    const mockError = {
      response: {
        status: 401,
        data: { message: '401: Unauthorized' },
      },
    };

    mockedAxios.get.mockRejectedValue(mockError);

    // Test error handling
    try {
      await axios.get(`${DISCORD_API_BASE_URL}/users/@me`, {
        headers: {
          Authorization: 'Bot INVALID_TOKEN',
        },
      });
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty('message', '401: Unauthorized');
    }

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://discord.com/api/users/@me',
      {
        headers: {
          Authorization: 'Bot INVALID_TOKEN',
        },
      }
    );
  });

  it('should handle network errors', async () => {
    // Mock network error
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    try {
      await axios.get(`${DISCORD_API_BASE_URL}/users/@me`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_WEB_BOT_TOKEN}`,
        },
      });
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.message).toBe('Network Error');
    }
  });
});