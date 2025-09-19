/**
 * RpgSystemService Unit Tests
 * Comprehensive tests for RPG system management service
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
import { RpgSystemService } from '../../server/services/RpgSystemService';
// Mock Prisma Client
var mockPrismaClient = {
    rpgSystem: {
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
    systems: {
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
describe('RpgSystemService', function () {
    var rpgSystemService;
    beforeEach(function () {
        jest.clearAllMocks();
        rpgSystemService = new RpgSystemService(mockPrismaClient, mockDiscordClient, mockWorldAnvilClient, mockOpenAIClient);
    });
    describe('Constructor', function () {
        it('should initialize with all required dependencies', function () {
            expect(rpgSystemService).toBeInstanceOf(RpgSystemService);
        });
    });
    describe('getAll', function () {
        it('should return all RPG systems', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockSystems, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSystems = [
                            {
                                id: 'system-1',
                                worldanvil_system_id: null,
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
                                data: { version: '5.0', publisher: 'Wizards of the Coast', tags: ['fantasy', 'dungeons'] },
                                is_active: true,
                                created_at: new Date(),
                                updated_at: new Date(),
                            },
                            {
                                id: 'system-2',
                                worldanvil_system_id: null,
                                discord_guild_id: null,
                                discord_post_id: null,
                                discord_chat_id: null,
                                discord_thread_id: null,
                                discord_forum_id: null,
                                discord_voice_id: null,
                                discord_role_id: null,
                                title: 'Pathfinder 2e',
                                slug: 'pathfinder-2e',
                                description: 'Second edition Pathfinder',
                                data: { version: '2.0', publisher: 'Paizo', tags: ['fantasy', 'complex'] },
                                is_active: true,
                                created_at: new Date(),
                                updated_at: new Date(),
                            },
                        ];
                        mockPrismaClient.rpgSystem.findMany.mockResolvedValue(mockSystems);
                        return [4 /*yield*/, rpgSystemService.getAll()];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockSystems);
                        expect(mockPrismaClient.rpgSystem.findMany).toHaveBeenCalledWith();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getById', function () {
        it('should return RPG system by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockSystem, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSystem = {
                            id: 'system-1',
                            worldanvil_system_id: null,
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
                            data: { version: '5.0', publisher: 'Wizards of the Coast', tags: ['fantasy', 'dungeons'] },
                            is_active: true,
                            created_at: new Date(),
                            updated_at: new Date(),
                        };
                        mockPrismaClient.rpgSystem.findUnique.mockResolvedValue(mockSystem);
                        return [4 /*yield*/, rpgSystemService.getById('system-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockSystem);
                        expect(mockPrismaClient.rpgSystem.findUnique).toHaveBeenCalledWith({
                            where: { id: 'system-1' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null if system not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgSystem.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, rpgSystemService.getById('non-existent')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByWorldAnvilId', function () {
        it('should return RPG system by WorldAnvil ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockSystem, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSystem = {
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
                            data: { version: '5.0', publisher: 'Wizards of the Coast', tags: ['fantasy', 'dungeons'] },
                            is_active: true,
                            created_at: new Date(),
                            updated_at: new Date(),
                        };
                        mockPrismaClient.rpgSystem.findUnique.mockResolvedValue(mockSystem);
                        return [4 /*yield*/, rpgSystemService.getByWorldAnvilId('wa-123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockSystem);
                        expect(mockPrismaClient.rpgSystem.findUnique).toHaveBeenCalledWith({
                            where: { worldanvil_system_id: 'wa-123' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('search', function () {
        it('should search systems by title and description', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockSystems, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSystems = [
                            {
                                id: 'system-1',
                                worldanvil_system_id: null,
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
                                data: {},
                                is_active: true,
                                created_at: new Date(),
                                updated_at: new Date(),
                            },
                        ];
                        mockPrismaClient.rpgSystem.findMany.mockResolvedValue(mockSystems);
                        return [4 /*yield*/, rpgSystemService.search('D&D')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockSystems);
                        expect(mockPrismaClient.rpgSystem.findMany).toHaveBeenCalledWith({
                            where: {
                                title: { contains: 'D&D', mode: 'insensitive' }
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('create', function () {
        it('should create a new RPG system', function () { return __awaiter(void 0, void 0, void 0, function () {
            var systemInput, mockCreatedSystem, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        systemInput = {
                            title: 'New System',
                            slug: 'new-system',
                            description: 'A new RPG system',
                            is_active: true,
                            data: {},
                        };
                        mockCreatedSystem = {
                            id: 'system-new',
                            worldanvil_system_id: null,
                            discord_guild_id: null,
                            discord_post_id: null,
                            discord_chat_id: null,
                            discord_thread_id: null,
                            discord_forum_id: null,
                            discord_voice_id: null,
                            discord_role_id: null,
                            title: 'New System',
                            slug: 'new-system',
                            description: 'A new RPG system',
                            is_active: true,
                            data: {},
                            created_at: new Date(),
                            updated_at: new Date(),
                        };
                        mockPrismaClient.rpgSystem.create.mockResolvedValue(mockCreatedSystem);
                        return [4 /*yield*/, rpgSystemService.create(systemInput)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCreatedSystem);
                        expect(mockPrismaClient.rpgSystem.create).toHaveBeenCalledWith({
                            data: systemInput,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('update', function () {
        it('should update an existing RPG system', function () { return __awaiter(void 0, void 0, void 0, function () {
            var systemUpdate, mockUpdatedSystem, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        systemUpdate = {
                            title: 'Updated System',
                            description: 'An updated RPG system',
                        };
                        mockUpdatedSystem = {
                            id: 'system-1',
                            worldanvil_system_id: null,
                            discord_guild_id: null,
                            discord_post_id: null,
                            discord_chat_id: null,
                            discord_thread_id: null,
                            discord_forum_id: null,
                            discord_voice_id: null,
                            discord_role_id: null,
                            title: 'Updated System',
                            slug: 'system-1',
                            description: 'An updated RPG system',
                            data: {},
                            is_active: true,
                            created_at: new Date(),
                            updated_at: new Date(),
                        };
                        mockPrismaClient.rpgSystem.update.mockResolvedValue(mockUpdatedSystem);
                        return [4 /*yield*/, rpgSystemService.update('system-1', systemUpdate)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockUpdatedSystem);
                        expect(mockPrismaClient.rpgSystem.update).toHaveBeenCalledWith({
                            where: { id: 'system-1' },
                            data: systemUpdate,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('delete', function () {
        it('should delete an RPG system', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockDeletedSystem, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockDeletedSystem = {
                            id: 'system-1',
                            worldanvil_system_id: null,
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
                            data: {},
                            is_active: true,
                            created_at: new Date(),
                            updated_at: new Date(),
                        };
                        mockPrismaClient.rpgSystem.delete.mockResolvedValue(mockDeletedSystem);
                        return [4 /*yield*/, rpgSystemService.delete('system-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockDeletedSystem);
                        expect(mockPrismaClient.rpgSystem.delete).toHaveBeenCalledWith({
                            where: { id: 'system-1' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=RpgSystemService.test.js.map