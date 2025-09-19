/**
 * RpgCampaignService Unit Tests
 * Comprehensive tests for RPG campaign management service
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { RpgCampaignService } from '../../server/services/RpgCampaignService';
// Mock Prisma Client
var mockPrismaClient = {
    rpgCampaign: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};
// Mock Discord Client
var mockDiscordClient = {
    guilds: {
        fetch: jest.fn(),
    },
};
// Mock WorldAnvil Client
var mockWorldAnvilClient = {
    getCampaignDetails: jest.fn(),
};
// Mock OpenAI Client
var mockOpenAIClient = {
    chat: {
        completions: {
            create: jest.fn(),
        },
    },
};
describe('RpgCampaignService', function () {
    var rpgCampaignService;
    beforeEach(function () {
        jest.clearAllMocks();
        rpgCampaignService = new RpgCampaignService(mockPrismaClient, mockDiscordClient, mockWorldAnvilClient, mockOpenAIClient);
    });
    describe('Constructor', function () {
        it('should initialize with all required dependencies', function () {
            expect(rpgCampaignService).toBeInstanceOf(RpgCampaignService);
        });
    });
    describe('getAll', function () {
        it('should return all RPG campaigns', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockCampaigns, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockCampaigns = [
                            {
                                id: 'campaign-1',
                                name: 'Lost Mines of Phandelver',
                                description: 'Starter campaign for D&D 5e',
                                systemId: 'system-1',
                                worldId: 'world-1',
                                gmId: 'user-1',
                                worldanvil_id: null,
                                status: 'active',
                                playerCount: 4,
                                sessionCount: 12,
                                config: {},
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        ];
                        mockPrismaClient.rpgCampaign.findMany.mockResolvedValue(mockCampaigns);
                        return [4 /*yield*/, rpgCampaignService.getAll()];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCampaigns);
                        expect(mockPrismaClient.rpgCampaign.findMany).toHaveBeenCalledWith({
                            orderBy: { name: 'asc' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getById', function () {
        it('should return campaign by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockCampaign, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockCampaign = {
                            id: 'campaign-1',
                            name: 'Lost Mines of Phandelver',
                            description: 'Starter campaign for D&D 5e',
                            systemId: 'system-1',
                            worldId: 'world-1',
                            gmId: 'user-1',
                            worldanvil_id: null,
                            status: 'active',
                            playerCount: 4,
                            sessionCount: 12,
                            config: {},
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgCampaign.findUnique.mockResolvedValue(mockCampaign);
                        return [4 /*yield*/, rpgCampaignService.getById('campaign-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCampaign);
                        expect(mockPrismaClient.rpgCampaign.findUnique).toHaveBeenCalledWith({
                            where: { id: 'campaign-1' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null if campaign not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgCampaign.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, rpgCampaignService.getById('non-existent')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByWorldAnvilId', function () {
        it('should return campaign by WorldAnvil ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockCampaign, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockCampaign = {
                            id: 'campaign-1',
                            name: 'Lost Mines of Phandelver',
                            description: 'Starter campaign for D&D 5e',
                            systemId: 'system-1',
                            worldId: 'world-1',
                            gmId: 'user-1',
                            worldanvil_id: 'wa-123',
                            status: 'active',
                            playerCount: 4,
                            sessionCount: 12,
                            config: {},
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgCampaign.findUnique.mockResolvedValue(mockCampaign);
                        return [4 /*yield*/, rpgCampaignService.getByWorldAnvilId('wa-123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCampaign);
                        expect(mockPrismaClient.rpgCampaign.findUnique).toHaveBeenCalledWith({
                            where: { worldanvil_id: 'wa-123' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getBySystemId', function () {
        it('should return campaigns by system ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockCampaigns, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockCampaigns = [
                            {
                                id: 'campaign-1',
                                name: 'Lost Mines of Phandelver',
                                description: 'Starter campaign for D&D 5e',
                                systemId: 'system-1',
                                worldId: 'world-1',
                                gmId: 'user-1',
                                worldanvil_id: null,
                                status: 'active',
                                playerCount: 4,
                                sessionCount: 12,
                                config: {},
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        ];
                        mockPrismaClient.rpgCampaign.findMany.mockResolvedValue(mockCampaigns);
                        return [4 /*yield*/, rpgCampaignService.getBySystemId('system-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCampaigns);
                        expect(mockPrismaClient.rpgCampaign.findMany).toHaveBeenCalledWith({
                            where: { systemId: 'system-1' },
                            orderBy: { name: 'asc' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByWorldId', function () {
        it('should return campaigns by world ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockCampaigns, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockCampaigns = [
                            {
                                id: 'campaign-1',
                                name: 'Lost Mines of Phandelver',
                                description: 'Starter campaign for D&D 5e',
                                systemId: 'system-1',
                                worldId: 'world-1',
                                gmId: 'user-1',
                                worldanvil_id: null,
                                status: 'active',
                                playerCount: 4,
                                sessionCount: 12,
                                config: {},
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        ];
                        mockPrismaClient.rpgCampaign.findMany.mockResolvedValue(mockCampaigns);
                        return [4 /*yield*/, rpgCampaignService.getByWorldId('world-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCampaigns);
                        expect(mockPrismaClient.rpgCampaign.findMany).toHaveBeenCalledWith({
                            where: { worldId: 'world-1' },
                            orderBy: { name: 'asc' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByGmId', function () {
        it('should return campaigns by GM ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockCampaigns, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockCampaigns = [
                            {
                                id: 'campaign-1',
                                name: 'Lost Mines of Phandelver',
                                description: 'Starter campaign for D&D 5e',
                                systemId: 'system-1',
                                worldId: 'world-1',
                                gmId: 'user-1',
                                worldanvil_id: null,
                                status: 'active',
                                playerCount: 4,
                                sessionCount: 12,
                                config: {},
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        ];
                        mockPrismaClient.rpgCampaign.findMany.mockResolvedValue(mockCampaigns);
                        return [4 /*yield*/, rpgCampaignService.getByGmId('user-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCampaigns);
                        expect(mockPrismaClient.rpgCampaign.findMany).toHaveBeenCalledWith({
                            where: { gmId: 'user-1' },
                            orderBy: { name: 'asc' },
                            include: {
                                system: true,
                                world: true,
                                gm: true,
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('search', function () {
        it('should search campaigns by query', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockCampaigns, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockCampaigns = [
                            {
                                id: 'campaign-1',
                                name: 'Lost Mines of Phandelver',
                                description: 'Starter campaign for D&D 5e',
                                systemId: 'system-1',
                                worldId: 'world-1',
                                gmId: 'user-1',
                                worldanvil_id: null,
                                status: 'active',
                                playerCount: 4,
                                sessionCount: 12,
                                config: {},
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        ];
                        mockPrismaClient.rpgCampaign.findMany.mockResolvedValue(mockCampaigns);
                        return [4 /*yield*/, rpgCampaignService.search('Lost Mines')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCampaigns);
                        expect(mockPrismaClient.rpgCampaign.findMany).toHaveBeenCalledWith({
                            where: {
                                OR: [
                                    { name: { contains: 'Lost Mines', mode: 'insensitive' } },
                                    { description: { contains: 'Lost Mines', mode: 'insensitive' } },
                                ],
                            },
                            orderBy: { name: 'asc' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('create', function () {
        it('should create new campaign', function () { return __awaiter(void 0, void 0, void 0, function () {
            var createData, mockCreatedCampaign, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createData = {
                            name: 'New Campaign',
                            description: 'A new RPG campaign',
                            system: { connect: { id: 'system-1' } },
                            world: { connect: { id: 'world-1' } },
                            gm: { connect: { id: 'user-1' } },
                            status: 'planning',
                            playerCount: 0,
                            sessionCount: 0,
                            config: {},
                        };
                        mockCreatedCampaign = {
                            id: 'campaign-new',
                            name: 'New Campaign',
                            description: 'A new RPG campaign',
                            systemId: 'system-1',
                            worldId: 'world-1',
                            gmId: 'user-1',
                            worldanvil_id: null,
                            status: 'planning',
                            playerCount: 0,
                            sessionCount: 0,
                            config: {},
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgCampaign.create.mockResolvedValue(mockCreatedCampaign);
                        return [4 /*yield*/, rpgCampaignService.create(createData)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCreatedCampaign);
                        expect(mockPrismaClient.rpgCampaign.create).toHaveBeenCalledWith({
                            data: createData,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('update', function () {
        it('should update existing campaign', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updateData, mockUpdatedCampaign, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateData = {
                            name: 'Updated Campaign',
                            description: 'An updated RPG campaign',
                            status: 'active',
                        };
                        mockUpdatedCampaign = {
                            id: 'campaign-1',
                            name: 'Updated Campaign',
                            description: 'An updated RPG campaign',
                            systemId: 'system-1',
                            worldId: 'world-1',
                            gmId: 'user-1',
                            worldanvil_id: null,
                            status: 'active',
                            playerCount: 4,
                            sessionCount: 12,
                            config: {},
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgCampaign.update.mockResolvedValue(mockUpdatedCampaign);
                        return [4 /*yield*/, rpgCampaignService.update('campaign-1', updateData)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockUpdatedCampaign);
                        expect(mockPrismaClient.rpgCampaign.update).toHaveBeenCalledWith({
                            where: { id: 'campaign-1' },
                            data: updateData,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('delete', function () {
        it('should delete campaign', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockDeletedCampaign, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockDeletedCampaign = {
                            id: 'campaign-1',
                            name: 'Lost Mines of Phandelver',
                            description: 'Starter campaign for D&D 5e',
                            systemId: 'system-1',
                            worldId: 'world-1',
                            gmId: 'user-1',
                            worldanvil_id: null,
                            status: 'active',
                            playerCount: 4,
                            sessionCount: 12,
                            config: {},
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgCampaign.delete.mockResolvedValue(mockDeletedCampaign);
                        return [4 /*yield*/, rpgCampaignService.delete('campaign-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockDeletedCampaign);
                        expect(mockPrismaClient.rpgCampaign.delete).toHaveBeenCalledWith({
                            where: { id: 'campaign-1' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setupDiscordIntegration', function () {
        it('should setup Discord integration for campaign', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockGuild, mockCampaign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockGuild = {
                            id: 'guild-123',
                            name: 'Test Guild',
                            channels: {
                                create: jest.fn().mockResolvedValue({
                                    id: 'channel-123',
                                    name: 'campaign-channel',
                                }),
                            },
                        };
                        mockDiscordClient.guilds.fetch.mockResolvedValue(mockGuild);
                        mockCampaign = {
                            id: 'campaign-1',
                            name: 'Test Campaign',
                            description: 'Test campaign',
                            systemId: 'system-1',
                            worldId: 'world-1',
                            gmId: 'user-1',
                            worldanvil_id: null,
                            status: 'active',
                            playerCount: 4,
                            sessionCount: 12,
                            config: {},
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgCampaign.findUnique.mockResolvedValue(mockCampaign);
                        mockPrismaClient.rpgCampaign.update.mockResolvedValue(__assign(__assign({}, mockCampaign), { config: { discord: { guildId: 'guild-123', channelId: 'channel-123' } } }));
                        return [4 /*yield*/, rpgCampaignService.setupDiscordIntegration('campaign-1', 'guild-123')];
                    case 1:
                        _a.sent();
                        expect(mockDiscordClient.guilds.fetch).toHaveBeenCalledWith('guild-123');
                        expect(mockGuild.channels.create).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle Discord integration errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockDiscordClient.guilds.fetch.mockRejectedValue(new Error('Guild not found'));
                        return [4 /*yield*/, expect(rpgCampaignService.setupDiscordIntegration('campaign-1', 'invalid-guild')).rejects.toThrow('Failed to setup Discord integration: Guild not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('syncWithWorldAnvil', function () {
        it('should sync campaign with WorldAnvil', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockWorldAnvilData, mockUpdatedCampaign, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockWorldAnvilData = {
                            id: 'wa-123',
                            title: 'WorldAnvil Campaign',
                            excerpt: 'Campaign from WorldAnvil',
                        };
                        mockWorldAnvilClient.getCampaignDetails.mockResolvedValue(mockWorldAnvilData);
                        mockUpdatedCampaign = {
                            id: 'campaign-1',
                            name: 'WorldAnvil Campaign',
                            description: 'Campaign from WorldAnvil',
                            systemId: 'system-1',
                            worldId: 'world-1',
                            gmId: 'user-1',
                            worldanvil_id: 'wa-123',
                            status: 'active',
                            playerCount: 4,
                            sessionCount: 12,
                            config: {},
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgCampaign.update.mockResolvedValue(mockUpdatedCampaign);
                        return [4 /*yield*/, rpgCampaignService.syncWithWorldAnvil('campaign-1', 'wa-123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockUpdatedCampaign);
                        expect(mockWorldAnvilClient.getCampaignDetails).toHaveBeenCalledWith('wa-123');
                        expect(mockPrismaClient.rpgCampaign.update).toHaveBeenCalledWith({
                            where: { id: 'campaign-1' },
                            data: {
                                name: 'WorldAnvil Campaign',
                                description: 'Campaign from WorldAnvil',
                                worldanvil_id: 'wa-123',
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle WorldAnvil sync errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockWorldAnvilClient.getCampaignDetails.mockRejectedValue(new Error('Campaign not found in WorldAnvil'));
                        return [4 /*yield*/, expect(rpgCampaignService.syncWithWorldAnvil('campaign-1', 'invalid-wa-id')).rejects.toThrow('Failed to sync with WorldAnvil: Campaign not found in WorldAnvil')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('generateAIContent', function () {
        it('should generate AI content for campaign', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockCampaign, mockAIResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockCampaign = {
                            id: 'campaign-1',
                            name: 'Lost Mines of Phandelver',
                            description: 'Starter campaign for D&D 5e',
                            systemId: 'system-1',
                            worldId: 'world-1',
                            gmId: 'user-1',
                            worldanvil_id: null,
                            status: 'active',
                            playerCount: 4,
                            sessionCount: 12,
                            config: {},
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        mockPrismaClient.rpgCampaign.findUnique.mockResolvedValue(mockCampaign);
                        mockAIResponse = {
                            choices: [
                                {
                                    message: {
                                        content: 'Generated plot hooks for Lost Mines of Phandelver campaign.',
                                    },
                                },
                            ],
                        };
                        mockOpenAIClient.chat.completions.create.mockResolvedValue(mockAIResponse);
                        return [4 /*yield*/, rpgCampaignService.generateAIContent('campaign-1', 'hooks')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe('Generated plot hooks for Lost Mines of Phandelver campaign.');
                        expect(mockOpenAIClient.chat.completions.create).toHaveBeenCalledWith({
                            model: 'gpt-4',
                            messages: [
                                {
                                    role: 'system',
                                    content: 'You are a creative RPG campaign designer who creates engaging content.',
                                },
                                {
                                    role: 'user',
                                    content: expect.stringContaining('Generate hooks for the campaign: Lost Mines of Phandelver'),
                                },
                            ],
                            max_tokens: 1500,
                            temperature: 0.8,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error if campaign not found for AI content generation', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgCampaign.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(rpgCampaignService.generateAIContent('non-existent', 'plot')).rejects.toThrow('Campaign not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=RpgCampaignService.test.js.map