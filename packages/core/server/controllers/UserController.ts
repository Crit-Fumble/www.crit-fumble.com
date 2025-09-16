/**
 * User Controller
 * Integrates user-related functionality using centralized AuthService
 */

import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';


interface HttpRequest {
  query?: Record<string, string | string[]>;
  body?: any;
  headers?: Record<string, string | string[]>;
}

interface HttpResponse {
  status(code: number): {
    json(body: any): void;
    send(body: any): void;
  };
}

/**
 * Controller for managing user data and integrations across platforms
 */
export class UserController {
  /**
   * Create a new UserController with service dependencies
   * @param authService AuthService instance for handling authentication
   * @param userService UserService instance for user operations
   */
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  /**
   * Initialize controller and underlying services
   */
  async initialize(): Promise<void> {
    // AuthService no longer has an initialize method - it initializes in constructor
    // Initialization is handled automatically when AuthService is instantiated
  }

  /**
   * Handle Discord authentication callback
   * @param req HTTP request with Discord OAuth code
   * @param res HTTP response
   */
  async handleDiscordAuth(req: HttpRequest, res: HttpResponse): Promise<void> {
    const code = req.query?.code as string;
    const redirectUri = req.query?.redirectUri as string;

    if (!code) {
      res.status(400).json({ error: 'Discord authorization code is required' });
      return;
    }

    // Handle the OAuth callback through AuthService
    const authResult = await this.authService.handleCallback(code, redirectUri);
    if (!authResult.success) {
      res.status(401).json({ error: authResult.error || 'Discord authentication failed' });
      return;
    }

    // Get user from token
    const tokenResult = await this.authService.verifyToken(authResult.token!);
    if (!tokenResult.success || !tokenResult.user) {
      res.status(500).json({ error: tokenResult.error || 'Failed to get user details after authentication' });
      return;
    }

    const user = tokenResult.user;

    res.status(200).json({
      success: true,
      token: authResult.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        discordId: user.providers.discord?.id,
        worldAnvilId: user.providers.worldanvil?.id,
        image: user.image
      }
    });
  }

  /**
   * Handle World Anvil authentication
   * @param req HTTP request with World Anvil token
   * @param res HTTP response
   */
  async handleWorldAnvilAuth(req: HttpRequest, res: HttpResponse): Promise<void> {
    const { token, userId } = req.body;
    if (!token || !userId) {
      res.status(400).json({ error: 'World Anvil token and user ID are required' });
      return;
    }

    // Get the user
    const user = await this.userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    try {
      // TODO: Implement World Anvil account linking
      // await this.authService.linkWorldAnvilAccount(userId, token);
      res.status(501).json({ error: 'World Anvil account linking not implemented yet' });
    } catch (error) {
      res.status(401).json({ error: 'Invalid World Anvil token' });
    }
  }

  /**
   * Get user data from all integrated platforms
   * @param req HTTP request with user ID and optional auth token
   * @param res HTTP response
   */
  async getUserIntegrationData(req: HttpRequest, res: HttpResponse): Promise<void> {
    const userId = req.query?.userId as string;
    const authHeader = req.headers?.authorization as string | undefined;
    const token = authHeader?.replace('Bearer ', '');

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    try {
      // Use auth service to verify token and get user
      let user;
      if (token) {
        const tokenResult = await this.authService.verifyToken(token);
        if (!tokenResult.success || !tokenResult.user || tokenResult.user.id !== userId) {
          res.status(401).json({ error: tokenResult.error || 'Invalid or expired token' });
          return;
        }
        user = tokenResult.user;
      } else {
        user = await this.userService.getUserById(userId);
      }

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Return user data including integration IDs
      const result = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        discordId: 'providers' in user ? user.providers.discord?.id : user.discord_id,
        worldAnvilId: 'providers' in user ? user.providers.worldanvil?.id : user.worldanvil_id
      };

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  }
}
