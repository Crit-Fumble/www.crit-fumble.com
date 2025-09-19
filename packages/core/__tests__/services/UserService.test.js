/**
 * UserService Unit Tests
 * Comprehensive tests for user management service
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
import { UserService } from '../../server/services/UserService';
// Mock Prisma Client
var mockPrismaClient = {
    user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
};
// Mock Discord Client
var mockDiscordClient = {
    users: {
        fetch: jest.fn(),
    },
    guilds: {
        fetch: jest.fn(),
    },
};
// Mock WorldAnvil Client
var mockWorldAnvilClient = {
    getUser: jest.fn(),
    getWorlds: jest.fn(),
    getCampaigns: jest.fn(),
};
// Mock OpenAI Client
var mockOpenAIClient = {
    chat: {
        completions: {
            create: jest.fn(),
        },
    },
};
describe('UserService', function () {
    var userService;
    beforeEach(function () {
        jest.clearAllMocks();
        userService = new UserService(mockPrismaClient, mockDiscordClient, mockWorldAnvilClient, mockOpenAIClient);
    });
    describe('Constructor', function () {
        it('should initialize with all client dependencies', function () {
            expect(userService).toBeInstanceOf(UserService);
        });
    });
    describe('getUserById', function () {
        var mockUser = {
            id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
            emailVerified: null,
            image: 'https://example.com/avatar.png',
            discord_id: 'discord-123',
            worldanvil_id: 'wa-123',
            slug: 'test-user',
            admin: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            data: null,
        };
        it('should get user by database ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
                        return [4 /*yield*/, userService.getUserById('user-123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockUser);
                        expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
                            where: { id: 'user-123' }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get user by Discord ID when not found by database ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.user.findUnique.mockResolvedValue(null);
                        mockPrismaClient.user.findFirst
                            .mockResolvedValueOnce(mockUser)
                            .mockResolvedValueOnce(null);
                        return [4 /*yield*/, userService.getUserById('discord-123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockUser);
                        expect(mockPrismaClient.user.findFirst).toHaveBeenCalledWith({
                            where: { discord_id: 'discord-123' }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get user by WorldAnvil ID when not found by other IDs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.user.findUnique.mockResolvedValue(null);
                        mockPrismaClient.user.findFirst
                            .mockResolvedValueOnce(null)
                            .mockResolvedValueOnce(mockUser);
                        return [4 /*yield*/, userService.getUserById('wa-123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockUser);
                        expect(mockPrismaClient.user.findFirst).toHaveBeenCalledWith({
                            where: { worldanvil_id: 'wa-123' }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null when user not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.user.findUnique.mockResolvedValue(null);
                        mockPrismaClient.user.findFirst.mockResolvedValue(null);
                        return [4 /*yield*/, userService.getUserById('non-existent')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUserByEmail', function () {
        it('should get user by email', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockUser = {
                            id: 'user-123',
                            name: 'Test User',
                            email: 'test@example.com',
                            emailVerified: null,
                            image: null,
                            discord_id: null,
                            worldanvil_id: null,
                            slug: 'test-user',
                            admin: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            data: null,
                        };
                        mockPrismaClient.user.findFirst.mockResolvedValue(mockUser);
                        return [4 /*yield*/, userService.getUserByEmail('test@example.com')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockUser);
                        expect(mockPrismaClient.user.findFirst).toHaveBeenCalledWith({
                            where: { email: 'test@example.com' }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('createUser', function () {
        it('should create a new user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userData, createdUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userData = {
                            name: 'New User',
                            email: 'new@example.com',
                            discord_id: 'discord-456',
                            slug: 'new-user',
                        };
                        createdUser = {
                            id: 'user-456',
                            name: userData.name,
                            email: userData.email,
                            emailVerified: null,
                            image: null,
                            discord_id: userData.discord_id,
                            worldanvil_id: null,
                            slug: userData.slug,
                            admin: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            data: null,
                        };
                        mockPrismaClient.user.create.mockResolvedValue(createdUser);
                        return [4 /*yield*/, userService.createUser(userData)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(createdUser);
                        expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
                            data: userData
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateUser', function () {
        it('should update an existing user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updateData, updatedUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateData = {
                            name: 'Updated User',
                            email: 'updated@example.com',
                        };
                        updatedUser = {
                            id: 'user-123',
                            name: updateData.name,
                            email: updateData.email,
                            emailVerified: null,
                            image: null,
                            discord_id: 'discord-123',
                            worldanvil_id: null,
                            slug: 'updated-user',
                            admin: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            data: null,
                        };
                        mockPrismaClient.user.update.mockResolvedValue(updatedUser);
                        return [4 /*yield*/, userService.updateUser('user-123', updateData)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(updatedUser);
                        expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
                            where: { id: 'user-123' },
                            data: updateData
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('validateDiscordId', function () {
        it('should return true for valid Discord ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, userService.validateDiscordId('discord-123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('validateWorldAnvilId', function () {
        it('should return true for valid WorldAnvil ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, userService.validateWorldAnvilId('wa-123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('generateAIContent', function () {
        it('should throw not implemented error', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(userService.generateAIContent('user-123', 'bio')).rejects.toThrow('Not implemented - use OpenAI SDK directly')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('analyzeUserActivity', function () {
        it('should throw not implemented error', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(userService.analyzeUserActivity('user-123')).rejects.toThrow('Not implemented - use OpenAI SDK directly')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Error Handling', function () {
        it('should handle database errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaClient.user.findUnique.mockRejectedValue(new Error('Database connection failed'));
                        return [4 /*yield*/, expect(userService.getUserById('user-123')).rejects.toThrow('Database connection failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=UserService.test.js.map