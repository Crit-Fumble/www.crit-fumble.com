/**
 * RpgSystemController Unit Tests
 * Comprehensive tests for RPG system HTTP controller
 */

import { RpgSystemController } from '../../server/controllers/RpgSystemController';
import { RpgSystemService } from '../../server/services/RpgSystemService';
import { HttpRequest, HttpResponse } from '../../types/http';

// Mock RpgSystemService
const mockRpgSystemService = {
  getAll: jest.fn(),
  create: jest.fn(),
  setupDiscordIntegration: jest.fn(),
  syncWithWorldAnvil: jest.fn(),
  validateWorldAnvilSystem: jest.fn(),
} as unknown as RpgSystemService;

// Mock HTTP Request
const createMockRequest = (body?: any, params?: any, query?: any): HttpRequest => ({
  method: 'GET',
  url: '/api/rpg-systems',
  headers: {},
  body: body || {},
  params: params || {},
  query: query || {},
  user: {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    admin: false,
  },
});

// Mock HTTP Response
const createMockResponse = (): HttpResponse => {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  } as unknown as HttpResponse;
  return response;
};

describe('RpgSystemController', () => {
  let rpgSystemController: RpgSystemController;

  beforeEach(() => {
    jest.clearAllMocks();
    rpgSystemController = new RpgSystemController(mockRpgSystemService);
  });

  describe('Constructor', () => {
    it('should initialize with RpgSystemService', () => {
      expect(rpgSystemController).toBeInstanceOf(RpgSystemController);
    });
  });

  describe('getWorldAnvilRpgSystems', () => {
    it('should return WorldAnvil RPG systems', async () => {
      const mockSystems = [
        {
          id: 'system-1',
          worldanvil_system_id: 'wa-123',
          discord_guild_id: null,
          discord_post_id: null,
          discord_chat_id: null,
          discord_thread_id: null,
          discord_forum_id: null,
          discord_voice_id: null,
          discord_role_id: null,
          title: 'D&D 5e',
          slug: 'dnd-5e',
          description: 'Fifth edition D&D',
          data: {
            version: '5.0',
            publisher: 'Wizards of the Coast',
            tags: ['fantasy']
          },
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (mockRpgSystemService.getAll as jest.Mock).mockResolvedValue(mockSystems);

      const req = createMockRequest();
      const res = createMockResponse();

      await rpgSystemController.getWorldAnvilRpgSystems(req, res);

      expect(mockRpgSystemService.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSystems,
      });
    });

    it('should handle service errors', async () => {
      (mockRpgSystemService.getAll as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      const req = createMockRequest();
      const res = createMockResponse();

      await rpgSystemController.getWorldAnvilRpgSystems(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch WorldAnvil RPG systems',
      });
    });
  });

  describe('registerRpgSystem', () => {
    it('should register new RPG system', async () => {
      const systemData = {
        title: 'New System',
        description: 'A new RPG system',
        data: {
          version: '1.0',
          publisher: 'Test Publisher',
          tags: ['new']
        },
      };

      const mockCreatedSystem = {
        id: 'system-new',
        worldanvil_system_id: null,
        discord_guild_id: null,
        discord_post_id: null,
        discord_chat_id: null,
        discord_thread_id: null,
        discord_forum_id: null,
        discord_voice_id: null,
        discord_role_id: null,
        title: systemData.title,
        slug: 'new-system',
        description: systemData.description,
        data: systemData.data,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockRpgSystemService.create as jest.Mock).mockResolvedValue(mockCreatedSystem);

      const req = createMockRequest(systemData);
      const res = createMockResponse();

      await rpgSystemController.registerRpgSystem(req, res);

      expect(mockRpgSystemService.create).toHaveBeenCalledWith({
        title: systemData.title,
        description: systemData.description,
        data: systemData.data,
        is_active: true,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedSystem,
        message: 'RPG system registered successfully',
      });
    });

    it('should validate required fields', async () => {
      const invalidData = {
        description: 'Missing title field',
      };

      const req = createMockRequest(invalidData);
      const res = createMockResponse();

      await rpgSystemController.registerRpgSystem(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Bad request',
        message: 'Missing required fields: title, description',
      });
    });

    it('should handle service errors during registration', async () => {
      const systemData = {
        title: 'New System',
        description: 'A new RPG system',
        data: {
          version: '1.0',
          publisher: 'Test Publisher',
          tags: ['new']
        },
      };

      (mockRpgSystemService.create as jest.Mock).mockRejectedValue(
        new Error('Database constraint violation')
      );

      const req = createMockRequest(systemData);
      const res = createMockResponse();

      await rpgSystemController.registerRpgSystem(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
        message: 'Failed to register RPG system',
      });
    });
  });

  describe('linkDiscordGuild', () => {
    it('should link Discord guild to RPG system', async () => {
      const linkData = {
        systemId: 'system-1',
        guildId: 'guild-123',
      };

      (mockRpgSystemService.setupDiscordIntegration as jest.Mock).mockResolvedValue(undefined);

      const req = createMockRequest(linkData);
      const res = createMockResponse();

      await rpgSystemController.linkDiscordGuild(req, res);

      expect(mockRpgSystemService.setupDiscordIntegration).toHaveBeenCalledWith(
        'system-1',
        'guild-123'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Discord guild linked successfully',
      });
    });

    it('should validate required fields for Discord linking', async () => {
      const invalidData = {
        systemId: 'system-1',
        // Missing guildId
      };

      const req = createMockRequest(invalidData);
      const res = createMockResponse();

      await rpgSystemController.linkDiscordGuild(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Bad request',
        message: 'Missing required fields: systemId, guildId',
      });
    });

    it('should handle Discord integration errors', async () => {
      const linkData = {
        systemId: 'system-1',
        guildId: 'invalid-guild',
      };

      (mockRpgSystemService.setupDiscordIntegration as jest.Mock).mockRejectedValue(
        new Error('Guild not found')
      );

      const req = createMockRequest(linkData);
      const res = createMockResponse();

      await rpgSystemController.linkDiscordGuild(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
        message: 'Failed to link Discord guild',
      });
    });
  });

  describe('linkWorldAnvilSystem', () => {
    it('should link WorldAnvil system to RPG system', async () => {
      const linkData = {
        systemId: 'system-1',
        worldAnvilSystemId: 'wa-123',
      };

      (mockRpgSystemService.validateWorldAnvilSystem as jest.Mock).mockResolvedValue(true);

      const mockSyncedSystem = {
        id: 'system-1',
        name: 'D&D 5e',
        description: 'Fifth edition D&D',
        worldanvil_id: 'wa-123',
        version: '5.0',
        publisher: 'Wizards of the Coast',
        tags: ['fantasy'],
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockRpgSystemService.syncWithWorldAnvil as jest.Mock).mockResolvedValue(mockSyncedSystem);

      const req = createMockRequest(linkData);
      const res = createMockResponse();

      await rpgSystemController.linkWorldAnvilSystem(req, res);

      expect(mockRpgSystemService.validateWorldAnvilSystem).toHaveBeenCalledWith('wa-123');
      expect(mockRpgSystemService.syncWithWorldAnvil).toHaveBeenCalledWith('system-1', 'wa-123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSyncedSystem,
        message: 'WorldAnvil system linked successfully',
      });
    });

    it('should validate required fields for WorldAnvil linking', async () => {
      const invalidData = {
        systemId: 'system-1',
        // Missing worldAnvilSystemId
      };

      const req = createMockRequest(invalidData);
      const res = createMockResponse();

      await rpgSystemController.linkWorldAnvilSystem(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Bad request',
        message: 'Missing required fields: systemId, worldAnvilSystemId',
      });
    });

    it('should handle invalid WorldAnvil system ID', async () => {
      const linkData = {
        systemId: 'system-1',
        worldAnvilSystemId: 'invalid-wa-id',
      };

      (mockRpgSystemService.validateWorldAnvilSystem as jest.Mock).mockResolvedValue(false);

      const req = createMockRequest(linkData);
      const res = createMockResponse();

      await rpgSystemController.linkWorldAnvilSystem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Not found',
        message: 'WorldAnvil system not found or inaccessible',
      });
    });

    it('should handle WorldAnvil sync errors', async () => {
      const linkData = {
        systemId: 'system-1',
        worldAnvilSystemId: 'wa-123',
      };

      (mockRpgSystemService.validateWorldAnvilSystem as jest.Mock).mockResolvedValue(true);
      (mockRpgSystemService.syncWithWorldAnvil as jest.Mock).mockRejectedValue(
        new Error('Sync failed')
      );

      const req = createMockRequest(linkData);
      const res = createMockResponse();

      await rpgSystemController.linkWorldAnvilSystem(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
        message: 'Failed to link WorldAnvil system',
      });
    });
  });
});