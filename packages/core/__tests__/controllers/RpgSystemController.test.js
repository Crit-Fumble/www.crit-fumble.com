/**
 * RpgSystemController Unit Tests
 * Comprehensive tests for RPG system HTTP controller
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
import { RpgSystemController } from '../../server/controllers/RpgSystemController';
// Mock RpgSystemService
var mockRpgSystemService = {
    getAll: jest.fn(),
    create: jest.fn(),
    setupDiscordIntegration: jest.fn(),
    syncWithWorldAnvil: jest.fn(),
    validateWorldAnvilSystem: jest.fn(),
};
// Mock HTTP Request
var createMockRequest = function (body, params, query) { return ({
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
}); };
// Mock HTTP Response
var createMockResponse = function () {
    var response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnThis(),
    };
    return response;
};
describe('RpgSystemController', function () {
    var rpgSystemController;
    beforeEach(function () {
        jest.clearAllMocks();
        rpgSystemController = new RpgSystemController(mockRpgSystemService);
    });
    describe('Constructor', function () {
        it('should initialize with RpgSystemService', function () {
            expect(rpgSystemController).toBeInstanceOf(RpgSystemController);
        });
    });
    describe('getWorldAnvilRpgSystems', function () {
        it('should return WorldAnvil RPG systems', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockSystems, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSystems = [
                            {
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
                            },
                        ];
                        mockRpgSystemService.getAll.mockResolvedValue(mockSystems);
                        req = createMockRequest();
                        res = createMockResponse();
                        return [4 /*yield*/, rpgSystemController.getWorldAnvilRpgSystems(req, res)];
                    case 1:
                        _a.sent();
                        expect(mockRpgSystemService.getAll).toHaveBeenCalled();
                        expect(res.status).toHaveBeenCalledWith(200);
                        expect(res.json).toHaveBeenCalledWith({
                            success: true,
                            data: mockSystems,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle service errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockRpgSystemService.getAll.mockRejectedValue(new Error('Database connection failed'));
                        req = createMockRequest();
                        res = createMockResponse();
                        return [4 /*yield*/, rpgSystemController.getWorldAnvilRpgSystems(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(500);
                        expect(res.json).toHaveBeenCalledWith({
                            success: false,
                            error: 'Internal server error',
                            message: 'Failed to fetch WorldAnvil RPG systems',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('registerRpgSystem', function () {
        it('should register new RPG system', function () { return __awaiter(void 0, void 0, void 0, function () {
            var systemData, mockCreatedSystem, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        systemData = {
                            name: 'New System',
                            description: 'A new RPG system',
                            version: '1.0',
                            publisher: 'Test Publisher',
                            tags: ['new'],
                        };
                        mockCreatedSystem = __assign(__assign({ id: 'system-new' }, systemData), { worldanvil_id: null, config: {}, createdAt: new Date(), updatedAt: new Date() });
                        mockRpgSystemService.create.mockResolvedValue(mockCreatedSystem);
                        req = createMockRequest(systemData);
                        res = createMockResponse();
                        return [4 /*yield*/, rpgSystemController.registerRpgSystem(req, res)];
                    case 1:
                        _a.sent();
                        expect(mockRpgSystemService.create).toHaveBeenCalledWith({
                            name: systemData.name,
                            description: systemData.description,
                            version: systemData.version,
                            publisher: systemData.publisher,
                            tags: systemData.tags,
                            config: {},
                        });
                        expect(res.status).toHaveBeenCalledWith(201);
                        expect(res.json).toHaveBeenCalledWith({
                            success: true,
                            data: mockCreatedSystem,
                            message: 'RPG system registered successfully',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should validate required fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidData, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidData = {
                            description: 'Missing name field',
                        };
                        req = createMockRequest(invalidData);
                        res = createMockResponse();
                        return [4 /*yield*/, rpgSystemController.registerRpgSystem(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(400);
                        expect(res.json).toHaveBeenCalledWith({
                            success: false,
                            error: 'Bad request',
                            message: 'Missing required fields: name, description, version, publisher',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle service errors during registration', function () { return __awaiter(void 0, void 0, void 0, function () {
            var systemData, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        systemData = {
                            name: 'New System',
                            description: 'A new RPG system',
                            version: '1.0',
                            publisher: 'Test Publisher',
                            tags: ['new'],
                        };
                        mockRpgSystemService.create.mockRejectedValue(new Error('Database constraint violation'));
                        req = createMockRequest(systemData);
                        res = createMockResponse();
                        return [4 /*yield*/, rpgSystemController.registerRpgSystem(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(500);
                        expect(res.json).toHaveBeenCalledWith({
                            success: false,
                            error: 'Internal server error',
                            message: 'Failed to register RPG system',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('linkDiscordGuild', function () {
        it('should link Discord guild to RPG system', function () { return __awaiter(void 0, void 0, void 0, function () {
            var linkData, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linkData = {
                            systemId: 'system-1',
                            guildId: 'guild-123',
                        };
                        mockRpgSystemService.setupDiscordIntegration.mockResolvedValue(undefined);
                        req = createMockRequest(linkData);
                        res = createMockResponse();
                        return [4 /*yield*/, rpgSystemController.linkDiscordGuild(req, res)];
                    case 1:
                        _a.sent();
                        expect(mockRpgSystemService.setupDiscordIntegration).toHaveBeenCalledWith('system-1', 'guild-123');
                        expect(res.status).toHaveBeenCalledWith(200);
                        expect(res.json).toHaveBeenCalledWith({
                            success: true,
                            message: 'Discord guild linked successfully',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should validate required fields for Discord linking', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidData, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidData = {
                            systemId: 'system-1',
                            // Missing guildId
                        };
                        req = createMockRequest(invalidData);
                        res = createMockResponse();
                        return [4 /*yield*/, rpgSystemController.linkDiscordGuild(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(400);
                        expect(res.json).toHaveBeenCalledWith({
                            success: false,
                            error: 'Bad request',
                            message: 'Missing required fields: systemId, guildId',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle Discord integration errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var linkData, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linkData = {
                            systemId: 'system-1',
                            guildId: 'invalid-guild',
                        };
                        mockRpgSystemService.setupDiscordIntegration.mockRejectedValue(new Error('Guild not found'));
                        req = createMockRequest(linkData);
                        res = createMockResponse();
                        return [4 /*yield*/, rpgSystemController.linkDiscordGuild(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(500);
                        expect(res.json).toHaveBeenCalledWith({
                            success: false,
                            error: 'Internal server error',
                            message: 'Failed to link Discord guild',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('linkWorldAnvilSystem', function () {
        it('should link WorldAnvil system to RPG system', function () { return __awaiter(void 0, void 0, void 0, function () {
            var linkData, mockSyncedSystem, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linkData = {
                            systemId: 'system-1',
                            worldAnvilSystemId: 'wa-123',
                        };
                        mockRpgSystemService.validateWorldAnvilSystem.mockResolvedValue(true);
                        mockSyncedSystem = {
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
                        mockRpgSystemService.syncWithWorldAnvil.mockResolvedValue(mockSyncedSystem);
                        req = createMockRequest(linkData);
                        res = createMockResponse();
                        return [4 /*yield*/, rpgSystemController.linkWorldAnvilSystem(req, res)];
                    case 1:
                        _a.sent();
                        expect(mockRpgSystemService.validateWorldAnvilSystem).toHaveBeenCalledWith('wa-123');
                        expect(mockRpgSystemService.syncWithWorldAnvil).toHaveBeenCalledWith('system-1', 'wa-123');
                        expect(res.status).toHaveBeenCalledWith(200);
                        expect(res.json).toHaveBeenCalledWith({
                            success: true,
                            data: mockSyncedSystem,
                            message: 'WorldAnvil system linked successfully',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should validate required fields for WorldAnvil linking', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidData, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidData = {
                            systemId: 'system-1',
                            // Missing worldAnvilSystemId
                        };
                        req = createMockRequest(invalidData);
                        res = createMockResponse();
                        return [4 /*yield*/, rpgSystemController.linkWorldAnvilSystem(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(400);
                        expect(res.json).toHaveBeenCalledWith({
                            success: false,
                            error: 'Bad request',
                            message: 'Missing required fields: systemId, worldAnvilSystemId',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle invalid WorldAnvil system ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var linkData, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linkData = {
                            systemId: 'system-1',
                            worldAnvilSystemId: 'invalid-wa-id',
                        };
                        mockRpgSystemService.validateWorldAnvilSystem.mockResolvedValue(false);
                        req = createMockRequest(linkData);
                        res = createMockResponse();
                        return [4 /*yield*/, rpgSystemController.linkWorldAnvilSystem(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(404);
                        expect(res.json).toHaveBeenCalledWith({
                            success: false,
                            error: 'Not found',
                            message: 'WorldAnvil system not found or inaccessible',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle WorldAnvil sync errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var linkData, req, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linkData = {
                            systemId: 'system-1',
                            worldAnvilSystemId: 'wa-123',
                        };
                        mockRpgSystemService.validateWorldAnvilSystem.mockResolvedValue(true);
                        mockRpgSystemService.syncWithWorldAnvil.mockRejectedValue(new Error('Sync failed'));
                        req = createMockRequest(linkData);
                        res = createMockResponse();
                        return [4 /*yield*/, rpgSystemController.linkWorldAnvilSystem(req, res)];
                    case 1:
                        _a.sent();
                        expect(res.status).toHaveBeenCalledWith(500);
                        expect(res.json).toHaveBeenCalledWith({
                            success: false,
                            error: 'Internal server error',
                            message: 'Failed to link WorldAnvil system',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=RpgSystemController.test.js.map