/**
 * RpgWorldService Unit Tests
 * Comprehensive tests for RPG world management service
 */
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
import { RpgWorldService } from '../server/services/RpgWorldService';
// Mock Prisma Client
var mockPrismaClient = {
    rpgWorld: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    rpgWorldSystem: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        update: jest.fn(),
        deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
};
// Mock Discord Client
var mockDiscordClient = {
    guilds: {
        fetch: jest.fn(),
    },
};
// Mock WorldAnvil Client
var mockWorldAnvilClient = {
    worlds: {
        get: jest.fn(),
    },
};
// Mock OpenAI Client
var mockOpenAIClient = {
    chat: {
        completions: {
            create: jest.fn(),
        },
    },
};
describe('RpgWorldService', function () {
    var rpgWorldService;
    beforeEach(function () {
        jest.clearAllMocks();
        rpgWorldService = new RpgWorldService(mockPrismaClient, mockDiscordClient, mockWorldAnvilClient, mockOpenAIClient);
    });
    describe('Constructor', function () {
        it('should initialize with all required dependencies', function () {
            expect(rpgWorldService).toBeInstanceOf(RpgWorldService);
        });
    });
    describe('getAll', function () {
        it('should return all RPG worlds', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockWorlds, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockWorlds = [
                            {
                                id: 'world-1',
                                worldanvil_world_id: null,
                                discord_post_id: null,
                                discord_chat_id: null,
                                discord_thread_id: null,
                                discord_forum_id: null,
                                discord_voice_id: null,
                                discord_role_id: null,
                                gm_ids: ['gm-1', 'gm-2'],
                                title: 'Test World',
                                slug: 'test-world',
                                summary: 'A test RPG world',
                                description: 'A detailed description of the test world',
                                is_active: true,
                                data: { setting: 'fantasy' },
                                created_at: new Date(),
                                updated_at: new Date(),
                            },
                            {
                                id: 'world-2',
                                worldanvil_world_id: 'wa-world-123',
                                discord_post_id: null,
                                discord_chat_id: null,
                                discord_thread_id: null,
                                discord_forum_id: null,
                                discord_voice_id: null,
                                discord_role_id: null,
                                gm_ids: ['gm-3'],
                                title: 'Another World',
                                slug: 'another-world',
                                summary: 'Another test RPG world',
                                description: 'Another detailed description',
                                is_active: true,
                                data: { setting: 'sci-fi' },
                                created_at: new Date(),
                                updated_at: new Date(),
                            },
                        ];
                        mockPrismaClient.rpgWorld.findMany.mockResolvedValue(mockWorlds);
                        return [4 /*yield*/, rpgWorldService.getAll()];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockWorlds);
                        expect(mockPrismaClient.rpgWorld.findMany).toHaveBeenCalledWith({
                            orderBy: { title: 'asc' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getById', function () {
        it('should return RPG world by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockWorld, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockWorld = {
                            id: 'world-1',
                            worldanvil_world_id: null,
                            discord_post_id: null,
                            discord_chat_id: null,
                            discord_thread_id: null,
                            discord_forum_id: null,
                            discord_voice_id: null,
                            discord_role_id: null,
                            gm_ids: ['gm-1'],
                            title: 'Test World',
                            slug: 'test-world',
                            summary: 'A test RPG world',
                            description: 'A detailed description',
                            is_active: true,
                            data: { setting: 'fantasy' },
                            created_at: new Date(),
                            updated_at: new Date(),
                        };
                        mockPrismaClient.rpgWorld.findUnique.mockResolvedValue(mockWorld);
                        return [4 /*yield*/, rpgWorldService.getById('world-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockWorld);
                        expect(mockPrismaClient.rpgWorld.findUnique).toHaveBeenCalledWith({
                            where: { id: 'world-1' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null if world not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgWorld.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, rpgWorldService.getById('non-existent')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('create', function () {
        it('should create a new RPG world', function () { return __awaiter(void 0, void 0, void 0, function () {
            var worldInput, mockCreatedWorld, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        worldInput = {
                            title: 'New World',
                            slug: 'new-world',
                            summary: 'A new RPG world',
                            description: 'A new world description',
                            gm_ids: ['gm-1'],
                            is_active: true,
                            data: { setting: 'fantasy' },
                        };
                        mockCreatedWorld = {
                            id: 'world-new',
                            worldanvil_world_id: null,
                            discord_post_id: null,
                            discord_chat_id: null,
                            discord_thread_id: null,
                            discord_forum_id: null,
                            discord_voice_id: null,
                            discord_role_id: null,
                            title: worldInput.title,
                            slug: worldInput.slug || null,
                            summary: worldInput.summary || null,
                            description: worldInput.description || null,
                            gm_ids: worldInput.gm_ids,
                            is_active: worldInput.is_active,
                            data: worldInput.data,
                            created_at: new Date(),
                            updated_at: new Date(),
                        };
                        mockPrismaClient.rpgWorld.create.mockResolvedValue(mockCreatedWorld);
                        return [4 /*yield*/, rpgWorldService.create(worldInput)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCreatedWorld);
                        expect(mockPrismaClient.rpgWorld.create).toHaveBeenCalledWith({
                            data: worldInput,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('update', function () {
        it('should update an existing RPG world', function () { return __awaiter(void 0, void 0, void 0, function () {
            var worldUpdate, mockUpdatedWorld, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        worldUpdate = {
                            title: 'Updated World',
                            description: 'An updated world description',
                        };
                        mockUpdatedWorld = {
                            id: 'world-1',
                            worldanvil_world_id: null,
                            discord_post_id: null,
                            discord_chat_id: null,
                            discord_thread_id: null,
                            discord_forum_id: null,
                            discord_voice_id: null,
                            discord_role_id: null,
                            title: 'Updated World',
                            slug: 'world-1',
                            summary: 'A test world',
                            description: 'An updated world description',
                            gm_ids: ['gm-1'],
                            is_active: true,
                            data: {},
                            created_at: new Date(),
                            updated_at: new Date(),
                        };
                        mockPrismaClient.rpgWorld.update.mockResolvedValue(mockUpdatedWorld);
                        return [4 /*yield*/, rpgWorldService.update('world-1', worldUpdate)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockUpdatedWorld);
                        expect(mockPrismaClient.rpgWorld.update).toHaveBeenCalledWith({
                            where: { id: 'world-1' },
                            data: worldUpdate,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('delete', function () {
        it('should delete an RPG world', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockDeletedWorld, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockDeletedWorld = {
                            id: 'world-1',
                            worldanvil_world_id: null,
                            discord_post_id: null,
                            discord_chat_id: null,
                            discord_thread_id: null,
                            discord_forum_id: null,
                            discord_voice_id: null,
                            discord_role_id: null,
                            title: 'Test World',
                            slug: 'test-world',
                            summary: 'A test world',
                            description: 'A test description',
                            gm_ids: ['gm-1'],
                            is_active: true,
                            data: {},
                            created_at: new Date(),
                            updated_at: new Date(),
                        };
                        mockPrismaClient.rpgWorld.delete.mockResolvedValue(mockDeletedWorld);
                        return [4 /*yield*/, rpgWorldService.delete('world-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockDeletedWorld);
                        expect(mockPrismaClient.rpgWorld.delete).toHaveBeenCalledWith({
                            where: { id: 'world-1' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('addSystemToWorld', function () {
        it('should add a system to a world', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockWorldSystem, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockWorldSystem = {
                            id: 'ws-1',
                            world_id: 'world-1',
                            system_id: 'system-1',
                            is_primary: true,
                            created_at: new Date(),
                            updated_at: new Date(),
                        };
                        mockPrismaClient.rpgWorldSystem.upsert.mockResolvedValue(mockWorldSystem);
                        return [4 /*yield*/, rpgWorldService.addSystemToWorld('world-1', 'system-1', true)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockWorldSystem);
                        expect(mockPrismaClient.rpgWorldSystem.upsert).toHaveBeenCalledWith({
                            where: {
                                world_id_system_id: {
                                    world_id: 'world-1',
                                    system_id: 'system-1',
                                },
                            },
                            update: {
                                is_primary: true,
                            },
                            create: {
                                world_id: 'world-1',
                                system_id: 'system-1',
                                is_primary: true,
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('removeSystemFromWorld', function () {
        it('should remove a system from a world', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgWorldSystem.deleteMany.mockResolvedValue({ count: 1 });
                        return [4 /*yield*/, rpgWorldService.removeSystemFromWorld('world-1', 'system-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({ count: 1 });
                        expect(mockPrismaClient.rpgWorldSystem.deleteMany).toHaveBeenCalledWith({
                            where: {
                                world_id: 'world-1',
                                system_id: 'system-1',
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getWorldSystems', function () {
        it('should get all systems for a world', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockWorldSystems, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockWorldSystems = [
                            {
                                id: 'ws-1',
                                world_id: 'world-1',
                                system_id: 'system-1',
                                is_primary: true,
                                created_at: new Date(),
                                updated_at: new Date(),
                            },
                            {
                                id: 'ws-2',
                                world_id: 'world-1',
                                system_id: 'system-2',
                                is_primary: false,
                                created_at: new Date(),
                                updated_at: new Date(),
                            },
                        ];
                        mockPrismaClient.rpgWorldSystem.findMany.mockResolvedValue(mockWorldSystems);
                        return [4 /*yield*/, rpgWorldService.getWorldSystems('world-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockWorldSystems);
                        expect(mockPrismaClient.rpgWorldSystem.findMany).toHaveBeenCalledWith({
                            where: { world_id: 'world-1' },
                            include: { system: true },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setPrimarySystem', function () {
        it('should set a system as primary for a world', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockTransaction, mockUpdatedWorldSystem, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockTransaction = jest.fn(function (callback) { return callback(mockPrismaClient); });
                        mockPrismaClient.$transaction = mockTransaction;
                        mockUpdatedWorldSystem = {
                            id: 'ws-1',
                            world_id: 'world-1',
                            system_id: 'system-1',
                            is_primary: true,
                            created_at: new Date(),
                            updated_at: new Date(),
                        };
                        mockPrismaClient.rpgWorldSystem.update.mockResolvedValue(mockUpdatedWorldSystem);
                        return [4 /*yield*/, rpgWorldService.setPrimarySystem('world-1', 'system-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockUpdatedWorldSystem);
                        expect(mockPrismaClient.$transaction).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=RpgWorldService.test.js.map