/**
 * RPG System Controller
 * Handles RPG system management integrating Discord, WorldAnvil, and OpenAI functionality
 */

import { RpgSystemService } from '../services/RpgSystemService';

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
 * Controller for managing RPG systems and their integrations
 */
export class RpgSystemController {
  private rpgSystemService: RpgSystemService;

  /**
   * Initialize RPG System Controller with required services
   * @param rpgSystemService Service for managing RPG systems and integrations
   */
  constructor(rpgSystemService: RpgSystemService) {
    this.rpgSystemService = rpgSystemService;
  }

  /**
   * Get available RPG systems from World Anvil
   * @param req HTTP request
   * @param res HTTP response
   */
  async getWorldAnvilRpgSystems(req: HttpRequest, res: HttpResponse): Promise<void> {
    try {
      const systems = await this.rpgSystemService.getAll();
      res.status(200).json({
        success: true,
        data: systems,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch WorldAnvil RPG systems',
      });
    }
  }

  /**
   * Register an RPG system with our database
   * @param req HTTP request with system details
   * @param res HTTP response
   */
  async registerRpgSystem(req: HttpRequest, res: HttpResponse): Promise<void> {
    const { 
      name,
      description,
      worldAnvilId,
      discordGuildId,
      version,
      publisher,
      tags
    } = req.body;
    // Validate required fields per tests
    const missing: string[] = [];
    if (!name) missing.push('name');
    if (!description) missing.push('description');
    if (!version) missing.push('version');
    if (!publisher) missing.push('publisher');

    if (missing.length > 0) {
      res.status(400).json({ success: false, error: 'Bad request', message: `Missing required fields: ${missing.join(', ')}` });
      return;
    }

    try {
      // Create system in database
      const systemData = {
        name,
        description,
        version,
        publisher,
        tags: tags || [],
        config: {},
      };

      // Use service method to create
      const system = await this.rpgSystemService.create(systemData as any);

      // If Discord guild ID provided, set up necessary bot commands
      if (discordGuildId) {
        await this.rpgSystemService.setupDiscordIntegration(system.id, discordGuildId);
      }

      res.status(201).json({ success: true, data: system, message: 'RPG system registered successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error', message: 'Failed to register RPG system' });
    }
  }

  /**
   * Link an RPG system to a Discord guild
   * @param req HTTP request with system and guild IDs
   * @param res HTTP response
   */
  async linkDiscordGuild(req: HttpRequest, res: HttpResponse): Promise<void> {
    const { systemId, guildId } = req.body;

    if (!systemId || !guildId) {
      res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'Missing required fields: systemId, guildId',
      });
      return;
    }

    try {
      await this.rpgSystemService.setupDiscordIntegration(systemId, guildId);
      
      res.status(200).json({
        success: true,
        message: 'Discord guild linked successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to link Discord guild',
      });
    }
  }

  /**
   * Link an RPG system to a World Anvil system
   * @param req HTTP request with system and World Anvil IDs
   * @param res HTTP response
   */
  async linkWorldAnvilSystem(req: HttpRequest, res: HttpResponse): Promise<void> {
    const { systemId, worldAnvilSystemId } = req.body;

    if (!systemId || !worldAnvilSystemId) {
      res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'Missing required fields: systemId, worldAnvilSystemId',
      });
      return;
    }

    try {
      // Validate the World Anvil system exists
      const isValid = await this.rpgSystemService.validateWorldAnvilSystem(worldAnvilSystemId);
      if (!isValid) {
        res.status(404).json({
          success: false,
          error: 'Not found',
          message: 'WorldAnvil system not found or inaccessible',
        });
        return;
      }

      // Sync with WorldAnvil
      const updatedSystem = await this.rpgSystemService.syncWithWorldAnvil(systemId, worldAnvilSystemId);

      res.status(200).json({
        success: true,
        data: updatedSystem,
        message: 'WorldAnvil system linked successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to link WorldAnvil system',
      });
    }
  }

  /**
   * Helper method to set up Discord bot commands for an RPG system
   * @param systemId Our internal system ID
   * @param guildId Discord guild ID
   */
  private async setupDiscordCommands(systemId: string, guildId: string): Promise<void> {
    // Get the system
    const system = await this.rpgSystemService.getById(systemId);
    if (!system) {
      throw new Error('System not found');
    }

    // TODO: Implement Discord command registration through the service
    // This should be handled by the unified service which manages Discord integrations
    // await this.rpgSystemService.setupDiscordIntegration(systemId, guildId);
    
    console.warn('Discord command registration not implemented yet - this should be handled by the unified service');
  }
}