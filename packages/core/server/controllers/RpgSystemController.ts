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
      // For now, return empty array until WorldAnvil integration is implemented in the service
      // TODO: Implement WorldAnvil integration in RpgSystemService
      const systems: any[] = [];
      res.status(200).json(systems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch RPG systems from World Anvil' });
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
      discordGuildId
    } = req.body;

    if (!name) {
      res.status(400).json({ error: 'System name is required' });
      return;
    }

    try {
      // Create system in database
      const systemData = {
        title: name,
        description,
        worldanvil_system_id: worldAnvilId,
        discord_guild_id: discordGuildId
      };

      // Use service method to create
      const system = await this.rpgSystemService.create(systemData);

      // If Discord guild ID provided, set up necessary bot commands
      if (discordGuildId) {
        await this.setupDiscordCommands(system.id, discordGuildId);
      }

      res.status(201).json(system);
    } catch (error) {
      res.status(500).json({ error: 'Failed to register RPG system' });
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
      res.status(400).json({ error: 'System ID and Guild ID are required' });
      return;
    }

    try {
      // Get current system
      const system = await this.rpgSystemService.getById(systemId);
      if (!system) {
        res.status(404).json({ error: 'System not found' });
        return;
      }

      // Update Discord guild ID
      const updated = await this.rpgSystemService.update(systemId, {
        discord_guild_id: guildId
      });

      // Set up Discord bot commands for this system
      await this.setupDiscordCommands(systemId, guildId);

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to link Discord guild' });
    }
  }

  /**
   * Link an RPG system to a World Anvil system
   * @param req HTTP request with system and World Anvil IDs
   * @param res HTTP response
   */
  async linkWorldAnvilSystem(req: HttpRequest, res: HttpResponse): Promise<void> {
    const { systemId, worldAnvilId } = req.body;

    if (!systemId || !worldAnvilId) {
      res.status(400).json({ error: 'System ID and World Anvil ID are required' });
      return;
    }

    try {
      // Get current system
      const system = await this.rpgSystemService.getById(systemId);
      if (!system) {
        res.status(404).json({ error: 'System not found' });
        return;
      }

      // TODO: Verify the World Anvil system exists through the service
      // For now, we'll skip validation until WorldAnvil integration is implemented
      // try {
      //   await this.rpgSystemService.validateWorldAnvilSystem(worldAnvilId);
      // } catch (error) {
      //   res.status(404).json({ error: 'World Anvil system not found' });
      //   return;
      // }

      // Update World Anvil system ID
      const updated = await this.rpgSystemService.update(systemId, {
        worldanvil_system_id: worldAnvilId
      });

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to link World Anvil system' });
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