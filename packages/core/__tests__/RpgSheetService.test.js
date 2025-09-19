/**
 * RpgSheetService Unit Tests
 * Comprehensive tests for RPG sheet management service
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
import { RpgSheetService } from '../server/services/RpgSheetService';
// Mock Prisma Client
var mockPrismaClient = {
    rpgSheet: {
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
    sheets: {
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
describe('RpgSheetService', function () {
    var rpgSheetService;
    beforeEach(function () {
        jest.clearAllMocks();
        rpgSheetService = new RpgSheetService(mockPrismaClient, mockDiscordClient, mockWorldAnvilClient, mockOpenAIClient);
    });
    describe('Constructor', function () {
        it('should initialize with all required dependencies', function () {
            expect(rpgSheetService).toBeInstanceOf(RpgSheetService);
        });
    });
    describe('getAll', function () {
        it('should return all RPG sheets', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockSheets, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSheets = [
                            {
                                id: 'sheet-1',
                                worldanvil_block_id: null,
                                discord_post_id: null,
                                discord_thread_id: null,
                                title: 'Character Sheet 1',
                                slug: 'character-sheet-1',
                                summary: 'A character sheet',
                                description: 'A detailed character sheet',
                                portrait_url: null,
                                token_url: null,
                                data: { name: 'Aragorn', level: 10 },
                                is_active: true,
                                admin_only: false,
                                last_played: null,
                                created_at: new Date(),
                                updated_at: new Date(),
                                rpg_character_id: 'char-1',
                                rpg_system_id: 'system-1',
                                rpg_party_id: null,
                                rpg_campaign_id: null,
                                rpg_world_id: null,
                            },
                            {
                                id: 'sheet-2',
                                worldanvil_block_id: null,
                                discord_post_id: null,
                                discord_thread_id: null,
                                title: 'Character Sheet 2',
                                slug: 'character-sheet-2',
                                summary: 'Another character sheet',
                                description: 'Another detailed character sheet',
                                portrait_url: null,
                                token_url: null,
                                data: { name: 'Legolas', level: 8 },
                                is_active: true,
                                admin_only: false,
                                last_played: new Date(),
                                created_at: new Date(),
                                updated_at: new Date(),
                                rpg_character_id: 'char-2',
                                rpg_system_id: 'system-1',
                                rpg_party_id: 'party-1',
                                rpg_campaign_id: 'campaign-1',
                                rpg_world_id: 'world-1',
                            },
                        ];
                        mockPrismaClient.rpgSheet.findMany.mockResolvedValue(mockSheets);
                        return [4 /*yield*/, rpgSheetService.getAll()];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockSheets);
                        expect(mockPrismaClient.rpgSheet.findMany).toHaveBeenCalledWith({
                            orderBy: { title: 'asc' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getById', function () {
        it('should return RPG sheet by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockSheet, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSheet = {
                            id: 'sheet-1',
                            worldanvil_block_id: null,
                            discord_post_id: null,
                            discord_thread_id: null,
                            title: 'Character Sheet',
                            slug: 'character-sheet',
                            summary: 'A character sheet',
                            description: 'A detailed character sheet',
                            portrait_url: null,
                            token_url: null,
                            data: { name: 'Aragorn', level: 10 },
                            is_active: true,
                            admin_only: false,
                            last_played: null,
                            created_at: new Date(),
                            updated_at: new Date(),
                            rpg_character_id: 'char-1',
                            rpg_system_id: 'system-1',
                            rpg_party_id: null,
                            rpg_campaign_id: null,
                            rpg_world_id: null,
                        };
                        mockPrismaClient.rpgSheet.findUnique.mockResolvedValue(mockSheet);
                        return [4 /*yield*/, rpgSheetService.getById('sheet-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockSheet);
                        expect(mockPrismaClient.rpgSheet.findUnique).toHaveBeenCalledWith({
                            where: { id: 'sheet-1' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null if sheet not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.rpgSheet.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, rpgSheetService.getById('non-existent')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getByCharacterId', function () {
        it('should return sheets by character ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockSheets, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSheets = [
                            {
                                id: 'sheet-1',
                                worldanvil_block_id: null,
                                discord_post_id: null,
                                discord_thread_id: null,
                                title: 'Character Sheet',
                                slug: 'character-sheet',
                                summary: null,
                                description: null,
                                portrait_url: null,
                                token_url: null,
                                data: { name: 'Aragorn' },
                                is_active: true,
                                admin_only: false,
                                last_played: null,
                                created_at: new Date(),
                                updated_at: new Date(),
                                rpg_character_id: 'char-1',
                                rpg_system_id: null,
                                rpg_party_id: null,
                                rpg_campaign_id: null,
                                rpg_world_id: null,
                            },
                        ];
                        mockPrismaClient.rpgSheet.findMany.mockResolvedValue(mockSheets);
                        return [4 /*yield*/, rpgSheetService.getByCharacterId('char-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockSheets);
                        expect(mockPrismaClient.rpgSheet.findMany).toHaveBeenCalledWith({
                            where: { rpg_character_id: 'char-1' },
                            orderBy: { title: 'asc' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('create', function () {
        it('should create a new RPG sheet', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sheetInput, mockCreatedSheet, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sheetInput = {
                            title: 'New Sheet',
                            slug: 'new-sheet',
                            summary: 'A new sheet',
                            data: { name: 'Test Character' },
                            is_active: true,
                        };
                        mockCreatedSheet = {
                            id: 'sheet-new',
                            worldanvil_block_id: null,
                            discord_post_id: null,
                            discord_thread_id: null,
                            title: 'New Sheet',
                            slug: 'new-sheet',
                            summary: 'A new sheet',
                            description: null,
                            portrait_url: null,
                            token_url: null,
                            data: { name: 'Test Character' },
                            is_active: true,
                            admin_only: false,
                            last_played: null,
                            created_at: new Date(),
                            updated_at: new Date(),
                            rpg_character_id: null,
                            rpg_system_id: null,
                            rpg_party_id: null,
                            rpg_campaign_id: null,
                            rpg_world_id: null,
                        };
                        mockPrismaClient.rpgSheet.create.mockResolvedValue(mockCreatedSheet);
                        return [4 /*yield*/, rpgSheetService.create(sheetInput)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCreatedSheet);
                        expect(mockPrismaClient.rpgSheet.create).toHaveBeenCalledWith({
                            data: sheetInput,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('update', function () {
        it('should update an existing RPG sheet', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sheetUpdate, mockUpdatedSheet, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sheetUpdate = {
                            title: 'Updated Sheet',
                            summary: 'An updated sheet',
                        };
                        mockUpdatedSheet = {
                            id: 'sheet-1',
                            worldanvil_block_id: null,
                            discord_post_id: null,
                            discord_thread_id: null,
                            title: 'Updated Sheet',
                            slug: 'sheet-1',
                            summary: 'An updated sheet',
                            description: null,
                            portrait_url: null,
                            token_url: null,
                            data: {},
                            is_active: true,
                            admin_only: false,
                            last_played: null,
                            created_at: new Date(),
                            updated_at: new Date(),
                            rpg_character_id: null,
                            rpg_system_id: null,
                            rpg_party_id: null,
                            rpg_campaign_id: null,
                            rpg_world_id: null,
                        };
                        mockPrismaClient.rpgSheet.update.mockResolvedValue(mockUpdatedSheet);
                        return [4 /*yield*/, rpgSheetService.update('sheet-1', sheetUpdate)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockUpdatedSheet);
                        expect(mockPrismaClient.rpgSheet.update).toHaveBeenCalledWith({
                            where: { id: 'sheet-1' },
                            data: sheetUpdate,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('delete', function () {
        it('should delete an RPG sheet', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockDeletedSheet, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockDeletedSheet = {
                            id: 'sheet-1',
                            worldanvil_block_id: null,
                            discord_post_id: null,
                            discord_thread_id: null,
                            title: 'Test Sheet',
                            slug: 'test-sheet',
                            summary: null,
                            description: null,
                            portrait_url: null,
                            token_url: null,
                            data: {},
                            is_active: true,
                            admin_only: false,
                            last_played: null,
                            created_at: new Date(),
                            updated_at: new Date(),
                            rpg_character_id: null,
                            rpg_system_id: null,
                            rpg_party_id: null,
                            rpg_campaign_id: null,
                            rpg_world_id: null,
                        };
                        mockPrismaClient.rpgSheet.delete.mockResolvedValue(mockDeletedSheet);
                        return [4 /*yield*/, rpgSheetService.delete('sheet-1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockDeletedSheet);
                        expect(mockPrismaClient.rpgSheet.delete).toHaveBeenCalledWith({
                            where: { id: 'sheet-1' },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=RpgSheetService.test.js.map